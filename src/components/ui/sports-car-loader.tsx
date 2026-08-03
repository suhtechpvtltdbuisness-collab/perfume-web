import Image from "next/image";

export function SportsCarLoader() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,151,73,0.08),transparent_48%)]" />
      <div className="relative z-10 -translate-y-12 text-center">
        <p className="font-display text-4xl tracking-[0.22em] text-ivory sm:text-6xl">AUTOROMA</p>
        <p className="mt-3 text-[0.45rem] uppercase tracking-[0.55em] text-gold-300/55">Performance in every note</p>
      </div>

      <div className="absolute inset-x-0 bottom-[29%] h-28 sm:bottom-[25%]">
        <div className="absolute inset-x-0 bottom-2 h-px bg-gradient-to-r from-transparent via-gold-300/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-gold-300/[0.035] to-transparent" />
        <div className="absolute bottom-0 left-0 flex w-[200%] animate-road-dash gap-12 opacity-35">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} className="h-px w-20 shrink-0 bg-gold-300" />
          ))}
        </div>

        <div className="absolute bottom-1 left-0 animate-car-load will-change-transform">
          <div className="relative w-[19rem] sm:w-[30rem]">
            <div className="absolute -left-14 bottom-[1.1rem] z-0 flex items-center sm:-left-[4.5rem] sm:bottom-[1.8rem]">
              <span className="h-4 w-16 animate-flame-outer rounded-l-full bg-gradient-to-l from-orange-400 via-orange-600 to-transparent blur-[3px] sm:h-5 sm:w-24" />
              <span className="absolute right-0 h-2.5 w-12 animate-flame-inner rounded-l-full bg-gradient-to-l from-yellow-100 via-yellow-400 to-transparent sm:h-3 sm:w-16" />
              <span className="absolute right-0 h-1 w-8 rounded-l-full bg-gradient-to-l from-white via-cyan-200 to-transparent sm:h-1.5 sm:w-10" />
            </div>

            <Image
              src="/images/autoroma-supercar.webp"
              alt="Crimson Autoroma supercar loading"
              width={1664}
              height={439}
              priority
              unoptimized
              className="relative z-10 h-auto w-full drop-shadow-[0_16px_28px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-[17%] mx-auto max-w-md sm:bottom-[13%]">
        <div className="h-px overflow-hidden bg-white/10">
          <div className="h-full origin-left animate-line-in bg-gradient-to-r from-gold-500 via-gold-300 to-ivory" />
        </div>
        <div className="mt-4 flex justify-between text-[0.42rem] uppercase tracking-[0.45em] text-mist/35">
          <span>Ignition</span>
          <span>Loading experience</span>
        </div>
      </div>
    </div>
  );
}
