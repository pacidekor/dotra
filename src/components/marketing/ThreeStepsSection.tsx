"use client";

import Link from "next/link";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/marketing/ImagePlaceholder";
import { chillax } from "@/lib/fonts";

const steps = [
  {
    n: "01",
    title: "Vyberte si svou dotru.",
    text: "Karta do peněženky, kolečko na stůl, nebo stojánek na recepci. Forma, která sedne vašemu provozu.",
    cta: { label: "Prohlédnout produkty", href: "#cards" },
  },
  {
    n: "02",
    title: "Dejte jí vlastní styl.",
    text: "Vaše logo, barvy a obsah. Přesně tak, aby dotra patřila k vám.",
    cta: { label: "Prozkoumat možnosti", href: "/register" },
  },
  {
    n: "03",
    title: "Přiložte a sdílejte.",
    text: "Telefon se přiblíží a profil je venku. Bez aplikace, bez hledání QR kódu.",
    cta: { label: "Jak to funguje", href: "#jak-to-funguje" },
  },
] as const;

export function ThreeStepsSection() {
  const [open, setOpen] = useState(1);

  return (
    <section id="jak-to-funguje" className="scroll-mt-24 bg-white py-12 sm:py-24">
      <div className="mx-auto w-[92%] max-w-[1700px]">
        <div>
          <h2
            className={`${chillax.className} text-[clamp(1.85rem,7vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.035em] sm:whitespace-nowrap sm:leading-[1.02]`}
          >
            Vaše dotra. ve třech krocích.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/50 sm:mt-4 sm:text-lg">
            Od výběru po první přiložení
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="border-t border-black/[0.08]">
            {steps.map((step, index) => {
              const isOpen = open === index;

              return (
                <div key={step.n} className="border-b border-black/[0.08]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(index)}
                    className="flex w-full cursor-pointer items-center gap-3 py-5 text-left sm:gap-6 sm:py-7"
                  >
                    <span
                      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors sm:size-11 sm:text-base ${
                        isOpen
                          ? "bg-[#ccfc4e] text-black"
                          : "bg-transparent text-foreground/35"
                      }`}
                    >
                      {step.n}
                    </span>
                    <span className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
                      {step.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-2xl leading-none font-light text-foreground/40 sm:text-3xl"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex gap-3 pb-6 sm:gap-6 sm:pb-8">
                        <div className="flex w-9 shrink-0 justify-center sm:w-11">
                          {index < steps.length - 1 ? (
                            <span className="w-px bg-[#ccfc4e]" />
                          ) : null}
                        </div>
                        <div className="min-w-0 pb-1">
                          <p className="max-w-xl text-[15px] leading-relaxed text-foreground/50 sm:text-lg">
                            {step.text}
                          </p>
                          <Link
                            href={step.cta.href}
                            className="mt-4 inline-flex items-center gap-1.5 border-b border-foreground/80 pb-0.5 text-[15px] font-medium text-foreground transition-opacity hover:opacity-70 sm:mt-5 sm:text-base"
                          >
                            {step.cta.label}
                            <span aria-hidden="true">↗</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="order-first w-full overflow-hidden rounded-[1.5rem] lg:order-none sm:rounded-[1.75rem]">
            <ImagePlaceholder
              label="dotra ve třech krocích"
              aspect="aspect-[4/3] sm:aspect-[8/5]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
