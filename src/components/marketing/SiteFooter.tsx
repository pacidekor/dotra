import Link from "next/link";
import { chillax } from "@/lib/fonts";

export function SiteFooter() {
  return (
    <footer className="bg-[#f5f5f7] text-foreground">
      <div className="mx-auto w-[92%] max-w-[1700px]">
        {/* CTA */}
        <div className="flex flex-col gap-6 border-b border-black/[0.08] py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <h2
            className={`${chillax.className} text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.035em]`}
          >
            Najděte svou Dotru.
          </h2>
          <Link
            href="#cards"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#ccfc4e] px-7 text-[15px] font-medium text-black transition-opacity hover:opacity-85 sm:h-14 sm:self-auto sm:px-8 sm:text-base"
          >
            Prohlédnout produkty
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-[1.4fr_1fr_1fr_0.6fr] lg:gap-8">
          <p
            className={`${chillax.className} max-w-xs text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-3xl`}
          >
            Malé přiložení.
            <br />
            Velké možnosti.
          </p>

          <div>
            <p className="text-[12px] font-medium tracking-[0.18em] text-foreground/40 uppercase">
              Produkty
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-foreground">
              <li>
                <a href="#cards" className="transition-opacity hover:opacity-60">
                  NFC karty
                </a>
              </li>
              <li>
                <a href="#cards" className="transition-opacity hover:opacity-60">
                  NFC kolečka
                </a>
              </li>
              <li>
                <a href="#cards" className="transition-opacity hover:opacity-60">
                  Stojánky
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-medium tracking-[0.18em] text-foreground/40 uppercase">
              Dotra
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-foreground">
              <li>
                <a
                  href="#jak-to-funguje"
                  className="transition-opacity hover:opacity-60"
                >
                  Jak to funguje
                </a>
              </li>
              <li>
                <a href="#pouziti" className="transition-opacity hover:opacity-60">
                  Časté dotazy
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@rezit.cz"
                  className="transition-opacity hover:opacity-60"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant brand */}
        <div className="@container w-full overflow-hidden pb-4 pt-2 sm:pb-6 sm:pt-4">
          <p
            className={`${chillax.className} w-full whitespace-nowrap text-[22.5cqw] leading-[0.8] font-bold tracking-[-0.07em] lowercase`}
          >
            dotra.
          </p>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-black/[0.08] py-6 text-sm text-foreground/40 sm:flex-row sm:items-center sm:justify-between sm:py-7">
          <p>© {new Date().getFullYear()} Dotra</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="transition-colors hover:text-foreground">
              Obchodní podmínky
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Ochrana soukromí
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Nastavení cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
