import { cn } from "@/lib/utils";

interface BottleArtProps {
  accent: string;
  name: string;
  className?: string;
}

export function BottleArt({ accent, name, className }: BottleArtProps) {
  return (
    <div className={cn("relative flex aspect-[4/5] items-center justify-center overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_55%)]" />
      <div className="absolute bottom-[15%] h-12 w-40 rounded-full bg-black/70 blur-xl" />
      <div className="relative h-[58%] w-[40%] rounded-[1.4rem_1.4rem_1.8rem_1.8rem] border border-white/25 bg-gradient-to-br from-white/20 via-white/[0.04] to-black/40 shadow-[inset_12px_0_30px_rgba(255,255,255,0.08),0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur">
        <div className="absolute left-1/2 top-0 h-[18%] w-[38%] -translate-x-1/2 -translate-y-full border border-white/20 bg-gradient-to-r from-black via-white/15 to-black" />
        <div className="absolute left-1/2 top-0 h-[11%] w-[50%] -translate-x-1/2 -translate-y-[255%] bg-gradient-to-r from-[#806f4b] via-[#dac184] to-[#66542f] shadow-lg" />
        <div className="absolute inset-x-[12%] top-[36%] border border-gold-300/25 bg-black/70 px-2 py-4 text-center backdrop-blur-md">
          <span className="block font-display text-sm tracking-editorial text-ivory sm:text-lg">
            {name}
          </span>
          <span className="mt-1 block text-[0.34rem] uppercase tracking-[0.38em] text-gold-300/70">
            Autoroma
          </span>
        </div>
        <div className={cn("absolute inset-x-0 bottom-0 h-1/3 opacity-60 blur-xl", accent)} />
      </div>
    </div>
  );
}
