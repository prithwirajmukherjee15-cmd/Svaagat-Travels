<div align="center">

<img src="./docs/banner.svg" alt="Svaagat Travels" width="100%" />

<br/>

<img src="./frontend/public/svaagat-logo.png" alt="Svaagat Travels logo" width="90" />

# Svaagat Travels

**A premium, full-stack travel platform — Holidays, Hotels, Flights & Forex.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

### 🔗 **[Live Demo → svaagat-travels.netlify.app](https://svaagat-travels.netlify.app)** &nbsp;·&nbsp; [API → /api](https://svaagat-travels.onrender.com/api)

</div>

---

## 📖 Overview

**Svaagat Travels** is a modern, responsive travel portal that unifies holidays, luxury
hotels, flights and foreign-exchange services in one elegant experience. Users browse
curated holiday packages with day-wise itineraries and tiered pricing, reserve handpicked
luxury hotels, search flights, convert currencies, earn **EDGE loyalty points**, and
complete secure bookings via **Stripe** — all wrapped in a premium, royal-inspired UI.

> 👉 **The best way to explore the project is the [live demo](https://svaagat-travels.netlify.app).**

> ⏳ **Please note — first load may be slow.** This is a **client-first mock / demo project**.
> The backend is hosted on **Render's free tier**, which "sleeps" after inactivity, so the
> **first request can take ~30–50 seconds** to wake the server. Once it's awake, everything
> is fast. Just give it a moment on the first visit and refresh if needed. 🙂

---

## ✨ Features

- **🏝️ Holiday Packages** — Browse & filter domestic/international tours, rich day-wise itineraries, and tiered pricing (Value / Deluxe / Luxury).
- **🏨 Luxury Hotels** — A curated collection of world-renowned properties with image galleries, room tiers, amenities and per-night booking.
- **✈️ Flights** — Premium flight search with popular routes and cabin-class options.
- **💱 Forex** — Live-style rates, an interactive currency converter, and services.
- **🎁 EDGE Loyalty** — Earn and track loyalty points on every booking.
- **🔐 Authentication** — Email/Password **and** Google sign-in, both issuing app JWTs.
- **💳 Payments** — Secure Stripe Checkout for packages and hotel reservations.
- **👤 Accounts** — Profile, booking history and loyalty dashboard.
- **📱 Responsive & Accessible** — Mobile-first design with a consistent design-token system.

---

## 🏛️ Architecture

```
                     HTTPS                          Motor (async)
  ┌──────────────┐  /api/*   ┌────────────────────┐   driver    ┌──────────────┐
  │   Frontend   │ ────────▶ │      Backend        │ ──────────▶ │   MongoDB    │
  │ React (CRA)  │           │   FastAPI (Python)  │             │  (Atlas)     │
  │  on Netlify  │ ◀──────── │     on Render       │ ◀────────── │              │
  └──────────────┘   JSON    └─────────┬───────────┘             └──────────────┘
                                        │
                                        ▼
                              ┌────────────────────┐
                              │   Stripe Checkout   │  (secure payments)
                              └────────────────────┘
```

The frontend calls `${REACT_APP_BACKEND_URL}/api/...`. Catalogue content (packages, hotels,
forex, flights) is served from in-code data modules; MongoDB stores users, bookings,
payment transactions and newsletter signups.

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, React Router 7, Tailwind CSS 3, shadcn/ui, Zustand, Framer Motion, Axios (CRA + CRACO) |
| **Backend** | FastAPI, Uvicorn, Pydantic v2, Motor (async MongoDB), PyJWT, Passlib |
| **Database** | MongoDB |
| **Payments** | Stripe Checkout |
| **Hosting** | Netlify (frontend), Render (backend), MongoDB Atlas |

---

## 🗂️ Project Structure

```
Svaagat-Travels/
├── backend/                    # FastAPI application
│   ├── server.py               # App entry point (CORS, routers)
│   ├── database.py             # MongoDB (Motor) client
│   ├── models.py               # Pydantic models
│   ├── auth_utils.py           # JWT helpers & auth dependency
│   ├── routers/
│   │   ├── auth.py             # Register / login / Google session / me
│   │   ├── packages.py         # Holiday packages
│   │   ├── hotels.py           # Luxury hotels
│   │   ├── content.py          # Home, offers, forex, flights, faqs
│   │   └── payments.py         # Stripe checkout & bookings
│   ├── seed_data.py            # Packages / forex / flights / home content
│   ├── hotels_data.py          # Hotel catalogue + room tiers
│   ├── requirements.txt
│   └── .env.example
├── frontend/                   # React application
│   ├── src/
│   │   ├── features/           # home, holidays, hotels, flights, forex, auth, account, booking
│   │   ├── shared/             # Header, Footer, Layout, cards, Logo
│   │   ├── api/client.js       # Axios instance (+ JWT interceptor)
│   │   ├── lib/                # store (Zustand), formatters
│   │   └── components/ui/      # shadcn/ui primitives
│   ├── public/_redirects       # SPA fallback for Netlify
│   ├── package.json
│   └── .env.example
├── docs/                       # 📚 Documentation
│   ├── DEPLOYMENT.md           # Full hosting guide (Netlify + Render + Atlas)
│   ├── AUTH.md                 # Authentication architecture
│   ├── DESIGN.md               # UI/UX design guidelines
│   └── banner.svg
├── netlify.toml                # Netlify build configuration
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 🔌 API Reference (selected)

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| `GET` | `/api/` | Health check | — |
| `POST` | `/api/auth/register` | Create account, returns JWT | — |
| `POST` | `/api/auth/login` | Log in, returns JWT | — |
| `POST` | `/api/auth/session` | Exchange Google session for JWT | — |
| `GET` | `/api/auth/me` | Current user profile | ✅ |
| `GET` | `/api/home` | Homepage content (hero, trending, stats) | — |
| `GET` | `/api/packages` | List / filter holiday packages | — |
| `GET` | `/api/packages/{id}` | Package detail + tiered pricing | — |
| `GET` | `/api/hotels` | List / filter hotels | — |
| `GET` | `/api/hotels/{id}` | Hotel detail + room tiers | — |
| `GET` | `/api/forex` | Rates, converter data, services | — |
| `GET` | `/api/flights/top-routes` | Popular flight routes | — |
| `POST` | `/api/flights/search` | Search flights | — |
| `POST` | `/api/checkout/session` | Stripe checkout (package) | ✅ |
| `POST` | `/api/checkout/hotel/session` | Stripe checkout (hotel) | ✅ |
| `GET` | `/api/bookings` | User's bookings | ✅ |

---

## ⚙️ Environment Variables

**Backend** (`backend/.env`) — see `backend/.env.example`:

| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | Database name |
| `CORS_ORIGINS` | Allowed frontend origin(s) |
| `STRIPE_API_KEY` | Stripe secret key |
| `JWT_SECRET` / `JWT_ALGORITHM` / `JWT_EXPIRE_DAYS` | JWT configuration |

**Frontend** (`frontend/.env`) — see `frontend/.env.example`:

| Variable | Description |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | Base URL of the backend (no `/api`, no trailing slash) |

---

## 🚀 Quick Start (Local)

> **Prerequisites:** Node.js 20, Yarn, Python 3.11, and a MongoDB instance
> (local or [MongoDB Atlas](https://www.mongodb.com/atlas)).

```bash
# 1. Clone
git clone https://github.com/prithwirajmukherjee15-cmd/Svaagat-Travels.git
cd Svaagat-Travels

# 2. Backend
cd backend
pip install -r requirements.txt --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
cp .env.example .env          # edit MONGO_URL, JWT_SECRET, etc.
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env          # set REACT_APP_BACKEND_URL=http://localhost:8001
yarn install
yarn start
```

App → `http://localhost:3000` · API → `http://localhost:8001/api/`

---

## ☁️ Deployment

This is a full-stack app: host the **frontend** on Netlify and the **backend + database** on
Render + MongoDB Atlas, then point the frontend at the backend.

📘 **Complete step-by-step guide → [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)**

Related docs: 🔐 [`docs/AUTH.md`](./docs/AUTH.md) · 🎨 [`docs/DESIGN.md`](./docs/DESIGN.md)

> **Current hosting:** Frontend on **Netlify**, backend on **Render (free tier)**, database on
> **MongoDB Atlas**. As a client-first demo, the free-tier backend sleeps when idle — the first
> request after a pause may take ~30–50 seconds to spin up.

---

## 🗺️ Roadmap

- [ ] Dedicated pages for Cruise & Rail
- [ ] Multi-currency price display
- [ ] User reviews & ratings on hotels/packages
- [ ] Wishlist / saved trips
- [ ] Admin dashboard for catalogue management

---

## 🤝 Contributing

Contributions are welcome! Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the
workflow, commit conventions and coding guidelines.

---

## 🙋 About the Author

**Prithwiraj Mukherjee** — a full-stack developer who enjoys turning ideas into polished,
production-minded web applications. Svaagat Travels was built as a client-first demo to
showcase an end-to-end product: clean React front end, a typed FastAPI back end, secure
auth and payments, and a considered, premium UI.

- 💼 Full-stack (React · FastAPI · MongoDB)
- 🎨 Focus on clean UX, design systems and maintainable code
- 📫 Reach me on GitHub: [@prithwirajmukherjee15-cmd](https://github.com/prithwirajmukherjee15-cmd)

> *Feel free to personalize this section with your own bio, links (LinkedIn, portfolio, email) and a photo.*

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](./LICENSE).

---

<div align="center">

### 👤 Author

**Prithwiraj Mukherjee**

[![GitHub](https://img.shields.io/badge/GitHub-prithwirajmukherjee15--cmd-181717?logo=github&logoColor=white)](https://github.com/prithwirajmukherjee15-cmd)

<sub>Built with care · Your journey, our pride.</sub>

</div>
