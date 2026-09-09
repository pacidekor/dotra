"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Frontend-only: zatím přesměrování do dashboardu
    router.push("/dashboard");
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

      <button
        type="submit"
        className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-card transition-colors hover:bg-accent-hover"
      >
        Přihlásit
      </button>
    </form>
  );
}
