import React, { useState } from "react";
import client from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Loader2, Send } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await client.post("/newsletter", { email });
      toast.success("Subscribed! Welcome to the Svaagat family.");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section data-testid="newsletter-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-[color:var(--tc-blue-900)] tc-noise px-6 py-10 sm:px-12 sm:py-12">
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Stay in the Loop!</h2>
            <p className="mt-2 text-white/75 text-sm sm:text-base max-w-md">Subscribe for exclusive travel deals, forex offers and holiday inspiration delivered to your inbox.</p>
          </div>
          <form onSubmit={submit} className="w-full max-w-md flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[color:var(--tc-ink-500)]" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 rounded-xl pl-9 bg-white border-0"
                data-testid="newsletter-email-input"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-12 bg-[color:var(--tc-yellow-500)] text-[color:var(--tc-ink-900)] hover:bg-[color:var(--tc-yellow-400)] font-bold px-6" data-testid="newsletter-submit-button">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Subscribe <Send className="ml-1.5 h-4 w-4" /></>}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
