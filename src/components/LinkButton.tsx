import { LinkIconGlyph } from "@/components/LinkIcons";
import type { ProfileLink } from "@/data/links";

type LinkButtonProps = {
  link: ProfileLink;
  index: number;
  onWifiClick?: () => void;
};

export function LinkButton({ link, index, onWifiClick }: LinkButtonProps) {
  const isWifi = link.id === "wifi" && onWifiClick;
  const isExternal = link.href.startsWith("http");
  const useSoft = index % 2 === 1;

  const className = `group flex w-full items-center gap-3.5 rounded-2xl border border-border bg-surface px-4 py-3.5 text-left will-change-transform transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white hover:shadow-[0_8px_24px_rgba(26,37,51,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 sm:gap-4 sm:px-5 sm:py-4 ${
    useSoft ? "animate-reveal-card-soft" : "animate-reveal-card"
  }`;

  const content = (
    <>
      <span
        className="animate-reveal-icon flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-foreground sm:size-11"
        style={{ animationDelay: `${780 + index * 75}ms` }}
      >
        <LinkIconGlyph name={link.icon} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-snug text-foreground transition-colors duration-300 group-hover:text-accent sm:text-base">
          {link.label}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-muted">
          {link.description}
        </span>
      </span>
    </>
  );

  if (isWifi) {
    return (
      <button
        type="button"
        onClick={onWifiClick}
        className={className}
        style={{ animationDelay: `${680 + index * 75}ms` }}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={link.href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={className}
      style={{ animationDelay: `${680 + index * 75}ms` }}
    >
      {content}
    </a>
  );
}
