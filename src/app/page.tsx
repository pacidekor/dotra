import Link from "next/link";
import { ImagePlaceholder } from "@/components/marketing/ImagePlaceholder";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export default function Home() {
  return (
    <div className="min-h-dvh bg-white text-foreground">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#f5f5f7] pt-16 sm:pt-[4.25rem]">
          <div className="mx-auto w-[92%] max-w-[1700px] pt-14 pb-10 text-center sm:pt-20 sm:pb-14 lg:pt-24">
            <p className="animate-reveal-fade text-[13px] font-medium tracking-[0.22em] text-foreground/40 uppercase">
              Dotra Cards
            </p>
            <h1 className="animate-reveal-title mx-auto mt-5 max-w-4xl text-[clamp(2.6rem,6.5vw,5.75rem)] leading-[0.98] font-semibold tracking-[-0.03em]">
              Nový způsob,
              <br />
              jak se předat dál.
            </h1>
            <p className="animate-reveal-subtitle mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-foreground/55 sm:text-xl">
              NFC kartička otevře váš Dotra profil. Osobní vizitka, podnik,
              recenze nebo menu — pořadí si nastavíte podle toho, co má přijít
              jako první.
            </p>
            <div
              className="animate-reveal-fade mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                Chci Dotra Cards
              </Link>
              <a
                href="#jak-to-funguje"
                className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                Jak to funguje
              </a>
            </div>
          </div>

          <div
            className="animate-reveal-banner mx-auto w-[92%] max-w-[1700px]"
            style={{ animationDelay: "80ms" }}
          >
            <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
              <ImagePlaceholder
                label="Dotra Card + telefon"
                aspect="aspect-[16/9]"
                className="w-full sm:aspect-[21/9]"
              />
            </div>
          </div>
          <div className="h-16 bg-gradient-to-b from-transparent to-white sm:h-24" />
        </section>

        {/* Jak to funguje */}
        <section
          id="jak-to-funguje"
          className="scroll-mt-24 border-t border-black/[0.04] bg-white py-20 sm:py-28"
        >
          <div className="mx-auto w-[92%] max-w-[1700px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Tři vteřiny
                <span className="text-foreground/35"> od kontaktu k akci.</span>
              </h2>
              <p className="max-w-md text-base leading-relaxed text-foreground/50 sm:text-lg">
                Bez aplikace. Bez QR kódu, který nikdo nehledá. Stačí přiložit
                telefon k Dotra Card.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
              {[
                {
                  n: "01",
                  title: "Přiložení",
                  text: "Telefon se přiblíží ke kartě. NFC otevře odkaz na váš Dotra profil.",
                },
                {
                  n: "02",
                  title: "Profil",
                  text: "Načte se stránka přesně podle účelu — osoba, podnik, služba.",
                },
                {
                  n: "03",
                  title: "Akce",
                  text: "Recenze, web, kontakt, menu. To důležité je nahoře, zbytek pod tím.",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  className="rounded-[1.5rem] bg-[#f5f5f7] px-6 py-7 sm:px-8 sm:py-9"
                >
                  <p className="text-[13px] font-medium tracking-[0.2em] text-foreground/30">
                    {item.n}
                  </p>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/50">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cards produkt */}
        <section
          id="cards"
          className="scroll-mt-24 bg-[#f5f5f7] py-20 sm:py-28"
        >
          <div className="mx-auto w-[92%] max-w-[1700px]">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div>
                <p className="text-[13px] font-medium tracking-[0.2em] text-foreground/35 uppercase">
                  Dotra Cards
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                  Fyzická karta,
                  <br />
                  která se nemění.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground/50 sm:text-lg">
                  Čip zůstává. Profil na platformě Dotra upravíte kdykoliv —
                  texty, odkazy, banner i pořadí. Karta v kapse nebo na stole
                  funguje pořád stejně.
                </p>
              </div>
              <div className="overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
                <ImagePlaceholder
                  label="Produktové foto Dotra Cards"
                  aspect="aspect-[16/10]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Použití */}
        <section
          id="pouziti"
          className="scroll-mt-24 bg-white py-20 sm:py-28"
        >
          <div className="mx-auto w-[92%] max-w-[1700px]">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Stejná karta.
                <span className="text-foreground/35"> Jiný záměr.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/50 sm:text-lg">
                Dotra dává smysl tehdy, když víte, co má druhá strana udělat po
                přiložení. Proto se profil staví kolem cíle — ne kolem seznamu
                odkazů.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {[
                {
                  tag: "Osobní",
                  title: "Vizitka, která se neztratí",
                  text: "Networking bez papíru. Web, telefon, sociální sítě — v pořadí, které reprezentuje vás.",
                  label: "Osobní profil",
                },
                {
                  tag: "Podnik",
                  title: "Recenze jako první krok",
                  text: "Host přiloží kartu a rovnou může ohodnotit. Ideální pro restaurace, salony i služby.",
                  label: "Podnik / recenze",
                },
                {
                  tag: "Provoz",
                  title: "Menu, Wi‑Fi, kontakt",
                  text: "Na stole leží karta. Hosté mají denní menu, síť i Instagram bez ptaní personálu.",
                  label: "Provoz / služby",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="flex flex-col overflow-hidden rounded-[1.75rem] bg-[#f5f5f7]"
                >
                  <ImagePlaceholder
                    label={item.label}
                    aspect="aspect-[5/4]"
                    className="rounded-none"
                  />
                  <div className="flex flex-1 flex-col px-6 py-7 sm:px-7">
                    <p className="text-[12px] font-medium tracking-[0.18em] text-foreground/35 uppercase">
                      {item.tag}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-foreground/50">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Platforma */}
        <section
          id="platforma"
          className="scroll-mt-24 bg-[#f5f5f7] py-20 sm:py-28"
        >
          <div className="mx-auto w-[92%] max-w-[1700px]">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
              <div>
                <p className="text-[13px] font-medium tracking-[0.2em] text-foreground/35 uppercase">
                  Platforma
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                  Pod každou kartou běží Dotra.
                </h2>
              </div>
              <p className="max-w-md text-base leading-relaxed text-foreground/50 sm:text-lg lg:justify-self-end">
                Správa profilu, pořadí odkazů a základní analytika. Karta je
                vstup. Platforma je kontrola.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-[1.75rem] sm:mt-14 sm:rounded-[2rem]">
              <ImagePlaceholder
                label="Dotra dashboard"
                aspect="aspect-[16/9]"
              />
            </div>

            <div className="mt-10 grid gap-8 border-t border-black/[0.06] pt-10 sm:grid-cols-3 sm:gap-10">
              {[
                {
                  title: "Živé úpravy",
                  text: "Změňte obsah profilu bez výměny karty. Platí hned.",
                },
                {
                  title: "Vlastní priorita",
                  text: "Recenze nahoru, vizitka jinak. Sestavíte tok podle cíle.",
                },
                {
                  title: "Přehled použití",
                  text: "Vidíte návštěvy a prokliky — co lidé po přiložení dělají.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/50 sm:text-[15px]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto w-[92%] max-w-[1700px]">
            <div className="flex flex-col gap-8 rounded-[1.75rem] bg-foreground px-7 py-14 text-white sm:rounded-[2rem] sm:px-12 sm:py-20 lg:flex-row lg:items-end lg:justify-between lg:px-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                  Připraveni nahradit
                  <br />
                  papír a QR chaos?
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">
                  Dotra Cards + platforma Dotra. Pro lidi a podniky, které chtějí
                  čistý první kontakt.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                Chci začít
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
