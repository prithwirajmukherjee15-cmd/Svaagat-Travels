import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { Layout } from "@/shared/Layout";
import { ProtectedRoute } from "@/shared/ProtectedRoute";

import HomePage from "@/features/home/HomePage";
import HolidaysPage from "@/features/holidays/HolidaysPage";
import PackageDetailPage from "@/features/holidays/PackageDetailPage";
import FlightsPage from "@/features/flights/FlightsPage";
import ForexPage from "@/features/forex/ForexPage";
import HotelsPage from "@/features/hotels/HotelsPage";
import HotelDetailPage from "@/features/hotels/HotelDetailPage";
import FaqPage from "@/features/faq/FaqPage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import AuthCallback from "@/features/auth/AuthCallback";
import AccountLayout from "@/features/account/AccountLayout";
import ProfilePage from "@/features/account/ProfilePage";
import BookingsPage from "@/features/account/BookingsPage";
import BookingSuccessPage from "@/features/booking/BookingSuccessPage";

function AppRoutes() {
  const location = useLocation();

  // Managed Google Auth returns to <origin>/auth/callback#session_id=...
  // Handle callback synchronously before anything else (route also covers it).
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/holidays" element={<HolidaysPage />} />
        <Route path="/holidays/:id" element={<PackageDetailPage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/forex" element={<ForexPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/booking/success" element={<BookingSuccessPage />} />
        <Route
          path="/account"
          element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}
        >
          <Route index element={<ProfilePage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    // Skip /auth/me check if returning from OAuth callback (AuthCallback handles it)
    if (window.location.hash?.includes("session_id=")) {
      useAuthStore.setState({ loading: false });
      return;
    }
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
