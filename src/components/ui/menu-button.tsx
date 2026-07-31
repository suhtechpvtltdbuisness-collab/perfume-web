import { cn } from "@/lib/utils";

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      className="group relative flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] outline-none transition-colors duration-500 hover:border-gold-400/40 focus-visible:ring-1 focus-visible:ring-gold-400 lg:hidden"
    >
      <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
      <span
        className={cn(
          "absolute h-px w-4 bg-ivory transition duration-500 ease-luxury",
          isOpen ? "rotate-45" : "-translate-y-[3px]",
        )}
      />
      <span
        className={cn(
          "absolute h-px w-4 bg-ivory transition duration-500 ease-luxury",
          isOpen ? "-rotate-45" : "translate-y-[3px]",
        )}
      />
    </button>
  );
}
