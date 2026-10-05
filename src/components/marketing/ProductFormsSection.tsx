"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chillax } from "@/lib/fonts";

/** Originální rozměr všech backgroundsekce*.webp */
const IMAGE_W = 1672;
const IMAGE_H = 941;

/**
 * Zapni při doladění hotspotů.
 * Boxy můžeš tahat a měnit velikost za rohy — dole uvidíš / zkopíruješ přesné pixely.
 */
const DEBUG_HOTSPOTS = false;

const baseImage = "/images/backgroundsekce.webp";

const hoverLayers = [
  {
    id: "card",
    src: "/images/backgroundsekcehover1.webp",
  },
  {
    id: "chip",
    src: "/images/backgroundsekcehover2.webp",
  },
  {
    id: "stand",
    src: "/images/backgroundsekcehover3.webp",
  },
] as const;

type HoverId = (typeof hoverLayers)[number]["id"];

const productInfo: Record<
  HoverId,
  {
    eyebrow: string;
    title: string;
    text: string;
    tags: string[];
  }
> = {
  card: {
    eyebrow: "Osobní vizitka",
    title: "Do peněženky.",
    text: "Nejvhodnější jako osobní vizitka. Váš design, jméno i firma. Uvnitř klasika — kontakt, sociální sítě, web a další odkazy.",
    tags: ["Kontakt", "Web", "Sociální sítě"],
  },
  chip: {
    eyebrow: "Gastro & provoz",
    title: "Na stůl.",
    text: "Cíleně pro restaurace a kavárny. Nalepené na stole — host přiloží telefon a má menu, recenze i web bez ptaní obsluhy.",
    tags: ["Menu", "Recenze", "Web"],
  },
  stand: {
    eyebrow: "Firma & recepce",
    title: "Na recepci.",
    text: "Prezentace podniku na místě. Ideální na recepci — nebo rovnou jen na recenze, menu a to nejdůležitější, co má návštěvník udělat.",
    tags: ["Prezentace", "Recenze", "Menu"],
  },
};

