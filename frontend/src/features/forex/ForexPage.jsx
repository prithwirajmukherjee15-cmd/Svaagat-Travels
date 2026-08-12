import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Banknote, CreditCard, Send, GraduationCap, Repeat, MessageCircle, ArrowRight, TrendingUp,
  ShieldCheck, Truck, BadgeCheck, Plane, CheckCircle2, Star, PlayCircle, Clock, MapPin,
  Phone, Sparkles, Globe, Wallet,
} from "lucide-react";

const PROD_ICONS = { buy: Banknote, student: GraduationCap, sell: Repeat, notes: Wallet, send: Send, whatsapp: MessageCircle };
const WHY_ICONS = { shield: ShieldCheck, trending: TrendingUp, truck: Truck, badge: BadgeCheck };
const CF_ICONS = { badge: BadgeCheck, card: CreditCard, plane: Plane, shield: ShieldCheck };

const soon = (label) => toast.info(`${label} — coming soon!`);

export default function ForexPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qService, setQService] = useState("Buy Forex");
  const [qCur, setQCur] = useState("USD");
  const [qAmt, setQAmt] = useState("1000");
  const [fromCur, setFromCur] = useState("USD");
  const [amount, setAmount] = useState("100");

  useEffect(() => {
    client.get("/forex").then((res) => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const rate = data?.rates?.find((r) => r.code === fromCur);
  const converted = rate ? (parseFloat(amount || 0) * rate.sell).toFixed(2) : "0.00";
  const qRate = data?.rates?.find((r) => r.code === qCur);

  const getQuote = () => {
    if (!qRate) return;
    const val = (parseFloat(qAmt || 0) * qRate.sell).toLocaleString("en-IN", { maximumFractionDigits: 0 });
    toast.success(`${qService}: ${qAmt} ${qCur} ≈ ₹${val}. Online forex booking coming soon!`);
  };

  return (
    <div>
      {/* HERO + QUOTE */}
      <section className="relative bg-[color:var(--tc-blue-900)] tc-noise">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white border border-white/20"><Globe className="h-3.5 w-3.5 text-[color:var(--tc-yellow-400)]" /> Zero Cross-Currency Conversion</span>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white leading-tight">Your Trusted Partner for Foreign Exchange</h1>
            <p className="mt-3 text-white/75 text-sm max-w-lg">Buy forex, sell currency, send money abroad and get forex cards — at the best online rates, delivered to your doorstep.</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(data?.stats || []).map((s, i) => (
                <div key={i}><div className="font-display text-xl sm:text-2xl font-bold text-[color:var(--tc-yellow-400)]">{s.value}</div><div className="text-[11px] text-white/70">{s.label}</div></div>
              ))}
            </div>
          </div>
          {/* Quote widget */}
          <Card className="rounded-2xl bg-white p-5 shadow-[0_18px_50px_rgba(6,43,91,0.35)]">
            <h3 className="font-display text-lg font-bold text-[color:var(--tc-blue-900)]">Get Your Quote</h3>
            <div className="mt-3 space-y-3">
              <div><label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Service</label>
                <Select value={qService} onValueChange={setQService}><SelectTrigger className="h-11 rounded-xl mt-1" data-testid="forex-quote-service"><SelectValue /></SelectTrigger><SelectContent>{["Buy Forex","Sell Forex","Forex Card","Send Money","Student Fees"].map((s)=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Currency</label>
                  <Select value={qCur} onValueChange={setQCur}><SelectTrigger className="h-11 rounded-xl mt-1" data-testid="forex-quote-currency"><SelectValue /></SelectTrigger><SelectContent>{(data?.rates||[]).map((r)=><SelectItem key={r.code} value={r.code}>{r.flag} {r.code}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Amount</label>
                  <Input type="number" value={qAmt} onChange={(e)=>setQAmt(e.target.value)} className="h-11 rounded-xl mt-1" data-testid="forex-quote-amount" />
                </div>
              </div>
              <Button onClick={getQuote} className="w-full h-12 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold" data-testid="forex-quote-button">Get Your Quote <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </div>
          </Card>
        </div>
      </section>

      {/* SEO INTRO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Effortless Foreign Exchange, Online</h2>
          <p className="mt-3 text-sm text-[color:var(--tc-ink-700)] leading-relaxed">Buy foreign exchange online with Svaagat Travels and make your travel plans hassle-free. Whether you're travelling for leisure, business or education, we offer competitive rates on foreign currency, multi-currency forex cards and money transfers — all with the trust and reliability of Svaagat Travels. Enjoy transparent pricing, doorstep delivery and dedicated support at every step.</p>
          <Button onClick={() => soon("Buy Forex")} className="mt-4 bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white" data-testid="forex-buynow-intro">Buy Now <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </div>
        <div className="flex justify-center"><div className="h-40 w-40 rounded-full bg-[color:var(--tc-yellow-100)] flex items-center justify-center"><Wallet className="h-20 w-20 text-[color:var(--tc-yellow-500)]" /></div></div>
      </section>

      {/* SVAAGAT CARDS - COMING SOON */}
      <section data-testid="forex-cards-section" className="bg-[color:var(--tc-surface-2)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)] text-center">Travel Worry-free with Svaagat Cards</h2>
          <p className="text-center text-sm text-[color:var(--tc-ink-500)] mt-1">Our range of smart forex cards — launching soon.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {(data?.cards || []).map((c, i) => (
              <div key={i} data-testid="svaagat-card" className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${c.gradient} p-5 text-white h-52 flex flex-col justify-between shadow-lg`}>
                <div className="absolute top-3 right-3"><Badge className="bg-white/90 text-[color:var(--tc-ink-900)] border-0 font-bold text-[10px]">Coming Soon</Badge></div>
                {c.tag && <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">{c.tag}</span>}
                <div><CreditCard className="h-8 w-8 mb-2 opacity-90" /><h3 className="font-bold text-lg leading-tight">{c.name}</h3><p className="text-xs text-white/85 mt-1">{c.desc}</p></div>
                <div className="text-[11px] font-semibold text-white/70">Svaagat Travels</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXCHANGE RATES + CONVERTER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border border-[color:var(--tc-border)] overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[color:var(--tc-border)]">
                <h2 className="font-display text-xl font-bold text-[color:var(--tc-blue-900)]">Today's Exchange Rates</h2>
                <span className="inline-flex items-center gap-1 text-xs text-[color:var(--tc-success,#0E9F6E)] font-semibold"><TrendingUp className="h-4 w-4" /> Indicative</span>
              </div>
              {loading ? <div className="p-5 space-y-2">{Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-10" />)}</div> : (
                <Table data-testid="forex-rates-table">
                  <TableHeader><TableRow className="bg-[color:var(--tc-blue-900)] hover:bg-[color:var(--tc-blue-900)]"><TableHead className="text-white">Currency</TableHead><TableHead className="text-white text-right">We Buy</TableHead><TableHead className="text-white text-right">We Sell</TableHead><TableHead className="text-white text-right hidden sm:table-cell">Card Rate</TableHead></TableRow></TableHeader>
                  <TableBody>{(data?.rates||[]).map((r)=>(<TableRow key={r.code} className="hover:bg-[color:var(--tc-blue-100)]"><TableCell className="font-semibold text-[color:var(--tc-ink-900)]"><span className="mr-2">{r.flag}</span>{r.code} <span className="text-[color:var(--tc-ink-500)] font-normal hidden sm:inline">· {r.name}</span></TableCell><TableCell className="text-right text-[color:var(--tc-ink-700)]">₹{r.buy.toFixed(2)}</TableCell><TableCell className="text-right font-semibold text-[color:var(--tc-blue-800)]">₹{r.sell.toFixed(2)}</TableCell><TableCell className="text-right text-[color:var(--tc-ink-700)] hidden sm:table-cell">₹{r.card_rate.toFixed(2)}</TableCell></TableRow>))}</TableBody>
                </Table>
              )}
            </Card>
          </div>
          <div>
            <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6 lg:sticky lg:top-24">
              <h3 className="font-display text-lg font-bold text-[color:var(--tc-blue-900)]">Currency Converter</h3>
              <div className="mt-4 space-y-3">
                <div><label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Amount (foreign)</label><Input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="h-11 rounded-xl mt-1" data-testid="forex-converter-amount" /></div>
                <div><label className="text-xs font-semibold text-[color:var(--tc-ink-700)]">Currency</label><Select value={fromCur} onValueChange={setFromCur}><SelectTrigger className="h-11 rounded-xl mt-1" data-testid="forex-converter-currency"><SelectValue /></SelectTrigger><SelectContent>{(data?.rates||[]).map((r)=><SelectItem key={r.code} value={r.code}>{r.flag} {r.code} - {r.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="rounded-xl bg-[color:var(--tc-blue-900)] p-4 text-white"><div className="text-xs text-white/70">You pay (at sell rate)</div><div className="text-2xl font-extrabold text-[color:var(--tc-yellow-400)]" data-testid="forex-converter-result">₹{Number(converted).toLocaleString("en-IN")}</div><div className="text-[11px] text-white/60 mt-1">1 {fromCur} = ₹{rate?.sell?.toFixed(2)}</div></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* BORDERLESS CARD BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[color:var(--tc-blue-800)] to-[color:var(--tc-blue-600)] tc-noise p-6 sm:p-10 text-white">
          <span className="text-[color:var(--tc-yellow-400)] text-xs font-bold uppercase tracking-widest">Borderless Travel Card</span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold">Experience Seamless Global Travel</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(data?.card_features||[]).map((f,i)=>{const Ic=CF_ICONS[f.icon]||BadgeCheck;return(<div key={i} className="flex items-center gap-2"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><Ic className="h-5 w-5 text-[color:var(--tc-yellow-400)]" /></div><span className="text-sm font-semibold">{f.title}</span></div>);})}
          </div>
          <Button onClick={()=>soon("Borderless Travel Card")} className="mt-6 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold" data-testid="forex-availnow">Avail Now <ArrowRight className="ml-1 h-4 w-4" /></Button>
        </div>
      </section>

      {/* 3-STEP PROCESS */}
      <section className="bg-[color:var(--tc-surface-2)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)] text-center">Quick & Easy Currency Exchange</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
            {(data?.steps||[]).map((s,i)=>(<Card key={i} className="rounded-2xl border border-[color:var(--tc-border)] p-6 text-center bg-white"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--tc-blue-700)] text-white font-display font-bold text-lg">{s.step}</div><h3 className="mt-3 font-bold text-[color:var(--tc-ink-900)]">{s.title}</h3><p className="mt-1 text-sm text-[color:var(--tc-ink-500)]">{s.desc}</p></Card>))}
          </div>
        </div>
      </section>

      {/* PRODUCTS & SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Products & Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {(data?.products||[]).map((p,i)=>{const Ic=PROD_ICONS[p.icon]||CreditCard;return(
            <Card key={i} data-testid="forex-product-card" onClick={()=>soon(p.title)} className="rounded-2xl border border-[color:var(--tc-border)] p-5 hover:shadow-[0_14px_40px_rgba(6,43,91,0.12)] transition-shadow group cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]"><Ic className="h-6 w-6" /></div>
              <h3 className="mt-4 font-bold text-[color:var(--tc-ink-900)]">{p.title}</h3><p className="mt-1 text-sm text-[color:var(--tc-ink-500)]">{p.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--tc-blue-700)] group-hover:translate-x-0.5 transition-transform">Explore <ArrowRight className="h-4 w-4" /></div>
            </Card>
          );})}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[color:var(--tc-surface-2)] py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)] text-center">FAQs About Foreign Exchange</h2>
          <Accordion type="single" collapsible className="w-full space-y-3 mt-6" data-testid="forex-faq-accordion">
            {(data?.faqs||[]).map((f,i)=>(<AccordionItem key={i} value={`ff-${i}`} className="rounded-2xl border border-[color:var(--tc-border)] bg-white px-5"><AccordionTrigger className="text-left font-semibold text-[color:var(--tc-ink-900)] hover:no-underline">{f.q}</AccordionTrigger><AccordionContent className="text-sm text-[color:var(--tc-ink-700)] leading-relaxed">{f.a}</AccordionContent></AccordionItem>))}
          </Accordion>
          <div className="mt-6 rounded-2xl bg-white border border-[color:var(--tc-border)] p-6 text-center"><h3 className="font-bold text-[color:var(--tc-ink-900)]">Need Help? We're here for you</h3><Button onClick={()=>toast.info("Support — coming soon")} className="mt-3 bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white" data-testid="forex-callus"><Phone className="mr-1.5 h-4 w-4" /> Contact Support</Button></div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Learn More About Forex</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {(data?.blogs||[]).map((b,i)=>(<Card key={i} data-testid="forex-blog-card" onClick={()=>soon("Blog article")} className="rounded-2xl border border-[color:var(--tc-border)] overflow-hidden cursor-pointer group"><div className="aspect-[16/10] overflow-hidden"><img src={b.image} alt={b.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /></div><div className="p-4"><Badge className="bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] border-0 text-[10px]">{b.category}</Badge><h3 className="mt-2 font-bold text-sm text-[color:var(--tc-ink-900)] leading-snug line-clamp-2">{b.title}</h3><div className="mt-2 flex items-center gap-1 text-[11px] text-[color:var(--tc-ink-500)]"><Clock className="h-3 w-3" /> {b.read}</div></div></Card>))}
        </div>
      </section>

      {/* VIDEOS */}
      <section className="bg-[color:var(--tc-surface-2)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Video Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {(data?.videos||[]).map((v,i)=>(<button key={i} data-testid="forex-video-card" onClick={()=>soon("Video")} className="relative rounded-2xl overflow-hidden aspect-video group"><img src={v.image} alt={v.title} loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center"><PlayCircle className="h-12 w-12 text-white group-hover:scale-110 transition-transform" /></div><div className="absolute bottom-2 left-2 right-2 text-left text-white text-xs font-semibold">{v.title}</div></button>))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)] text-center">Seamless Forex at the Best Rates</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {(data?.why||[]).map((w,i)=>{const Ic=WHY_ICONS[w.icon]||ShieldCheck;return(<Card key={i} className="rounded-2xl border border-[color:var(--tc-border)] p-5 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]"><Ic className="h-6 w-6" /></div><h3 className="mt-3 font-bold text-sm text-[color:var(--tc-ink-900)]">{w.title}</h3><p className="mt-1 text-xs text-[color:var(--tc-ink-500)]">{w.desc}</p></Card>);})}
        </div>
      </section>

      {/* TESTIMONIAL */}
      {data?.testimonial && (
        <section className="bg-[color:var(--tc-surface-2)] py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Our Customers Trust Us</h2>
            <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6 mt-6 bg-white"><div className="flex justify-center gap-0.5">{Array.from({length:5}).map((_,s)=><Star key={s} className="h-5 w-5 fill-[color:var(--tc-yellow-500)] text-[color:var(--tc-yellow-500)]" />)}</div><p className="mt-3 text-sm text-[color:var(--tc-ink-700)] italic">"{data.testimonial.text}"</p><div className="mt-4 flex items-center justify-center gap-3"><Avatar className="h-10 w-10"><AvatarFallback className="bg-[color:var(--tc-blue-700)] text-white text-xs">{data.testimonial.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar><div className="text-left"><div className="font-bold text-sm text-[color:var(--tc-ink-900)]">{data.testimonial.name}</div><div className="text-xs text-[color:var(--tc-ink-500)]">{data.testimonial.location}</div></div></div></Card>
            <Button variant="secondary" onClick={()=>soon("Leave a Review")} className="mt-4" data-testid="forex-review">Leave a Review</Button>
          </div>
        </section>
      )}

      {/* PARTNERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display text-xl font-bold text-[color:var(--tc-blue-900)] text-center">Our Partners</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {(data?.partners||[]).map((p,i)=>(<div key={i} className="rounded-xl border border-[color:var(--tc-border)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--tc-ink-700)]">{p}</div>))}
        </div>
      </section>
    </div>
  );
}
