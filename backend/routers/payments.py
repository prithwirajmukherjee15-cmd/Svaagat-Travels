import os
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Request, Depends
from typing import Optional

from database import db
from models import CheckoutRequest, CheckoutResponse, HotelCheckoutRequest
from auth_utils import get_current_user
from seed_data import PACKAGES
from package_details import TOUR_TYPE_MULT
from hotels_data import get_hotel, hotel_room_types, hotel_list_item

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest,
)

router = APIRouter(prefix="/api", tags=["payments"])

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")


def _get_package(package_id: str):
    for p in PACKAGES:
        if p["id"] == package_id:
            return p
    return None


def _tier_unit_price(base: float, tour_type: str) -> float:
    mult = TOUR_TYPE_MULT.get(tour_type, 1.0)
    return round(base * mult / 100.0) * 100


@router.post("/checkout/session", response_model=CheckoutResponse)
async def create_checkout(payload: CheckoutRequest, request: Request, current=Depends(get_current_user)):
    pkg = _get_package(payload.package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Invalid package")

    # SECURITY: amount computed server-side only (tier price x travelers)
    tour_type = payload.tour_type if payload.tour_type in TOUR_TYPE_MULT else "Value"
    unit_price = _tier_unit_price(float(pkg["price"]), tour_type)
    amount = unit_price * int(payload.travelers)
    currency = "inr"

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/booking/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/holidays/{pkg['id']}"

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    metadata = {
        "user_id": current["user_id"],
        "email": current["email"],
        "package_id": pkg["id"],
        "travelers": str(payload.travelers),
        "travel_date": payload.travel_date or "",
        "tour_type": tour_type,
        "source": "holiday_booking",
    }
    req = CheckoutSessionRequest(
        amount=amount, currency=currency,
        success_url=success_url, cancel_url=cancel_url, metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(req)

    # Create payment_transactions record BEFORE redirect
    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "user_id": current["user_id"],
        "email": current["email"],
        "package_id": pkg["id"],
        "package_title": pkg["title"],
        "destination": pkg["destination"],
        "image": pkg["image"],
        "travelers": int(payload.travelers),
        "travel_date": payload.travel_date,
        "tour_type": tour_type,
        "amount": amount,
        "currency": currency,
        "payment_status": "initiated",
        "status": "pending",
        "metadata": metadata,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return CheckoutResponse(url=session.url, session_id=session.session_id)


@router.post("/checkout/hotel/session", response_model=CheckoutResponse)
async def create_hotel_checkout(payload: HotelCheckoutRequest, request: Request, current=Depends(get_current_user)):
    hotel = get_hotel(payload.hotel_id)
    if not hotel:
        raise HTTPException(status_code=400, detail="Invalid hotel")

    # SECURITY: amount computed server-side only (room tier x nights x rooms)
    tiers = hotel_room_types(float(hotel["price"]))
    tier = next((t for t in tiers if t["name"] == payload.room_type), tiers[0])
    unit_price = int(tier["price"])
    amount = unit_price * int(payload.nights) * int(payload.rooms)
    currency = "inr"

    card = hotel_list_item(hotel)
    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/booking/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/hotels/{hotel['id']}"

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    metadata = {
        "user_id": current["user_id"],
        "email": current["email"],
        "hotel_id": hotel["id"],
        "room_type": tier["name"],
        "nights": str(payload.nights),
        "rooms": str(payload.rooms),
        "guests": str(payload.guests),
        "check_in": payload.check_in or "",
        "source": "hotel_booking",
    }
    req = CheckoutSessionRequest(
        amount=amount, currency=currency,
        success_url=success_url, cancel_url=cancel_url, metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(req)

    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "user_id": current["user_id"],
        "email": current["email"],
        "booking_type": "hotel",
        "package_id": hotel["id"],
        "package_title": hotel["name"],
        "destination": f"{hotel['city']}, {hotel['country']}",
        "image": card["image"],
        "room_type": tier["name"],
        "nights": int(payload.nights),
        "rooms": int(payload.rooms),
        "travelers": int(payload.guests),
        "tour_type": tier["name"],
        "travel_date": payload.check_in,
        "amount": amount,
        "currency": currency,
        "payment_status": "initiated",
        "status": "pending",
        "metadata": metadata,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return CheckoutResponse(url=session.url, session_id=session.session_id)


async def _finalize_booking(txn: dict):
    """Create a confirmed booking exactly once for a paid transaction, and credit EDGE points."""
    existing = await db.bookings.find_one({"session_id": txn["session_id"]})
    if existing:
        return
    booking_id = f"bk_{uuid.uuid4().hex[:12]}"
    points_earned = int(txn["amount"] // 100)
    await db.bookings.insert_one({
        "booking_id": booking_id,
        "user_id": txn["user_id"],
        "booking_type": txn.get("booking_type", "holiday"),
        "package_id": txn["package_id"],
        "package_title": txn["package_title"],
        "destination": txn["destination"],
        "image": txn.get("image"),
        "travelers": txn["travelers"],
        "travel_date": txn.get("travel_date"),
        "tour_type": txn.get("tour_type", "Value"),
        "room_type": txn.get("room_type"),
        "nights": txn.get("nights"),
        "rooms": txn.get("rooms"),
        "amount": txn["amount"],
        "currency": txn["currency"],
        "status": "confirmed",
        "payment_status": "paid",
        "edge_points_earned": points_earned,
        "session_id": txn["session_id"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    # Credit functional EDGE loyalty points to the user
    await db.users.update_one({"user_id": txn["user_id"]}, {"$inc": {"edge_points": points_earned}})


@router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, request: Request):
    txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # If already finalized as paid, short-circuit (idempotent)
    if txn.get("payment_status") == "paid":
        return {"payment_status": "paid", "status": "complete", "already_processed": True}

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

    new_status = status.status
    new_pay = status.payment_status
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {"payment_status": new_pay, "status": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if new_pay == "paid":
        fresh = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        await _finalize_booking(fresh)
    return {
        "payment_status": new_pay,
        "status": new_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
    }


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("Stripe-Signature")
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    try:
        event = await stripe_checkout.handle_webhook(body, sig)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {e}")
    if event.payment_status == "paid" and event.session_id:
        txn = await db.payment_transactions.find_one({"session_id": event.session_id}, {"_id": 0})
        if txn:
            await db.payment_transactions.update_one(
                {"session_id": event.session_id},
                {"$set": {"payment_status": "paid", "status": "complete", "updated_at": datetime.now(timezone.utc).isoformat()}},
            )
            fresh = await db.payment_transactions.find_one({"session_id": event.session_id}, {"_id": 0})
            await _finalize_booking(fresh)
    return {"received": True}


@router.get("/bookings")
async def my_bookings(current=Depends(get_current_user)):
    items = await db.bookings.find({"user_id": current["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"count": len(items), "bookings": items}
