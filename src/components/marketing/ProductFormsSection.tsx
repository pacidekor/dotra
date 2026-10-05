"use client";

import Image from "next/image";
import { useState } from "react";

/** Originální rozměr všech backgroundsekce*.webp */
const IMAGE_W = 1672;
const IMAGE_H = 941;

/**
 * Zapni při doladění hotspotů — uvidíš červené boxy + souřadnice kurzoru
 * v pixelech originálu (1672×941). Pak sem napiš nové left/top/width/height.
 */
const DEBUG_HOTSPOTS = true;

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

/**
 * Hotspoty v PIXELECH originálního obrázku 1672×941.
 * left/top = levý horní roh, width/height = rozměr boxu.
 */
const hotspots: {
  id: HoverId;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
}[] = [
  {
    id: "card",
    label: "Do peněženky",
    left: 300,
    top: 400,
    width: 360,
    height: 290,
  },
  {
    id: "chip",
    label: "Na stůl",
    left: 740,
    top: 500,
    width: 180,
    height: 180,
  },
  {
    id: "stand",
    label: "Na recepci",
    left: 1000,
    top: 280,
    width: 260,
    height: 460,
  },
];

function toPercent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

export function ProductFormsSection() {
  const [active, setActive] = useState<HoverId | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${IMAGE_W} / ${IMAGE_H}` }}
      onMouseMove={
        DEBUG_HOTSPOTS
          ? (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setCursor({
                x: Math.round(
                  ((event.clientX - rect.left) / rect.width) * IMAGE_W,
                ),
                y: Math.round(
                  ((event.clientY - rect.top) / rect.height) * IMAGE_H,
                ),
              });
            }
          : undefined
      }
      onMouseLeave={
        DEBUG_HOTSPOTS
          ? () => {
              setCursor(null);
              setActive(null);
            }
          : undefined
      }
    >
      {/* Základ vždy viditelný — hover vrstvy jen přiblednou přes něj */}
      <Image
        src={baseImage}
        alt="Dotra produkty: karta, čip a stojánek"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover"
      />

      {hoverLayers.map((layer) => (
        <Image
          key={layer.id}
          src={layer.src}
          alt=""
          fill
          sizes="100vw"
          className={`pointer-events-none object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            active === layer.id ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          aria-label={hotspot.label}
          className={`absolute z-10 cursor-pointer ${
            DEBUG_HOTSPOTS
              ? "border-2 border-red-500/80 bg-red-500/20"
              : "bg-transparent"
          }`}
          style={{
            left: toPercent(hotspot.left, IMAGE_W),
            top: toPercent(hotspot.top, IMAGE_H),
            width: toPercent(hotspot.width, IMAGE_W),
            height: toPercent(hotspot.height, IMAGE_H),
          }}
          onMouseEnter={() => setActive(hotspot.id)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(hotspot.id)}
          onBlur={() => setActive(null)}
        >
          {DEBUG_HOTSPOTS ? (
            <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {hotspot.id} · {hotspot.left},{hotspot.top} · {hotspot.width}×
              {hotspot.height}
            </span>
          ) : null}
        </button>
      ))}

      {DEBUG_HOTSPOTS && cursor ? (
        <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-md bg-black/75 px-3 py-1.5 font-mono text-xs text-white">
          kurzor: {cursor.x}, {cursor.y} / {IMAGE_W}×{IMAGE_H}
        </div>
      ) : null}
    </section>
  );
}
