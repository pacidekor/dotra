type ImagePlaceholderProps = {
  label?: string;
  className?: string;
  aspect?: string;
};

export function ImagePlaceholder({
  label = "Obrázek",
  className = "",
  aspect = "aspect-[16/10]",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#e4e4ea] ${aspect} ${className}`}
      aria-label={`Placeholder: ${label}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, #f0f0f4 0%, #e2e2e8 42%, #d6d6de 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 30% 25%, rgba(255,255,255,0.9), transparent), radial-gradient(ellipse 50% 40% at 75% 75%, rgba(0,0,0,0.06), transparent)",
        }}
      />
      <div className="absolute inset-0 flex items-end p-5 sm:p-6">
        <span className="text-[11px] font-medium tracking-[0.14em] text-foreground/35 uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
