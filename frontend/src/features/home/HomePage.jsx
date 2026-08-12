import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import client from "@/api/client";
import { SectionHeading } from "@/shared/SectionHeading";
import { PackageCard } from "@/shared/PackageCard";
import { Newsletter } from "@/features/home/Newsletter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatINR } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Search, MapPin, Users, CalendarDays, Plane, Palmtree, Banknote,
  Star, ArrowRight, ChevronRight, ChevronLeft, ShieldCheck, BadgeIndianRupee, Headphones,
  Package, Map, Quote, Sparkles, Gift, PlaneTakeoff, Building2, Hotel,
  Compass, Wallet, Smartphone, Apple, CheckCircle2, MessageCircleQuestion,
} from "lucide-react";

const CITIES = ["Mumbai", "New Delhi", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"];
const DEST = ["Dubai", "Bangkok", "Bali", "Maldives", "Singapore", "Paris", "Hanoi", "Srinagar", "Munnar", "Port Blair", "Leh", "Goa"];
const CURRENCIES = ["USD - US Dollar", "EUR - Euro", "GBP - British Pound", "AED - UAE Dirham", "THB - Thai Baht", "SGD - Singapore Dollar"];
const WHY_ICONS = { "shield-check": ShieldCheck, users: Users, "badge-indian-rupee": BadgeIndianRupee, headphones: Headphones, package: Package, map: Map };

/* ---------- count up ---------- */
const useCountUp = (target, inView) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(String(target).replace(/[^0-9]/g, ""), 10) || 0;
    const dur = 1400; const t0 = performance.now(); let raf;
    const step = (t) => { const p = Math.min((t - t0) / dur, 1); setVal(Math.floor(p * num)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, inView]);
  return val;
};
const StatItem = ({ stat }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const hasNumber = /[0-9]/.test(String(stat.value));
  const num = useCountUp(hasNumber ? stat.value : "", inView);
  const suffix = String(stat.value).replace(/[0-9]/g, "");
  return (
    <div ref={ref} className="text-center px-4">
      <div className="font-display text-2xl sm:text-3xl font-bold text-[color:var(--tc-blue-800)]">{hasNumber ? <>{num}{suffix}</> : stat.value}</div>
      <div className="mt-1 text-xs sm:text-sm text-[color:var(--tc-ink-500)]">{stat.label}</div>
    </div>
  );
};

