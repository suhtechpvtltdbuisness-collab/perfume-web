import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center">
      <p className="text-[0.58rem] uppercase tracking-luxury text-gold-300">404 · Lost note</p>
      <h1 className="mt-5 text-balance font-display text-5xl sm:text-7xl">This trail has faded.</h1>
      <Button href="/" className="mt-8">Return home</Button>
    </div>
  );
}
