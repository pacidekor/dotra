"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LivePreview } from "@/components/dashboard/LivePreview";
import { LinkIconGlyph } from "@/components/LinkIcons";
import type { LinkIcon, ProfileLink } from "@/data/types";
import {
  DEFAULT_ONBOARDING_LINKS,
  linksFromRows,
  profileFromRow,
  slugify,
  type DotraLinkRow,
  type DotraProfileRow,
} from "@/lib/dotra-profile";
import { createClient } from "@/utils/supabase/client";

const STEPS = [
  { id: "avatar", title: "Profilovka", hint: "Nahrajte profesionální fotografii nebo logo." },
  { id: "banner", title: "Banner", hint: "Vyberte úvodní obrázek profilu." },
  { id: "identity", title: "Jméno a URL", hint: "Jak se budete jmenovat a jaká bude adresa profilu." },
  { id: "tagline", title: "Popisek", hint: "Krátká věta pod jménem." },
  { id: "links", title: "Odkazy", hint: "Vyplňte a seřaďte karty odkazů." },
] as const;

type DraftLink = {
  key: string;
  label: string;
  href: string;
  description: string;
  icon: LinkIcon;
};

type OnboardingWizardProps = {
  userId: string;
  initialProfile: DotraProfileRow;
  initialLinks: DotraLinkRow[];
};

function SortableLinkRow({
  link,
  onChange,
}: {
  link: DraftLink;
  onChange: (next: DraftLink) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.key });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="rounded-2xl border border-border bg-surface p-3"
    >
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab rounded-lg border border-border px-2 py-1 text-xs text-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          Drag
        </button>
        <span className="flex size-8 items-center justify-center rounded-lg border border-border">
          <LinkIconGlyph name={link.icon} />
        </span>
        <span className="text-sm font-medium">{link.label}</span>
      </div>
      <input
        type="text"
        value={link.href}
        onChange={(event) => onChange({ ...link, href: event.target.value })}
        placeholder={
          link.icon === "email"
            ? "mailto:vas@email.cz"
            : link.icon === "phone"
              ? "tel:+420..."
              : "https://"
        }
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}

