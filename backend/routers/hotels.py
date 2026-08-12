from fastapi import APIRouter, HTTPException
from typing import Optional

from hotels_data import (
    HOTELS, hotel_list_item, hotel_detail, get_hotel, hotel_destinations,
)

router = APIRouter(prefix="/api/hotels", tags=["hotels"])


@router.get("")
async def list_hotels(
    city: Optional[str] = None,
    country: Optional[str] = None,
    category: Optional[str] = None,
    collection: Optional[str] = None,
    star: Optional[int] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
):
    items = [hotel_list_item(h) for h in HOTELS]
    if city:
        items = [h for h in items if h["city"].lower() == city.lower()]
    if country:
        items = [h for h in items if h["country"].lower() == country.lower()]
    if category:
        items = [h for h in items if h["category"].lower() == category.lower()]
    if collection:
        items = [h for h in items if h["collection"].lower() == collection.lower()]
    if star is not None:
        items = [h for h in items if h["star_rating"] == star]
    if min_price is not None:
        items = [h for h in items if h["price"] >= min_price]
    if max_price is not None:
        items = [h for h in items if h["price"] <= max_price]
    if search:
        s = search.lower()
        items = [h for h in items if s in h["name"].lower() or s in h["city"].lower() or s in h["country"].lower()]
    if sort == "price_asc":
        items = sorted(items, key=lambda x: x["price"])
    elif sort == "price_desc":
        items = sorted(items, key=lambda x: -x["price"])
    elif sort == "rating":
        items = sorted(items, key=lambda x: -x["rating"])
    else:
        items = sorted(items, key=lambda x: (0 if x["popular"] else 1, -x["rating"]))
    return {"count": len(items), "hotels": items}


@router.get("/filters")
async def filters():
    prices = [h["price"] for h in HOTELS]
    cities = sorted({h["city"] for h in HOTELS})
    countries = sorted({h["country"] for h in HOTELS})
    collections = sorted({h["collection"] for h in HOTELS})
    return {
        "cities": cities,
        "countries": countries,
        "categories": ["International", "India"],
        "collections": collections,
        "stars": sorted({h["star_rating"] for h in HOTELS}, reverse=True),
        "min_price": min(prices),
        "max_price": max(prices),
    }


@router.get("/destinations")
async def destinations():
    return {"destinations": hotel_destinations()}


@router.get("/{hotel_id}")
async def get_hotel_detail(hotel_id: str):
    h = get_hotel(hotel_id)
    if not h:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel_detail(h)
