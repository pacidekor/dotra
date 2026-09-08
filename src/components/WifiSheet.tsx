"use client";

import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { WifiConfig } from "@/data/types";

type WifiSheetProps = {
  open: boolean;
  onClose: () => void;
  wifi: WifiConfig;
  networkName?: string;
};

function buildWifiQrValue({
  ssid,
  password,
  encryption = "WPA",
}: WifiConfig): string {
  const escape = (value: string) =>
    value.replace(/([\\;,:"])/g, "\\$1");

  return `WIFI:T:${encryption};S:${escape(ssid)};P:${escape(password)};;`;
}

export function WifiSheet({ open, onClose, wifi, networkName }: WifiSheetProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const qrValue = buildWifiQrValue(wifi);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="wifi-sheet-title">
      <button
        type="button"
        className="animate-sheet-backdrop absolute inset-0 bg-black/40"
        aria-label="Zavřít"
        onClick={onClose}
      />

      <div className="animate-sheet-up absolute inset-x-0 bottom-0 w-full rounded-t-[1.75rem] bg-card pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(26,37,51,0.18)]">
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-border" aria-hidden />
        </div>

        <div className="px-6 pt-5 pb-2 text-left">
          <h2
            id="wifi-sheet-title"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Připojení k Wi‑Fi
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Připojte se k síti{" "}
            <span className="font-medium text-foreground">
              {networkName ?? wifi.ssid}
            </span>{" "}
            pomocí QR kódu níže.
          </p>
        </div>

        <div className="mx-6 mt-4 flex flex-col items-center rounded-2xl border border-border bg-surface px-5 py-6">
          <div className="rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(26,37,51,0.06)]">
            <QRCodeSVG
              value={qrValue}
              size={180}
              level="M"
              marginSize={0}
              bgColor="#ffffff"
              fgColor="#1a2533"
            />
          </div>

          <p className="mt-5 max-w-[16.5rem] text-center text-sm leading-relaxed text-muted">
            Klepněte a podržte QR kód cca 5 sekund pro připojení k Wi‑Fi síti.
          </p>
        </div>

        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-white"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
}
