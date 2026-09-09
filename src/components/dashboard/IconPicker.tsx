"use client";

import { LinkIconGlyph } from "@/components/LinkIcons";
import { ICON_OPTIONS } from "@/data/dashboard-mock";
import type { LinkIcon } from "@/data/types";

type IconPickerProps = {
  value: LinkIcon;
  onChange: (icon: LinkIcon) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ICON_OPTIONS.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            title={option.label}
            onClick={() => onChange(option.id)}
            className={`flex min-h-11 aspect-square items-center justify-center rounded-xl border transition-colors ${
              selected
                ? "border-foreground bg-foreground text-card"
                : "border-border bg-card text-foreground hover:border-foreground/30"
            }`}
          >
            <LinkIconGlyph name={option.id} />
          </button>
        );
      })}
    </div>
  );
}
