"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkIconGlyph } from "@/components/LinkIcons";
import { IconPicker } from "@/components/dashboard/IconPicker";
import type { LinkIcon, ProfileLink } from "@/data/types";

type LinksEditorProps = {
  links: ProfileLink[];
  onChange: (links: ProfileLink[]) => void;
  clicksByLink: Record<string, number>;
};

type DraftLink = {
  label: string;
  description: string;
  href: string;
  icon: LinkIcon;
};

const emptyDraft = (): DraftLink => ({
  label: "",
  description: "",
  href: "",
  icon: "globe",
});

export function LinksEditor({ links, onChange, clicksByLink }: LinksEditorProps) {
  const [draft, setDraft] = useState<DraftLink>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    onChange(arrayMove(links, oldIndex, newIndex));
  };

  const startCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setShowForm(true);
  };

  const startEdit = (link: ProfileLink) => {
    setEditingId(link.id);
    setDraft({
      label: link.label,
      description: link.description,
      href: link.href,
      icon: link.icon,
    });
    setShowForm(true);
  };

  const saveDraft = () => {
    if (!draft.label.trim() || !draft.href.trim()) return;

    if (editingId) {
      onChange(
        links.map((link) =>
          link.id === editingId
            ? {
                ...link,
                label: draft.label.trim(),
                description: draft.description.trim(),
                href: draft.href.trim(),
                icon: draft.icon,
              }
            : link,
        ),
      );
    } else {
      onChange([
        ...links,
        {
          id: `link-${Date.now()}`,
          label: draft.label.trim(),
          description: draft.description.trim() || "Bez popisu",
          href: draft.href.trim(),
          icon: draft.icon,
        },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const removeLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
    if (editingId === id) {
      setShowForm(false);
      setEditingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted">
          Karty odkazů
        </h2>
        <button
          type="button"
          onClick={startCreate}
          className="shrink-0 rounded-xl bg-foreground px-3.5 py-2 text-sm font-medium text-card transition-colors hover:bg-accent-hover"
        >
          Přidat kartu
        </button>
      </div>

      {showForm ? (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-foreground">
            {editingId ? "Upravit kartu" : "Nová karta"}
          </p>

          <div className="space-y-1.5">
            <span className="text-sm text-muted">Ikona</span>
            <IconPicker
              value={draft.icon}
              onChange={(icon) => setDraft((prev) => ({ ...prev, icon }))}
            />
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm text-muted">Název</span>
            <input
              type="text"
              value={draft.label}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, label: event.target.value }))
              }
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="Např. Instagram"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm text-muted">Popis</span>
            <input
              type="text"
              value={draft.description}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="Krátký popis"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm text-muted">Odkaz</span>
            <input
              type="url"
              value={draft.href}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, href: event.target.value }))
              }
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="https://"
            />
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-xl bg-foreground px-3.5 py-2 text-sm font-medium text-card hover:bg-accent-hover"
            >
              Uložit
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-foreground hover:bg-card"
            >
              Zrušit
            </button>
          </div>
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((link) => link.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2.5">
            {links.map((link) => (
              <SortableLinkRow
                key={link.id}
                link={link}
                clicks={clicksByLink[link.id] ?? 0}
                onEdit={() => startEdit(link)}
                onRemove={() => removeLink(link.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}

function SortableLinkRow({
  link,
  clicks,
  onEdit,
  onRemove,
}: {
  link: ProfileLink;
  clicks: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-border bg-surface p-3 sm:flex sm:items-center sm:gap-3 ${
        isDragging ? "z-10 shadow-lg opacity-95" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          className="flex size-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted active:cursor-grabbing"
          aria-label="Přesunout"
          {...attributes}
          {...listeners}
        >
          <DragHandleIcon />
        </button>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-foreground">
          <LinkIconGlyph name={link.icon} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {link.label}
          </p>
          <p className="truncate text-xs text-muted">
            <span className="sm:hidden">{clicks} prokliků</span>
            <span className="hidden sm:inline">
              {clicks} prokliků · {link.href}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-0 sm:flex sm:shrink-0 sm:gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground hover:bg-white sm:border-0 sm:bg-transparent sm:px-2.5 sm:py-1.5 sm:text-xs"
        >
          Upravit
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 sm:border-0 sm:bg-transparent sm:px-2.5 sm:py-1.5 sm:text-xs"
        >
          Smazat
        </button>
      </div>
    </li>
  );
}

function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}
