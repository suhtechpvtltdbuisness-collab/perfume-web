export function NoiseLayer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] hidden opacity-[0.035] mix-blend-soft-light after:absolute after:inset-0 after:bg-noise lg:block"
    />
  );
}
