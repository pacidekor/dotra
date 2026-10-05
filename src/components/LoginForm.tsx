"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { chillax } from "@/lib/fonts";
import { createClient } from "@/utils/supabase/client";

const inputClassName =
  "w-full rounded-xl border border-[#e5e5e8] bg-white px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground/30";

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
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="space-y-1.5">
        <h1
          className={`${chillax.className} text-[clamp(1.75rem,3.5vw,2.15rem)] leading-[1.05] font-bold tracking-[-0.035em]`}
        >
          Vítejte zpět
        </h1>
        <p className="text-[15px] leading-relaxed text-foreground/55">
          Přihlaste se do svého účtu.
        </p>
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
            className={inputClassName}
            placeholder="vas@email.cz"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Heslo</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            placeholder="••••••••"
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-foreground px-4 py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {loading ? "Přihlašuji…" : "Přihlásit se"}
      </button>

      <p className="text-center text-[15px] text-foreground/55">
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
