"use client";

import { useState } from "react";
import { chillax } from "@/lib/fonts";

const faqs = [
  {
    q: "Potřebuje zákazník nějakou aplikaci?",
    a: "Ne. Stačí přiložit telefon — profil se otevře v prohlížeči. Bez stahování, bez registrace na straně zákazníka.",
  },
  {
    q: "S jakými telefony Dotra funguje?",
    a: "S většinou moderních telefonů s NFC. Funguje na iPhonu i Androidu, bez speciální aplikace.",
  },
  {
    q: "Co všechno můžu přes Dotru sdílet?",
    a: "Kontakt, web, menu nebo sociální sítě. Sami si vyberete, kam zákazníka po přiložení nasměrujete.",
  },
  {
    q: "Můžu později změnit obsah?",
    a: "Ano. Obsah profilu upravíte kdykoliv v Dotra platformě — karta, kolečko i stojánek zůstávají stejné.",
  },
  {
    q: "Můžete připravit design podle naší značky?",
    a: "Ano. Logo, barvy i vizuál připravíme tak, aby Dotra seděla k vaší značce.",
  },
  {
    q: "Platí se za Dotru jednorázově, nebo měsíčně?",
    a: "Fyzickou Dotru platíte jednorázově. Správa profilu a platforma běží podle zvoleného plánu.",
  },
] as const;

export function FaqSection() {
  const [open, setOpen] = useState(2);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto w-[92%] max-w-[1700px]">
        <div className="grid items-start gap-10 lg:grid-cols-[0.3fr_0.7fr] lg:gap-14 xl:gap-20">
          <div className="lg:sticky lg:top-28">
            <h2
              className={`${chillax.className} text-[clamp(2.2rem,5vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.035em]`}
            >
              Často se ptáte.
            </h2>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-foreground/50 sm:mt-4 sm:text-lg">
              To nejdůležitější kolem Dotry na jednom místě.
            </p>
          </div>

          <div className="border-t border-black/[0.08]">
            {faqs.map((item, index) => {
              const isOpen = open === index;

              return (
                <div key={item.q} className="border-b border-black/[0.08]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="flex w-full items-center gap-4 py-5 text-left sm:gap-6 sm:py-6"
                  >
                    <span className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xl leading-none transition-colors sm:size-9 sm:text-2xl ${
                        isOpen
                          ? "bg-[#ccfc4e] font-medium text-black"
                          : "bg-transparent font-light text-foreground"
                      }`}
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
