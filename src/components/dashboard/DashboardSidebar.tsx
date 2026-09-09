"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const navItems: {
  href: string;
  label: string;
  exact?: boolean;
  icon: ReactNode;
}[] = [
  {
    href: "/dashboard",
    label: "Statistiky",
    exact: true,
    icon: <ChartIcon />,
  },
  {
    href: "/dashboard/profil",
    label: "Profil",
    icon: <ProfileIcon />,
  },
  {
    href: "/dashboard/nastaveni",
    label: "Nastavení",
    icon: <SettingsIcon />,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
        <Link href="/" className="mb-10 block px-2">
          <Image
            src="/images/logodotra.webp"
            alt="Dotra"
            width={200}
            height={72}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <Link
            href="/rezit"
            className="block rounded-xl border border-border px-3 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Veřejný profil
          </Link>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-xl bg-foreground px-3 py-2.5 text-sm font-medium text-card transition-colors hover:bg-accent-hover"
          >
            Odhlásit se
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logodotra.webp"
              alt="Dotra"
              width={140}
              height={48}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-surface"
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </div>
      </header>

      {/* Mobile burger menu — pod headerem */}
      {menuOpen ? (
        <div className="fixed inset-x-0 top-14 bottom-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="animate-sheet-backdrop absolute inset-0 bg-black/40"
            aria-label="Zavřít menu"
            onClick={() => setMenuOpen(false)}
          />

          <div className="animate-menu-down relative z-10 flex max-h-[calc(100dvh-3.5rem)] flex-col border-b border-border bg-card shadow-[0_12px_32px_rgba(17,17,17,0.1)]">
            <nav className="flex flex-col gap-1 px-4 pt-3 pb-4" aria-label="Dashboard">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setMenuOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto space-y-2 border-t border-border px-4 pt-4 pb-4">
              <Link
                href="/rezit"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl border border-border px-3 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                Veřejný profil
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full rounded-xl bg-foreground px-3 py-3 text-sm font-medium text-card transition-colors hover:bg-accent-hover"
              >
                Odhlásit se
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-foreground text-card"
          : "text-foreground/75 hover:bg-surface hover:text-foreground"
      }`}
    >
      <span className="opacity-90">{item.icon}</span>
      {item.label}
    </Link>
  );
}

function BurgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 19V5" strokeLinecap="round" />
      <path d="M4 19h16" strokeLinecap="round" />
      <path d="M8 15v-4" strokeLinecap="round" />
      <path d="M12 15V8" strokeLinecap="round" />
      <path d="M16 15v-7" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M17.8 6.2l-1.4 1.4M7.6 16.4l-1.4 1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
