import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import client from "@/api/client";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  MapPin, Clock, Star, Check, X, CalendarDays, Users, Loader2, ChevronRight,
  Plane, Hotel, Camera, UtensilsCrossed, UserCheck, Share2, Download, Bus, StickyNote,
  BadgeCheck, Sparkles, Gift, Phone, ChevronLeft, CalendarClock, Award,
} from "lucide-react";

const FEATURE_ICONS = { flights: Plane, hotels: Hotel, sightseeing: Camera, meals: UtensilsCrossed, tour_manager: UserCheck };
const INCL_ICONS = { Flights: Plane, Accommodation: Hotel, Sightseeing: Camera, Meals: UtensilsCrossed, Visa: BadgeCheck, "Tour Manager": UserCheck, Transfer: Bus };

export default function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tourType, setTourType] = useState("Value");
  const [travellers, setTravellers] = useState("2");
  const [date, setDate] = useState();
  const [booking, setBooking] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [calcShown, setCalcShown] = useState(false);
  const [cb, setCb] = useState({ mobile: "", email: "", consent: true });

  useEffect(() => {
    setLoading(true);
    client.get(`/packages/${id}`).then((res) => { setPkg(res.data); setLoading(false); })
      .catch(() => { setLoading(false); toast.error("Package not found"); });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Skeleton className="h-96 rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-6"><Skeleton className="h-64 rounded-2xl lg:col-span-2" /><Skeleton className="h-64 rounded-2xl" /></div>
      </div>
    );
  }
  if (!pkg) return <div className="py-20 text-center text-[color:var(--tc-ink-500)]">Package not found.</div>;

  const tier = (pkg.tour_type_options || []).find((t) => t.name === tourType) || pkg.tour_type_options[0];
  const nTravellers = parseInt(travellers, 10);
  const total = tier.price * nTravellers;
  const earnPoints = tier.edge_points * nTravellers;

  const handleBook = async () => {
    if (!token) { toast.info("Please login to book this package"); navigate("/login", { state: { from: `/holidays/${id}` } }); return; }
    setBooking(true);
    try {
      const res = await client.post("/checkout/session", {
        package_id: pkg.id, travelers: nTravellers, tour_type: tourType,
        travel_date: date ? format(date, "yyyy-MM-dd") : null, origin_url: window.location.origin,
      });
      if (res.data.url) window.location.href = res.data.url;
      else throw new Error("No checkout URL");
    } catch (e) {
      setBooking(false);
      toast.error(e?.response?.data?.detail || "Could not start checkout. Please try again.");
    }
  };

  const submitCallback = (e) => {
    e.preventDefault();
    if (!cb.mobile) { toast.error("Please enter your mobile number"); return; }
    toast.success("Thank you! Our travel expert will call you back shortly.");
    setCb({ mobile: "", email: "", consent: true });
  };

  const scrollTo = (secId) => { const el = document.getElementById(secId); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div className="bg-[color:var(--tc-surface-2)] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[color:var(--tc-ink-500)] flex-wrap" data-testid="detail-breadcrumb">
          <Link to="/" className="hover:text-[color:var(--tc-blue-700)]">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to="/holidays" className="hover:text-[color:var(--tc-blue-700)]">Holidays</Link><ChevronRight className="h-3 w-3" />
          <Link to={`/holidays?category=${pkg.category}`} className="hover:text-[color:var(--tc-blue-700)]">{pkg.category === "International" ? "International" : "India"} Tour Packages</Link><ChevronRight className="h-3 w-3" />
          <span className="text-[color:var(--tc-ink-900)] font-medium truncate max-w-[220px]">{pkg.title}</span>
        </nav>

        {/* Gallery */}
        <div className="mt-4 grid grid-cols-4 grid-rows-2 gap-2 h-[320px] sm:h-[420px] rounded-2xl overflow-hidden">
          <button onClick={() => setActiveImg(0)} className="col-span-4 sm:col-span-2 row-span-2 relative group">
            <img src={pkg.gallery[activeImg] || pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-[color:var(--tc-blue-900)]/90 text-white border-0">{pkg.duration_nights}N/{pkg.duration_days}D</Badge>
              {pkg.is_group_tour && <Badge className="bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] border-0 font-bold">Group Tour</Badge>}
            </div>
          </button>
          {(pkg.gallery || []).slice(1, 5).map((g, i) => (
            <button key={i} onClick={() => setActiveImg(i + 1)} className="hidden sm:block relative overflow-hidden group">
              <img src={g} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {i === 3 && (pkg.gallery.length > 5) && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">+{pkg.gallery.length - 5} more</div>}
            </button>
          ))}
        </div>

        {/* Title row */}
        <div className="mt-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[color:var(--tc-blue-900)]">{pkg.title}</h1>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-[color:var(--tc-ink-700)] font-medium"><MapPin className="h-4 w-4 text-[color:var(--tc-blue-600)]" /> {pkg.route}</div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[color:var(--tc-blue-700)] text-white px-3 py-2 shrink-0 w-fit">
            <span className="text-lg font-extrabold">{pkg.rating}</span>
            <div className="text-[11px] leading-tight"><div className="flex">{Array.from({length:5}).map((_,s)=><Star key={s} className={`h-3 w-3 ${s<Math.round(pkg.rating)?"fill-[color:var(--tc-yellow-400)] text-[color:var(--tc-yellow-400)]":"text-white/40"}`} />)}</div><span className="text-white/80">{(pkg.reviews_count/1000).toFixed(1)}k Reviews</span></div>
          </div>
        </div>

        {/* Feature row */}
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-y border-[color:var(--tc-border)] py-3">
          {(pkg.features || []).map((f) => { const Ic = FEATURE_ICONS[f.key] || Check; return (
            <div key={f.key} className="flex items-center gap-2 text-sm text-[color:var(--tc-ink-700)]"><Ic className="h-5 w-5 text-[color:var(--tc-blue-600)]" /> {f.label}</div>
          ); })}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="itinerary" data-testid="detail-tabs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <TabsList className="bg-[color:var(--tc-surface-2)] border border-[color:var(--tc-border)]">
                  <TabsTrigger value="itinerary" data-testid="tab-itinerary" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions" data-testid="tab-inclusions" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white">Inclusions</TabsTrigger>
                  <TabsTrigger value="summary" data-testid="tab-summary" className="data-[state=active]:bg-[color:var(--tc-blue-700)] data-[state=active]:text-white">Summary</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied to clipboard"); }} className="text-[color:var(--tc-blue-700)]" data-testid="detail-share"><Share2 className="h-4 w-4 mr-1" /> Share</Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.info("Itinerary PDF download — coming soon!")} className="text-[color:var(--tc-blue-700)]" data-testid="detail-download"><Download className="h-4 w-4 mr-1" /> Download</Button>
                </div>
              </div>

              {/* ITINERARY */}
              <TabsContent value="itinerary" className="mt-4">
                <Card className="rounded-2xl border border-[color:var(--tc-border)] p-5">
                  <p className="text-sm text-[color:var(--tc-ink-700)] mb-4">{pkg.description}</p>
                  <Accordion type="single" collapsible defaultValue="d-0" className="w-full" data-testid="package-itinerary-accordion">
                    {(pkg.day_plan || []).map((it, i) => (
                      <AccordionItem key={i} value={`d-${i}`} className="border-l-2 border-[color:var(--tc-blue-100)] ml-3 pl-4 relative">
                        <span className="absolute -left-[9px] top-4 h-4 w-4 rounded-full bg-[color:var(--tc-blue-700)] ring-4 ring-white" />
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline text-left">
                          <span><span className="text-[color:var(--tc-blue-700)]">Day {it.day}:</span> {it.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-[color:var(--tc-ink-700)] space-y-2">
                          <p>{it.detail}</p>
                          <div className="flex flex-wrap gap-4 pt-2 text-xs">
                            <span className="inline-flex items-center gap-1.5"><Hotel className="h-4 w-4 text-[color:var(--tc-blue-600)]" /> {it.hotel}</span>
                            <span className="inline-flex items-center gap-1.5"><UtensilsCrossed className="h-4 w-4 text-[color:var(--tc-blue-600)]" /> {it.meals}</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </TabsContent>

              {/* INCLUSIONS */}
              <TabsContent value="inclusions" className="mt-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  {[...Object.keys(pkg.inclusions_detail || {}), "Includes", "Excludes", "Notes"].map((k) => (
                    <button key={k} onClick={() => scrollTo(`incl-${k}`)} className="rounded-full border border-[color:var(--tc-border)] bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--tc-ink-700)] hover:border-[color:var(--tc-blue-600)] hover:text-[color:var(--tc-blue-700)]" data-testid="inclusion-subnav">{k}</button>
                  ))}
                </div>
                <div className="space-y-4">
                  {Object.entries(pkg.inclusions_detail || {}).map(([cat, items]) => { const Ic = INCL_ICONS[cat] || Check; return (
                    <Card key={cat} id={`incl-${cat}`} className="rounded-2xl border border-[color:var(--tc-border)] overflow-hidden">
                      <div className="flex items-center gap-2 bg-[color:var(--tc-blue-900)] text-white px-4 py-2.5 font-semibold text-sm"><Ic className="h-4 w-4" /> {cat}</div>
                      <ul className="p-4 space-y-2">{items.map((x, i) => <li key={i} className="flex items-start gap-2 text-sm text-[color:var(--tc-ink-700)]"><Check className="h-4 w-4 mt-0.5 text-[color:var(--tc-blue-600)] shrink-0" /> {x}</li>)}</ul>
                    </Card>
                  ); })}
                  <Card id="incl-Includes" className="rounded-2xl border border-[color:var(--tc-border)] p-5">
                    <h3 className="font-bold text-[color:var(--tc-ink-900)] mb-3">What your tour price includes</h3>
                    <ul className="space-y-2">{(pkg.price_includes || []).map((x, i) => <li key={i} className="flex items-start gap-2 text-sm text-[color:var(--tc-ink-700)]"><Check className="h-4 w-4 mt-0.5 text-[color:var(--tc-success,#0E9F6E)] shrink-0" /> {x}</li>)}</ul>
                  </Card>
                  <Card id="incl-Excludes" className="rounded-2xl border border-[color:var(--tc-border)] p-5">
                    <h3 className="font-bold text-[color:var(--tc-ink-900)] mb-3">What your tour price does not include</h3>
                    <ul className="space-y-2">{(pkg.price_excludes || []).map((x, i) => <li key={i} className="flex items-start gap-2 text-sm text-[color:var(--tc-ink-700)]"><X className="h-4 w-4 mt-0.5 text-[color:var(--tc-danger,#E11D48)] shrink-0" /> {x}</li>)}</ul>
                  </Card>
                  <Card id="incl-Notes" className="rounded-2xl border border-[color:var(--tc-border)] p-5">
                    <h3 className="font-bold text-[color:var(--tc-ink-900)] mb-3 flex items-center gap-2"><StickyNote className="h-4 w-4 text-[color:var(--tc-blue-600)]" /> Things to Note</h3>
                    <ol className="space-y-2 list-decimal pl-5">{(pkg.things_to_note || []).map((x, i) => <li key={i} className="text-sm text-[color:var(--tc-ink-700)]">{x}</li>)}</ol>
                  </Card>
                </div>
              </TabsContent>

              {/* SUMMARY */}
              <TabsContent value="summary" className="mt-4">
                <div className="rounded-2xl bg-[color:var(--tc-blue-100)] border border-[color:var(--tc-blue-100)] px-4 py-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--tc-blue-800)] mb-4">
                  <Plane className="h-4 w-4" /> Return Economy Class Airfare Included
                </div>
                <h3 className="font-bold text-[color:var(--tc-ink-900)] mb-3">Day wise summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(pkg.day_plan || []).map((it, i) => (
                    <Card key={i} className="rounded-2xl border border-[color:var(--tc-border)] p-4" data-testid="summary-day-card">
                      <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--tc-blue-700)] text-white text-xs font-bold shrink-0">{it.day}</span><span className="font-semibold text-sm text-[color:var(--tc-ink-900)]">{it.title}</span></div>
                      <div className="mt-3 space-y-1.5 text-xs text-[color:var(--tc-ink-700)]">
                        <div className="flex items-start gap-1.5"><Hotel className="h-3.5 w-3.5 mt-0.5 text-[color:var(--tc-blue-600)]" /> {it.hotel}</div>
                        <div className="flex items-start gap-1.5"><Camera className="h-3.5 w-3.5 mt-0.5 text-[color:var(--tc-blue-600)]" /> {it.sightseeing}</div>
                        <div className="flex items-start gap-1.5"><UtensilsCrossed className="h-3.5 w-3.5 mt-0.5 text-[color:var(--tc-blue-600)]" /> {it.meals}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT: Pricing sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card className="rounded-2xl border border-[color:var(--tc-border)] p-5 shadow-[0_10px_30px_rgba(6,43,91,0.08)]">
                <Label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Tour Type</Label>
                <Select value={tourType} onValueChange={setTourType}>
                  <SelectTrigger className="h-11 rounded-xl mt-1" data-testid="detail-tourtype-select"><SelectValue /></SelectTrigger>
                  <SelectContent>{(pkg.tour_type_options || []).map((t) => <SelectItem key={t.name} value={t.name}>{t.name} — {formatINR(t.price)}</SelectItem>)}</SelectContent>
                </Select>

                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[color:var(--tc-ink-500)] line-through">{formatINR(tier.original_price)}</span>
                    <Badge className="bg-[color:var(--tc-success,#0E9F6E)] text-white border-0 text-[10px]">{tier.discount_pct}% OFF</Badge>
                  </div>
                  <div className="text-3xl font-extrabold text-[color:var(--tc-blue-800)]">{formatINR(tier.price)}</div>
                  <div className="text-xs text-[color:var(--tc-ink-500)]">Starting price per adult</div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[11px] text-[color:var(--tc-ink-500)]">Travellers</Label>
                    <Select value={travellers} onValueChange={setTravellers}>
                      <SelectTrigger className="h-10 rounded-xl mt-1" data-testid="detail-travellers-select"><div className="flex items-center gap-1"><Users className="h-4 w-4 text-[color:var(--tc-blue-600)]" /><SelectValue /></div></SelectTrigger>
                      <SelectContent>{["1","2","3","4","5","6"].map((n)=><SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[11px] text-[color:var(--tc-ink-500)]">Travel date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="mt-1 flex h-10 w-full items-center gap-1.5 rounded-xl border border-[color:var(--tc-border)] bg-white px-2 text-xs hover:bg-[color:var(--tc-surface-2)]" data-testid="detail-date-trigger">
                          <CalendarDays className="h-4 w-4 text-[color:var(--tc-blue-600)]" /><span className={date?"text-[color:var(--tc-ink-900)]":"text-[color:var(--tc-ink-500)]"}>{date?format(date,"dd MMM"):"Select"}</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end"><Calendar mode="single" selected={date} onSelect={setDate} disabled={(d)=>d<new Date(new Date().setHours(0,0,0,0))} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button variant="secondary" className="w-full mt-3 h-11 border border-[color:var(--tc-blue-600)] text-[color:var(--tc-blue-700)] bg-white hover:bg-[color:var(--tc-blue-100)] font-semibold" onClick={() => setCalcShown(true)} data-testid="detail-calculate-price">
                  Calculate Price
                </Button>
                {calcShown && (
                  <div className="mt-3 rounded-xl bg-[color:var(--tc-surface-2)] p-3 space-y-1 text-sm" data-testid="detail-calc-result">
                    <div className="flex justify-between text-[color:var(--tc-ink-700)]"><span>{formatINR(tier.price)} × {travellers} ({tourType})</span><span>{formatINR(total)}</span></div>
                    <div className="flex justify-between text-[color:var(--tc-ink-500)] text-xs"><span>Taxes & fees</span><span>Included</span></div>
                    <div className="border-t border-[color:var(--tc-border)] pt-1.5 flex justify-between font-bold text-[color:var(--tc-ink-900)]"><span>Total</span><span className="text-[color:var(--tc-blue-800)]">{formatINR(total)}</span></div>
                  </div>
                )}

                <Button onClick={handleBook} disabled={booking} data-testid="package-book-now-button" className="w-full mt-3 h-12 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold text-base">
                  {booking ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redirecting…</> : "Book Now"}
                </Button>
                <p className="mt-2 text-center text-[11px] text-[color:var(--tc-ink-500)]">Secure payment powered by Stripe</p>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-[color:var(--tc-yellow-100)] p-3">
                  <Award className="h-6 w-6 text-[color:var(--tc-blue-700)] shrink-0" />
                  <div className="text-xs"><span className="font-bold text-[color:var(--tc-blue-800)]">EDGE Rewards</span><div className="text-[color:var(--tc-ink-700)]">Earn <span className="font-bold">{earnPoints.toLocaleString("en-IN")} points</span> on this booking</div></div>
                </div>
              </Card>

              {/* Callback */}
              <Card className="rounded-2xl border border-[color:var(--tc-border)] p-5">
                <h3 className="font-bold text-[color:var(--tc-ink-900)] flex items-center gap-2"><Phone className="h-4 w-4 text-[color:var(--tc-blue-600)]" /> Want us to call you?</h3>
                <form onSubmit={submitCallback} className="mt-3 space-y-3" data-testid="callback-form">
                  <Input placeholder="Mobile number" value={cb.mobile} onChange={(e)=>setCb({...cb,mobile:e.target.value})} className="h-11 rounded-xl" data-testid="callback-mobile" />
                  <Input placeholder="Email address" type="email" value={cb.email} onChange={(e)=>setCb({...cb,email:e.target.value})} className="h-11 rounded-xl" data-testid="callback-email" />
                  <label className="flex items-start gap-2 text-xs text-[color:var(--tc-ink-500)]"><Checkbox checked={cb.consent} onCheckedChange={(v)=>setCb({...cb,consent:!!v})} className="mt-0.5" /> I authorise Svaagat Travels to contact me with trip details & offers.</label>
                  <Button type="submit" className="w-full h-11 bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white font-semibold" data-testid="callback-submit">Get a Callback</Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
