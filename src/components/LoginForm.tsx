"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { chillax } from "@/lib/fonts";
import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("dotra_profiles")
      .select("onboarding_completed_at")
      .eq("id", data.user.id)
      .maybeSingle();

    router.push(profile?.onboarding_completed_at ? "/dashboard" : "/onboarding");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-6">
        <Link
          href="/"
          className={`${chillax.className} text-[1.85rem] leading-none font-semibold tracking-[-0.04em] text-foreground lowercase sm:text-[2.1rem]`}
        >
          dotra.
        </Link>

        <div className="space-y-2">
          <h1
            className={`${chillax.className} text-[clamp(1.85rem,4vw,2.35rem)] leading-[1.05] font-bold tracking-[-0.035em]`}
          >
            Vítejte zpět
          </h1>
          <p className="text-[15px] leading-relaxed text-foreground/55">
            Přihlaste se do dotra dashboardu a spravujte svůj profil.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-border bg-[#f7f7f8] px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground/25 focus:bg-white"
            placeholder="vas@email.cz"
          />
        </label>

        <label className="block space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-foreground">Heslo</span>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-border bg-[#f7f7f8] px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground/25 focus:bg-white"
            placeholder="••••••••"
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#ccfc4e] px-4 py-3.5 text-[15px] font-medium text-black transition-opacity hover:opacity-85 disabled:opacity-70"
      >
        {loading ? "Přihlašuji…" : "Přihlásit se"}
      </button>

      <p className="text-[15px] text-foreground/55">
        Nemáte účet?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          Registrovat
        </Link>
      </p>
    </form>
  );
}
