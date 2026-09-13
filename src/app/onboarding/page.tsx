import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { DotraLinkRow, DotraProfileRow } from "@/lib/dotra-profile";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Nastavení profilu | Dotra",
  description: "Onboarding Dotra profilu",
};

function emptyProfile(userId: string): DotraProfileRow {
  return {
    id: userId,
    slug: null,
    display_name: "",
    tagline: "",
    avatar_path: null,
    banner_path: null,
    onboarding_completed_at: null,
  };
}

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error: upsertError } = await supabase
    .from("dotra_profiles")
    .upsert({ id: user.id });

  const { data: profile, error: profileError } = await supabase
    .from("dotra_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (upsertError || profileError) {
    console.error("Onboarding profile load failed", upsertError || profileError);
  }

  const { data: links } = await supabase
    .from("dotra_links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-dvh bg-background px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logodotra.webp"
          alt="Dotra"
          className="h-9 w-auto object-contain"
        />
      </div>
      {(upsertError || profileError) && !profile ? (
        <div className="mx-auto mb-6 max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Nepodařilo se načíst profil z databáze. Ověř, že je spuštěná migrace
          `dotra_profiles` v Supabase projektu Dotra.
        </div>
      ) : null}
      <OnboardingWizard
        userId={user.id}
        initialProfile={(profile as DotraProfileRow) ?? emptyProfile(user.id)}
        initialLinks={(links ?? []) as DotraLinkRow[]}
      />
    </main>
  );
}
