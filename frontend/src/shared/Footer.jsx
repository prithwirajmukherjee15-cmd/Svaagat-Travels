import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/shared/Logo";
import { Facebook, Instagram, Twitter, Youtube, Sparkles, BedDouble, Headphones } from "lucide-react";

const COLS = [
  { title: "Holidays", links: ["India Holidays", "International Holidays", "Honeymoon Packages", "Group Tours", "Cruise Holidays"] },
  { title: "Quick Links", links: ["Flights", "Forex", "Visa Services", "Travel Insurance", "Corporate Travel"] },
  { title: "Company", links: ["About Us", "Careers", "Investor Relations", "Press Room", "Contact Us"] },
  { title: "Support", links: ["FAQ", "Cancellation Policy", "Terms & Conditions", "Privacy Policy", "Store Locator"] },
];

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="bg-[color:var(--tc-blue-900)] text-white mt-auto">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Handcrafted Journeys", desc: "Curated, tailor-made itineraries" },
            { icon: BedDouble, title: "World-class Stays", desc: "Handpicked luxury hotels & palaces" },
            { icon: Headphones, title: "24x7 Assistance", desc: "Support before, during & after" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)]">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="text-xs text-white/70">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-6 gap-8">
        <div className="col-span-2">
          <div className="mb-3">
            <Logo className="h-16" chip />
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            Your trusted travel partner. Holidays, flights, forex and visa services — all in one place.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[color:var(--tc-yellow-500)] hover:text-[color:var(--tc-ink-900)] transition-colors" aria-label="social">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm mb-3 text-white">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <Link to="/faq" className="text-sm text-white/65 hover:text-[color:var(--tc-yellow-400)] transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">© {new Date().getFullYear()} Svaagat Travels. All rights reserved.</p>
          <p className="text-xs text-white/60">Made with care · Your journey, our pride</p>
        </div>
      </div>
    </footer>
  );
};