/* ---------- search field helpers ---------- */
const FieldSelect = ({ label, icon: Icon, value, onChange, options, placeholder, testid }) => (
  <div>
    <label className="text-[11px] text-[color:var(--tc-ink-500)] px-1">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger data-testid={testid} className="h-11 rounded-xl">
        <div className="flex items-center gap-2 truncate">{Icon && <Icon className="h-4 w-4 text-[color:var(--tc-blue-600)] shrink-0" />}<SelectValue placeholder={placeholder || "Select"} /></div>
      </SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </div>
);
const FieldDate = ({ label, value, onChange, testid }) => (
  <div>
    <label className="text-[11px] text-[color:var(--tc-ink-500)] px-1">{label}</label>
    <Popover>
      <PopoverTrigger asChild>
        <button data-testid={testid} className="flex h-11 w-full items-center gap-2 rounded-xl border border-[color:var(--tc-border)] bg-white px-3 text-sm text-left hover:bg-[color:var(--tc-surface-2)] transition-colors">
          <CalendarDays className="h-4 w-4 text-[color:var(--tc-blue-600)]" />
          <span className={value ? "text-[color:var(--tc-ink-900)]" : "text-[color:var(--tc-ink-500)]"}>{value ? format(value, "dd MMM yyyy") : "Select date"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={value} onSelect={onChange} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus /></PopoverContent>
    </Popover>
  </div>
);

const HeroSearch = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("holidays");
  const [hFrom, setHFrom] = useState("Mumbai");
  const [hTo, setHTo] = useState("");
  const [hDate, setHDate] = useState();
  const [hTravellers, setHTravellers] = useState("2");
  const [fFrom, setFFrom] = useState("BOM");
  const [fTo, setFTo] = useState("DXB");
  const [fDate, setFDate] = useState();
  const [cur, setCur] = useState("USD - US Dollar");
  const [amt, setAmt] = useState("");

  const submit = () => {
    if (tab === "holidays") { const p = new URLSearchParams(); if (hTo) p.set("destination", hTo); navigate(`/holidays?${p.toString()}`); }
    else if (tab === "flights") navigate("/flights", { state: { origin: fFrom, destination: fTo, depart_date: fDate ? format(fDate, "yyyy-MM-dd") : "" } });
    else navigate("/forex");
  };

  return (
    <Card className="rounded-2xl bg-white shadow-[0_18px_50px_rgba(6,43,91,0.28)] border border-[color:var(--tc-border)] p-2 sm:p-3">
      <Tabs value={tab} onValueChange={setTab} data-testid="home-search-tabs">
        <TabsList className="grid w-full grid-cols-3 bg-[color:var(--tc-surface-2)] rounded-xl h-auto p-1">
          <TabsTrigger value="holidays" data-testid="home-search-tab-holidays" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white rounded-lg py-2.5 font-semibold text-sm gap-1.5"><Palmtree className="h-4 w-4" /> Holidays</TabsTrigger>
          <TabsTrigger value="flights" data-testid="home-search-tab-flights" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white rounded-lg py-2.5 font-semibold text-sm gap-1.5"><Plane className="h-4 w-4" /> Flights</TabsTrigger>
          <TabsTrigger value="forex" data-testid="home-search-tab-forex" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white rounded-lg py-2.5 font-semibold text-sm gap-1.5"><Banknote className="h-4 w-4" /> Forex</TabsTrigger>
        </TabsList>
        <TabsContent value="holidays" className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <FieldSelect label="From" icon={MapPin} value={hFrom} onChange={setHFrom} options={CITIES} testid="home-holidays-from" />
            <FieldSelect label="Destination" icon={MapPin} value={hTo} onChange={setHTo} options={DEST} placeholder="Where to?" testid="home-holidays-to" />
            <FieldDate label="Travel Month" value={hDate} onChange={setHDate} testid="home-holidays-date" />
            <FieldSelect label="Travellers" icon={Users} value={hTravellers} onChange={setHTravellers} options={["1", "2", "3", "4", "5", "6"]} testid="home-holidays-travellers" />
          </div>
        </TabsContent>
        <TabsContent value="flights" className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <FieldSelect label="From" icon={Plane} value={fFrom} onChange={setFFrom} options={["BOM", "DEL", "BLR", "MAA", "HYD", "CCU", "GOI"]} testid="home-flights-from" />
            <FieldSelect label="To" icon={MapPin} value={fTo} onChange={setFTo} options={["DXB", "SIN", "BKK", "LHR", "CDG", "DEL", "BOM"]} testid="home-flights-to" />
            <FieldDate label="Departure" value={fDate} onChange={setFDate} testid="home-flights-date" />
            <div className="flex items-end"><div className="w-full rounded-xl border border-[color:var(--tc-border)] px-3 py-2"><div className="text-[11px] text-[color:var(--tc-ink-500)]">Class</div><div className="text-sm font-semibold text-[color:var(--tc-ink-900)]">Economy</div></div></div>
          </div>
        </TabsContent>
        <TabsContent value="forex" className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="md:col-span-2"><FieldSelect label="Currency" icon={Banknote} value={cur} onChange={setCur} options={CURRENCIES} testid="home-forex-currency" /></div>
            <div><label className="text-[11px] text-[color:var(--tc-ink-500)] px-1">Amount</label><Input data-testid="home-forex-amount" type="number" placeholder="e.g. 1000" value={amt} onChange={(e) => setAmt(e.target.value)} className="h-11 rounded-xl" /></div>
            <div className="flex items-end"><div className="w-full rounded-xl border border-[color:var(--tc-border)] px-3 py-2"><div className="text-[11px] text-[color:var(--tc-ink-500)]">Service</div><div className="text-sm font-semibold text-[color:var(--tc-ink-900)]">Buy Forex</div></div></div>
          </div>
        </TabsContent>
        <div className="mt-3 flex justify-end">
          <Button onClick={submit} data-testid="home-search-submit-button" className="w-full md:w-auto bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold px-8 h-12 text-base"><Search className="mr-2 h-5 w-5" /> Search</Button>
        </div>
      </Tabs>
    </Card>
  );
};

