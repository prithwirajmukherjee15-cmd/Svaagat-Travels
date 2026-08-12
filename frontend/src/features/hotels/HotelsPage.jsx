import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import client from "@/api/client";
import { HotelCard } from "@/shared/HotelCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatINR } from "@/lib/format";
import { SlidersHorizontal, BedDouble, X, Star, Building2 } from "lucide-react";

function FiltersPanel({ filters, sel, setSel, priceRange, setPriceRange, resetAll }) {
  const toggle = (key, val) => {
    setSel((prev) => {
      const cur = new Set(prev[key]);
      cur.has(val) ? cur.delete(val) : cur.add(val);
      return { ...prev, [key]: Array.from(cur) };
    });
  };
  if (!filters) return null;
  return (
    <div className="space-y-1" data-testid="hotels-filters-sidebar">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[color:var(--tc-ink-900)]">Filters</h3>
        <button onClick={resetAll} className="text-xs font-semibold text-[color:var(--tc-blue-700)] hover:underline" data-testid="hotels-reset-filters">Reset all</button>
      </div>
      <Accordion type="multiple" defaultValue={["collection", "price", "city", "star"]} className="w-full">
        <AccordionItem value="collection">
          <AccordionTrigger className="text-sm font-semibold">Collection</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.collections.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={sel.collection.includes(c)} onCheckedChange={() => toggle("collection", c)} data-testid={`filter-collection-${c.toLowerCase()}`} /> {c}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">Price / night</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 pt-2">
              <Slider data-testid="hotels-filter-price-slider" min={filters.min_price} max={filters.max_price} step={1000} value={priceRange} onValueChange={setPriceRange} className="my-4" />
              <div className="flex justify-between text-xs text-[color:var(--tc-ink-700)]">
                <span>{formatINR(priceRange[0])}</span>
                <span>{formatINR(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="city">
          <AccordionTrigger className="text-sm font-semibold">City</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filters.cities.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={sel.city.includes(d)} onCheckedChange={() => toggle("city", d)} data-testid={`filter-city-${d.toLowerCase().replace(/\s+/g, "-")}`} /> {d}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="star">
          <AccordionTrigger className="text-sm font-semibold">Star Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.stars.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={sel.star.includes(String(s))} onCheckedChange={() => toggle("star", String(s))} data-testid={`filter-star-${s}`} />
                  <span className="inline-flex items-center gap-0.5">{s} <Star className="h-3.5 w-3.5 fill-[color:var(--tc-yellow-500)] text-[color:var(--tc-yellow-500)]" /> & up</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const initialCity = searchParams.get("city");
  const [sel, setSel] = useState({
    collection: [],
    city: initialCity ? [initialCity] : [],
    star: [],
  });

  useEffect(() => {
    client.get("/hotels/filters").then((res) => {
      setFilters(res.data);
      setPriceRange([res.data.min_price, res.data.max_price]);
    });
  }, []);

  const fetchHotels = useCallback(() => {
    setLoading(true);
    client.get("/hotels").then((res) => {
      let items = res.data.hotels;
      if (sel.collection.length) items = items.filter((h) => sel.collection.includes(h.collection));
      if (sel.city.length) items = items.filter((h) => sel.city.includes(h.city));
      if (sel.star.length) items = items.filter((h) => sel.star.includes(String(h.star_rating)));
      items = items.filter((h) => h.price >= priceRange[0] && h.price <= priceRange[1]);
      if (sort === "price_asc") items = [...items].sort((a, b) => a.price - b.price);
      else if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
      else if (sort === "rating") items = [...items].sort((a, b) => b.rating - a.rating);
      else items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      setHotels(items);
      setLoading(false);
    });
  }, [sel, priceRange, sort]);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const resetAll = () => {
    setSel({ collection: [], city: [], star: [] });
    if (filters) setPriceRange([filters.min_price, filters.max_price]);
    setSearchParams({});
  };

  const activeCount = sel.collection.length + sel.city.length + sel.star.length;

  return (
    <div>
      <div className="relative bg-[color:var(--tc-blue-900)] tc-noise overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-[color:var(--tc-yellow-400)] text-xs font-bold uppercase tracking-widest"><Building2 className="h-4 w-4" /> Svaagat Luxury Stays</div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">Handpicked hotels & palaces</h1>
          <p className="mt-2 text-white/75 text-sm max-w-xl">A curated collection of the world's most iconic luxury hotels, palaces and resorts — reserved with the trust of Svaagat Travels.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-[color:var(--tc-border)] bg-white p-5">
              <FiltersPanel filters={filters} sel={sel} setSel={setSel} priceRange={priceRange} setPriceRange={setPriceRange} resetAll={resetAll} />
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-5 gap-3">
              <p className="text-sm text-[color:var(--tc-ink-700)]">
                {loading ? "Loading..." : <><span className="font-bold">{hotels.length}</span> hotels found</>}
              </p>
              <div className="flex items-center gap-2">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="lg:hidden" data-testid="hotels-mobile-filter-button"><SlidersHorizontal className="h-4 w-4 mr-1" /> Filters</Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] overflow-y-auto">
                    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                    <div className="mt-4"><FiltersPanel filters={filters} sel={sel} setSel={setSel} priceRange={priceRange} setPriceRange={setPriceRange} resetAll={resetAll} /></div>
                  </SheetContent>
                </Sheet>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px] h-10 rounded-xl" data-testid="hotels-sort-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...sel.collection, ...sel.city, ...sel.star.map((s) => `${s} Star`)].map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] text-xs font-semibold px-3 py-1">{c}</span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
              </div>
            ) : hotels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <BedDouble className="h-12 w-12 text-[color:var(--tc-ink-500)]" />
                <h3 className="mt-4 font-bold text-lg text-[color:var(--tc-ink-900)]">No hotels match your filters</h3>
                <p className="mt-1 text-sm text-[color:var(--tc-ink-500)]">Try adjusting or resetting your filters.</p>
                <Button className="mt-4" onClick={resetAll} data-testid="hotels-empty-reset"><X className="h-4 w-4 mr-1" /> Reset Filters</Button>
              </div>
            ) : (
              <div data-testid="hotels-results-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {hotels.map((h) => <HotelCard key={h.id} hotel={h} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
