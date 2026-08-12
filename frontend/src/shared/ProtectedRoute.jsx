import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--tc-blue-700)]" />
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};
