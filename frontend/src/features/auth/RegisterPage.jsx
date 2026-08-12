import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import client from "@/api/client";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/shared/Logo";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Phone } from "lucide-react";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
);

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
const startGoogleLogin = () => {
  const redirectUrl = window.location.origin + "/auth/callback";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const from = location.state?.from || "/account";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await client.post("/auth/register", form);
      setAuth(res.data.access_token, res.data.user);
      toast.success(`Welcome to Svaagat Travels, ${res.data.user.name.split(" ")[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[color:var(--tc-surface-2)] min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <Logo className="h-20" />
          </Link>
        </div>
        <Card className="rounded-2xl border border-[color:var(--tc-border)] p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-[color:var(--tc-blue-900)]">Create your account</h1>
          <p className="text-sm text-[color:var(--tc-ink-500)] mt-1">Begin your journey with Svaagat Travels.</p>

          <Button onClick={startGoogleLogin} variant="secondary" className="w-full mt-6 h-11 border border-[color:var(--tc-border)] bg-white hover:bg-[color:var(--tc-surface-2)] gap-2" data-testid="register-google-button">
            <GoogleIcon /> Continue with Google
          </Button>
          <div className="flex items-center gap-3 my-5"><Separator className="flex-1" /><span className="text-xs text-[color:var(--tc-ink-500)]">or</span><Separator className="flex-1" /></div>

          <form onSubmit={submit} data-testid="register-form" className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1"><User className="absolute left-3 top-3 h-4 w-4 text-[color:var(--tc-ink-500)]" />
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="h-11 rounded-xl pl-9" data-testid="register-name-input" /></div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1"><Mail className="absolute left-3 top-3 h-4 w-4 text-[color:var(--tc-ink-500)]" />
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="h-11 rounded-xl pl-9" data-testid="register-email-input" /></div>
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <div className="relative mt-1"><Phone className="absolute left-3 top-3 h-4 w-4 text-[color:var(--tc-ink-500)]" />
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="98765 43210" className="h-11 rounded-xl pl-9" data-testid="register-phone-input" /></div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1"><Lock className="absolute left-3 top-3 h-4 w-4 text-[color:var(--tc-ink-500)]" />
                <Input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" className="h-11 rounded-xl pl-9" data-testid="register-password-input" /></div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold" data-testid="register-submit-button">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-[color:var(--tc-ink-500)]">Already have an account? <Link to="/login" className="font-semibold text-[color:var(--tc-blue-700)] hover:underline">Login</Link></p>
        </Card>
      </div>
    </div>
  );
}
