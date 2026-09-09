import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#f5f5f7]">
      <div className="mx-auto flex w-[92%] max-w-[1700px] flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight">Dotra</p>
          <p className="mt-1 max-w-sm text-sm text-foreground/45">
            NFC karty a digitální profily pro lidi i podniky.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-foreground/50">
          <Link href="/login" className="hover:text-foreground">
            Přihlášení
          </Link>
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <a href="mailto:info@rezit.cz" className="hover:text-foreground">
            Kontakt
          </a>
          <p className="text-foreground/35">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