type Hotspot = {
  id: HoverId;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

const initialHotspots: Hotspot[] = [
  {
    id: "card",
    label: "Do peněženky",
    left: 352,
    top: 486,
    width: 405,
    height: 248,
  },
  {
    id: "chip",
    label: "Na stůl",
    left: 775,
    top: 695,
    width: 143,
    height: 61,
  },
  {
    id: "stand",
    label: "Na recepci",
    left: 1017,
    top: 247,
    width: 356,
    height: 472,
  },
];

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatHotspots(hotspots: Hotspot[]) {
  return hotspots
    .map(
      (h) =>
        `${h.id}: left=${h.left}, top=${h.top}, width=${h.width}, height=${h.height}`,
    )
    .join("\n");
}

type DragMode =
  | { type: "move"; id: HoverId; startX: number; startY: number; origin: Hotspot }
  | {
      type: "resize";
      id: HoverId;
      corner: "nw" | "ne" | "sw" | "se";
      startX: number;
      startY: number;
      origin: Hotspot;
    };

export function ProductFormsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hotspots, setHotspots] = useState(initialHotspots);
  const [active, setActive] = useState<HoverId | null>(null);
  const [panel, setPanel] = useState<HoverId | null>(null);
  const [drag, setDrag] = useState<DragMode | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (active) setPanel(active);
  }, [active]);

  const clientToImage = useCallback((clientX: number, clientY: number) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * IMAGE_W,
      y: ((clientY - rect.top) / rect.height) * IMAGE_H,
    };
  }, []);

  useEffect(() => {
    if (!DEBUG_HOTSPOTS || !drag) return;

    const onMove = (event: PointerEvent) => {
      const point = clientToImage(event.clientX, event.clientY);
      const dx = point.x - drag.startX;
      const dy = point.y - drag.startY;
      const o = drag.origin;

      setHotspots((prev) =>
        prev.map((h) => {
          if (h.id !== drag.id) return h;

          if (drag.type === "move") {
            return {
              ...h,
              left: Math.round(clamp(o.left + dx, 0, IMAGE_W - o.width)),
              top: Math.round(clamp(o.top + dy, 0, IMAGE_H - o.height)),
            };
          }

          let left = o.left;
          let top = o.top;
          let width = o.width;
          let height = o.height;

          if (drag.corner.includes("e")) {
            width = clamp(o.width + dx, 40, IMAGE_W - o.left);
          }
          if (drag.corner.includes("s")) {
            height = clamp(o.height + dy, 40, IMAGE_H - o.top);
          }
          if (drag.corner.includes("w")) {
            const nextLeft = clamp(o.left + dx, 0, o.left + o.width - 40);
            width = o.width + (o.left - nextLeft);
            left = nextLeft;
          }
          if (drag.corner.includes("n")) {
            const nextTop = clamp(o.top + dy, 0, o.top + o.height - 40);
            height = o.height + (o.top - nextTop);
            top = nextTop;
          }

          return {
            ...h,
            left: Math.round(left),
            top: Math.round(top),
            width: Math.round(width),
            height: Math.round(height),
          };
        }),
      );
    };

    const onUp = () => setDrag(null);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [clientToImage, drag]);

  const copyCoords = async () => {
    const text = formatHotspots(hotspots);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: select via prompt
      window.prompt("Zkopíruj souřadnice:", text);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="cards"
      className="relative w-full scroll-mt-24 overflow-hidden"
      style={{ aspectRatio: `${IMAGE_W} / ${IMAGE_H}` }}
    >
      {/* Originální WebP bez Next optimalizace — jinak se fotky rozmažou */}
      <img
        src={baseImage}
        alt="dotra produkty: karta, čip a stojánek"
        width={IMAGE_W}
        height={IMAGE_H}
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {hoverLayers.map((layer) => (
        <img
          key={layer.id}
          src={layer.src}
          alt=""
          width={IMAGE_W}
          height={IMAGE_H}
          decoding="async"
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            active === layer.id ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Plynulý přechod z bílé sekce nad tím */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-[28%] bg-gradient-to-b from-white via-white/70 to-transparent sm:h-[32%]"
      />

      <div className="pointer-events-none absolute top-[6%] left-[4%] z-[5]">
        <h2
          className={`${chillax.className} whitespace-nowrap text-left text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-foreground`}
        >
          Různé podoby. Jedna dotra.
        </h2>
        <p className="mt-3 whitespace-nowrap text-left text-base leading-relaxed text-foreground/50 sm:mt-4 sm:text-lg">
          Karty, kolečka i stojánky. Vyberte si podobu, která sedne vašemu
          podnikání.
        </p>
      </div>

      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          role="button"
          tabIndex={0}
          aria-label={hotspot.label}
          className={`absolute z-10 ${
            DEBUG_HOTSPOTS
              ? "cursor-move border-2 border-red-500/90 bg-red-500/20"
              : "cursor-pointer bg-transparent"
          }`}
          style={{
            left: toPercent(hotspot.left, IMAGE_W),
            top: toPercent(hotspot.top, IMAGE_H),
            width: toPercent(hotspot.width, IMAGE_W),
            height: toPercent(hotspot.height, IMAGE_H),
          }}
          onMouseEnter={() => {
            if (!drag) setActive(hotspot.id);
          }}
          onMouseLeave={() => {
            if (!drag) setActive(null);
          }}
          onFocus={() => setActive(hotspot.id)}
          onBlur={() => setActive(null)}
          onPointerDown={
            DEBUG_HOTSPOTS
              ? (event) => {
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  const point = clientToImage(event.clientX, event.clientY);
                  setDrag({
                    type: "move",
                    id: hotspot.id,
                    startX: point.x,
                    startY: point.y,
                    origin: hotspot,
                  });
                  setActive(hotspot.id);
                }
              : undefined
          }
        >
          {DEBUG_HOTSPOTS ? (
            <>
              <span className="pointer-events-none absolute left-1 top-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {hotspot.id} · {hotspot.left},{hotspot.top} · {hotspot.width}×
                {hotspot.height}
              </span>
              {(["nw", "ne", "sw", "se"] as const).map((corner) => (
                <span
                  key={corner}
                  className={`absolute z-20 size-3 rounded-sm bg-red-500 ${
                    corner === "nw"
                      ? "-left-1.5 -top-1.5 cursor-nwse-resize"
                      : corner === "ne"
                        ? "-right-1.5 -top-1.5 cursor-nesw-resize"
                        : corner === "sw"
                          ? "-bottom-1.5 -left-1.5 cursor-nesw-resize"
                          : "-bottom-1.5 -right-1.5 cursor-nwse-resize"
                  }`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const point = clientToImage(event.clientX, event.clientY);
                    setDrag({
                      type: "resize",
                      id: hotspot.id,
                      corner,
                      startX: point.x,
                      startY: point.y,
                      origin: hotspot,
                    });
                    setActive(hotspot.id);
                  }}
                />
              ))}
            </>
          ) : null}
        </div>
      ))}

      {/* Hover info card */}
      <div
        className={`pointer-events-none absolute bottom-[7%] left-[4%] z-20 w-[min(90%,22rem)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          active
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        }`}
      >
        {panel ? (
          <div
            key={panel}
            className="rounded-[1.35rem] border border-black/[0.06] bg-white/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#ccfc4e]" />
              <p className="text-[11px] font-medium tracking-[0.16em] text-foreground/40 uppercase">
                {productInfo[panel].eyebrow}
              </p>
            </div>
            <h3
              className={`${chillax.className} mt-3 text-2xl leading-tight font-bold tracking-[-0.03em] sm:text-[1.75rem]`}
            >
              {productInfo[panel].title}
            </h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-foreground/55 sm:text-[15px]">
              {productInfo[panel].text}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {productInfo[panel].tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f0f0f2] px-3 py-1 text-[12px] font-medium text-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {DEBUG_HOTSPOTS ? (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 rounded-xl bg-black/80 p-3 text-white sm:left-auto sm:right-3 sm:w-[360px]">
          <p className="text-[11px] leading-relaxed text-white/70">
            Přesuň boxy myší, velikost změň za červené rohy. Pak zkopíruj
            souřadnice a pošli mi je.
          </p>
          <pre className="overflow-x-auto rounded-md bg-white/10 p-2 font-mono text-[11px] leading-relaxed">
            {formatHotspots(hotspots)}
          </pre>
          <button
            type="button"
            onClick={copyCoords}
            className="rounded-full bg-[#ccfc4e] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            {copied ? "Zkopírováno" : "Zkopírovat souřadnice"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
