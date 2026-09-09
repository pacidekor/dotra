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

type DashboardContextValue = {
  state: DashboardState;
  setProfile: (profile: Profile) => void;
  setLinks: (links: ProfileLink[]) => void;
  save: () => void;
  savedAt: Date | null;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialDashboardState);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const setProfile = useCallback((profile: Profile) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const setLinks = useCallback((links: ProfileLink[]) => {
    setState((prev) => ({ ...prev, links }));
  }, []);

  const save = useCallback(() => {
    // Frontend-only: zatím jen potvrzení uložení
    setSavedAt(new Date());
  }, []);

  const value = useMemo(
    () => ({ state, setProfile, setLinks, save, savedAt }),
    [state, setProfile, setLinks, save, savedAt],
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
