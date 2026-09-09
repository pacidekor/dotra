import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-[92%] max-w-[1700px] items-center justify-between sm:h-[4.25rem]">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logodotra.webp"
            alt="Dotra"
            width={140}
            height={48}
            priority
            className="h-8 w-auto object-contain sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-10 text-[13px] font-medium tracking-wide text-foreground/60 lg:flex">
          <a href="#jak-to-funguje" className="transition-colors hover:text-foreground">
            Jak to funguje
          </a>
          <a href="#cards" className="transition-colors hover:text-foreground">
            Dotra Cards
          </a>
          <a href="#pouziti" className="transition-colors hover:text-foreground">
            Použití
          </a>
          <a href="#platforma" className="transition-colors hover:text-foreground">
            Platforma
          </a>
        </nav>

        <Link
          href="/login"
          className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-80"
        >
          Přihlásit
        </Link>
      </div>
    </header>
  );
}
