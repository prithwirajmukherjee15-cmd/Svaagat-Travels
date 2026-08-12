import React from "react";

const LOGO_SRC = "/svaagat-logo.png";

/**
 * Logo component.
 * - variant="lockup" : cropped emblem (icon) + "Svaagat / Travels" wordmark (horizontal). For header.
 * - variant="full"   : the complete brand image (icon + wordmark stacked). For auth pages / footer chip.
 */
export const Logo = ({ variant = "full", className = "h-12", chip = false, alt = "Svaagat Travels", markSize = 48 }) => {
  if (variant === "lockup") {
    // Crop only the golden emblem from the top of the source PNG.
    const scale = markSize / 40; // relative scaling of the crop window
    return (
      <span className="flex items-center gap-2.5 select-none" aria-label={alt}>
        <span
          aria-hidden="true"
          className="block shrink-0 bg-no-repeat"
          style={{
            width: `${markSize}px`,
            height: `${markSize}px`,
            backgroundImage: `url(${LOGO_SRC})`,
            backgroundSize: `${116 * (markSize / 48)}px auto`,
            backgroundPosition: `${-34 * (markSize / 48)}px ${-16 * (markSize / 48)}px`,
          }}
        />
        <span className="leading-[0.95]">
          <span className="block font-display text-[26px] font-extrabold text-[color:var(--tc-blue-900)] tracking-tight">Svaagat</span>
          <span className="block text-[11px] font-bold tracking-[0.42em] text-[color:var(--tc-blue-800)] mt-[3px] pl-[2px]">TRAVELS</span>
        </span>
      </span>
    );
  }

  const img = <img src={LOGO_SRC} alt={alt} className={`${className} w-auto object-contain`} />;
  if (chip) {
    return <span className="inline-flex items-center justify-center rounded-xl bg-white px-2 py-1.5 shadow-sm">{img}</span>;
  }
  return img;
};
