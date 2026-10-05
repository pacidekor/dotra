"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { chillax } from "@/lib/fonts";
import { createClient } from "@/utils/supabase/client";

const inputClassName =
  "w-full cursor-text rounded-xl border border-[#e5e5e8] bg-white px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-foreground/30";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků.");
      return;
    }

    if (password !== confirm) {
      setError("Hesla se neshodují.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(
        "Odkaz vypršel nebo je neplatný. Požádejte o nový odkaz pro obnovení hesla.",
      );
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("dotra_profiles")
      .select("onboarding_completed_at")
      .eq("id", user.id)
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
          Nové heslo
        </h1>
        <p className="text-[15px] leading-relaxed text-foreground/55">
          Zvolte si nové heslo pro svůj dotra účet.
        </p>
      </div>

      <div className="space-y-3.5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Nové heslo</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            placeholder="Minimálně 8 znaků"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Potvrzení hesla
          </span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className={inputClassName}
            placeholder="Zopakujte heslo"
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
        className="w-full rounded-full bg-[#ccfc4e] px-4 py-3.5 text-[15px] font-medium text-black transition-opacity hover:opacity-85 disabled:opacity-70"
      >
        {loading ? "Ukládám…" : "Uložit heslo"}
      </button>

      <p className="text-center text-[15px] text-foreground/55">
        <Link
          href="/forgot-password"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          Poslat nový odkaz
        </Link>
      </p>
    </form>
  );
}
