"use client";

import { useState } from "react";
import { chillax } from "@/lib/fonts";

const faqs = [
  {
    q: "Potřebuje zákazník nějakou aplikaci?",
    a: "Ne. Stačí přiložit telefon — profil se otevře v prohlížeči. Bez stahování, bez registrace na straně zákazníka.",
  },
  {
    q: "S jakými telefony dotra funguje?",
    a: "S většinou moderních telefonů s NFC. Funguje na iPhonu i Androidu, bez speciální aplikace.",
  },
  {
    q: "Co všechno můžu přes dotru sdílet?",
    a: "Kontakt, web, menu nebo sociální sítě. Sami si vyberete, kam zákazníka po přiložení nasměrujete.",
  },
  {
    q: "Můžu později změnit obsah?",
    a: "Ano. Obsah profilu upravíte kdykoliv v dotra platformě — karta, kolečko i stojánek zůstávají stejné.",
  },
  {
    q: "Můžete připravit design podle naší značky?",
    a: "Ano. Logo, barvy i vizuál připravíme tak, aby dotra seděla k vaší značce.",
  },
  {
    q: "Platí se za dotru jednorázově, nebo měsíčně?",
    a: "Fyzickou dotru platíte jednorázově. Správa profilu a platforma běží podle zvoleného plánu.",
  },
] as const;

export function FaqSection() {
  const [open, setOpen] = useState(2);

  return (
    <section id="pouziti" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto w-[92%] max-w-[1700px]">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className="lg:sticky lg:top-28">
            <h2
              className={`${chillax.className} text-[clamp(2.2rem,5vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.035em]`}
            >
              Ještě vás možná zajímá.
            </h2>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-foreground/50 sm:mt-4 sm:text-lg">
              Vše důležité před prvním přiložením.
            </p>
          </div>

          <div>
            {faqs.map((item, index) => {
              const isOpen = open === index;

              return (
                <div
                  key={item.q}
                  className={
                    index > 0 ? "border-t border-black/[0.08]" : undefined
                  }
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="flex w-full cursor-pointer items-center gap-4 py-5 text-left sm:gap-6 sm:py-6"
                  >
                    <span className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors sm:size-9 ${
                        isOpen
                          ? "bg-[#ccfc4e] text-black"
                          : "bg-transparent text-foreground"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="size-4 sm:size-[1.125rem]"
                      >
                        {isOpen ? (
                          <line x1="6" y1="12" x2="18" y2="12" />
                        ) : (
                          <>
                            <line x1="12" y1="6" x2="12" y2="18" />
                            <line x1="6" y1="12" x2="18" y2="12" />
                          </>
                        )}
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-foreground/50 sm:pb-6 sm:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
