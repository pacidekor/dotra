"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { chillax } from "@/lib/fonts";
import { createClient } from "@/utils/supabase/client";

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
  const { slug } = useDashboard();
  const [menuOpen, setMenuOpen] = useState(false);
  const publicHref = slug ? `/${slug}` : "/";

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/clear";
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-black/[0.06] bg-white/80 px-4 py-6 backdrop-blur-xl lg:flex">
        <Link
          href="/"
          className={`${chillax.className} mb-10 block px-2 text-[1.85rem] leading-none font-semibold tracking-[-0.04em] text-foreground lowercase`}
        >
          dotra.
        </Link>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <Link
            href={publicHref}
            className="block rounded-full bg-foreground px-3 py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Veřejný profil
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-full border border-black/[0.08] bg-white px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-[#f5f5f7] hover:text-foreground"
          >
            Odhlásit se
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            href="/"
            className={`${chillax.className} text-[1.55rem] leading-none font-semibold tracking-[-0.04em] text-foreground lowercase`}
          >
            dotra.
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full border border-black/[0.08] bg-white text-foreground transition-colors hover:bg-[#f5f5f7]"
            aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="fixed inset-x-0 top-14 bottom-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="animate-sheet-backdrop absolute inset-0 bg-black/40"
            aria-label="Zavřít menu"
            onClick={() => setMenuOpen(false)}
          />

          <div className="animate-menu-down relative z-10 flex max-h-[calc(100dvh-3.5rem)] flex-col border-b border-black/[0.06] bg-white shadow-[0_12px_32px_rgba(17,17,17,0.1)]">
            <nav
              className="flex flex-col gap-1 px-4 pt-3 pb-4"
              aria-label="Dashboard"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setMenuOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-auto space-y-2 border-t border-black/[0.06] px-4 pt-4 pb-4">
              <Link
                href={publicHref}
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-foreground px-3 py-3 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Veřejný profil
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void handleLogout();
                }}
                className="w-full rounded-full border border-black/[0.08] bg-white px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-[#f5f5f7]"
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
      className={`flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[#111111] text-white"
          : "text-foreground/65 hover:bg-[#f5f5f7] hover:text-foreground"
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
