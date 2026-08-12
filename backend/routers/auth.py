import os
import uuid
import requests
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional

from database import db
from models import RegisterRequest, LoginRequest, AuthResponse, UserPublic, ProfileUpdate
from auth_utils import hash_password, verify_password, create_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


def _serialize_user(doc: dict) -> dict:
    doc = {k: v for k, v in doc.items() if k not in ("_id", "password_hash")}
    ca = doc.get("created_at")
    if isinstance(ca, str):
        try:
            doc["created_at"] = datetime.fromisoformat(ca)
        except Exception:
            doc["created_at"] = None
    return doc


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterRequest):
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    doc = {
        "user_id": user_id,
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "picture": None,
        "provider": "email",
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    token = create_token(user_id, doc["email"])
    return AuthResponse(access_token=token, user=UserPublic(**_serialize_user(doc)))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["user_id"], user["email"])
    return AuthResponse(access_token=token, user=UserPublic(**_serialize_user(user)))


@router.post("/session", response_model=AuthResponse)
async def google_session(x_session_id: Optional[str] = Header(None)):
    """Exchange Emergent Managed Google Auth session_id for an app JWT."""
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Missing session id")
    try:
        resp = requests.get(EMERGENT_SESSION_URL, headers={"X-Session-ID": x_session_id}, timeout=15)
    except Exception:
        raise HTTPException(status_code=502, detail="Auth service unreachable")
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    data = resp.json()
    email = (data.get("email") or "").lower()
    if not email:
        raise HTTPException(status_code=401, detail="Invalid session data")
    user = await db.users.find_one({"email": email})
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "name": data.get("name") or email.split("@")[0],
            "email": email,
            "phone": None,
            "picture": data.get("picture"),
            "provider": "google",
            "password_hash": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user)
    else:
        # update picture/name if newly available
        await db.users.update_one({"email": email}, {"$set": {"picture": data.get("picture") or user.get("picture"), "name": user.get("name") or data.get("name")}})
    token = create_token(user["user_id"], user["email"])
    return AuthResponse(access_token=token, user=UserPublic(**_serialize_user(user)))


@router.get("/me", response_model=UserPublic)
async def me(current=Depends(get_current_user)):
    return UserPublic(**_serialize_user(current))


@router.put("/profile", response_model=UserPublic)
async def update_profile(payload: ProfileUpdate, current=Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"user_id": current["user_id"]}, {"$set": updates})
    user = await db.users.find_one({"user_id": current["user_id"]})
    return UserPublic(**_serialize_user(user))
