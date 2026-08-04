"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/auth-api";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { LandingContent } from "@/types/site-content";
import { PerfumeFormModal } from "@/components/admin/perfume-form-modal";

type AdminView = "overview" | "landing" | "products";

const emptyProduct: Product = {
  id: "",
  slug: "",
  name: "",
  subtitle: "Eau de Parfum",
  family: "Woody · Amber",
  price: 0,
  size: "75 ml",
  description: "",
  notes: ["", "", ""],
  accent: "bg-[#8b5a3c]",
  featured: false,
  media: [],
};

export function AdminDashboard() {
  const content = useSiteContent();
  const router = useRouter();
  const { user, isReady, logout } = useAuth();
  const [view, setView] = useState<AdminView>("overview");
  const [editor, setEditor] = useState<Product | null>(null);

  const authenticated = isReady && user?.role === "admin";

  useEffect(() => {
    if (!isReady) return;
    if (user && user.role !== "admin") {
      router.replace("/shop");
    }
  }, [isReady, router, user]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-ivory">
        Checking access…
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-ivory">
        Redirecting…
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-24">
      <div className="grid min-h-[calc(100vh-6rem)] lg:grid-cols-[16rem_1fr]">
        <aside className="bg-black/35 border-b border-white/20 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-[0.68rem] uppercase tracking-luxury text-gold-300">Autoroma control</p>
          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:block lg:space-y-2" aria-label="Admin sections">
            <AdminNav active={view === "overview"} onClick={() => setView("overview")} icon={<LayoutDashboard className="size-4" />}>Overview</AdminNav>
            <AdminNav active={view === "landing"} onClick={() => setView("landing")} icon={<Pencil className="size-4" />}>Landing page</AdminNav>
            <AdminNav active={view === "products"} onClick={() => setView("products")} icon={<Package className="size-4" />}>Products</AdminNav>
          </nav>
          <button onClick={() => void logout()} className="mt-6 flex items-center gap-3 text-[0.62rem] uppercase tracking-editorial text-ivory hover:text-ivory lg:mt-12">
            <LogOut className="size-4" /> Sign out
          </button>
        </aside>

        <main className="min-w-0 p-6 sm:p-10 lg:p-14">
          {view === "overview" && (
            <>
              <AdminHeading eyebrow="Dashboard" title="Good evening." description="Manage the storefront experience from one place." />
              <div className="mt-12 grid gap-5 sm:grid-cols-3">
                <Stat label="Products" value={String(content.products.length)} />
                <Stat label="Featured scents" value={String(content.products.filter((item) => item.featured).length)} />
                <Stat label="Storefront" value="Live" />
              </div>
              <div className="mt-10 border border-white/20 bg-white/[0.06] p-7">
                <p className="text-[0.6rem] uppercase tracking-luxury text-gold-300">Storage mode</p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-ivory">
                  Changes are saved instantly in this browser. Connect a database and secure server authentication before granting production team access.
                </p>
              </div>
            </>
          )}

          {view === "landing" && (
            <LandingEditor
              value={content.landing}
              onSave={content.updateLanding}
              onReset={() => {
                if (window.confirm("Reset all landing content and products to defaults?")) content.resetContent();
              }}
            />
          )}

          {view === "products" && (
            <>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <AdminHeading eyebrow="Catalogue" title="Products" description="Add, edit, feature or remove fragrances." />
                <Button onClick={() => setEditor({ ...emptyProduct, id: crypto.randomUUID() })}>
                  <Plus className="size-4" /> Add perfume
                </Button>
              </div>
              <div className="mt-10 overflow-x-auto border border-white/20">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="border-b border-white/20 bg-white/[0.065] text-[0.68rem] uppercase tracking-luxury text-ivory">
                    <tr><th className="p-4">Product</th><th className="p-4">Family</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {content.products.map((product) => (
                      <tr key={product.id} className="text-sm">
                        <td className="p-4"><span className="font-display text-xl">{product.name}</span><span className="mt-1 block text-[0.68rem] uppercase tracking-editorial text-ivory/95">{product.size}</span></td>
                        <td className="p-4 text-ivory">{product.family}</td>
                        <td className="p-4 text-ivory">₹{product.price.toLocaleString("en-IN")}</td>
                        <td className="p-4"><span className={cn("text-[0.68rem] uppercase tracking-editorial", product.featured ? "text-gold-300" : "text-ivory/95")}>{product.featured ? "Featured" : "Active"}</span></td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button aria-label={`Edit ${product.name}`} onClick={() => setEditor(product)} className="border border-white/20 p-2.5 text-ivory/95 hover:border-gold-300/40 hover:text-gold-300"><Pencil className="size-3.5" /></button>
                            <button aria-label={`Delete ${product.name}`} onClick={() => {
                              if (window.confirm(`Delete ${product.name}?`)) {
                                void content.deleteProduct(product.id).catch((error: unknown) => {
                                  window.alert(error instanceof Error ? error.message : "Failed to delete perfume");
                                });
                              }
                            }} className="border border-white/20 p-2.5 text-ivory/95 hover:border-red-400/40 hover:text-red-300"><Trash2 className="size-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      {editor && (
        <PerfumeFormModal
          product={editor}
          onClose={() => setEditor(null)}
          onSave={async (product) => {
            await content.saveProduct(product);
            setEditor(null);
          }}
        />
      )}
    </div>
  );
}

function AdminLogin() {
  const router = useRouter();
  const { adminLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      await adminLogin(String(data.get("password") ?? ""));
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <form onSubmit={submit} className="w-full max-w-sm border border-white/20 bg-white/[0.065] p-8">
        <p className="text-center text-[0.68rem] uppercase tracking-luxury text-gold-300">Autoroma control</p>
        <h1 className="mt-4 text-center font-display text-4xl">Admin access</h1>
        <label htmlFor="admin-password" className="mt-8 block text-[0.68rem] uppercase tracking-luxury text-ivory">Password</label>
        <input id="admin-password" name="password" type="password" required className="mt-2 h-14 w-full border border-white/20 bg-black px-4 text-sm outline-none focus:border-gold-300/60" />
        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Checking…" : "Enter dashboard"}
        </Button>
      </form>
    </div>
  );
}

function LandingEditor({ value, onSave, onReset }: { value: LandingContent; onSave: (value: LandingContent) => void; onReset: () => void }) {
  const [draft, setDraft] = useState(value);
  const update = (key: keyof LandingContent, nextValue: string) => setDraft((current) => ({ ...current, [key]: nextValue }));
  const groups: {
    number: string;
    title: string;
    help: string;
    fields: { key: keyof LandingContent; label: string; help: string; multiline?: boolean }[];
  }[] = [
    {
      number: "01",
      title: "Announcement bar",
      help: "Hero ke turant baad dikhne wali slim information strip.",
      fields: [{ key: "announcement", label: "Announcement message", help: "Short rakho—delivery, offer ya launch update." }],
    },
    {
      number: "02",
      title: "Signature section",
      help: "Homepage par large bottle ke saath brand ka main introduction.",
      fields: [
        { key: "signatureEyebrow", label: "Small heading", help: "Heading ke upar chhota gold text." },
        { key: "signatureTitle", label: "Main heading", help: "Section ka large luxury headline." },
        { key: "signatureDescription", label: "Description", help: "2–3 lines mein fragrance philosophy.", multiline: true },
      ],
    },
    {
      number: "03",
      title: "Our story",
      help: "Cream background par brand quotation aur short history.",
      fields: [
        { key: "storyQuote", label: "Story quotation", help: "Quotation marks automatically add honge." },
        { key: "storyDescription", label: "Story summary", help: "Brand history ka short introduction.", multiline: true },
      ],
    },
    {
      number: "04",
      title: "Newsletter",
      help: "Footer se pehle email subscription section.",
      fields: [
        { key: "newsletterTitle", label: "Newsletter heading", help: "Visitor ko subscribe karne ka clear reason." },
        { key: "newsletterDescription", label: "Newsletter description", help: "Emails mein kya milega woh explain karo.", multiline: true },
      ],
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <AdminHeading eyebrow="Content" title="Landing page" description="Update the copy shown below the cinematic hero." />
        <button onClick={onReset} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-editorial text-ivory hover:text-gold-300"><RotateCcw className="size-4" /> Reset defaults</button>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); onSave(draft); }} className="mt-10 grid gap-5">
        {groups.map((group) => (
          <section key={group.number} className="grid gap-8 border border-white/30 bg-white/[0.075] p-6 sm:p-8 lg:grid-cols-[15rem_1fr]">
            <div>
              <span className="text-xs font-semibold tracking-luxury text-gold-300">{group.number}</span>
              <h2 className="mt-3 font-display text-4xl text-ivory">{group.title}</h2>
              <p className="mt-4 text-base leading-7 text-ivory/90">{group.help}</p>
            </div>
            <div className="space-y-5">
              {group.fields.map((item) => (
                <div key={item.key}>
                  <label htmlFor={item.key} className="mb-3 block text-xs font-semibold uppercase tracking-luxury text-ivory">{item.label}</label>
                  {item.multiline ? (
                    <textarea id={item.key} value={draft[item.key]} onChange={(event) => update(item.key, event.target.value)} rows={3} className="w-full border border-white/30 bg-black/40 p-5 text-base text-ivory outline-none focus:border-gold-300" />
                  ) : (
                    <input id={item.key} value={draft[item.key]} onChange={(event) => update(item.key, event.target.value)} className="h-16 w-full border border-white/30 bg-black/40 px-5 text-base text-ivory outline-none focus:border-gold-300" />
                  )}
                  <p className="mt-2 text-sm leading-6 text-ivory/85">{item.help}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="sticky bottom-5 z-10 mt-2 flex justify-end border border-white/20 bg-obsidian/90 p-4 backdrop-blur-xl">
          <Button type="submit">Save all landing changes</Button>
        </div>
      </form>
    </>
  );
}

function AdminHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-luxury text-gold-300">{eyebrow}</p><h1 className="mt-3 font-display text-5xl text-ivory sm:text-6xl">{title}</h1><p className="mt-4 text-base text-ivory/90">{description}</p></div>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="border border-white/20 bg-white/[0.06] p-6"><p className="text-[0.68rem] uppercase tracking-luxury text-ivory">{label}</p><p className="mt-5 font-display text-5xl text-gold-300">{value}</p></div>;
}

function AdminNav({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return <button onClick={onClick} className={cn("flex shrink-0 items-center gap-3 whitespace-nowrap px-4 py-3 text-left text-sm transition lg:w-full", active ? "bg-gold-300 text-ink" : "text-ivory hover:bg-white/[0.06] hover:text-ivory")}>{icon}{children}</button>;
}
