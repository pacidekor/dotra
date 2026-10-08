"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { chillax } from "@/lib/fonts";
import { createClient } from "@/utils/supabase/client";

export default function DashboardSettingsPage() {
  const { slug, userEmail } = useDashboard();
  const [host, setHost] = useState("");
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const publicPath = slug ? `/${slug}` : null;
  const publicUrl = publicPath
    ? host
      ? `${host}${publicPath}`
      : publicPath
    : null;

  async function copyPublicUrl() {
    if (!publicUrl) return;
    const full =
      typeof window !== "undefined"
        ? `${window.location.origin}${publicPath}`
        : publicUrl;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handlePasswordChange(event: FormEvent) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (password.length < 8) {
      setPasswordError("Heslo musí mít alespoň 8 znaků.");
      return;
    }
    if (password !== confirm) {
      setPasswordError("Hesla se neshodují.");
      return;
    }

    setPasswordSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setPasswordError(error.message);
      setPasswordSaving(false);
      return;
    }

    setPassword("");
    setConfirm("");
    setPasswordSuccess("Heslo bylo změněno.");
    setPasswordSaving(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/clear";
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1
          className={`${chillax.className} text-[clamp(1.75rem,3vw,2.35rem)] leading-[1.05] font-bold tracking-[-0.035em] text-foreground`}
        >
          Nastavení
        </h1>
        <p className="mt-2 text-[15px] text-foreground/55">
          Účet, veřejná adresa a odhlášení.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-black/[0.06] bg-white/90 p-4 sm:p-5">
        <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-foreground/45">
          Profil
        </h2>

        <div className="space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Veřejná URL
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl ?? "Nejdřív nastavte slug v Profilu"}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted outline-none"
            />
            <button
              type="button"
              disabled={!publicPath}
              onClick={() => void copyPublicUrl()}
              className="shrink-0 rounded-xl border border-border px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card disabled:opacity-50"
            >
              {copied ? "Zkopírováno" : "Kopírovat"}
            </button>
          </div>
          {publicPath ? (
            <p className="text-xs text-muted">
              Otevřít:{" "}
              <Link
                href={publicPath}
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                {publicPath}
              </Link>
              {" · "}
              <Link
                href="/dashboard/profil"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                Změnit slug
              </Link>
            </p>
          ) : (
            <p className="text-xs text-muted">
              Slug nastavíte v{" "}
              <Link
                href="/dashboard/profil"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                Profilu
              </Link>
              .
            </p>
          )}
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">E-mail</span>
          <input
            type="email"
            readOnly
            value={userEmail || "—"}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted outline-none"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-black/[0.06] bg-white/90 p-4 sm:p-5">
        <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-foreground/45">
          Změna hesla
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-3.5">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Nové heslo
            </span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full cursor-text rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground/30"
              placeholder="Minimálně 8 znaků"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Potvrzení hesla
            </span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="w-full cursor-text rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground/30"
              placeholder="Zopakujte heslo"
            />
          </label>

          {passwordError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {passwordError}
            </p>
          ) : null}

          {passwordSuccess ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800">
              {passwordSuccess}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={passwordSaving || !password}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {passwordSaving ? "Ukládám…" : "Uložit heslo"}
          </button>
        </form>
      </section>

      <section className="space-y-3 rounded-2xl border border-black/[0.06] bg-white/90 p-4 sm:p-5">
        <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-foreground/45">
          Relace
        </h2>
        <p className="text-sm text-foreground/55">
          Odhlášení ukončí session na tomto zařízení.
        </p>
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void handleLogout()}
          className="rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[#f5f5f7] disabled:opacity-70"
        >
          {loggingOut ? "Odhlašuji…" : "Odhlásit se"}
        </button>
      </section>
    </div>
  );
}
