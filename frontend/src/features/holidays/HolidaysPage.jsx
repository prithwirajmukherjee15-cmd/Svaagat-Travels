import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import client from "@/api/client";
import { PackageCard } from "@/shared/PackageCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatINR } from "@/lib/format";
import { SlidersHorizontal, MapPinned, X, Compass } from "lucide-react";

const DURATIONS = [
  { label: "Up to 4 nights", min: 0, max: 4 },
  { label: "5 - 6 nights", min: 5, max: 6 },
  { label: "7+ nights", min: 7, max: 30 },
];

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
    <div className="space-y-1" data-testid="holidays-filters-sidebar">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[color:var(--tc-ink-900)]">Filters</h3>
        <button onClick={resetAll} className="text-xs font-semibold text-[color:var(--tc-blue-700)] hover:underline" data-testid="holidays-reset-filters">Reset all</button>
      </div>
      <Accordion type="multiple" defaultValue={["category", "price", "destination", "duration"]} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {filters.categories.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={sel.category.includes(c)} onCheckedChange={() => toggle("category", c)} data-testid={`filter-category-${c.toLowerCase()}`} /> {c}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 pt-2">
              <Slider data-testid="holidays-filter-price-slider" min={filters.min_price} max={filters.max_price} step={1000} value={priceRange} onValueChange={setPriceRange} className="my-4" />
              <div className="flex justify-between text-xs text-[color:var(--tc-ink-700)]">
                <span>{formatINR(priceRange[0])}</span>
                <span>{formatINR(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="destination">
          <AccordionTrigger className="text-sm font-semibold">Destination</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filters.destinations.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={sel.destination.includes(d)} onCheckedChange={() => toggle("destination", d)} data-testid={`filter-destination-${d.toLowerCase()}`} /> {d}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="duration">
          <AccordionTrigger className="text-sm font-semibold">Duration</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {DURATIONS.map((d) => (
                <label key={d.label} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={sel.duration.includes(d.label)} onCheckedChange={() => toggle("duration", d.label)} data-testid={`filter-duration-${d.min}`} /> {d.label}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default function HolidaysPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const initialDest = searchParams.get("destination");
  const [sel, setSel] = useState({
    category: [],
    destination: initialDest ? [initialDest] : [],
    duration: [],
  });

  useEffect(() => {
    client.get("/packages/filters").then((res) => {
      setFilters(res.data);
      setPriceRange([res.data.min_price, res.data.max_price]);
    });
  }, []);

  const fetchPackages = useCallback(() => {
    setLoading(true);
    client.get("/packages").then((res) => {
      let items = res.data.packages;
      if (sel.category.length) items = items.filter((p) => sel.category.includes(p.category));
      if (sel.destination.length) items = items.filter((p) => sel.destination.includes(p.destination));
      if (sel.duration.length) {
        items = items.filter((p) => sel.duration.some((label) => {
          const d = DURATIONS.find((x) => x.label === label);
          return d && p.duration_nights >= d.min && p.duration_nights <= d.max;
        }));
      }
      items = items.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
      if (sort === "price_asc") items = [...items].sort((a, b) => a.price - b.price);
      else if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
      else if (sort === "rating") items = [...items].sort((a, b) => b.rating - a.rating);
      else items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      setPackages(items);
      setLoading(false);
    });
  }, [sel, priceRange, sort]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const resetAll = () => {
    setSel({ category: [], destination: [], duration: [] });
    if (filters) setPriceRange([filters.min_price, filters.max_price]);
    setSearchParams({});
  };

  return (
    <div>
      <div className="bg-[color:var(--tc-blue-900)] tc-noise">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-[color:var(--tc-yellow-400)] text-xs font-bold uppercase tracking-widest"><Compass className="h-4 w-4" /> Holiday Packages</div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">Find your perfect getaway</h1>
          <p className="mt-2 text-white/70 text-sm max-w-xl">Explore curated domestic and international holiday packages with the best prices, handpicked by our experts.</p>
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
                {loading ? "Loading..." : <><span className="font-bold">{packages.length}</span> packages found</>}
              </p>
              <div className="flex items-center gap-2">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="lg:hidden" data-testid="holidays-mobile-filter-button"><SlidersHorizontal className="h-4 w-4 mr-1" /> Filters</Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] overflow-y-auto">
                    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                    <div className="mt-4"><FiltersPanel filters={filters} sel={sel} setSel={setSel} priceRange={priceRange} setPriceRange={setPriceRange} resetAll={resetAll} /></div>
                  </SheetContent>
                </Sheet>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px] h-10 rounded-xl" data-testid="holidays-sort-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active chips */}
            {(sel.category.length + sel.destination.length + sel.duration.length) > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...sel.category, ...sel.destination, ...sel.duration].map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] text-xs font-semibold px-3 py-1">{c}</span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
              </div>
            ) : packages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MapPinned className="h-12 w-12 text-[color:var(--tc-ink-500)]" />
                <h3 className="mt-4 font-bold text-lg text-[color:var(--tc-ink-900)]">No packages match your filters</h3>
                <p className="mt-1 text-sm text-[color:var(--tc-ink-500)]">Try adjusting or resetting your filters.</p>
                <Button className="mt-4" onClick={resetAll} data-testid="holidays-empty-reset"><X className="h-4 w-4 mr-1" /> Reset Filters</Button>
              </div>
            ) : (
              <div data-testid="holidays-results-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {packages.map((p) => <PackageCard key={p.id} pkg={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
