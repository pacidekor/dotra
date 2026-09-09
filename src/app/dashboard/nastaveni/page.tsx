"use client";

export default function DashboardSettingsPage() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Nastavení
        </h1>
        <p className="mt-1 text-sm text-muted">
          Základní nastavení účtu — zatím frontend placeholder.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Veřejná URL
          </span>
          <input
            type="text"
            defaultValue="dotra.vercel.app/rezit"
            readOnly
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-muted outline-none"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">E-mail</span>
          <input
            type="email"
            defaultValue="info@rezit.cz"
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>

        <button
          type="button"
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Odhlásit se
        </button>
      </div>
    </div>
  );
}
