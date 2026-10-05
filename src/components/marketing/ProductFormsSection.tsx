"use client";

import Image from "next/image";
import { useState } from "react";

const layers = [
  {
    id: "default",
    src: "/images/backgroundsekce.webp",
  },
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

type LayerId = (typeof layers)[number]["id"];

const hotspots: {
  id: Exclude<LayerId, "default">;
  label: string;
  className: string;
}[] = [
  {
    id: "card",
    label: "Do peněženky",
    className:
      "left-[16%] top-[42%] h-[32%] w-[22%] sm:left-[18%] sm:top-[44%] sm:h-[30%] sm:w-[20%]",
  },
  {
    id: "chip",
    label: "Na stůl",
    className:
      "left-[44%] top-[52%] h-[22%] w-[14%] sm:left-[45%] sm:top-[54%] sm:h-[20%] sm:w-[12%]",
  },
  {
    id: "stand",
    label: "Na recepci",
    className:
      "left-[60%] top-[30%] h-[48%] w-[18%] sm:left-[61%] sm:top-[32%] sm:h-[46%] sm:w-[16%]",
  },
];

export function ProductFormsSection() {
  const [active, setActive] = useState<LayerId>("default");

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "1672 / 941" }}
    >
      {layers.map((layer, index) => (
        <Image
          key={layer.id}
          src={layer.src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`pointer-events-none object-cover transition-opacity duration-500 ease-out ${
            active === layer.id ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          aria-label={hotspot.label}
          className={`absolute z-10 cursor-pointer rounded-[1.25rem] bg-transparent ${hotspot.className}`}
          onMouseEnter={() => setActive(hotspot.id)}
          onMouseLeave={() => setActive("default")}
          onFocus={() => setActive(hotspot.id)}
          onBlur={() => setActive("default")}
        />
      ))}
    </section>
  );
}
