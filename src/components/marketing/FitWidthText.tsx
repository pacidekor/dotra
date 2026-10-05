"use client";

import { useEffect, useRef } from "react";

type FitWidthTextProps = {
  text: string;
  className?: string;
};

/** Škáluje text přesně na 100 % šířky rodiče (levý → pravý okraj). */
export function FitWidthText({ text, className = "" }: FitWidthTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    const fit = () => {
      const available = container.clientWidth;
      if (available <= 0) return;

      // Měř při známé velikosti — NE přes React style (ten by to po renderu shodil).
      el.style.fontSize = "100px";
      const measured = el.scrollWidth;
      if (measured <= 0) return;

      el.style.fontSize = `${(available / measured) * 100}px`;
    };

    const run = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }
      // Dvojitý rAF — po layoutu a po načtení fontu
      requestAnimationFrame(() => requestAnimationFrame(fit));
    };

    run();

    const observer = new ResizeObserver(() => fit());
    observer.observe(container);
    return () => observer.disconnect();
  }, [text, className]);

  return (
    <div ref={containerRef} className="w-full">
      <p
        ref={textRef}
        className={`m-0 whitespace-nowrap leading-none ${className}`}
      >
        {text}
      </p>
    </div>
  );
}