/* ---------- Hero Carousel ---------- */
const HeroCarousel = ({ slides }) => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const list = slides?.length ? slides : [{ title: "", subtitle: "", image: "https://images.unsplash.com/photo-1642516864726-a243f416fc00?w=1920&q=80" }];
  const next = useCallback(() => setIdx((i) => (i + 1) % list.length), [list.length]);
  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);

  return (
    <section className="relative">
      <div className="relative h-[420px] sm:h-[500px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div key={idx} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0">
            <img src={list[idx].image} alt={list[idx].title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--tc-blue-900)]/85 via-[color:var(--tc-blue-900)]/35 to-transparent" />
          </motion.div>
        </AnimatePresence>
        <div className="relative mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div key={`t-${idx}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold text-white border border-white/20 mb-3">
              <Star className="h-3.5 w-3.5 fill-[color:var(--tc-yellow-400)] text-[color:var(--tc-yellow-400)]" /> India's warm welcome to the world
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-[1.06]">
              {list[idx].title && <span className="text-[color:var(--tc-yellow-400)]">{list[idx].title}</span>}
              {list[idx].title ? " – " : ""}{list[idx].subtitle}
            </h1>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => navigate(list[idx].query ? `/holidays?destination=${encodeURIComponent(list[idx].query)}` : "/holidays")} className="bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold" data-testid="hero-explore-button">{list[idx].cta || "Explore Packages"} <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </div>
          </motion.div>
        </div>
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/25 backdrop-blur text-white hover:bg-white/40 transition-colors" data-testid="hero-prev"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/25 backdrop-blur text-white hover:bg-white/40 transition-colors" data-testid="hero-next"><ChevronRight className="h-5 w-5" /></button>
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
          {list.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-[color:var(--tc-yellow-400)]" : "w-2 bg-white/60"}`} aria-label={`slide ${i + 1}`} />)}
        </div>
      </div>
      {/* overlapping search */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-20 z-10"><HeroSearch /></div>
    </section>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/home").then((res) => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const d = data || {};

  return (
    <div>
      <HeroCarousel slides={d.hero_slides} />

      {/* TRENDING DESTINATIONS */}
      <section data-testid="home-trending-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <SectionHeading eyebrow="Explore the world" title="Trending Destinations" align="center" />
        <div className="flex gap-5 sm:gap-8 overflow-x-auto no-scrollbar pb-2 justify-start sm:justify-center">
          {(d.trending || []).map((t, i) => (
            <button key={i} onClick={() => navigate(`/holidays?destination=${encodeURIComponent(t.query)}`)} className="group flex flex-col items-center shrink-0" data-testid="trending-destination-card">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 ring-2 ring-[color:var(--tc-blue-100)] group-hover:ring-[color:var(--tc-yellow-500)] transition-all">
                <div className="h-full w-full rounded-full overflow-hidden">
                  <img src={t.image} alt={t.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <span className="mt-3 text-sm font-bold text-[color:var(--tc-ink-900)]">{t.name}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-center mt-6"><Button onClick={() => navigate("/holidays")} className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white" data-testid="trending-explore-more">Explore More <ArrowRight className="ml-1 h-4 w-4" /></Button></div>
      </section>

      {/* FOREX BANNER */}
      <section data-testid="home-forex-banner" className="bg-[color:var(--tc-surface-2)] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden bg-[color:var(--tc-blue-900)] tc-noise relative">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-48 lg:h-auto">
                <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80" alt="Forex" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[color:var(--tc-blue-900)]" />
              </div>
              <div className="p-6 sm:p-10">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[color:var(--tc-yellow-400)]">Forex Services</span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">Travel the world, worry-free forex</h2>
                <p className="mt-2 text-white/70 text-sm">Best rates on forex cards & currency notes. Zero markup for students.</p>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white rounded-2xl p-2">
                  <div className="sm:col-span-1"><label className="text-[10px] text-[color:var(--tc-ink-500)] px-1">Service</label><Select defaultValue="buy"><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="buy">Buy Forex</SelectItem><SelectItem value="sell">Sell Forex</SelectItem><SelectItem value="card">Forex Card</SelectItem></SelectContent></Select></div>
                  <div className="sm:col-span-1"><label className="text-[10px] text-[color:var(--tc-ink-500)] px-1">Currency</label><Select defaultValue="USD"><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{["USD", "EUR", "GBP", "AED", "THB", "SGD"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                  <div className="sm:col-span-1"><label className="text-[10px] text-[color:var(--tc-ink-500)] px-1">Amount</label><Input type="number" placeholder="1000" className="h-11 rounded-xl" data-testid="forex-banner-amount" /></div>
                  <div className="sm:col-span-1 flex items-end"><Button onClick={() => navigate("/forex")} className="w-full h-11 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold" data-testid="forex-banner-book">Book Now</Button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section data-testid="home-offers-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Deals & Discounts" title="Offers for You" />
          <Button variant="ghost" onClick={() => navigate("/holidays")} className="hidden sm:inline-flex text-[color:var(--tc-blue-700)] font-semibold mb-8" data-testid="offers-view-all">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />) : (d.offers || []).map((o, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.28, delay: i * 0.05 }}>
              <Card data-testid="home-offer-card" className="relative overflow-hidden rounded-2xl border border-[color:var(--tc-border)] p-5 h-full flex flex-col justify-between hover:shadow-[0_14px_40px_rgba(6,43,91,0.14)] transition-shadow">
                <div className="tc-promo-strip absolute inset-0 opacity-70" />
                <div className="relative"><span className="inline-block rounded-full bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] text-[10px] font-bold px-2 py-0.5 tracking-wide">{o.tag}</span><h3 className="mt-3 font-sans font-bold text-[color:var(--tc-ink-900)] leading-snug">{o.title}</h3><p className="mt-1 text-xs text-[color:var(--tc-ink-500)]">{o.desc}</p></div>
                <div className="relative mt-4 flex items-center justify-between"><span className="text-xs font-mono font-bold text-[color:var(--tc-blue-800)] border border-dashed border-[color:var(--tc-blue-600)] rounded px-2 py-1 bg-white">{o.code}</span><button onClick={() => navigate("/holidays")} className="text-[color:var(--tc-blue-700)] hover:translate-x-0.5 transition-transform"><ChevronRight className="h-5 w-5" /></button></div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOURISM BOARD BANNER */}
      <section data-testid="home-tourism-board-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
        <SectionHeading eyebrow="In partnership with" title="Tourism Board Recommends" />
        <div className="relative overflow-hidden rounded-3xl">
          <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80" alt="Tourism" className="h-56 sm:h-72 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--tc-blue-900)]/90 via-[color:var(--tc-blue-900)]/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-xl">
            <span className="text-[color:var(--tc-yellow-400)] text-xs font-bold uppercase tracking-widest">Lakshadweep · Maldives</span>
            <h3 className="mt-2 font-display text-2xl sm:text-4xl font-bold text-white leading-tight">From Coral to Sands,<br />Wonder from the Sky</h3>
            <p className="mt-2 text-white/80 text-sm">Experience calm island escapes starting ₹79,999.</p>
            <Button onClick={() => navigate("/holidays?destination=Maldives")} className="mt-4 w-fit bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold" data-testid="tourism-banner-cta">Explore Now <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      {/* SVAAGAT SPECIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Best sellers" title="Svaagat Specials" subtitle="Our most-loved holiday packages this season." />
          <Button variant="ghost" onClick={() => navigate("/holidays")} className="hidden sm:inline-flex text-[color:var(--tc-blue-700)] font-semibold mb-8" data-testid="specials-view-all">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </div>
        {/* feature strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Sparkles, title: "Escorted Group Tours", desc: "Travel with expert tour managers", to: "/holidays" },
            { icon: Compass, title: "Build Your Own Getaway", desc: "Fully customizable itineraries", to: "/holidays" },
            { icon: Wallet, title: "Buy Forex & Earn Rewards", desc: "Best rates + travel rewards", to: "/forex" },
          ].map((f, i) => (
            <Card key={i} onClick={() => navigate(f.to)} className="rounded-2xl border border-[color:var(--tc-border)] p-4 flex items-center gap-3 cursor-pointer hover:shadow-[0_10px_30px_rgba(6,43,91,0.10)] transition-shadow" data-testid="special-feature-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] shrink-0"><f.icon className="h-5 w-5" /></div>
              <div><div className="font-bold text-sm text-[color:var(--tc-ink-900)]">{f.title}</div><div className="text-xs text-[color:var(--tc-ink-500)]">{f.desc}</div></div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />) : (d.specials || []).map((p) => <PackageCard key={p.id} pkg={p} testid="home-special-package-card" />)}
        </div>
      </section>

      {/* TOP FLIGHT ROUTES */}
      <section data-testid="home-flight-routes-section" className="bg-[color:var(--tc-surface-2)] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Fly with the best fares" title="Top Flight Routes" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(d.flight_routes || []).map((r, i) => (
              <button key={i} onClick={() => navigate("/flights", { state: { origin: r.from_code, destination: r.to_code } })} className="text-left" data-testid="flight-route-card">
                <Card className="rounded-2xl border border-[color:var(--tc-border)] p-4 hover:shadow-[0_10px_30px_rgba(6,43,91,0.10)] transition-shadow bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]"><PlaneTakeoff className="h-4 w-4" /></div>
                      <div><div className="font-bold text-sm text-[color:var(--tc-ink-900)]">{r.from} → {r.to}</div><div className="text-[11px] text-[color:var(--tc-ink-500)]">{r.airline} · {r.type}</div></div>
                    </div>
                    <div className="text-right"><div className="text-[10px] text-[color:var(--tc-ink-500)]">from</div><div className="font-extrabold text-[color:var(--tc-blue-800)]">{formatINR(r.price)}</div></div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE HOTEL STAYS */}
      <section data-testid="home-hotels-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Svaagat Luxury Stays" title="Explore Hotel Stays" />
          <button onClick={() => navigate("/hotels")} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--tc-blue-700)] hover:underline shrink-0 mb-6" data-testid="home-view-all-hotels">
            View all hotels <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {(d.hotel_stays || []).map((h, i) => (
            <button key={i} onClick={() => navigate(`/hotels?city=${encodeURIComponent(h.city)}`)} className="group relative overflow-hidden rounded-2xl aspect-[3/4]" data-testid="hotel-stay-card">
              <img src={h.image} alt={h.city} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <div className="flex items-center gap-1 text-white font-bold"><Hotel className="h-4 w-4" /> {h.city}</div>
                <div className="text-white/80 text-[11px]">{h.count} {h.count > 1 ? "hotels" : "hotel"} · from {formatINR(h.from_price)}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* WHY SVAAGAT */}
      <section data-testid="home-why-tc-section" className="bg-[color:var(--tc-surface-2)] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="The Svaagat Advantage" title="Why Svaagat Travels" align="center" />
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-3xl overflow-hidden h-72 lg:h-96">
              <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80" alt="Why Svaagat" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[color:var(--tc-blue-900)]/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(d.why_features || []).map((w, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.28, delay: i * 0.05 }}>
                  <Card className="rounded-2xl border border-[color:var(--tc-border)] bg-white p-5 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--tc-yellow-100)] text-[color:var(--tc-blue-700)]"><CheckCircle2 className="h-5 w-5" /></div>
                    <h3 className="mt-3 font-bold text-[color:var(--tc-ink-900)] text-sm">{w.title}</h3>
                    <p className="mt-1 text-xs text-[color:var(--tc-ink-500)]">{w.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP */}
      <section data-testid="home-app-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[color:var(--tc-blue-800)] to-[color:var(--tc-blue-600)] tc-noise px-6 py-10 sm:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Download the Svaagat Travels App</h2>
              <p className="mt-2 text-white/80 text-sm max-w-md">Book holidays, flights & forex on the go. Exclusive app-only deals await!</p>
              <div className="mt-5 flex flex-wrap gap-3 justify-center lg:justify-start">
                <button onClick={() => toast.info("App Store link — coming soon!")} className="flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2.5 hover:opacity-90 transition-opacity"><Apple className="h-6 w-6" /><div className="text-left leading-tight"><div className="text-[9px]">Download on the</div><div className="text-sm font-bold">App Store</div></div></button>
                <button onClick={() => toast.info("Google Play link — coming soon!")} className="flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2.5 hover:opacity-90 transition-opacity"><Smartphone className="h-6 w-6" /><div className="text-left leading-tight"><div className="text-[9px]">GET IT ON</div><div className="text-sm font-bold">Google Play</div></div></button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white p-3 shadow-lg">
                <div className="h-24 w-24 grid grid-cols-5 grid-rows-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => <div key={i} className={`rounded-[2px] ${[0,1,2,4,5,6,8,9,10,12,14,16,18,20,21,22,24].includes(i) ? "bg-[color:var(--tc-blue-900)]" : "bg-transparent"}`} />)}
                </div>
                <div className="text-center text-[10px] font-bold text-[color:var(--tc-ink-700)] mt-1">Scan to download</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS + TESTIMONIALS */}
      <section data-testid="home-testimonials-section" className="bg-[color:var(--tc-surface-2)] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Guest Stories" title="Why Travellers Love Svaagat Travels" align="center" />
          <div className="rounded-2xl bg-white border border-[color:var(--tc-border)] py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {(d.stats || []).map((s, i) => <StatItem key={i} stat={s} />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(d.testimonials || []).slice(0, 6).map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.28, delay: i * 0.04 }}>
                <Card className="rounded-2xl border border-[color:var(--tc-border)] bg-white p-5 h-full relative">
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-[color:var(--tc-blue-100)]" />
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className={`h-4 w-4 ${s < t.rating ? "fill-[color:var(--tc-yellow-500)] text-[color:var(--tc-yellow-500)]" : "text-[color:var(--tc-border)]"}`} />)}</div>
                  <p className="mt-3 text-sm text-[color:var(--tc-ink-700)] leading-relaxed">"{t.text}"</p>
                  <div className="mt-4 flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarFallback className="bg-[color:var(--tc-blue-700)] text-white text-xs">{t.avatar}</AvatarFallback></Avatar><div><div className="text-sm font-bold text-[color:var(--tc-ink-900)]">{t.name}</div><div className="text-xs text-[color:var(--tc-ink-500)]">{t.location}</div></div></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section data-testid="home-faq-section" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <SectionHeading eyebrow="Need help?" title="Frequently Asked Questions" align="center" />
        <Accordion type="single" collapsible defaultValue="hfaq-0" className="w-full space-y-3" data-testid="home-faq-accordion">
          {(d.faqs || []).map((f, i) => (
            <AccordionItem key={i} value={`hfaq-${i}`} className="rounded-2xl border border-[color:var(--tc-border)] bg-white px-5">
              <AccordionTrigger className="text-left font-semibold text-[color:var(--tc-ink-900)] hover:no-underline"><span className="flex items-start gap-3"><MessageCircleQuestion className="h-5 w-5 text-[color:var(--tc-blue-600)] shrink-0 mt-0.5" /> {f.q}</span></AccordionTrigger>
              <AccordionContent className="text-sm text-[color:var(--tc-ink-700)] leading-relaxed pl-8">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex justify-center mt-6"><Button variant="secondary" onClick={() => navigate("/faq")} data-testid="home-faq-view-all">View all FAQs</Button></div>
      </section>

      {/* SEO CONTENT + SERVICE TAGS */}
      <section data-testid="home-seo-section" className="bg-[color:var(--tc-surface-2)] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[color:var(--tc-blue-900)]">Tours and Travel Agency – Svaagat Travels</h2>
          <p className="mt-3 text-sm text-[color:var(--tc-ink-700)] leading-relaxed">
            Svaagat Travels is your bespoke travel partner for unforgettable holidays across India and the world. From handcrafted international getaways and incredible India tours to seamless flight bookings, transparent forex services and end-to-end visa assistance — we bring everything you need for a perfect trip under one roof. With handpicked luxury stays, dedicated tour managers and a concierge-led travel desk, we make every journey feel personal, effortless and truly memorable.
          </p>
          <h3 className="mt-6 font-bold text-[color:var(--tc-blue-900)]">Svaagat Travels Services</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(d.service_tags || []).map((tag, i) => (
              <button key={i} onClick={() => navigate("/holidays")} className="rounded-full border border-[color:var(--tc-border)] bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--tc-ink-700)] hover:border-[color:var(--tc-blue-600)] hover:text-[color:var(--tc-blue-700)] transition-colors" data-testid="service-tag">{tag}</button>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />
    </div>
  );
}
