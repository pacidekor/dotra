import type { ContactConfig } from "@/data/types";

function escapeVCard(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { given: parts[0], family: "" };
  }
  return {
    given: parts.slice(0, -1).join(" "),
    family: parts[parts.length - 1] ?? "",
  };
}

function foldLine(line: string) {
  const max = 75;
  if (line.length <= max) return line;
  const chunks: string[] = [];
  let remaining = line;
  chunks.push(remaining.slice(0, max));
  remaining = remaining.slice(max);
  while (remaining.length > 0) {
    chunks.push(` ${remaining.slice(0, max - 1)}`);
    remaining = remaining.slice(max - 1);
  }
  return chunks.join("\r\n");
}

async function avatarToJpegBase64(avatarSrc: string) {
  const response = await fetch(avatarSrc);
  if (!response.ok) {
    throw new Error("Nepodařilo se načíst profilovku");
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Nepodařilo se dekódovat profilovku"));
      img.src = objectUrl;
    });

    const size = 400;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas není dostupný");

    const scale = Math.max(size / image.width, size / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(image, (size - w) / 2, (size - h) / 2, w, h);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    return dataUrl.split(",")[1] ?? "";
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function buildVCard(options: {
  name: string;
  avatarSrc: string;
  contact: ContactConfig;
}) {
  const { given, family } = splitName(options.name);
  const photo = await avatarToJpegBase64(options.avatarSrc);
  const phone = options.contact.phone.replace(/\s+/g, "");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(family)};${escapeVCard(given)};;;`,
    `FN:${escapeVCard(options.name)}`,
  ];

  if (options.contact.organization) {
    lines.push(`ORG:${escapeVCard(options.contact.organization)}`);
  }
  if (options.contact.title) {
    lines.push(`TITLE:${escapeVCard(options.contact.title)}`);
  }

  lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCard(phone)}`);
  lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(options.contact.email)}`);
  lines.push(`URL:${escapeVCard(options.contact.url)}`);

  if (photo) {
    lines.push(foldLine(`PHOTO;ENCODING=b;TYPE=JPEG:${photo}`));
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function downloadVCard(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".vcf") ? filename : `${filename}.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function contactFilename(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${slug || "kontakt"}.vcf`;
}
