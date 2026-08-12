import React, { useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, CalendarCheck, LogOut } from "lucide-react";

export default function AccountLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  if (!user) return null;

  const link = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? "bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)]" : "text-[color:var(--tc-ink-700)] hover:bg-[color:var(--tc-surface-2)]"
    }`;

  return (
    <div className="bg-[color:var(--tc-surface-2)] min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Card className="rounded-2xl border border-[color:var(--tc-border)] p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12"><AvatarImage src={user.picture || undefined} /><AvatarFallback className="bg-[color:var(--tc-blue-700)] text-white">{(user.name||"U").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="min-w-0"><div className="font-bold text-[color:var(--tc-ink-900)] truncate">{user.name}</div><div className="text-xs text-[color:var(--tc-ink-500)] truncate">{user.email}</div></div>
              </div>
              <div className="mt-4 space-y-1">
                <NavLink to="/account" end className={link} data-testid="account-nav-profile"><User className="h-4 w-4" /> My Profile</NavLink>
                <NavLink to="/account/bookings" className={link} data-testid="account-nav-bookings"><CalendarCheck className="h-4 w-4" /> My Bookings</NavLink>
                <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[color:var(--tc-ink-700)] hover:bg-[color:var(--tc-surface-2)]" data-testid="account-logout"><LogOut className="h-4 w-4" /> Logout</button>
              </div>
            </Card>
          </aside>
          <div className="lg:col-span-3"><Outlet /></div>
        </div>
      </div>
    </div>
  );
}
