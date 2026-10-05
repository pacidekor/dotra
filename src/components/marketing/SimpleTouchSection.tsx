import Link from "next/link";
import { ImagePlaceholder } from "@/components/marketing/ImagePlaceholder";
import { chillax } from "@/lib/fonts";

export function SimpleTouchSection() {
  return (
    <section className="bg-white py-12 sm:py-24">
      <div className="mx-auto w-[92%] max-w-[1700px]">
        <div className="max-w-3xl">
          <h2
            className={`${chillax.className} text-[clamp(1.85rem,7vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.035em] sm:whitespace-nowrap sm:leading-[1.02]`}
          >
            Takhle jednoduché to je.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/50 sm:mt-4 sm:text-lg">
            Jeden dotyk. Okamžitý přístup ke všemu důležitému.
          </p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[1.5rem] sm:mt-12 sm:rounded-[2rem]">
          <ImagePlaceholder
            label="dotra v praxi — foto"
            aspect="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[21/10]"
            className="rounded-none"
          />

          <button
            type="button"
            className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-sm font-medium text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-opacity hover:opacity-90 sm:bottom-6 sm:left-6 sm:gap-2.5 sm:px-5 sm:py-3 sm:text-[15px]"
          >
            <span className="inline-flex size-5 items-center justify-center sm:size-6">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3.5 sm:size-4"
                aria-hidden="true"
              >
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </span>
            dotra v praxi
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="max-w-md text-sm leading-relaxed text-foreground/45 sm:text-[15px]">
            Váš brand, váš styl. Každá dotra je unikátní.
          </p>

          <Link
            href="/register"
            className="group inline-flex items-center gap-3 self-start text-[15px] font-medium text-foreground sm:self-auto sm:text-base"
          >
            Objevte svou dotru
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#ccfc4e] sm:size-11">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 text-black transition-transform duration-300 ease-out group-hover:-rotate-45 sm:size-5"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
