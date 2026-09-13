"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError(
        "Účet je vytvořený, ale chybí session. Vypněte Confirm email v Supabase Auth, nebo potvrďte e-mail.",
      );
      setLoading(false);
      return;
    }

    // Trigger may lag — ensure profile row exists
    await supabase.from("dotra_profiles").upsert({ id: data.user!.id });

    router.push("/onboarding");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-center">
        <Image
          src="/images/logodotra.webp"
          alt="Dotra"
          width={180}
          height={64}
          priority
          className="h-12 w-auto object-contain"
        />
      </div>

      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Registrace</h1>
        <p className="text-sm text-muted">
          Vytvořte účet a nastavte si Dotra profil.
        </p>
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
            placeholder="Minimálně 8 znaků"
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
        {loading ? "Vytvářím účet…" : "Registrovat"}
      </button>

      <p className="text-center text-sm text-muted">
        Už máte účet?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-2 hover:underline">
          Přihlásit
        </Link>
      </p>
    </form>
  );
}
