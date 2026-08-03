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

        <div className="absolute bottom-2 left-0 animate-car-load will-change-transform">
          <div className="relative w-72 sm:w-[25rem]">
            <div className="absolute -left-16 bottom-[1.05rem] flex items-center">
              <span className="h-5 w-20 animate-flame-outer rounded-l-full bg-gradient-to-l from-orange-400 via-orange-600 to-transparent blur-[3px]" />
              <span className="absolute right-0 h-3 w-14 animate-flame-inner rounded-l-full bg-gradient-to-l from-yellow-100 via-yellow-400 to-transparent" />
              <span className="absolute right-0 h-1.5 w-9 rounded-l-full bg-gradient-to-l from-white via-cyan-200 to-transparent" />
            </div>

            <svg viewBox="0 0 430 132" role="img" aria-label="Red sports car loading" className="relative w-full -scale-x-100 overflow-visible drop-shadow-[0_14px_24px_rgba(0,0,0,0.95)]">
              <defs>
                <linearGradient id="car-body" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff5a4f" />
                  <stop offset="0.42" stopColor="#e52f2c" />
                  <stop offset="0.76" stopColor="#9e1118" />
                  <stop offset="1" stopColor="#f13a32" />
                </linearGradient>
                <linearGradient id="car-glass" x1="0" x2="1">
                  <stop stopColor="#37414b" />
                  <stop offset="0.5" stopColor="#11151a" />
                  <stop offset="1" stopColor="#030405" />
                </linearGradient>
                <linearGradient id="car-stripe" x1="0" x2="1">
                  <stop stopColor="#f8c84f" />
                  <stop offset="0.55" stopColor="#c99224" />
                  <stop offset="1" stopColor="#f4b83e" />
                </linearGradient>
              </defs>
              <path d="M19 88 43 66c8-7 19-12 30-13l78-8 47-31h107c17 0 34 5 49 14l43 27 21 8c7 3 11 9 10 16l-3 22-16 8h-31a38 38 0 0 0-75 0H135a38 38 0 0 0-75 0H18L11 99l8-11Z" fill="url(#car-body)" stroke="#3b090b" strokeLinejoin="round" strokeWidth="3" />
              <path d="m162 44 45-25h91c12 0 25 4 35 10l38 25H151l11-10Z" fill="url(#car-glass)" stroke="#ead8c1" strokeLinejoin="round" strokeWidth="2.5" />
              <path d="M23 91h402l-2 17-19 9h-25a38 38 0 0 0-76 0H135a38 38 0 0 0-76 0H18L14 105Z" fill="url(#car-stripe)" stroke="#39100b" strokeWidth="2" />
              <path d="M206 19 179 44M335 30l-3 58M151 47l8 61M369 54l27 2-11-18" fill="none" stroke="#601018" strokeWidth="3" />
              <path d="M50 65h86M170 57h140M172 66h27" fill="none" stroke="#ff8278" strokeLinecap="round" strokeWidth="3" opacity=".8" />
              <path d="m416 68 12 6-3 14h-23Z" fill="#ffe08a" stroke="#3b090b" strokeWidth="2" />
              <path d="M15 91h19" stroke="#ff5b42" strokeLinecap="round" strokeWidth="7" />
              <path d="M306 62c-11 2-24 7-32 14l33-4 15-11-16 1Z" fill="#25090b" />
              <ellipse cx="97" cy="108" rx="35" ry="34" fill="#080808" stroke="#5e1218" strokeWidth="4" />
              <ellipse cx="97" cy="108" rx="22" ry="22" fill="#b8b9b7" stroke="#ef3b37" strokeWidth="5" />
              <circle cx="97" cy="108" r="8" fill="#151515" />
              <g transform="translate(97 108)">
                <g className="origin-center animate-wheel-spin">
                  <path d="M0-20v40M-20 0h40M-14-14l28 28M14-14l-28 28" stroke="#424242" strokeWidth="3" />
                </g>
              </g>
              <ellipse cx="341" cy="108" rx="35" ry="34" fill="#080808" stroke="#5e1218" strokeWidth="4" />
              <ellipse cx="341" cy="108" rx="22" ry="22" fill="#b8b9b7" stroke="#ef3b37" strokeWidth="5" />
              <circle cx="341" cy="108" r="8" fill="#151515" />
              <g transform="translate(341 108)">
                <g className="origin-center animate-wheel-spin">
                  <path d="M0-20v40M-20 0h40M-14-14l28 28M14-14l-28 28" stroke="#424242" strokeWidth="3" />
                </g>
              </g>
            </svg>
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
