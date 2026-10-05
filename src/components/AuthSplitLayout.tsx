import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { chillax } from "@/lib/fonts";

type AuthSplitLayoutProps = {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
};

export function AuthSplitLayout({
  children,
  imageSrc = "/images/img2.webp",
  imageAlt = "dotra — váš podnik na jednom místě",
}: AuthSplitLayoutProps) {
  return (
    <main className="min-h-dvh bg-white text-foreground lg:grid lg:grid-cols-2">
      <section className="relative flex min-h-dvh flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-8 xl:px-16">
        <Link
          href="/"
          className={`${chillax.className} shrink-0 self-start text-[1.85rem] leading-none font-semibold tracking-[-0.04em] text-foreground lowercase sm:text-[2.1rem]`}
        >
          dotra.
        </Link>

        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="mx-auto w-full max-w-[420px] lg:mx-0">{children}</div>
        </div>
      </section>

      <aside className="relative hidden p-4 lg:block lg:p-5 xl:p-6">
        <div className="relative h-full min-h-[calc(100dvh-2.5rem)] overflow-hidden rounded-[1.75rem] bg-[#f0f0f2] xl:min-h-[calc(100dvh-3rem)] xl:rounded-[2rem]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
          />
          <p className="absolute inset-x-0 bottom-0 p-7 text-[15px] leading-snug font-medium text-white/95 xl:p-8 xl:text-base">
            Jedno přiložení.
            <br />
            Spousta možností.
          </p>
        </div>
      </aside>
    </main>
  );
}
