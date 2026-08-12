import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";

export const PackageCard = ({ pkg, testid = "holidays-package-card" }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        data-testid={testid}
        className="group overflow-hidden rounded-2xl border border-[color:var(--tc-border)] bg-white transition-shadow duration-200 hover:shadow-[0_14px_40px_rgba(6,43,91,0.14)] cursor-pointer h-full flex flex-col"
        onClick={() => navigate(`/holidays/${pkg.id}`)}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-[color:var(--tc-blue-900)]/90 text-white border-0 backdrop-blur">{pkg.category}</Badge>
            {pkg.popular && (
              <Badge className="bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] border-0 font-bold">Popular</Badge>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[color:var(--tc-ink-900)] shadow">
              <Star className="h-3.5 w-3.5 fill-[color:var(--tc-yellow-500)] text-[color:var(--tc-yellow-500)]" /> {pkg.rating}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-xs text-[color:var(--tc-ink-500)] mb-1">
            <MapPin className="h-3.5 w-3.5" /> {pkg.destination}, {pkg.country.split(",")[0]}
          </div>
          <h3 className="font-sans text-base font-bold text-[color:var(--tc-ink-900)] leading-snug line-clamp-2 min-h-[2.75rem]">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-[color:var(--tc-ink-700)]">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {pkg.duration_nights}N / {pkg.duration_days}D</span>
            <span className="text-[color:var(--tc-ink-500)]">· {pkg.reviews_count?.toLocaleString("en-IN")} reviews</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(pkg.tags || []).slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-[color:var(--tc-surface-2)] px-2 py-0.5 text-[11px] text-[color:var(--tc-ink-700)]">{t}</span>
            ))}
          </div>
          <div className="mt-auto pt-4 flex items-end justify-between">
            <div>
              <div className="text-[11px] text-[color:var(--tc-ink-500)]">Starting from</div>
              <div className="text-lg font-extrabold text-[color:var(--tc-blue-800)]">{formatINR(pkg.price)}</div>
              <div className="text-[10px] text-[color:var(--tc-ink-500)]">per person</div>
            </div>
            <Button
              size="sm"
              data-testid="home-special-package-view-details"
              className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white group/btn"
              onClick={(e) => { e.stopPropagation(); navigate(`/holidays/${pkg.id}`); }}
            >
              View Details <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
