import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { Logo } from "@/shared/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu, Umbrella, Coins, Plane, Building2, Ship, TrainFront, Grip,
  User, LogOut, CalendarCheck, Phone, Headset, MapPin, Globe, ChevronDown, LogIn,
  Gift, BadgePercent, Star, ShieldCheck, Briefcase, BookOpen,
} from "lucide-react";

const NAV = [
  { label: "Holidays", to: "/holidays", icon: Umbrella },
  { label: "Forex", to: "/forex", icon: Coins },
  { label: "Flights", to: "/flights", icon: Plane },
  { label: "Hotels", to: "/hotels", icon: Building2 },
  { label: "Cruise", icon: Ship, soon: true },
  { label: "Eurail", icon: TrainFront, soon: true },
];

const MORE = [
  { label: "Gift Card", icon: Gift, soon: true },
  { label: "Offers", icon: BadgePercent, to: "/holidays" },
  { label: "Loyalty Points", icon: Star, soon: true },
  { label: "Insurance", icon: ShieldCheck, soon: true },
  { label: "Careers", icon: Briefcase, soon: true },
  { label: "Blogs", icon: BookOpen, soon: true },
];

export const Header = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (to) => to && (location.pathname === to || location.pathname.startsWith(to + "/"));

  const go = (item, closeSheet = false) => {
    if (closeSheet) setOpen(false);
    if (item.soon) { toast.info(`${item.label} — coming soon!`); return; }
    if (item.to) navigate(item.to);
  };

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 border-b border-[color:var(--tc-border)]"
    >
      {/* Utility strip */}
      <div className="hidden md:block border-b border-[color:var(--tc-border)] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 text-sm">
          <span className="inline-flex items-center gap-2 font-semibold text-[color:var(--tc-ink-900)]" data-testid="header-phone">
            <Phone className="h-4 w-4 text-[color:var(--tc-blue-700)]" /> Coming soon
          </span>
          <div className="flex items-center gap-6">
            <button onClick={() => toast.info("Contact Us — coming soon")} className="inline-flex items-center gap-1.5 font-medium text-[color:var(--tc-ink-700)] hover:text-[color:var(--tc-blue-700)] transition-colors" data-testid="header-contact">
              <Headset className="h-4 w-4" /> Contact Us
            </button>
            <button onClick={() => toast.info("Stores — coming soon")} className="inline-flex items-center gap-1.5 font-medium text-[color:var(--tc-ink-700)] hover:text-[color:var(--tc-blue-700)] transition-colors" data-testid="header-stores">
              <MapPin className="h-4 w-4" /> Stores
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 font-medium text-[color:var(--tc-ink-700)] hover:text-[color:var(--tc-blue-700)] transition-colors" data-testid="header-language">
                  <Globe className="h-4 w-4" /> English <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["English", "हिन्दी", "मराठी", "தமிழ்"].map((l) => (
                  <DropdownMenuItem key={l} onClick={() => toast.info(`Language: ${l} — coming soon!`)}>{l}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center shrink-0" data-testid="header-logo">
            <Logo variant="lockup" markSize={46} />
          </Link>

          <nav data-testid="site-primary-nav" className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              const content = (
                <span className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active ? "text-[color:var(--tc-blue-700)] bg-[color:var(--tc-blue-100)]" : "text-[color:var(--tc-ink-700)] hover:bg-[color:var(--tc-surface-2)] hover:text-[color:var(--tc-blue-700)]"
                }`}>
                  <Icon className="h-[18px] w-[18px]" /> {item.label}
                </span>
              );
              return item.to && !item.soon ? (
                <Link key={item.label} to={item.to} data-testid={`nav-${item.label.toLowerCase()}`}>{content}</Link>
              ) : (
                <button key={item.label} onClick={() => go(item)} data-testid={`nav-${item.label.toLowerCase()}`}>{content}</button>
              );
            })}

            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-testid="nav-more" className="flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-semibold text-[color:var(--tc-ink-700)] hover:bg-[color:var(--tc-surface-2)] hover:text-[color:var(--tc-blue-700)] transition-colors">
                  <Grip className="h-[18px] w-[18px]" /> More <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {MORE.map((m) => {
                  const Icon = m.icon;
                  return (
                    <DropdownMenuItem key={m.label} onClick={() => go(m)} data-testid={`more-${m.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Icon className="mr-2 h-4 w-4 text-[color:var(--tc-blue-700)]" /> {m.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {token && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button data-testid="header-account-menu" className="flex items-center gap-2 rounded-full border border-[color:var(--tc-border)] pl-1 pr-3 py-1 hover:bg-[color:var(--tc-surface-2)] transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.picture || undefined} alt={user.name} />
                      <AvatarFallback className="bg-[color:var(--tc-blue-700)] text-white text-xs">{(user.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-semibold text-[color:var(--tc-ink-900)] max-w-[100px] truncate">{user.name?.split(" ")[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")} data-testid="menu-profile"><User className="mr-2 h-4 w-4" /> My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account/bookings")} data-testid="menu-bookings"><CalendarCheck className="mr-2 h-4 w-4" /> My Bookings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout" className="text-[color:var(--tc-danger,#E11D48)]"><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white font-semibold rounded-xl px-5" onClick={() => navigate("/login")} data-testid="header-login-button">
                Login <LogIn className="ml-1.5 h-4 w-4" />
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" data-testid="mobile-menu-button"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left"><Logo className="h-12" /></SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1">
                  {NAV.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button key={item.label} onClick={() => go(item, true)} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-left ${isActive(item.to) ? "bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]" : "text-[color:var(--tc-ink-700)]"}`}>
                        <Icon className="h-4 w-4" /> {item.label}
                      </button>
                    );
                  })}
                  <div className="px-3 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--tc-ink-500)]">More</div>
                  {MORE.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button key={m.label} onClick={() => go(m, true)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-[color:var(--tc-ink-700)] text-left">
                        <Icon className="h-4 w-4" /> {m.label}
                      </button>
                    );
                  })}
                  <div className="h-px bg-[color:var(--tc-border)] my-3" />
                  {token && user ? (
                    <>
                      <Link to="/account" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-[color:var(--tc-ink-700)]"><User className="h-4 w-4" /> My Profile</Link>
                      <Link to="/account/bookings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-[color:var(--tc-ink-700)]"><CalendarCheck className="h-4 w-4" /> My Bookings</Link>
                      <button onClick={() => { setOpen(false); handleLogout(); }} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-[color:var(--tc-ink-700)] text-left"><LogOut className="h-4 w-4" /> Logout</button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 px-1">
                      <Button className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white font-semibold" onClick={() => { setOpen(false); navigate("/login"); }}>Login</Button>
                      <Button variant="secondary" onClick={() => { setOpen(false); navigate("/register"); }}>Sign Up</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
