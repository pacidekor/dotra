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
      el.style.fontSize = "100px";
      const width = el.scrollWidth;
      if (width <= 0) return;
      const next = (container.clientWidth / width) * 100;
      el.style.fontSize = `${next}px`;
    };

    const run = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }
      fit();
    };

    run();

    const observer = new ResizeObserver(() => fit());
    observer.observe(container);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <p
        ref={textRef}
        className={`whitespace-nowrap ${className}`}
        style={{ fontSize: "100px" }}
      >
        {text}
      </p>
    </div>
  );
}
