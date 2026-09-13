"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialDashboardState,
  type DashboardState,
} from "@/data/dashboard-mock";
import type { Profile, ProfileLink } from "@/data/types";
import { createClient } from "@/utils/supabase/client";

type DashboardContextValue = {
  state: DashboardState;
  profileId: string;
  slug: string | null;
  setProfile: (profile: Profile) => void;
  setLinks: (links: ProfileLink[]) => void;
  save: () => Promise<void>;
  savedAt: Date | null;
  saving: boolean;
  saveError: string | null;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

type DashboardProviderProps = {
  children: ReactNode;
  profileId: string;
  slug: string | null;
  initialProfile: Profile;
  initialLinks: ProfileLink[];
};

export function DashboardProvider({
  children,
  profileId,
  slug,
  initialProfile,
  initialLinks,
}: DashboardProviderProps) {
  const [state, setState] = useState<DashboardState>({
    ...initialDashboardState,
    profile: initialProfile,
    links: initialLinks,
  });
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const setProfile = useCallback((profile: Profile) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const setLinks = useCallback((links: ProfileLink[]) => {
    setState((prev) => ({ ...prev, links }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();

    try {
      const { error: profileError } = await supabase
        .from("dotra_profiles")
        .update({
          display_name: state.profile.name,
          tagline: state.profile.tagline,
        })
        .eq("id", profileId);

      if (profileError) throw profileError;

      await supabase.from("dotra_links").delete().eq("profile_id", profileId);

      const rows = state.links.map((link, index) => ({
        profile_id: profileId,
        label: link.label,
        href: link.href,
        description: link.description,
        icon: link.icon,
        sort_order: index,
        enabled: true,
      }));

      if (rows.length > 0) {
        const { error: linksError } = await supabase
          .from("dotra_links")
          .insert(rows);
        if (linksError) throw linksError;
      }

      setSavedAt(new Date());
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Uložení selhalo.");
    } finally {
      setSaving(false);
    }
  }, [profileId, state.links, state.profile.name, state.profile.tagline]);

  const value = useMemo(
    () => ({
      state,
      profileId,
      slug,
      setProfile,
      setLinks,
      save,
      savedAt,
      saving,
      saveError,
    }),
    [
      state,
      profileId,
      slug,
      setProfile,
      setLinks,
      save,
      savedAt,
      saving,
      saveError,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
