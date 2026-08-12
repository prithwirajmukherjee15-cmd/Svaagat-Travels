from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid


def now_utc():
    return datetime.now(timezone.utc)


def gen_id(prefix=""):
    return f"{prefix}{uuid.uuid4().hex[:16]}"


# ---------- Auth ----------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    name: str
    email: str
    phone: Optional[str] = None
    picture: Optional[str] = None
    provider: str = "email"
    edge_points: int = 0
    created_at: Optional[datetime] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    picture: Optional[str] = None


# ---------- Payments / Bookings ----------
class CheckoutRequest(BaseModel):
    package_id: str
    travelers: int = Field(default=1, ge=1, le=20)
    travel_date: Optional[str] = None
    tour_type: str = "Value"
    origin_url: str


class HotelCheckoutRequest(BaseModel):
    hotel_id: str
    room_type: str = "Deluxe Room"
    nights: int = Field(default=1, ge=1, le=60)
    rooms: int = Field(default=1, ge=1, le=10)
    guests: int = Field(default=2, ge=1, le=20)
    check_in: Optional[str] = None
    origin_url: str


class CheckoutResponse(BaseModel):
    url: str
    session_id: str


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    booking_id: str
    user_id: str
    package_id: str
    package_title: str
    destination: str
    image: Optional[str] = None
    travelers: int
    travel_date: Optional[str] = None
    amount: float
    currency: str
    status: str  # pending | confirmed | cancelled
    payment_status: str  # initiated | paid | failed | expired
    session_id: Optional[str] = None
    created_at: datetime
