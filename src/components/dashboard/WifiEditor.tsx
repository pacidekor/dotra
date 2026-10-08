"use client";

import type { WifiConfig } from "@/data/types";

type WifiEditorProps = {
  wifi?: WifiConfig;
  onChange: (wifi: WifiConfig | undefined) => void;
};

export function WifiEditor({ wifi, onChange }: WifiEditorProps) {
  const active = wifi !== undefined;

  return (
    <section className="space-y-4 rounded-2xl border border-black/[0.06] bg-white/90 p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-foreground">Wi‑Fi</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Hosté se připojí QR kódem z veřejného profilu. Při uložení se
            automaticky přidá odkaz s ikonou Wi‑Fi, pokud chybí.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          onClick={() => {
            if (active) {
              onChange(undefined);
              return;
            }
            onChange({
              ssid: "",
              password: "",
              encryption: "WPA",
            });
          }}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            active ? "bg-[#ccfc4e]" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform ${
              active ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {wifi !== undefined ? (
        <div className="space-y-3.5">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">
              Název sítě (SSID)
            </span>
            <input
              type="text"
              value={wifi.ssid}
              onChange={(event) =>
                onChange({ ...wifi, ssid: event.target.value })
              }
              className="w-full cursor-text rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground/30"
              placeholder="MojeWiFi"
              autoComplete="off"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">Heslo</span>
            <input
              type="text"
              value={wifi.password}
              onChange={(event) =>
                onChange({ ...wifi, password: event.target.value })
              }
              className="w-full cursor-text rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground/30"
              placeholder="Heslo k síti"
              autoComplete="off"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">Zabezpečení</span>
            <select
              value={wifi.encryption || "WPA"}
              onChange={(event) =>
                onChange({
                  ...wifi,
                  encryption: event.target.value as WifiConfig["encryption"],
                })
              }
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground/30"
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Bez hesla</option>
            </select>
          </label>
        </div>
      ) : null}
    </section>
  );
}
