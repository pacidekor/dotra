import Image from "next/image";
import Link from "next/link";
import { FaqSection } from "@/components/marketing/FaqSection";
import { ProductFormsSection } from "@/components/marketing/ProductFormsSection";
import { SimpleTouchSection } from "@/components/marketing/SimpleTouchSection";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { ThreeStepsSection } from "@/components/marketing/ThreeStepsSection";
import { chillax } from "@/lib/fonts";

const headline = chillax.className;

export default function Home() {
  return (
    <div className="min-h-dvh bg-white text-foreground">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white pt-[4.5rem] sm:pt-[5.25rem]">
          <div className="mx-auto w-[92%] max-w-[1700px] pt-6 pb-4 text-center sm:pt-10 sm:pb-6 lg:pt-12">
            <h1
              className={`${headline} animate-reveal-title mx-auto flex w-full max-w-5xl flex-col items-center gap-1 text-[clamp(2.35rem,9vw,7rem)] leading-[0.98] font-bold tracking-[-0.035em] uppercase sm:gap-2`}
            >
              <span>Jedno přiložení.</span>
              <span className="sm:whitespace-nowrap">Spousta možností.</span>
            </h1>
            <p className="animate-reveal-subtitle mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/55 sm:mt-5 sm:text-[17px] sm:text-xl">
              Menu, osobní profil, kontakty, Wi-Fi i recenze. Vše, co chcete
              sdílet. Na jedno přiložení telefonu.
            </p>
            <div
              className="animate-reveal-fade mt-5 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-6 sm:w-auto sm:flex-row sm:items-center"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#ccfc4e] px-8 text-[15px] font-medium text-black transition-opacity hover:opacity-85 sm:h-14 sm:px-9 sm:text-base"
              >
                Pořídit dotru.
              </Link>
              <a
                href="#jak-to-funguje"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#f5f5f7] px-7 text-[15px] font-medium text-foreground transition-colors hover:bg-[#ececef] sm:h-14"
              >
                Jak to funguje
              </a>
            </div>
          </div>

          <div
            className="animate-reveal-banner mx-auto w-[min(96%,1100px)] sm:w-[min(92%,1280px)]"
            style={{ animationDelay: "80ms" }}
          >
            <Image
              src="/images/dotraheroilustracefixed.webp"
              alt="dotra card a telefon"
              width={2100}
              height={900}
              priority
              className="h-auto w-full object-contain"
              sizes="(max-width: 1280px) 96vw, 1280px"
            />
          </div>
          <div className="h-8 bg-white sm:h-14" />
        </section>

        {/* Co všechno zvládne */}
        <section className="bg-white py-12 sm:py-24">
          <div className="mx-auto w-[92%] max-w-[1700px]">
            <h2
              className={`${headline} max-w-5xl text-[clamp(1.85rem,7vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.035em]`}
            >
              Co všechno zvládne jedno přiložení.
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
              {[
                {
                  title: "Kontakt, který nezapadne.",
                  subtitle: "Sdílejte kontakt, web i sociální sítě.",
                  image: "/images/img1.webp",
                },
                {
                  title: "Váš podnik. Na jednom místě.",
                  subtitle: "Menu, sociální sítě i kontakt.",
                  image: "/images/img2.webp",
                },
                {
                  title: "Malý dotek. Hotovo.",
                  subtitle: "Usnadněte přístup k Wi-Fi i recenzím.",
                  image: "/images/img3.webp",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`group relative flex min-h-[22rem] cursor-pointer flex-col overflow-hidden rounded-[1.5rem] bg-cover bg-center bg-no-repeat p-5 sm:aspect-[4/5] sm:min-h-0 sm:rounded-[1.75rem] sm:p-7 lg:p-8`}
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <h3
                    className={`${headline} text-[clamp(1.35rem,4vw,1.65rem)] leading-tight font-semibold tracking-[-0.03em] sm:whitespace-nowrap sm:text-[clamp(0.95rem,1.9vw,1.65rem)]`}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground/50 sm:mt-3 sm:text-base">
                    {item.subtitle}
                  </p>
                  <div className="mt-auto flex justify-end pt-4">
                    <span className="inline-flex h-10 items-center overflow-hidden rounded-full bg-white transition-colors duration-300 ease-out group-hover:bg-[#ccfc4e] sm:h-11 lg:h-12">
                      <span className="inline-flex max-w-0 items-center overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-w-[7.5rem] group-hover:opacity-100 group-hover:pl-4">
                        <span className="whitespace-nowrap text-[13px] font-medium text-black sm:text-sm">
                          Zjistit více
                        </span>
                      </span>
                      <span className="inline-flex size-10 shrink-0 items-center justify-center sm:size-11 lg:size-12">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-[1.1rem] text-black transition-transform duration-300 ease-out group-hover:-rotate-45 sm:size-5 lg:size-6"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intro sekce */}
        <ProductFormsSection />

        <ThreeStepsSection />

        <SimpleTouchSection />

        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
