"""Enriches base packages with detailed tour data (route, day-plan, accommodation,
inclusions/exclusions, tour-type price tiers) for the detailed package page."""

TOUR_TYPES = ["Value", "Deluxe", "Luxury"]
TOUR_TYPE_MULT = {"Value": 1.0, "Deluxe": 1.35, "Luxury": 1.85}

# Route breakdown [city, nights] per package (sums to duration_nights)
STOPS = {
    "pkg-dubai-delight": [["Dubai", 4]],
    "pkg-thailand-explorer": [["Pattaya", 2], ["Bangkok", 3]],
    "pkg-bali-romance": [["Kuta", 3], ["Ubud", 3]],
    "pkg-maldives-luxury": [["Maldives", 3]],
    "pkg-singapore-family": [["Singapore", 4]],
    "pkg-europe-highlights": [["Paris", 2], ["Switzerland", 2], ["Venice", 1], ["Rome", 2], ["Amsterdam", 2]],
    "pkg-vietnam-discovery": [["Hanoi", 2], ["Ha Long", 1], ["Ho Chi Minh City", 3]],
    "pkg-kashmir-paradise": [["Srinagar", 3], ["Gulmarg", 1], ["Pahalgam", 1]],
    "pkg-kerala-backwaters": [["Munnar", 2], ["Thekkady", 1], ["Alleppey", 1], ["Cochin", 1]],
    "pkg-andaman-islands": [["Port Blair", 2], ["Havelock", 2], ["Neil Island", 1]],
    "pkg-ladakh-adventure": [["Leh", 4], ["Nubra Valley", 1], ["Pangong", 1]],
    "pkg-goa-beach": [["North Goa", 2], ["South Goa", 1]],
    "pkg-australia-discovery": [["Melbourne", 3], ["Cairns", 2], ["Sydney", 2]],
    "pkg-japan-highlights": [["Tokyo", 3], ["Kyoto", 2], ["Osaka", 2]],
    "pkg-china-explorer": [["Beijing", 3], ["Shanghai", 3]],
    "pkg-abudhabi-extravaganza": [["Abu Dhabi", 4]],
}

HOTELS = {
    "Dubai": "Citymax Hotel / Rove Downtown or similar", "Pattaya": "Grande Centre Point or similar",
    "Bangkok": "Novotel Bangkok / Berkeley Pratunam or similar", "Kuta": "Grand Mirage Resort or similar",
    "Ubud": "Ubud Village Resort or similar", "Maldives": "Adaaran Club Rannalhi (Water Villa) or similar",
    "Singapore": "Village Hotel / Hotel Boss or similar", "Paris": "Ibis / Mercure Paris or similar",
    "Switzerland": "Ibis Zurich / Alpine hotel or similar", "Venice": "Hotel Alexander Mestre or similar",
    "Rome": "Hotel Cristoforo Colombo or similar", "Amsterdam": "Corendon Amsterdam or similar",
    "Hanoi": "Muong Thanh Grand or similar", "Ha Long": "Overnight luxury cruise on Ha Long Bay",
    "Ho Chi Minh City": "Muong Thanh Saigon or similar", "Srinagar": "Deluxe Houseboat / Hotel or similar",
    "Gulmarg": "Hotel Highlands Park or similar", "Pahalgam": "Hotel Heevan or similar",
    "Munnar": "Tea County / Fragrant Nature or similar", "Thekkady": "Spice Village / Greenwoods or similar",
    "Alleppey": "Deluxe Houseboat (full board)", "Cochin": "The Avenue Regent or similar",
    "Port Blair": "Sea Shell / Fortune Resort or similar", "Havelock": "Symphony Palms / TSG Blue or similar",
    "Neil Island": "Summer Sand Beach Resort or similar", "Leh": "The Zen Ladakh / Grand Dragon or similar",
    "Nubra Valley": "Desert Camp / Hotel Sten-Del or similar", "Pangong": "Pangong Camps (deluxe tents)",
    "North Goa": "Novotel Goa / Country Inn or similar", "South Goa": "The Zuri White Sands or similar",
    "Melbourne": "Oaks Melbourne / Holiday Inn or similar", "Cairns": "Hotel Pacific / Rydges Esplanade or similar",
    "Sydney": "Holiday Inn Express Sydney or similar", "Gold Coast": "Hotel Voco / Mantra Legends or similar",
    "Tokyo": "Shinjuku Washington or similar", "Kyoto": "Kyoto Tower Hotel or similar",
    "Osaka": "Namba Oriental / Hotel Monterey or similar", "Beijing": "Novotel Beijing or similar",
    "Shanghai": "Holiday Inn Express Shanghai or similar", "Abu Dhabi": "Premier Inn / Centro Yas or similar",
}


def _round100(n):
    return int(round(n / 100.0) * 100)


