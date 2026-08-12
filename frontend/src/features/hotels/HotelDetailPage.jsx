import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import client from "@/api/client";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  MapPin, Star, Check, Loader2, ChevronRight, CalendarDays, Users, BedDouble,
  Wifi, Waves, Sparkles, Utensils, Dumbbell, ShieldCheck, Award, Gift, Phone,
  ChevronLeft, ChevronRight as ChevronRightIcon, BadgeCheck, Clock, Baby, XCircle,
} from "lucide-react";

const AMENITY_ICON = (name) => {
  const n = name.toLowerCase();
  if (n.includes("wi-fi") || n.includes("wifi")) return Wifi;
  if (n.includes("pool") || n.includes("beach") || n.includes("water") || n.includes("overwater")) return Waves;
  if (n.includes("spa") || n.includes("wellness") || n.includes("yoga")) return Sparkles;
  if (n.includes("dining") || n.includes("cuisine") || n.includes("bar") || n.includes("gourmet")) return Utensils;
  if (n.includes("fitness") || n.includes("dive")) return Dumbbell;
  if (n.includes("transfer") || n.includes("valet") || n.includes("parking")) return ShieldCheck;
  return BadgeCheck;
};

const StarRow = ({ n }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-[color:var(--tc-yellow-500)] text-[color:var(--tc-yellow-500)]" />
    ))}
  </span>
);

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [roomType, setRoomType] = useState("");
  const [nights, setNights] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [guests, setGuests] = useState("2");
  const [checkIn, setCheckIn] = useState();
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    setLoading(true);
    client.get(`/hotels/${id}`).then((res) => {
      setHotel(res.data);
      setRoomType(res.data.room_types?.[0]?.name || "");
      setLoading(false);
    }).catch(() => { setLoading(false); toast.error("Hotel not found"); });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Skeleton className="h-[420px] rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-6"><Skeleton className="h-64 rounded-2xl lg:col-span-2" /><Skeleton className="h-64 rounded-2xl" /></div>
      </div>
    );
  }
  if (!hotel) return <div className="py-20 text-center text-[color:var(--tc-ink-500)]">Hotel not found.</div>;

  const room = (hotel.room_types || []).find((r) => r.name === roomType) || hotel.room_types[0];
  const nNights = parseInt(nights, 10);
  const nRooms = parseInt(rooms, 10);
  const total = room.price * nNights * nRooms;
  const earnPoints = room.edge_points * nNights * nRooms;

  const handleBook = async () => {
    if (!token) { toast.info("Please login to reserve this hotel"); navigate("/login", { state: { from: `/hotels/${id}` } }); return; }
    setBooking(true);
    try {
      const res = await client.post("/checkout/hotel/session", {
        hotel_id: hotel.id, room_type: room.name, nights: nNights, rooms: nRooms,
        guests: parseInt(guests, 10), check_in: checkIn ? format(checkIn, "yyyy-MM-dd") : null,
        origin_url: window.location.origin,
      });
      if (res.data.url) window.location.href = res.data.url;
      else throw new Error("No checkout URL");
    } catch (e) {
      setBooking(false);
      toast.error(e?.response?.data?.detail || "Could not start checkout. Please try again.");
    }
  };

  const images = hotel.images || [hotel.image];

  return (
    <div className="bg-[color:var(--tc-surface-2)] min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5">
        <nav className="flex items-center gap-1.5 text-xs text-[color:var(--tc-ink-500)]" data-testid="hotel-breadcrumb">
          <Link to="/" className="hover:text-[color:var(--tc-blue-700)]">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/hotels" className="hover:text-[color:var(--tc-blue-700)]">Hotels</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[color:var(--tc-ink-900)] font-medium line-clamp-1">{hotel.name}</span>
        </nav>
      </div>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid lg:grid-cols-4 gap-3">
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden aspect-[16/9] bg-black" data-testid="hotel-gallery-main">
            <img src={images[activeImg]} alt={hotel.name} className="h-full w-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-[color:var(--tc-blue-900)]/90 text-white border-0 backdrop-blur font-semibold">{hotel.collection}</Badge>
              {hotel.popular && <Badge className="bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] border-0 font-bold">Popular</Badge>}
            </div>
            <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow" data-testid="hotel-gallery-prev"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => setActiveImg((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center shadow" data-testid="hotel-gallery-next"><ChevronRightIcon className="h-5 w-5" /></button>
          </div>
          <div className="lg:col-span-1 grid grid-cols-4 lg:grid-cols-1 gap-3">
            {images.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`relative rounded-xl overflow-hidden aspect-[4/3] lg:aspect-[16/10] ${activeImg === i ? "ring-2 ring-[color:var(--tc-blue-700)]" : "opacity-80 hover:opacity-100"}`} data-testid={`hotel-gallery-thumb-${i}`}>
                <img src={img} alt={`${hotel.name} ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Title */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <StarRow n={hotel.star_rating} />
            <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[color:var(--tc-ink-900)]" data-testid="hotel-detail-title">{hotel.name}</h1>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[color:var(--tc-ink-700)]"><MapPin className="h-4 w-4 text-[color:var(--tc-blue-600)]" /> {hotel.location}, {hotel.city}, {hotel.country}</div>
            <p className="mt-1 text-sm text-[color:var(--tc-ink-500)] italic">{hotel.landmark}</p>
          </div>
          <div className="rounded-2xl bg-[color:var(--tc-blue-900)] text-white px-4 py-3 text-center">
            <div className="flex items-center gap-1.5 justify-center"><Star className="h-4 w-4 fill-[color:var(--tc-yellow-400)] text-[color:var(--tc-yellow-400)]" /><span className="text-xl font-extrabold">{hotel.rating}</span></div>
            <div className="text-[11px] text-white/70">{hotel.reviews_count?.toLocaleString("en-IN")} reviews</div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-6 items-start">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6 bg-white">
            <h2 className="font-display text-xl font-bold text-[color:var(--tc-blue-900)]">About this hotel</h2>
            <p className="mt-3 text-sm text-[color:var(--tc-ink-700)] leading-relaxed">{hotel.description}</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {(hotel.highlights || []).map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[color:var(--tc-ink-700)]"><Check className="h-4 w-4 mt-0.5 text-[color:var(--tc-blue-700)] shrink-0" /> {h}</div>
              ))}
            </div>
          </Card>

          {/* Amenities */}
          <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6 bg-white" data-testid="hotel-amenities">
            <h2 className="font-display text-xl font-bold text-[color:var(--tc-blue-900)]">Amenities & facilities</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(hotel.amenities || []).map((a, i) => {
                const Ic = AMENITY_ICON(a);
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-2 rounded-xl bg-[color:var(--tc-surface-2)] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]"><Ic className="h-5 w-5" /></div>
                    <span className="text-[11px] font-semibold text-[color:var(--tc-ink-700)] leading-tight">{a}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Room types */}
          <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6 bg-white" data-testid="hotel-room-types">
            <h2 className="font-display text-xl font-bold text-[color:var(--tc-blue-900)]">Choose your room</h2>
            <div className="mt-4 space-y-3">
              {(hotel.room_types || []).map((r) => {
                const active = r.name === roomType;
                return (
                  <button
                    key={r.name}
                    onClick={() => setRoomType(r.name)}
                    data-testid={`hotel-room-option-${r.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`w-full text-left rounded-2xl border p-4 transition-colors ${active ? "border-[color:var(--tc-blue-700)] bg-[color:var(--tc-blue-100)]/50 ring-1 ring-[color:var(--tc-blue-700)]" : "border-[color:var(--tc-border)] hover:border-[color:var(--tc-blue-400,#7FA8D9)]"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4 text-[color:var(--tc-blue-700)]" />
                          <h3 className="font-bold text-[color:var(--tc-ink-900)]">{r.name}</h3>
                          {active && <Badge className="bg-[color:var(--tc-blue-700)] text-white border-0 text-[10px]">Selected</Badge>}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[color:var(--tc-ink-500)]">
                          <span>{r.size}</span><span>· {r.occupancy}</span><span>· {r.bed}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {r.perks.map((p) => (
                            <span key={p} className="inline-flex items-center gap-1 rounded-full bg-[color:var(--tc-surface-2)] px-2 py-0.5 text-[11px] text-[color:var(--tc-ink-700)]"><Check className="h-3 w-3 text-[color:var(--tc-blue-700)]" /> {p}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-extrabold text-[color:var(--tc-blue-800)]">{formatINR(r.price)}</div>
                        <div className="text-[10px] text-[color:var(--tc-ink-500)]">/ night</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Policies */}
          {hotel.policies && (
            <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6 bg-white">
              <h2 className="font-display text-xl font-bold text-[color:var(--tc-blue-900)]">Good to know</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-[color:var(--tc-ink-700)]">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[color:var(--tc-blue-700)]" /> Check-in: <span className="font-semibold">{hotel.policies.check_in}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[color:var(--tc-blue-700)]" /> Check-out: <span className="font-semibold">{hotel.policies.check_out}</span></div>
                <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-[color:var(--tc-blue-700)]" /> {hotel.policies.cancellation}</div>
                <div className="flex items-center gap-2"><Baby className="h-4 w-4 text-[color:var(--tc-blue-700)]" /> {hotel.policies.children}</div>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT: booking */}
        <div className="lg:sticky lg:top-24">
          <Card className="rounded-2xl border border-[color:var(--tc-border)] p-5 bg-white shadow-[0_14px_40px_rgba(6,43,91,0.10)]">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] text-[color:var(--tc-ink-500)]">Per night from</div>
                <div className="text-2xl font-extrabold text-[color:var(--tc-blue-800)]" data-testid="hotel-room-price">{formatINR(room.price)}</div>
              </div>
              <Badge className="bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] border-0">{room.name}</Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <Label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Room type</Label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger className="h-11 rounded-xl mt-1" data-testid="hotel-booking-room-select"><SelectValue /></SelectTrigger>
                  <SelectContent>{(hotel.room_types || []).map((r) => <SelectItem key={r.name} value={r.name}>{r.name} — {formatINR(r.price)}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Check-in date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full h-11 rounded-xl mt-1 justify-start font-normal" data-testid="hotel-booking-date">
                      <CalendarDays className="mr-2 h-4 w-4 text-[color:var(--tc-blue-700)]" />
                      {checkIn ? format(checkIn, "PPP") : <span className="text-[color:var(--tc-ink-500)]">Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Nights</Label>
                  <Select value={nights} onValueChange={setNights}>
                    <SelectTrigger className="h-11 rounded-xl mt-1" data-testid="hotel-booking-nights"><SelectValue /></SelectTrigger>
                    <SelectContent>{Array.from({ length: 14 }, (_, i) => i + 1).map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Rooms</Label>
                  <Select value={rooms} onValueChange={setRooms}>
                    <SelectTrigger className="h-11 rounded-xl mt-1" data-testid="hotel-booking-rooms"><SelectValue /></SelectTrigger>
                    <SelectContent>{Array.from({ length: 6 }, (_, i) => i + 1).map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="h-11 rounded-xl mt-1" data-testid="hotel-booking-guests"><SelectValue /></SelectTrigger>
                    <SelectContent>{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-xl bg-[color:var(--tc-surface-2)] p-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-[color:var(--tc-ink-700)]"><span>{formatINR(room.price)} × {nNights} night{nNights > 1 ? "s" : ""} × {nRooms} room{nRooms > 1 ? "s" : ""}</span></div>
                <div className="flex justify-between font-bold text-[color:var(--tc-ink-900)] pt-1.5 border-t border-[color:var(--tc-border)]"><span>Total</span><span data-testid="hotel-total-price">{formatINR(total)}</span></div>
              </div>

              <Button onClick={handleBook} disabled={booking} data-testid="hotel-book-now-button" className="w-full h-12 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold text-base">
                {booking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting…</> : <>Reserve Now</>}
              </Button>

              <div className="flex items-center gap-2 rounded-xl border border-[color:var(--tc-border)] p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--tc-yellow-100)] text-[color:var(--tc-yellow-600,#B7791F)]"><Award className="h-5 w-5" /></div>
                <div className="text-xs"><span className="font-bold text-[color:var(--tc-blue-800)]">EDGE Rewards</span><div className="text-[color:var(--tc-ink-700)]">Earn <span className="font-bold" data-testid="hotel-edge-points">{earnPoints.toLocaleString("en-IN")} points</span> on this stay</div></div>
              </div>

              <button onClick={() => toast.info("Our luxury stays desk will call you back — coming soon")} className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-[color:var(--tc-blue-700)] hover:underline" data-testid="hotel-callback">
                <Phone className="h-4 w-4" /> Need help? Request a callback
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
