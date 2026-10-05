"use client";

import { useLayoutEffect, useRef, useState } from "react";

type FitWidthTextProps = {
  text: string;
  className?: string;
};

/**
 * HTML text, který se font-size přizpůsobí přesně na šířku kontejneru.
 * Bez scaleX, bez roztahování mezer, bez ořezu.
 */
export function FitWidthText({ text, className = "" }: FitWidthTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;

    let frame = 0;
    let cancelled = false;

    const measureAndFit = () => {
      if (cancelled) return;

      const available = container.clientWidth;
      if (available <= 0) return;

      // Dočasná známá velikost pro lineární přepočet (přes DOM, ne přes React state).
      el.style.fontSize = "100px";
      // force layout
      const measured = el.getBoundingClientRect().width;
      if (measured <= 0) return;

      let next = (available / measured) * 100;

      el.style.fontSize = `${next}px`;
      const after = el.getBoundingClientRect().width;
      if (after > 0 && Math.abs(after - available) > 0.5) {
        next = next * (available / after);
        el.style.fontSize = `${next}px`;
      }

      // Ultimátní pojistka proti přečnívání (subpixel / font metrics)
      let guard = 0;
      while (el.getBoundingClientRect().width > available + 0.5 && guard < 8) {
        next *= 0.995;
        el.style.fontSize = `${next}px`;
        guard += 1;
      }

      setFontSize(next);
      setReady(true);
    };

    const run = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }
      if (cancelled) return;
      measureAndFit();
    };

    run();

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measureAndFit);
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text, className]);

  return (
    <div ref={containerRef} className="w-full">
      <p
        ref={textRef}
        className={`m-0 block w-max max-w-none whitespace-nowrap ${className}`}
        style={{
          fontSize: fontSize ? `${fontSize}px` : "100px",
          lineHeight: 0.82,
          height: "auto",
          maxHeight: "none",
          overflow: "visible",
          opacity: ready ? 1 : 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}
