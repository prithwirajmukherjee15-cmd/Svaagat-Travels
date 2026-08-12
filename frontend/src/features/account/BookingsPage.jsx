import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/lib/format";
import { CalendarCheck, MapPin, Users, Plane, Package } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/bookings").then((res) => setBookings(res.data.bookings)).catch(() => setBookings([]));
  }, []);

  return (
    <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6" data-testid="account-bookings-list">
      <h1 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">My Bookings</h1>
      <p className="text-sm text-[color:var(--tc-ink-500)] mt-1">Your confirmed holiday bookings.</p>

      {bookings === null ? (
        <div className="mt-6 space-y-3">{Array.from({length:2}).map((_,i)=><Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-[color:var(--tc-ink-500)]" />
          <h3 className="mt-3 font-bold text-[color:var(--tc-ink-900)]">No bookings yet</h3>
          <p className="mt-1 text-sm text-[color:var(--tc-ink-500)]">Start exploring and book your next adventure!</p>
          <Button className="mt-4 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold" onClick={() => navigate("/holidays")} data-testid="bookings-explore-button">Explore Holidays</Button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => (
            <div key={b.booking_id} className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-[color:var(--tc-border)] overflow-hidden" data-testid="booking-item">
              <img src={b.image} alt={b.package_title} className="h-40 sm:h-auto sm:w-48 object-cover" />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[color:var(--tc-ink-900)]">{b.package_title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[color:var(--tc-ink-500)]">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {b.destination}</span>
                      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {b.travelers} travellers</span>
                      {b.travel_date && <span className="inline-flex items-center gap-1"><CalendarCheck className="h-3.5 w-3.5" /> {b.travel_date}</span>}
                    </div>
                  </div>
                  <Badge className="bg-[color:var(--tc-success,#0E9F6E)] text-white border-0 capitalize shrink-0">{b.status}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-[color:var(--tc-ink-500)]">Booking ID: {b.booking_id}</span>
                  <span className="font-extrabold text-[color:var(--tc-blue-800)]">{formatINR(b.amount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
