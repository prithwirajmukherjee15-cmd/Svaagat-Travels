import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import client from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Plane, CalendarDays, ArrowRightLeft, Search, Clock, Loader2, PlaneTakeoff, PlaneLanding,
  Users, ArrowRight, ShieldCheck, BadgeIndianRupee, Headphones, Sparkles, Globe2, Wallet,
} from "lucide-react";

const WHY = [
  { icon: BadgeIndianRupee, title: "Best Fares", desc: "Handpicked deals across leading airlines." },
  { icon: ShieldCheck, title: "Secure Booking", desc: "Bank-grade encryption on every payment." },
  { icon: Globe2, title: "Domestic & Global", desc: "Fly across India and around the world." },
  { icon: Headphones, title: "Concierge Support", desc: "A dedicated travel desk, around the clock." },
];

const CLASS_PERKS = [
  { name: "Economy", tag: "Everyday value", desc: "Comfortable seats and generous baggage on smart fares.", accent: "from-sky-600 to-blue-800" },
  { name: "Premium Economy", tag: "Extra room", desc: "More legroom, priority boarding and elevated dining.", accent: "from-indigo-600 to-blue-900" },
  { name: "Business", tag: "Signature luxury", desc: "Lie-flat suites, lounge access and gourmet menus.", accent: "from-amber-500 to-orange-700" },
];

