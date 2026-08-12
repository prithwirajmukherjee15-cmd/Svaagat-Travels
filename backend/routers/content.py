from fastapi import APIRouter
from seed_data import (
    FOREX_RATES, FOREX_PRODUCTS, FAQS, OFFERS, TOURISM_BOARDS,
    TESTIMONIALS, STATS, WHY_US, AIRPORTS, AIRLINES, PACKAGES,
    TRENDING_DESTINATIONS, HERO_SLIDES, TOP_FLIGHT_ROUTES, HOTEL_STAYS,
    SERVICE_TAGS, WHY_FEATURES,
    FOREX_STATS, FOREX_CARDS, CARD_BANNER_FEATURES, FOREX_STEPS, FOREX_WHY,
    FOREX_BLOGS, FOREX_VIDEOS, FOREX_PARTNERS, FOREX_FAQS, FOREX_TESTIMONIAL,
)
import random
from datetime import datetime, timedelta

from database import db
from pydantic import BaseModel, EmailStr
from hotels_data import hotel_destinations

router = APIRouter(prefix="/api", tags=["content"])


class NewsletterRequest(BaseModel):
    email: EmailStr


@router.get("/home")
async def home():
    popular = [p for p in PACKAGES if p.get("popular")][:6]
    return {
        "hero_slides": HERO_SLIDES,
        "trending": TRENDING_DESTINATIONS,
        "offers": OFFERS,
        "tourism_boards": TOURISM_BOARDS,
        "specials": popular,
        "flight_routes": TOP_FLIGHT_ROUTES,
        "hotel_stays": hotel_destinations(),
        "why_us": WHY_US,
        "why_features": WHY_FEATURES,
        "stats": STATS,
        "testimonials": TESTIMONIALS,
        "service_tags": SERVICE_TAGS,
        "faqs": FAQS[:6],
    }


@router.post("/newsletter")
async def newsletter(payload: NewsletterRequest):
    await db.newsletter.update_one(
        {"email": payload.email.lower()},
        {"$set": {"email": payload.email.lower(), "subscribed_at": datetime.utcnow().isoformat()}},
        upsert=True,
    )
    return {"success": True, "message": "Subscribed successfully"}


@router.get("/offers")
async def offers():
    return {"offers": OFFERS}


@router.get("/forex")
async def forex():
    return {
        "rates": FOREX_RATES,
        "products": FOREX_PRODUCTS,
        "stats": FOREX_STATS,
        "cards": FOREX_CARDS,
        "card_features": CARD_BANNER_FEATURES,
        "steps": FOREX_STEPS,
        "why": FOREX_WHY,
        "blogs": FOREX_BLOGS,
        "videos": FOREX_VIDEOS,
        "partners": FOREX_PARTNERS,
        "faqs": FOREX_FAQS,
        "testimonial": FOREX_TESTIMONIAL,
        "updated_at": datetime.utcnow().isoformat(),
    }


@router.get("/faqs")
async def faqs():
    return {"faqs": FAQS}


@router.get("/testimonials")
async def testimonials():
    return {"testimonials": TESTIMONIALS}


@router.get("/flights/airports")
async def airports():
    return {"airports": AIRPORTS}


@router.get("/flights/top-routes")
async def flight_top_routes():
    return {"routes": TOP_FLIGHT_ROUTES}


@router.post("/flights/search")
async def flight_search(payload: dict):
    """Dummy flight search - generates realistic static results."""
    origin = payload.get("origin", "BOM")
    destination = payload.get("destination", "DXB")
    depart_date = payload.get("depart_date")
    passengers = int(payload.get("passengers", 1))
    travel_class = payload.get("travel_class", "Economy")

    results = []
    seed = abs(hash(f"{origin}{destination}{depart_date}")) % 1000
    rng = random.Random(seed)
    for airline in AIRLINES:
        base = rng.randint(4200, 38000)
        dep_h = rng.randint(5, 21)
        dep_m = rng.choice([0, 15, 30, 45])
        dur_h = rng.randint(2, 11)
        dur_m = rng.choice([5, 20, 35, 50])
        stops = rng.choice([0, 0, 1])
        arr_total = (dep_h * 60 + dep_m) + (dur_h * 60 + dur_m)
        arr_h = (arr_total // 60) % 24
        arr_m = arr_total % 60
        results.append({
            "id": f"{airline['code']}{rng.randint(100,999)}",
            "airline": airline["name"],
            "airline_code": airline["code"],
            "origin": origin,
            "destination": destination,
            "depart_time": f"{dep_h:02d}:{dep_m:02d}",
            "arrive_time": f"{arr_h:02d}:{arr_m:02d}",
            "duration": f"{dur_h}h {dur_m}m",
            "stops": stops,
            "stop_label": "Non-stop" if stops == 0 else f"{stops} stop",
            "price": base * passengers,
            "price_per_person": base,
            "travel_class": travel_class,
            "seats_left": rng.randint(2, 9),
        })
    results = sorted(results, key=lambda x: x["price"])
    return {"count": len(results), "results": results, "query": payload}
