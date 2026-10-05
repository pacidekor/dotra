"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { chillax } from "@/lib/fonts";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-[92%] max-w-[1700px] items-center justify-between sm:h-[5.25rem]">
        <Link
          href="/"
          className={`${chillax.className} text-[1.75rem] leading-none font-semibold tracking-[-0.04em] text-foreground lowercase sm:text-[2.35rem]`}
        >
          dotra.
        </Link>

        <nav className="hidden items-center gap-11 text-[15px] font-medium tracking-wide text-foreground/60 lg:flex">
          <a
            href="#jak-to-funguje"
            className="transition-colors hover:text-foreground"
          >
            Jak to funguje
          </a>
          <a href="#cards" className="transition-colors hover:text-foreground">
            Produkty
          </a>
          <a
            href="#pouziti"
            className="transition-colors hover:text-foreground"
          >
            Pro podniky
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-full px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:px-4 sm:py-3 sm:text-base"
          >
            Přihlásit se
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#ccfc4e] px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-85 sm:px-7 sm:py-3.5 sm:text-base"
          >
            Registrovat
          </Link>
        </div>
      </div>
    </header>
  );
}