export default function FlightsPage() {
  const location = useLocation();
  const preset = location.state || {};
  const [airports, setAirports] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);
  const [trip, setTrip] = useState("oneway");
  const [origin, setOrigin] = useState(preset.origin || "BOM");
  const [destination, setDestination] = useState(preset.destination || "DXB");
  const [date, setDate] = useState(preset.depart_date ? new Date(preset.depart_date) : undefined);
  const [pax, setPax] = useState("1");
  const [cls, setCls] = useState("Economy");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client.get("/flights/airports").then((res) => setAirports(res.data.airports));
    client.get("/flights/top-routes").then((res) => setTopRoutes(res.data.routes)).catch(() => {});
  }, []);

  const runSearch = async (o = origin, d = destination, dt = date, p = pax, c = cls) => {
    if (o === d) { toast.error("Origin and destination cannot be the same"); return; }
    setLoading(true);
    setResults(null);
    try {
      const res = await client.post("/flights/search", {
        origin: o, destination: d,
        depart_date: dt ? format(dt, "yyyy-MM-dd") : "",
        passengers: parseInt(p, 10), travel_class: c,
      });
      setResults(res.data.results);
    } catch (e) {
      toast.error("Flight search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preset.origin) runSearch();
    // eslint-disable-next-line
  }, []);

  const swap = () => { setOrigin(destination); setDestination(origin); };
  const airportLabel = (code) => { const a = airports.find((x) => x.code === code); return a ? `${a.city} (${a.code})` : code; };

  const quickRoute = (r) => {
    setOrigin(r.from_code); setDestination(r.to_code);
    const d = new Date(); d.setDate(d.getDate() + 14);
    setDate(d);
    runSearch(r.from_code, r.to_code, d, pax, cls);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* HERO */}
      <div className="relative bg-[color:var(--tc-blue-900)] tc-noise overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--tc-blue-900)] via-[color:var(--tc-blue-900)]/85 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-[color:var(--tc-yellow-400)] text-xs font-bold uppercase tracking-widest"><Plane className="h-4 w-4" /> Flights</div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">Fly further, in signature style</h1>
          <p className="mt-3 text-white/75 text-sm sm:text-base max-w-xl">Compare fares across leading airlines and book domestic & international flights — effortlessly, with the Svaagat Travels concierge by your side.</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card data-testid="flights-search-form" className="rounded-2xl border border-[color:var(--tc-border)] p-5 shadow-[0_18px_50px_rgba(6,43,91,0.18)]">
          <Tabs value={trip} onValueChange={setTrip} className="mb-4">
            <TabsList className="bg-[color:var(--tc-surface-2)]">
              <TabsTrigger value="oneway" data-testid="flights-tab-oneway" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white">One Way</TabsTrigger>
              <TabsTrigger value="round" data-testid="flights-tab-round" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white">Round Trip</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
            <div className="md:col-span-3">
              <label className="text-[11px] text-[color:var(--tc-ink-500)] px-1">From</label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="h-11 rounded-xl" data-testid="flights-from-select"><div className="flex items-center gap-2"><PlaneTakeoff className="h-4 w-4 text-[color:var(--tc-blue-600)]" /><SelectValue /></div></SelectTrigger>
                <SelectContent>{airports.map((a) => <SelectItem key={a.code} value={a.code}>{a.city} ({a.code})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1 flex justify-center pb-1">
              <button onClick={swap} className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--tc-border)] hover:bg-[color:var(--tc-blue-100)] transition-colors" data-testid="flights-swap-button"><ArrowRightLeft className="h-4 w-4 text-[color:var(--tc-blue-700)]" /></button>
            </div>
            <div className="md:col-span-3">
              <label className="text-[11px] text-[color:var(--tc-ink-500)] px-1">To</label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="h-11 rounded-xl" data-testid="flights-to-select"><div className="flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-[color:var(--tc-blue-600)]" /><SelectValue /></div></SelectTrigger>
                <SelectContent>{airports.map((a) => <SelectItem key={a.code} value={a.code}>{a.city} ({a.code})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] text-[color:var(--tc-ink-500)] px-1">Departure</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex h-11 w-full items-center gap-2 rounded-xl border border-[color:var(--tc-border)] bg-white px-3 text-sm hover:bg-[color:var(--tc-surface-2)]" data-testid="flights-depart-date">
                    <CalendarDays className="h-4 w-4 text-[color:var(--tc-blue-600)]" />
                    <span className={date ? "text-[color:var(--tc-ink-900)]" : "text-[color:var(--tc-ink-500)]"}>{date ? format(date, "dd MMM") : "Date"}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="md:col-span-3">
              <label className="text-[11px] text-[color:var(--tc-ink-500)] px-1">Travellers & Class</label>
              <div className="flex gap-2">
                <Select value={pax} onValueChange={setPax}>
                  <SelectTrigger className="h-11 rounded-xl" data-testid="flights-pax-select"><div className="flex items-center gap-1"><Users className="h-4 w-4 text-[color:var(--tc-blue-600)]" /><SelectValue /></div></SelectTrigger>
                  <SelectContent>{["1","2","3","4","5"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={cls} onValueChange={setCls}>
                  <SelectTrigger className="h-11 rounded-xl" data-testid="flights-class-select"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Economy","Premium Economy","Business"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[color:var(--tc-ink-500)] mr-1">Popular:</span>
              {topRoutes.slice(0, 4).map((r) => (
                <button key={`${r.from_code}-${r.to_code}`} onClick={() => quickRoute(r)} className="rounded-full border border-[color:var(--tc-border)] bg-[color:var(--tc-surface-2)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--tc-ink-700)] hover:border-[color:var(--tc-blue-600)] hover:text-[color:var(--tc-blue-700)] transition-colors" data-testid="flights-quick-route">
                  {r.from_code} → {r.to_code}
                </button>
              ))}
            </div>
            <Button onClick={() => runSearch()} disabled={loading} data-testid="flights-search-submit-button" className="bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold px-8 h-12">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="mr-2 h-5 w-5" /> Search Flights</>}
            </Button>
          </div>
        </Card>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="space-y-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
        )}
        {!loading && results && results.length > 0 && (
          <>
            <p className="text-sm text-[color:var(--tc-ink-700)] mb-4"><span className="font-bold">{results.length}</span> flights from {airportLabel(origin)} to {airportLabel(destination)}</p>
            <div className="space-y-3">
              {results.map((f) => (
                <Card key={f.id} data-testid="flights-result-card" className="rounded-2xl border border-[color:var(--tc-border)] p-4 sm:p-5 hover:shadow-[0_10px_30px_rgba(6,43,91,0.10)] transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 sm:w-48">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] font-bold text-sm">{f.airline_code}</div>
                      <div>
                        <div className="font-bold text-sm text-[color:var(--tc-ink-900)]">{f.airline}</div>
                        <div className="text-xs text-[color:var(--tc-ink-500)]">{f.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center"><div className="font-bold text-lg text-[color:var(--tc-ink-900)]">{f.depart_time}</div><div className="text-xs text-[color:var(--tc-ink-500)]">{f.origin}</div></div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="text-xs text-[color:var(--tc-ink-500)] flex items-center gap-1"><Clock className="h-3 w-3" /> {f.duration}</div>
                        <div className="w-full h-px bg-[color:var(--tc-border)] my-1 relative"><Plane className="absolute right-0 -top-2 h-4 w-4 text-[color:var(--tc-blue-600)] rotate-90" /></div>
                        <div className="text-[11px] text-[color:var(--tc-ink-500)]">{f.stop_label}</div>
                      </div>
                      <div className="text-center"><div className="font-bold text-lg text-[color:var(--tc-ink-900)]">{f.arrive_time}</div><div className="text-xs text-[color:var(--tc-ink-500)]">{f.destination}</div></div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:w-40 border-t sm:border-t-0 sm:border-l border-[color:var(--tc-border)] pt-3 sm:pt-0 sm:pl-4">
                      <div className="text-right">
                        <div className="font-extrabold text-lg text-[color:var(--tc-blue-800)]">{formatINR(f.price)}</div>
                        <div className="text-[10px] text-[color:var(--tc-ink-500)]">{f.seats_left} seats left</div>
                      </div>
                      <Button size="sm" onClick={() => toast.success(`${f.airline} ${f.id} selected. Flight booking is coming soon!`)} className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white" data-testid="flights-select-button">Select</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        {!loading && results && results.length === 0 && (
          <div className="py-16 text-center text-[color:var(--tc-ink-500)]">No flights found. Try different dates or airports.</div>
        )}

        {/* Discovery content (shown before a search is run) */}
        {!loading && !results && (
          <div className="space-y-12">
            {/* Popular routes */}
            <section data-testid="flights-popular-routes">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[color:var(--tc-yellow-500)]" />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[color:var(--tc-blue-900)]">Popular flight routes</h2>
              </div>
              <p className="text-sm text-[color:var(--tc-ink-500)] mt-1">Tap a route to see live indicative fares instantly.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {topRoutes.map((r) => (
                  <button key={`${r.from_code}-${r.to_code}`} onClick={() => quickRoute(r)} className="group text-left rounded-2xl border border-[color:var(--tc-border)] bg-white p-5 hover:shadow-[0_14px_40px_rgba(6,43,91,0.12)] hover:border-[color:var(--tc-blue-400,#7FA8D9)] transition-all" data-testid="flights-route-card">
                    <div className="flex items-center justify-between">
                      <Badge className={`border-0 text-[10px] ${r.type === "International" ? "bg-[color:var(--tc-blue-900)] text-white" : "bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]"}`}>{r.type}</Badge>
                      <span className="text-[11px] text-[color:var(--tc-ink-500)]">{r.airline}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[color:var(--tc-ink-900)]">
                      <span className="font-bold">{r.from}</span>
                      <span className="flex-1 border-t border-dashed border-[color:var(--tc-border)] relative"><Plane className="absolute left-1/2 -translate-x-1/2 -top-2 h-3.5 w-3.5 text-[color:var(--tc-blue-600)]" /></span>
                      <span className="font-bold">{r.to}</span>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <div><div className="text-[10px] text-[color:var(--tc-ink-500)]">from</div><div className="font-extrabold text-[color:var(--tc-blue-800)]">{formatINR(r.price)}</div></div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--tc-blue-700)] group-hover:translate-x-0.5 transition-transform">Search <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Cabin classes */}
            <section>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[color:var(--tc-blue-900)]">Choose how you fly</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                {CLASS_PERKS.map((c) => (
                  <div key={c.name} className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${c.accent} min-h-[160px] flex flex-col justify-between`}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{c.tag}</span>
                      <h3 className="mt-1 font-display text-xl font-bold">{c.name}</h3>
                    </div>
                    <p className="text-sm text-white/85">{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Why fly with Svaagat */}
            <section className="rounded-3xl bg-[color:var(--tc-surface-2)] p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[color:var(--tc-blue-900)] text-center">Why book flights with Svaagat Travels</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {WHY.map((w) => (
                  <Card key={w.title} className="rounded-2xl border border-[color:var(--tc-border)] bg-white p-5 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]"><w.icon className="h-6 w-6" /></div>
                    <h3 className="mt-3 font-bold text-sm text-[color:var(--tc-ink-900)]">{w.title}</h3>
                    <p className="mt-1 text-xs text-[color:var(--tc-ink-500)]">{w.desc}</p>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
