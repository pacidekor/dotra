"use client";

import { useState } from "react";
import type { ContactConfig } from "@/data/types";
import {
  buildVCard,
  contactFilename,
  downloadVCard,
} from "@/lib/vcard";

type SaveContactButtonProps = {
  name: string;
  avatarSrc: string;
  contact: ContactConfig;
};

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M9 5.25C8.58579 5.25 8.25 5.58579 8.25 6C8.25 6.41421 8.58579 6.75 9 6.75H15C15.4142 6.75 15.75 6.41421 15.75 6C15.75 5.58579 15.4142 5.25 15 5.25H9Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9425 1.25C9.86994 1.24999 8.23716 1.24997 6.96128 1.42337C5.65122 1.60141 4.60609 1.97468 3.78484 2.80484C2.96469 3.63387 2.59692 4.68702 2.4213 6.00741C2.24998 7.29551 2.24999 8.94462 2.25 11.0411V16.139C2.24999 17.6466 2.24998 18.8402 2.34601 19.7388C2.44091 20.6269 2.64447 21.428 3.22584 21.9638C3.69226 22.3937 4.28211 22.6646 4.91165 22.7367C5.69912 22.8268 6.43439 22.4508 7.15868 21.9377C7.89163 21.4185 8.78075 20.6321 9.90254 19.6399L9.93905 19.6076C10.4591 19.1476 10.8112 18.8372 11.105 18.6224C11.3889 18.4148 11.5623 18.3397 11.7084 18.3103C11.9009 18.2715 12.0991 18.2715 12.2916 18.3103C12.4377 18.3397 12.6111 18.4148 12.895 18.6224C13.1888 18.8372 13.5409 19.1476 14.061 19.6076L14.0975 19.64C15.2193 20.6321 16.1084 21.4186 16.8413 21.9377C17.5656 22.4508 18.3009 22.8268 19.0883 22.7367C19.7179 22.6646 20.3077 22.3937 20.7742 21.9638C21.3555 21.428 21.5591 20.6269 21.654 19.7388C21.75 18.8402 21.75 17.6466 21.75 16.139V11.041C21.75 8.94462 21.75 7.2955 21.5787 6.00741C21.4031 4.68702 21.0353 3.63387 20.2152 2.80484C19.3939 1.97468 18.3488 1.60141 17.0387 1.42337C15.7628 1.24997 14.1301 1.24999 12.0575 1.25H11.9425ZM4.8512 3.85977C5.34797 3.35762 6.02251 3.06474 7.16328 2.90971C8.32645 2.75163 9.85725 2.75 12 2.75C14.1427 2.75 15.6736 2.75163 16.8367 2.90971C17.9775 3.06474 18.652 3.35762 19.1488 3.85977C19.6467 4.36303 19.9379 5.04819 20.0918 6.20518C20.2484 7.38292 20.25 8.93223 20.25 11.0975V16.0909C20.25 17.6572 20.249 18.7702 20.1625 19.5794C20.0739 20.4088 19.9104 20.72 19.7576 20.8608C19.5238 21.0763 19.2298 21.2107 18.9178 21.2464C18.7182 21.2692 18.3835 21.192 17.7083 20.7137C17.0497 20.2472 16.2211 19.5157 15.0547 18.484L15.0286 18.4609C14.5413 18.0299 14.1372 17.6725 13.7804 17.4116C13.4074 17.1388 13.0312 16.9292 12.5878 16.8398C12.1998 16.7617 11.8002 16.7617 11.4122 16.8398C10.9688 16.9292 10.5926 17.1388 10.2196 17.4116C9.86283 17.6725 9.45871 18.0299 8.97146 18.4609L8.94527 18.484C7.77887 19.5157 6.95026 20.2472 6.29165 20.7137C5.61646 21.192 5.28182 21.2692 5.08218 21.2464C4.77019 21.2107 4.47617 21.0763 4.24237 20.8608C4.08963 20.72 3.92614 20.4088 3.83752 19.5794C3.75104 18.7702 3.75 17.6572 3.75 16.0909V11.0975C3.75 8.93223 3.75156 7.38292 3.90821 6.20518C4.06209 5.04819 4.35333 4.36303 4.8512 3.85977Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SaveContactButton({
  name,
  avatarSrc,
  contact,
}: SaveContactButtonProps) {
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      const vcard = await buildVCard({ name, avatarSrc, contact });
      downloadVCard(contactFilename(name), vcard);
    } catch {
      try {
        const lines = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${name}`,
          `TEL;TYPE=CELL,VOICE:${contact.phone.replace(/\s+/g, "")}`,
          `EMAIL;TYPE=INTERNET:${contact.email}`,
          `URL:${contact.url}`,
          "END:VCARD",
        ];
        downloadVCard(contactFilename(name), lines.join("\r\n"));
      } catch {
        // ignore
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    if (sharing) return;
    setSharing(true);
    try {
      const url = window.location.href;
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: name,
          text: name,
          url,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // uživatel zrušil share dialog / clipboard fail — ignorovat
    } finally {
      setSharing(false);
    }
  }

  return (
    <div
      className="animate-reveal-card grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 md:gap-3"
      style={{ animationDelay: "620ms" }}
    >
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex min-w-0 items-center justify-center gap-2.5 rounded-2xl bg-foreground px-4 py-3.5 text-[15px] font-medium text-white will-change-transform transition-[transform,opacity] duration-300 ease-out hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 disabled:opacity-70 sm:gap-3 sm:px-5 sm:py-4 sm:text-base"
      >
        <SaveIcon className="size-5 shrink-0 sm:size-6" />
        {saving ? "Připravuji…" : "Uložit kontakt"}
      </button>

      <button
        type="button"
        onClick={handleShare}
        disabled={sharing}
        aria-label="Sdílet profil"
        className="box-border aspect-square h-full w-auto rounded-2xl border-[1.5px] border-foreground bg-transparent text-foreground will-change-transform transition-[transform,opacity,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 disabled:opacity-70"
      >
        <span className="flex size-full items-center justify-center">
          <ShareIcon className="size-5 sm:size-6" />
        </span>
      </button>
    </div>
  );
}
