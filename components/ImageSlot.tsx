import Image from "next/image";

type Props = {
  /** Path under /public. Null renders the labelled placeholder instead. */
  src: string | null;
  alt: string;
  /** Shown inside the frame while no image is set. */
  placeholder: string;
  /** Tailwind aspect utility, e.g. "aspect-[4/3]". */
  aspect: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Optional caption rendered over the bottom-left of the frame. */
  caption?: string;
};

export default function ImageSlot({
  src,
  alt,
  placeholder,
  aspect,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  priority = false,
  caption,
}: Props) {
  return (
    <div
      className={`relative w-full ${aspect} border border-white/10 bg-white/[0.03] overflow-hidden ${className}`}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[11px] text-muted-500 text-center px-6">
            {placeholder}
          </span>
        </div>
      )}
      {caption ? (
        <div className="absolute left-0 bottom-0 px-4 py-3.5 font-mono text-[10.5px] tracking-[0.14em] uppercase text-white/75 pointer-events-none">
          {caption}
        </div>
      ) : null}
    </div>
  );
}
