import React, { useState } from "react";
import client from "@/api/client";
import { useAuthStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, BadgeCheck, Award } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await client.put("/auth/profile", form);
      updateUser(res.data);
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6" data-testid="account-profile-card">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">My Profile</h1>
        <Badge className="bg-[color:var(--tc-blue-100)] text-[color:var(--tc-blue-700)] border-0 capitalize">{user?.provider} account</Badge>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[color:var(--tc-blue-900)] tc-noise p-4 w-fit" data-testid="account-edge-points">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)]"><Award className="h-5 w-5" /></div>
        <div><div className="text-[11px] text-white/70">EDGE Rewards Balance</div><div className="text-xl font-extrabold text-[color:var(--tc-yellow-400)]">{(user?.edge_points || 0).toLocaleString("en-IN")} pts</div></div>
      </div>
      <form onSubmit={save} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl mt-1" data-testid="profile-name-input" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Add your phone" className="h-11 rounded-xl mt-1" data-testid="profile-phone-input" />
        </div>
        <div className="sm:col-span-2">
          <Label>Email</Label>
          <div className="h-11 rounded-xl mt-1 flex items-center gap-2 px-3 bg-[color:var(--tc-surface-2)] text-sm text-[color:var(--tc-ink-700)]">
            {user?.email} <BadgeCheck className="h-4 w-4 text-[color:var(--tc-success,#0E9F6E)]" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving} className="bg-[color:var(--tc-blue-700)] hover:bg-[color:var(--tc-blue-800)] text-white" data-testid="profile-save-button">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving</> : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
