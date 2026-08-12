import React from "react";

export const SectionHeading = ({ eyebrow, title, subtitle, align = "left", light = false }) => {
  return (
    <div className={`mb-6 sm:mb-8 ${align === "center" ? "text-center mx-auto max-w-2xl" : ""}`}>
      {eyebrow && (
        <span className={`inline-block text-xs font-bold uppercase tracking-[0.18em] mb-2 ${light ? "text-[color:var(--tc-yellow-400)]" : "text-[color:var(--tc-blue-600)]"}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${light ? "text-white" : "text-[color:var(--tc-blue-900)]"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-sm sm:text-base ${light ? "text-white/70" : "text-[color:var(--tc-ink-500)]"}`}>{subtitle}</p>
      )}
    </div>
  );
};
