import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="mb-5 text-[0.58rem] font-semibold uppercase tracking-[0.4em] text-gold-400">
        {eyebrow}
      </p>
      <h2 className="text-balance font-display text-5xl leading-[0.95] tracking-[-0.035em] text-ivory sm:text-7xl lg:text-8xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-7 max-w-xl text-sm leading-7 text-mist/70",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