def _tour_types(base):
    out = []
    for t in TOUR_TYPES:
        price = _round100(base * TOUR_TYPE_MULT[t])
        original = _round100(price * 1.075)
        out.append({
            "name": t,
            "price": price,
            "original_price": original,
            "discount_pct": round((1 - price / original) * 100) if original else 0,
            "edge_points": int(price // 100),
        })
    return out


def _gallery(pkg, all_packages):
    extras = [p["image"] for p in all_packages if p.get("region") == pkg.get("region") and p["id"] != pkg["id"]]
    defaults = [
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
        "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    ]
    pool = extras + defaults
    return [pkg["image"]] + pool[:4]


def _day_plan(pkg):
    stops = STOPS.get(pkg["id"], [[pkg["destination"], pkg["duration_nights"]]])
    # build list of city per night
    city_by_night = []
    for city, nights in stops:
        city_by_night.extend([city] * nights)
    plan = []
    itin = pkg.get("itinerary", [])
    total = len(itin)
    for i, it in enumerate(itin):
        is_last = i == total - 1
        night_idx = min(i, len(city_by_night) - 1)
        city = city_by_night[night_idx] if city_by_night else pkg["destination"]
        if i == 0:
            meals = "Dinner"
        elif is_last:
            meals = "Breakfast"
        else:
            meals = "Breakfast, Lunch, Dinner"
        plan.append({
            "day": it["day"],
            "title": it["title"],
            "detail": it["detail"],
            "city": city,
            "hotel": ("Departure" if is_last else HOTELS.get(city, f"4\u2605 hotel in {city} or similar")),
            "meals": meals,
            "sightseeing": it["detail"],
        })
    return plan


def _accommodation(pkg):
    stops = STOPS.get(pkg["id"], [[pkg["destination"], pkg["duration_nights"]]])
    return [{"city": c, "nights": n, "hotel": HOTELS.get(c, f"4\u2605 hotel in {c} or similar")} for c, n in stops]


def _route_str(pkg):
    stops = STOPS.get(pkg["id"], [[pkg["destination"], pkg["duration_nights"]]])
    return "  \u00b7  ".join(f"{n}N {c}" for c, n in stops)


def enrich_package(pkg, all_packages):
    p = dict(pkg)
    nights = pkg["duration_nights"]
    intl = pkg["category"] == "International"
    breakfasts = nights
    lunches = max(nights - 1, 0)
    dinners = nights

    p["route"] = _route_str(pkg)
    p["stops"] = [{"city": c, "nights": n} for c, n in STOPS.get(pkg["id"], [[pkg["destination"], nights]])]
    p["gallery"] = _gallery(pkg, all_packages)
    p["features"] = [
        {"key": "flights", "label": "Flights"},
        {"key": "hotels", "label": "Hotels"},
        {"key": "sightseeing", "label": "Sightseeing"},
        {"key": "meals", "label": "Meal"},
        {"key": "tour_manager", "label": "Tour Manager"},
    ]
    p["tour_type_options"] = _tour_types(pkg["price"])
    p["day_plan"] = _day_plan(pkg)
    p["accommodation"] = _accommodation(pkg)
    p["is_group_tour"] = True

    airfare = ("Return economy class airfare from India" + (" (international)" if intl else ""))
    p["inclusions_detail"] = {
        "Flights": [airfare + " on a reputed airline or similar.", "Joining/Direct (JD) pax do not have any flights included."],
        "Accommodation": [f"{a['nights']}N in {a['city']} — {a['hotel']}." for a in p["accommodation"]],
        "Sightseeing": pkg.get("highlights", []),
        "Meals": [f"{breakfasts} breakfasts (except Day 1)", f"{lunches} lunches & {dinners} dinners as per itinerary"],
        "Visa": ["Visa assistance as per itinerary." if intl else "No visa required for Indian nationals."],
        "Tour Manager": ["Experienced & knowledgeable tour manager accompanies the group throughout (subject to minimum 15–20 travellers), ensuring a seamless, stress-free journey."],
        "Transfer": ["All transfers & excursions with entrance fees (as specified in the itinerary) by air-conditioned coach."],
    }
    p["price_includes"] = [
        ("Cost of Visa & Medical Insurance up to age 60 years." if intl else "Medical & travel insurance for the trip."),
        airfare + " or similar airlines.",
        "Sightseeing, accommodation & services as per the above-mentioned itinerary.",
        "All transfers & excursions with entrance fees by air-conditioned coach.",
        "Services of a professional, friendly Svaagat Travels Tour Manager (subject to minimum group size) or local representative.",
        "All applicable local taxes and services.",
    ]
    p["price_excludes"] = [
        "Any increase in airfare/taxes charged by the airline.",
        "Applicable GST and TCS are additional.",
        "Tipping for coach driver, guides & restaurant staff.",
        "Porterage, laundry, mini-bar, telephone charges and items of personal nature.",
        "Any meals or excursions not mentioned in the itinerary.",
        "Cost of optional excursions and city sightseeing done privately.",
    ]
    p["things_to_note"] = [
        "The routing of the itinerary may change as per flight & hotel availability.",
        "Please do not issue any tickets without confirming with the sales team.",
        "Joining/Direct (JD) pax do not have any flights included (domestic/international).",
        "Maximum number of occupants in a hotel room is 3 guests.",
        "Standard hotel check-in is 1500 hrs and check-out is 1000 hrs.",
    ]
    return p
