"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-center">
        <Image
          src="/images/logodotra.webp"
          alt="dotra"
          width={180}
          height={64}
          priority
          className="h-12 w-auto object-contain"
        />
      </div>

      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Přihlášení</h1>
        <p className="text-sm text-muted">Vstup do dotra dashboardu</p>
      </div>

      <div className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
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
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
            placeholder="••••••••"
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-card transition-colors hover:bg-accent-hover disabled:opacity-70"
      >
        {loading ? "Přihlašuji…" : "Přihlásit"}
      </button>

      <p className="text-center text-sm text-muted">
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
