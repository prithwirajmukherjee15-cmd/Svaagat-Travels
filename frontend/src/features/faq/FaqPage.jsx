import React, { useEffect, useState } from "react";
import client from "@/api/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    client.get("/faqs").then((res) => { setFaqs(res.data.faqs); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="bg-[color:var(--tc-blue-900)] tc-noise">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-[color:var(--tc-yellow-400)] text-xs font-bold uppercase tracking-widest"><HelpCircle className="h-4 w-4" /> Help Centre</div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="mt-2 text-white/70 text-sm">Everything you need to know about booking, payments, visas and more.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="space-y-3">{Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3" data-testid="faq-accordion">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-2xl border border-[color:var(--tc-border)] bg-white px-5">
                <AccordionTrigger className="text-left font-semibold text-[color:var(--tc-ink-900)] hover:no-underline" data-testid={`faq-item-${i}`}>
                  <span className="flex items-start gap-3"><MessageCircleQuestion className="h-5 w-5 text-[color:var(--tc-blue-600)] shrink-0 mt-0.5" /> {f.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[color:var(--tc-ink-700)] leading-relaxed pl-8">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        <div className="mt-8 rounded-2xl bg-[color:var(--tc-surface-2)] p-6 text-center">
          <h3 className="font-bold text-[color:var(--tc-ink-900)]">Still have questions?</h3>
          <p className="mt-1 text-sm text-[color:var(--tc-ink-500)]">Reach our travel experts — <span className="font-semibold text-[color:var(--tc-blue-700)]">dedicated helpline coming soon</span>. Meanwhile, drop us a message any time.</p>
        </div>
      </div>
    </div>
  );
}
