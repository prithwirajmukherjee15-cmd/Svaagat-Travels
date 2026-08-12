from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List

from seed_data import PACKAGES, DESTINATIONS, REGIONS
from package_details import enrich_package

router = APIRouter(prefix="/api/packages", tags=["packages"])


@router.get("")
async def list_packages(
    destination: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    max_duration: Optional[int] = None,
    min_duration: Optional[int] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
):
    items = list(PACKAGES)
    if destination:
        items = [p for p in items if p["destination"].lower() == destination.lower()]
    if region:
        items = [p for p in items if p["region"].lower() == region.lower()]
    if category:
        items = [p for p in items if p["category"].lower() == category.lower()]
    if min_price is not None:
        items = [p for p in items if p["price"] >= min_price]
    if max_price is not None:
        items = [p for p in items if p["price"] <= max_price]
    if min_duration is not None:
        items = [p for p in items if p["duration_nights"] >= min_duration]
    if max_duration is not None:
        items = [p for p in items if p["duration_nights"] <= max_duration]
    if tag:
        items = [p for p in items if tag.lower() in [t.lower() for t in p.get("tags", [])]]
    if search:
        s = search.lower()
        items = [p for p in items if s in p["title"].lower() or s in p["destination"].lower() or s in p["country"].lower()]
    if sort == "price_asc":
        items = sorted(items, key=lambda x: x["price"])
    elif sort == "price_desc":
        items = sorted(items, key=lambda x: -x["price"])
    elif sort == "rating":
        items = sorted(items, key=lambda x: -x["rating"])
    return {"count": len(items), "packages": items}


@router.get("/filters")
async def filters():
    prices = [p["price"] for p in PACKAGES]
    return {
        "destinations": DESTINATIONS,
        "regions": REGIONS,
        "categories": ["International", "India"],
        "tags": sorted(list({t for p in PACKAGES for t in p.get("tags", [])})),
        "min_price": min(prices),
        "max_price": max(prices),
    }


@router.get("/{package_id}")
async def get_package(package_id: str):
    for p in PACKAGES:
        if p["id"] == package_id:
            return enrich_package(p, PACKAGES)
    raise HTTPException(status_code=404, detail="Package not found")
