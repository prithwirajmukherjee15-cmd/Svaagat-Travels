import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api/client";
import { useAuthStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Handles the managed Google Auth redirect: <origin>/auth/callback#session_id=xxx
export default function AuthCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash || "";
    const match = hash.match(/session_id=([^&]+)/);
    const sessionId = match ? decodeURIComponent(match[1]) : null;

    if (!sessionId) {
      toast.error("Google login failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await client.post("/auth/session", {}, { headers: { "X-Session-ID": sessionId } });
        setAuth(res.data.access_token, res.data.user);
        // Clear the hash
        window.history.replaceState(null, "", window.location.pathname);
        toast.success(`Welcome, ${res.data.user.name.split(" ")[0]}!`);
        navigate("/account", { replace: true });
      } catch (e) {
        toast.error("Google login failed. Please try again.");
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, setAuth]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-[color:var(--tc-blue-700)]" />
      <p className="text-sm text-[color:var(--tc-ink-500)]">Signing you in…</p>
    </div>
  );
}
