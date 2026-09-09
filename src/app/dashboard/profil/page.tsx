"use client";

import { useState } from "react";
import { LinksEditor } from "@/components/dashboard/LinksEditor";
import { LivePreview } from "@/components/dashboard/LivePreview";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export default function DashboardProfilePage() {
  const { state, setProfile, setLinks, save, savedAt } = useDashboard();
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="space-y-6 pb-24 xl:space-y-8 xl:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Profil
          </h1>
          <p className="mt-1 text-sm text-muted">
            Uprav profil, fotky i karty odkazů.
          </p>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {savedAt ? (
            <span className="text-xs text-muted">
              Uloženo{" "}
              {savedAt.toLocaleTimeString("cs-CZ", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          ) : null}
          <button
            type="button"
            onClick={save}
            className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-card transition-colors hover:bg-accent-hover"
          >
            Uložit
          </button>
        </div>
      </div>

      {/* Mobile preview toggle */}
      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setPreviewOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground"
        >
          <span>Live preview</span>
          <span className="text-muted">{previewOpen ? "Skrýt" : "Zobrazit"}</span>
        </button>
        {previewOpen ? (
          <div className="mt-3">
            <LivePreview
              profile={state.profile}
              links={state.links}
              compact
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-7 sm:space-y-8">
          <section className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted">
              Základní údaje
            </h2>
            <ProfileEditor profile={state.profile} onChange={setProfile} />
          </section>

          <section className="space-y-3">
            <LinksEditor
              links={state.links}
              clicksByLink={state.stats.clicksByLink}
              onChange={setLinks}
            />
          </section>
        </div>

        <div className="hidden xl:block">
          <LivePreview profile={state.profile} links={state.links} />
        </div>
      </div>

      {/* Mobile sticky save */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <div className="flex items-center gap-3">
          {savedAt ? (
            <span className="min-w-0 flex-1 truncate text-xs text-muted">
              Uloženo{" "}
              {savedAt.toLocaleTimeString("cs-CZ", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          ) : (
            <span className="flex-1 text-xs text-muted">Neuložené změny</span>
          )}
          <button
            type="button"
            onClick={save}
            className="rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-card"
          >
            Uložit
          </button>
        </div>
      </div>
    </div>
  );
}
