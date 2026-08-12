# Authentication & Authorization

Svaagat Travels supports **two sign-in methods**, both of which issue the same
application **JWT** (JSON Web Token). The token is stored client-side in `localStorage`
under the key `tc_token` and sent as a `Bearer` token on protected requests.

## Methods

| Method | Flow |
|--------|------|
| **Email / Password** | `POST /api/auth/register` and `POST /api/auth/login` → returns `{ access_token }` |
| **Google (managed OAuth)** | The login page redirects to the managed Google broker → returns to `/auth/callback#session_id=...` → the app exchanges it via `POST /api/auth/session` (header `X-Session-ID`) → returns `{ access_token }` |

Protected endpoints validate the token via the `Authorization: Bearer <jwt>` header
(e.g. `GET /api/auth/me`, `GET /api/bookings`).

## Token lifecycle

- **Storage:** `localStorage` key `tc_token`
- **Attachment:** an Axios request interceptor adds `Authorization: Bearer <token>` automatically
- **Expiry:** configurable via `JWT_EXPIRE_DAYS` (default `7` days)
- **Signing:** `JWT_SECRET` + `JWT_ALGORITHM` (default `HS256`)

## Quick API checks

```bash
BASE="https://your-backend-url"   # e.g. https://svaagat-travels.onrender.com

# 1) Register (returns access_token)
curl -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test.user@example.com","password":"Test@1234"}'

# 2) Call a protected endpoint
curl -X GET "$BASE/api/auth/me" -H "Authorization: Bearer <TOKEN>"
curl -X GET "$BASE/api/bookings" -H "Authorization: Bearer <TOKEN>"
```

## Browser session (for manual testing)

```js
localStorage.setItem('tc_token', '<TOKEN>');
location.reload();
```

## Configuration

Set the following environment variables on the backend (see
[`DEPLOYMENT.md`](./DEPLOYMENT.md)):

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Secret used to sign tokens — use a long random string in production |
| `JWT_ALGORITHM` | Signing algorithm (default `HS256`) |
| `JWT_EXPIRE_DAYS` | Token validity in days (default `7`) |

> The Google sign-in uses a managed OAuth broker so it works out of the box. To make the
> project fully independent, replace the broker call in
> `frontend/src/features/auth/{LoginPage,RegisterPage}.jsx` and the session exchange in
> `backend/routers/auth.py` with your own Google OAuth credentials. Email/password auth is
> fully self-contained and requires no third party.
