import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { chillax } from "@/lib/fonts";

type AuthSplitLayoutProps = {
  children: ReactNode;
  /** Optional — when set, fills the right-side canvas. */
  imageSrc?: string | null;
  imageAlt?: string;
};

export function AuthSplitLayout({
  children,
  imageSrc = null,
  imageAlt = "dotra",
}: AuthSplitLayoutProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f3f3f5] px-3 py-3 text-foreground sm:px-5 sm:py-5 lg:px-8 lg:py-8">
      <div className="grid w-full max-w-[1180px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_80px_rgba(17,17,17,0.08)] lg:min-h-[min(820px,calc(100dvh-4rem))] lg:grid-cols-2 lg:rounded-[1.75rem]">
        <section className="relative flex flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-8 xl:px-14">
          <Link
            href="/"
            className={`${chillax.className} shrink-0 self-start text-[1.75rem] leading-none font-semibold tracking-[-0.04em] text-foreground lowercase sm:text-[1.95rem]`}
          >
            dotra.
          </Link>

          <div className="flex flex-1 flex-col justify-center py-10 sm:py-12">
            <div className="mx-auto w-full max-w-[380px]">{children}</div>
          </div>
        </section>

        <aside className="relative hidden p-4 pl-2 sm:p-5 lg:block lg:p-5 lg:pl-2 xl:p-6 xl:pl-3">
          <div className="relative h-full min-h-[560px] overflow-hidden rounded-[1.35rem] bg-[#f0f0f2] xl:rounded-[1.5rem]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1180px) 50vw, 560px"
                className="object-cover object-center"
              />
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
