"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { chillax } from "@/lib/fonts";
import { createClient } from "@/utils/supabase/client";

const inputClassName =
  "w-full cursor-text rounded-xl border border-[#e5e5e8] bg-white px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground/30";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const origin = window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      },
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="space-y-7">
        <div className="space-y-1.5">
          <h1
            className={`${chillax.className} text-[clamp(1.75rem,3.5vw,2.15rem)] leading-[1.05] font-bold tracking-[-0.035em]`}
          >
            Zkontrolujte e-mail
          </h1>
          <p className="text-[15px] leading-relaxed text-foreground/55">
            Pokud účet s adresou{" "}
            <span className="font-medium text-foreground">{email}</span>{" "}
            existuje, poslali jsme odkaz pro obnovení hesla.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-full bg-[#ccfc4e] px-4 py-3.5 text-[15px] font-medium text-black transition-opacity hover:opacity-85"
        >
          Zpět na přihlášení
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="space-y-1.5">
        <h1
          className={`${chillax.className} text-[clamp(1.75rem,3.5vw,2.15rem)] leading-[1.05] font-bold tracking-[-0.035em]`}
        >
          Zapomenuté heslo
        </h1>
        <p className="text-[15px] leading-relaxed text-foreground/55">
          Zadejte e-mail a pošleme vám odkaz pro nastavení nového hesla.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-foreground">E-mail</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
          placeholder="vas@email.cz"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#ccfc4e] px-4 py-3.5 text-[15px] font-medium text-black transition-opacity hover:opacity-85 disabled:opacity-70"
      >
        {loading ? "Odesílám…" : "Poslat odkaz"}
      </button>

      <p className="text-center text-[15px] text-foreground/55">
        Vzpomněli jste si?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          Přihlásit se
        </Link>
      </p>
    </form>
  );
}
