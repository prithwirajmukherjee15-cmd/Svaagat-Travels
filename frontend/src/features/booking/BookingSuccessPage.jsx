import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import client from "@/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { CheckCircle2, Loader2, XCircle, CalendarCheck, Home } from "lucide-react";

const MAX_ATTEMPTS = 6;

export default function BookingSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id");
  const [state, setState] = useState("checking"); // checking | success | failed | timeout
  const [details, setDetails] = useState(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (!sessionId) { setState("failed"); return; }
    let timer;
    const poll = async () => {
      try {
        const res = await client.get(`/checkout/status/${sessionId}`);
        const ps = res.data.payment_status;
        if (ps === "paid") {
          setDetails(res.data);
          setState("success");
          return;
        }
        if (res.data.status === "expired") { setState("failed"); return; }
        attempts.current += 1;
        if (attempts.current >= MAX_ATTEMPTS) { setState("timeout"); return; }
        timer = setTimeout(poll, 2000);
      } catch (e) {
        attempts.current += 1;
        if (attempts.current >= MAX_ATTEMPTS) { setState("failed"); return; }
        timer = setTimeout(poll, 2000);
      }
    };
    poll();
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="bg-[color:var(--tc-surface-2)] min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4" data-testid="booking-success-page">
      <Card className="w-full max-w-lg rounded-2xl border border-[color:var(--tc-border)] p-8 text-center">
        {state === "checking" && (
          <>
            <Loader2 className="h-14 w-14 mx-auto animate-spin text-[color:var(--tc-blue-700)]" />
            <h1 className="mt-4 font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Confirming your payment…</h1>
            <p className="mt-2 text-sm text-[color:var(--tc-ink-500)]">Please wait while we verify your transaction. Do not close this window.</p>
          </>
        )}
        {state === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--tc-yellow-100)]"><CheckCircle2 className="h-10 w-10 text-[color:var(--tc-success,#0E9F6E)]" /></div>
            <h1 className="mt-4 font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Booking Confirmed!</h1>
            <p className="mt-2 text-sm text-[color:var(--tc-ink-500)]">Your holiday is booked. A confirmation has been recorded in your account.</p>
            {details && (
              <div className="mt-5 rounded-xl bg-[color:var(--tc-surface-2)] p-4 text-left text-sm">
                <div className="flex justify-between"><span className="text-[color:var(--tc-ink-500)]">Amount Paid</span><span className="font-bold text-[color:var(--tc-blue-800)]">{formatINR((details.amount_total || 0) / 100)}</span></div>
                <div className="flex justify-between mt-1"><span className="text-[color:var(--tc-ink-500)]">Status</span><span className="font-semibold capitalize text-[color:var(--tc-success,#0E9F6E)]">Paid</span></div>
              </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/account/bookings")} className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white" data-testid="success-view-bookings"><CalendarCheck className="mr-2 h-4 w-4" /> View My Bookings</Button>
              <Button variant="secondary" onClick={() => navigate("/")}><Home className="mr-2 h-4 w-4" /> Back to Home</Button>
            </div>
          </>
        )}
        {(state === "failed" || state === "timeout") && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50"><XCircle className="h-10 w-10 text-[color:var(--tc-danger,#E11D48)]" /></div>
            <h1 className="mt-4 font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">{state === "timeout" ? "Still processing" : "Payment not completed"}</h1>
            <p className="mt-2 text-sm text-[color:var(--tc-ink-500)]">{state === "timeout" ? "Your payment is taking longer than expected. Please check My Bookings shortly." : "We couldn't confirm your payment. If money was deducted, it will be refunded automatically."}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/holidays")} className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white">Browse Holidays</Button>
              <Button variant="secondary" onClick={() => navigate("/account/bookings")}>My Bookings</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
