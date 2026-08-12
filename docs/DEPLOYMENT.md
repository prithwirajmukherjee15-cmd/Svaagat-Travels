# Svaagat Travels — Deployment Guide

This is a **full-stack** application:

- **Frontend:** React (Create React App + CRACO, Tailwind, shadcn/ui)
- **Backend:** FastAPI (Python) + MongoDB (Motor async driver)
- **Payments:** Stripe Checkout · **Auth:** JWT (email/password) + managed Google login

> ⚠️ **Important:** Netlify can host **only the frontend** (static files). The Python/FastAPI
> backend and MongoDB must be hosted separately (e.g. **Render**, **Railway**, or **Fly.io**),
> and MongoDB on **MongoDB Atlas**. You then point the frontend at your backend URL.
>
> Deploying only the frontend zip to Netlify will render the UI, but Holidays / Hotels /
> Auth / Payments will not work until the backend is live and wired up.

> ℹ️ **Demo note:** This project is deployed as a **client-first mock** using **free tiers**
> (Render for the backend, MongoDB Atlas for the database). Render's free tier puts the
> service to sleep after inactivity, so the **first request after a pause takes ~30–50 seconds**
> to wake the server. This is expected on free hosting; upgrade the Render instance to remove
> cold starts.

---

## Architecture at a glance

```
[ Netlify (frontend, static) ]  --HTTPS-->  [ Render/Railway (FastAPI backend) ]  -->  [ MongoDB Atlas ]
        REACT_APP_BACKEND_URL                       /api/*  routes                         database
```

All backend routes are prefixed with `/api`. The frontend calls
`${REACT_APP_BACKEND_URL}/api/...`, so no Netlify proxy/redirect for the API is required.

---

## Part A — Deploy the Backend (do this first)

### 1. Create a MongoDB (MongoDB Atlas, free tier)
1. Create a free cluster at https://www.mongodb.com/atlas.
2. Create a database user + password.
3. Network Access → allow `0.0.0.0/0` (or your host's IPs).
4. Copy the connection string, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### 2. Deploy FastAPI (example: Render.com)
1. Push the `backend/` folder to a Git repo (or use Render's manual deploy).
2. New → **Web Service** → connect the repo (root = `backend`).
3. **Runtime:** Python 3.11
4. **Build command:**
   ```
   pip install -r requirements.txt --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
   ```
   > The `--extra-index-url` is required because `emergentintegrations` (used for Stripe
   > Checkout) is served from that package index. Everything else installs from PyPI.
5. **Start command:**
   ```
   uvicorn server:app --host 0.0.0.0 --port $PORT
   ```
   (A `Procfile` is included for Railway/Heroku-style platforms.)
6. **Environment variables** (from `backend/.env.example`):
   | Key | Value |
   |-----|-------|
   | `MONGO_URL` | your Atlas connection string |
   | `DB_NAME` | `svaagat_travels` |
   | `CORS_ORIGINS` | your Netlify URL, e.g. `https://svaagat.netlify.app` |
   | `STRIPE_API_KEY` | your Stripe secret key (or keep the bundled test key) |
   | `JWT_SECRET` | a long random string |
   | `JWT_ALGORITHM` | `HS256` |
   | `JWT_EXPIRE_DAYS` | `7` |
7. Deploy. Note the public URL, e.g. `https://svaagat-backend.onrender.com`.
8. Verify: open `https://<your-backend>/api/` → should return `{"message":"Svaagat Travels API","status":"ok"}`.

### 3. Seed data
No seeding step is needed — all catalogue content (packages, hotels, forex, flights) is served
from in-code data files (`seed_data.py`, `hotels_data.py`). MongoDB is used only for users,
bookings, payment transactions and newsletter signups, which are created on demand.

---

## Part B — Deploy the Frontend to Netlify

### Option 1 — Drag-and-drop a pre-built `build/` folder (simplest)
1. On your computer, inside `frontend/`:
   ```
   cp .env.example .env          # then edit REACT_APP_BACKEND_URL
   yarn install
   yarn build
   ```
   Set `REACT_APP_BACKEND_URL` in `.env` to your **backend URL** from Part A (no trailing slash).
2. Drag the generated `frontend/build/` folder into Netlify → “Add new site → Deploy manually”.
3. Done. The included `public/_redirects` (`/* /index.html 200`) is copied into the build so
   client-side routes like `/hotels`, `/forex`, `/holidays/:id` work on refresh.

### Option 2 — Connect the Git repo to Netlify (CI builds)
- **Base directory:** `frontend`
- **Build command:** `yarn build`
- **Publish directory:** `frontend/build`
- **Environment variable:** `REACT_APP_BACKEND_URL = https://<your-backend-url>`

> `REACT_APP_BACKEND_URL` is baked in at **build time** (CRA). If you change the backend URL
> later, rebuild/redeploy the frontend.

---

## Part C — Final wiring checklist
- [ ] Backend `/api/` health check returns OK.
- [ ] Backend `CORS_ORIGINS` includes your exact Netlify origin.
- [ ] Frontend `.env` `REACT_APP_BACKEND_URL` points to the backend (HTTPS, no trailing slash).
- [ ] Rebuilt & redeployed the frontend after setting the URL.
- [ ] Register/login works; browsing Holidays & Hotels works; a booking redirects to Stripe.

---

## Notes on third-party services (shipped as-is)
- **Stripe:** Uses `emergentintegrations` + `STRIPE_API_KEY`. The bundled key is an
  Emergent-managed **test** key. Swap in your own Stripe key for production. Test card:
  `4242 4242 4242 4242`, any future expiry, any CVC.
- **Google login:** Routes through a managed Google-auth broker
  (`auth.emergentagent.com` → `/auth/callback`). It works out of the box while that service is
  available. To remove this dependency entirely, replace the Google button in
  `frontend/src/features/auth/LoginPage.jsx` & `RegisterPage.jsx` and the session verification
  in `backend/routers/auth.py` with your own Google OAuth credentials.
- **Email/password auth** is fully self-contained (JWT) and needs no third party.

## Local development
```
# Backend
cd backend
pip install -r requirements.txt --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
cp .env.example .env    # edit values
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (in another terminal)
cd frontend
cp .env.example .env     # set REACT_APP_BACKEND_URL=http://localhost:8001
yarn install
yarn start
```