export function OnboardingWizard({
  userId,
  initialProfile,
  initialLinks,
}: OnboardingWizardProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(
    initialProfile.display_name || "",
  );
  const [slug, setSlug] = useState(initialProfile.slug || "");
  const [tagline, setTagline] = useState(initialProfile.tagline || "");
  const [avatarPath, setAvatarPath] = useState(initialProfile.avatar_path);
  const [bannerPath, setBannerPath] = useState(initialProfile.banner_path);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [links, setLinks] = useState<DraftLink[]>(() => {
    if (initialLinks.length > 0) {
      return linksFromRows(initialLinks).map((link) => ({
        key: link.id,
        label: link.label,
        href: link.href,
        description: link.description,
        icon: link.icon,
      }));
    }
    return DEFAULT_ONBOARDING_LINKS.map((link, index) => ({
      key: `draft-${index}`,
      label: link.label,
      href: link.href,
      description: link.description,
      icon: link.icon as LinkIcon,
    }));
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const previewProfile = profileFromRow({
    ...initialProfile,
    display_name: displayName,
    tagline,
    avatar_path: avatarPreview || avatarPath,
    banner_path: bannerPreview || bannerPath,
  });

  const previewLinks: ProfileLink[] = links.map((link) => ({
    id: link.key,
    label: link.label,
    href: link.href || "#",
    description: link.description,
    icon: link.icon,
  }));

  async function uploadImage(
    file: File,
    bucket: "avatars" | "banners",
  ): Promise<string> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) {
      const message = uploadError.message || "";
      if (
        message.toLowerCase().includes("bucket") ||
        message.toLowerCase().includes("not found")
      ) {
        throw new Error(
          "Úložiště fotek ještě není vytvořené. V Supabase spusť migraci storage (avatars/banners), nebo krok zatím přeskoč.",
        );
      }
      throw uploadError;
    }
    return path;
  }

  async function saveProfilePatch(
    patch: Partial<DotraProfileRow>,
  ) {
    const { error: updateError } = await supabase
      .from("dotra_profiles")
      .update(patch)
      .eq("id", userId);
    if (updateError) throw updateError;
  }

  async function persistLinks() {
    await supabase.from("dotra_links").delete().eq("profile_id", userId);
    const rows = links
      .map((link, index) => ({
        profile_id: userId,
        label: link.label,
        href: link.href.trim(),
        description: link.description,
        icon: link.icon,
        sort_order: index,
        enabled: Boolean(link.href.trim()),
      }))
      .filter((link) => link.href.length > 0);

    if (rows.length === 0) return;

    const { error: insertError } = await supabase.from("dotra_links").insert(rows);
    if (insertError) throw insertError;
  }

  async function handleNext() {
    setError(null);
    setSaving(true);
    try {
      // Avatar/banner are recommended but can be skipped until storage buckets exist
      if (step === 2) {
        const nextSlug = slugify(slug || displayName);
        if (!displayName.trim()) throw new Error("Zadejte jméno profilu.");
        if (!nextSlug) throw new Error("Zadejte platný slug URL.");
        const reserved = [
          "dashboard",
          "login",
          "register",
          "onboarding",
          "tomas",
          "filip",
          "rezit",
          "ukaplicky",
          "api",
        ];
        if (reserved.includes(nextSlug)) {
          throw new Error("Tento slug je rezervovaný, zvolte jiný.");
        }
        setSlug(nextSlug);
        const { error: slugError } = await supabase
          .from("dotra_profiles")
          .update({
            display_name: displayName.trim(),
            slug: nextSlug,
          })
          .eq("id", userId);
        if (slugError) {
          if (slugError.code === "23505") {
            throw new Error("Tento slug už někdo používá.");
          }
          throw slugError;
        }
      }
      if (step === 3) {
        await saveProfilePatch({ tagline: tagline.trim() });
      }
      if (step === 4) {
        await persistLinks();
        await saveProfilePatch({
          display_name: displayName.trim(),
          slug: slugify(slug || displayName),
          tagline: tagline.trim(),
          avatar_path: avatarPath,
          banner_path: bannerPath,
          onboarding_completed_at: new Date().toISOString(),
        });
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setStep((current) => Math.min(current + 1, STEPS.length - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uložení se nepovedlo.");
    } finally {
      setSaving(false);
    }
  }

  async function onAvatarChange(file: File | null) {
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const localUrl = URL.createObjectURL(file);
      setAvatarPreview(localUrl);
      const path = await uploadImage(file, "avatars");
      setAvatarPath(path);
      await saveProfilePatch({ avatar_path: path });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload profilovky selhal.");
    } finally {
      setSaving(false);
    }
  }

  async function onBannerChange(file: File | null) {
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const localUrl = URL.createObjectURL(file);
      setBannerPreview(localUrl);
      const path = await uploadImage(file, "banners");
      setBannerPath(path);
      await saveProfilePatch({ banner_path: path });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload banneru selhal.");
    } finally {
      setSaving(false);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((link) => link.key === active.id);
    const newIndex = links.findIndex((link) => link.key === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setLinks(arrayMove(links, oldIndex, newIndex));
  }

  const current = STEPS[step];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Onboarding · {step + 1}/{STEPS.length}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-muted sm:text-base">{current.hint}</p>
        </div>

        <div className="mb-6 flex gap-1.5">
          {STEPS.map((item, index) => (
            <div
              key={item.id}
              className={`h-1.5 flex-1 rounded-full ${
                index <= step ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="space-y-4">
          {step === 0 ? (
            <label className="block space-y-3">
              <span className="text-sm font-medium">Soubor profilovky</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  onAvatarChange(event.target.files?.[0] ?? null)
                }
                className="block w-full text-sm"
              />
              {(avatarPreview || avatarPath) && (
                <div className="relative mx-auto size-28 overflow-hidden rounded-full border border-border">
                  <Image
                    src={
                      avatarPreview ||
                      profileFromRow({
                        ...initialProfile,
                        avatar_path: avatarPath,
                      }).avatarSrc
                    }
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
            </label>
          ) : null}

          {step === 1 ? (
            <label className="block space-y-3">
              <span className="text-sm font-medium">Soubor banneru</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  onBannerChange(event.target.files?.[0] ?? null)
                }
                className="block w-full text-sm"
              />
            </label>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Jméno profilu</span>
                <input
                  value={displayName}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDisplayName(value);
                    if (!slug || slug === slugify(displayName)) {
                      setSlug(slugify(value));
                    }
                  }}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-accent"
                  placeholder="Tomáš Dočekal"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">URL slug</span>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-3 text-sm">
                  <span className="text-muted">/</span>
                  <input
                    value={slug}
                    onChange={(event) => setSlug(slugify(event.target.value))}
                    className="w-full bg-transparent outline-none"
                    placeholder="tomas"
                  />
                </div>
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Popisek</span>
              <textarea
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-accent"
                placeholder="Co-Founder of Rezit, Vouchy and Dotra"
              />
            </label>
          ) : null}

          {step === 4 ? (
            <>
              <p className="text-sm text-muted">
                Odkazy jsou volitelné — nevyplněné se neuloží.
              </p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={links.map((link) => link.key)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2.5">
                    {links.map((link) => (
                      <SortableLinkRow
                        key={link.key}
                        link={link}
                        onChange={(next) =>
                          setLinks((prev) =>
                            prev.map((item) =>
                              item.key === next.key ? next : item,
                            ),
                          )
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          ) : null}
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium"
            >
              Zpět
            </button>
          ) : null}
          {step === 0 || step === 1 ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setError(null);
                setStep((current) => Math.min(current + 1, STEPS.length - 1));
              }}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/70"
            >
              Přeskočit
            </button>
          ) : null}
          <button
            type="button"
            disabled={saving}
            onClick={handleNext}
            className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-white disabled:opacity-70"
          >
            {saving
              ? "Ukládám…"
              : step === STEPS.length - 1
                ? "Dokončit"
                : "Pokračovat"}
          </button>
        </div>
        {(step === 0 || step === 1) && (
          <p className="mt-3 text-xs text-muted">
            Fotky vyžadují storage buckety <code>avatars</code> a{" "}
            <code>banners</code> v Supabase. Když upload nejde, krok přeskoč a
            doplň je později v dashboardu.
          </p>
        )}
      </div>

      <div className="lg:sticky lg:top-8">
        <div className="mb-3 lg:hidden">
          <p className="text-sm font-medium text-muted">Live preview</p>
        </div>
        <LivePreview profile={previewProfile} links={previewLinks} />
      </div>
    </div>
  );
}
