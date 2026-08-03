"use client";

import { useState, type FormEvent } from "react";
import { LayoutDashboard, LogOut, Package, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";

import { useSiteContent } from "@/components/providers/site-content-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { LandingContent } from "@/types/site-content";
import { MediaUploader } from "@/components/admin/media-uploader";

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
};

export function AdminDashboard() {
  const content = useSiteContent();
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<AdminView>("overview");
  const [editor, setEditor] = useState<Product | null>(null);

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      <div className="grid min-h-[calc(100vh-6rem)] lg:grid-cols-[16rem_1fr]">
        <aside className="border-r border-white/10 p-6">
          <p className="text-[0.5rem] uppercase tracking-luxury text-gold-300">Autoroma control</p>
          <nav className="mt-10 space-y-2" aria-label="Admin sections">
            <AdminNav active={view === "overview"} onClick={() => setView("overview")} icon={<LayoutDashboard className="size-4" />}>Overview</AdminNav>
            <AdminNav active={view === "landing"} onClick={() => setView("landing")} icon={<Pencil className="size-4" />}>Landing page</AdminNav>
            <AdminNav active={view === "products"} onClick={() => setView("products")} icon={<Package className="size-4" />}>Products</AdminNav>
          </nav>
          <button onClick={() => setAuthenticated(false)} className="mt-12 flex items-center gap-3 text-[0.55rem] uppercase tracking-editorial text-mist/45 hover:text-ivory">
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
              <div className="mt-10 border border-white/10 bg-white/[0.02] p-7">
                <p className="text-[0.52rem] uppercase tracking-luxury text-gold-300">Storage mode</p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-mist/55">
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
                  <Plus className="size-4" /> New product
                </Button>
              </div>
              <div className="mt-10 overflow-x-auto border border-white/10">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="border-b border-white/10 bg-white/[0.025] text-[0.5rem] uppercase tracking-luxury text-mist/45">
                    <tr><th className="p-4">Product</th><th className="p-4">Family</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {content.products.map((product) => (
                      <tr key={product.id} className="text-sm">
                        <td className="p-4"><span className="font-display text-xl">{product.name}</span><span className="mt-1 block text-[0.5rem] uppercase tracking-editorial text-mist/35">{product.size}</span></td>
                        <td className="p-4 text-mist/55">{product.family}</td>
                        <td className="p-4 text-mist/70">₹{product.price.toLocaleString("en-IN")}</td>
                        <td className="p-4"><span className={cn("text-[0.5rem] uppercase tracking-editorial", product.featured ? "text-gold-300" : "text-mist/35")}>{product.featured ? "Featured" : "Active"}</span></td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button aria-label={`Edit ${product.name}`} onClick={() => setEditor(product)} className="border border-white/10 p-2.5 text-mist/60 hover:border-gold-300/40 hover:text-gold-300"><Pencil className="size-3.5" /></button>
                            <button aria-label={`Delete ${product.name}`} onClick={() => {
                              if (window.confirm(`Delete ${product.name}?`)) content.deleteProduct(product.id);
                            }} className="border border-white/10 p-2.5 text-mist/60 hover:border-red-400/40 hover:text-red-300"><Trash2 className="size-3.5" /></button>
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
        <ProductEditor
          product={editor}
          onClose={() => setEditor(null)}
          onSave={(product) => {
            content.saveProduct(product);
            setEditor(null);
          }}
        />
      )}
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") === "admin") onSuccess();
    else setError(true);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <form onSubmit={submit} className="w-full max-w-sm border border-white/10 bg-white/[0.025] p-8">
        <p className="text-center text-[0.5rem] uppercase tracking-luxury text-gold-300">Autoroma control</p>
        <h1 className="mt-4 text-center font-display text-4xl">Admin access</h1>
        <label htmlFor="admin-password" className="mt-8 block text-[0.5rem] uppercase tracking-luxury text-mist/50">Password</label>
        <input id="admin-password" name="password" type="password" required className="mt-2 h-14 w-full border border-white/10 bg-black px-4 text-sm outline-none focus:border-gold-300/60" />
        {error && <p className="mt-3 text-xs text-red-300">Incorrect password. Demo password: admin</p>}
        <Button type="submit" className="mt-6 w-full">Enter dashboard</Button>
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
        <button onClick={onReset} className="flex items-center gap-2 text-[0.52rem] uppercase tracking-editorial text-mist/45 hover:text-ivory"><RotateCcw className="size-3.5" /> Reset defaults</button>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); onSave(draft); }} className="mt-10 grid gap-5">
        {groups.map((group) => (
          <section key={group.number} className="grid gap-7 border border-white/10 bg-white/[0.018] p-6 sm:p-8 lg:grid-cols-[13rem_1fr]">
            <div>
              <span className="text-[0.5rem] tracking-luxury text-gold-300">{group.number}</span>
              <h2 className="mt-3 font-display text-3xl">{group.title}</h2>
              <p className="mt-3 text-xs leading-5 text-mist/40">{group.help}</p>
            </div>
            <div className="space-y-5">
              {group.fields.map((item) => (
                <div key={item.key}>
                  <label htmlFor={item.key} className="mb-2 block text-[0.52rem] uppercase tracking-luxury text-mist/60">{item.label}</label>
                  {item.multiline ? (
                    <textarea id={item.key} value={draft[item.key]} onChange={(event) => update(item.key, event.target.value)} rows={3} className="w-full border border-white/10 bg-black/30 p-4 text-sm outline-none focus:border-gold-300/60" />
                  ) : (
                    <input id={item.key} value={draft[item.key]} onChange={(event) => update(item.key, event.target.value)} className="h-14 w-full border border-white/10 bg-black/30 px-4 text-sm outline-none focus:border-gold-300/60" />
                  )}
                  <p className="mt-2 text-[0.65rem] text-mist/30">{item.help}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="sticky bottom-5 z-10 mt-2 flex justify-end border border-white/10 bg-obsidian/90 p-4 backdrop-blur-xl">
          <Button type="submit">Save all landing changes</Button>
        </div>
      </form>
    </>
  );
}

function ProductEditor({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (product: Product) => void }) {
  const [draft, setDraft] = useState(product);
  const field = (key: keyof Product, value: Product[keyof Product]) =>
    setDraft((current) => ({ ...current, [key]: value }) as Product);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const slug = draft.slug || draft.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    onSave({ ...draft, slug });
  };
  return (
    <div className="fixed inset-0 z-[160] flex justify-end overflow-hidden bg-black/75 backdrop-blur-sm">
      <form
        onSubmit={submit}
        data-lenis-prevent
        className="h-dvh w-full max-w-xl touch-pan-y overflow-y-auto overscroll-contain border-l border-white/10 bg-obsidian p-7 pb-24 sm:p-10 sm:pb-28"
      >
        <div className="flex items-center justify-between"><h2 className="font-display text-4xl">{product.name ? "Edit product" : "New product"}</h2><button type="button" onClick={onClose} className="text-xs uppercase tracking-luxury text-mist/50">Close</button></div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          <EditorField label="Name" value={draft.name} onChange={(value) => field("name", value)} wide />
          <EditorField label="Subtitle" value={draft.subtitle} onChange={(value) => field("subtitle", value)} />
          <EditorField label="Family" value={draft.family} onChange={(value) => field("family", value)} />
          <EditorField label="Price" value={String(draft.price)} type="number" onChange={(value) => field("price", Number(value))} />
          <EditorField label="Size" value={draft.size} onChange={(value) => field("size", value)} />
          <EditorField label="Description" value={draft.description} onChange={(value) => field("description", value)} wide />
          <EditorField label="Top note" value={draft.notes[0] ?? ""} onChange={(value) => field("notes", [value, draft.notes[1] ?? "", draft.notes[2] ?? ""])} />
          <EditorField label="Heart note" value={draft.notes[1] ?? ""} onChange={(value) => field("notes", [draft.notes[0] ?? "", value, draft.notes[2] ?? ""])} />
          <EditorField label="Base note" value={draft.notes[2] ?? ""} onChange={(value) => field("notes", [draft.notes[0] ?? "", draft.notes[1] ?? "", value])} />
          <label className="flex items-center gap-3 self-end pb-4 text-xs text-mist/60"><input type="checkbox" checked={draft.featured ?? false} onChange={(event) => field("featured", event.target.checked)} /> Feature on homepage</label>
          <MediaUploader value={draft.media ?? []} onChange={(media) => field("media", media)} />
        </div>
        <Button type="submit" className="mt-8 w-full">Save product</Button>
      </form>
    </div>
  );
}

function EditorField({ label, value, onChange, type = "text", wide = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; wide?: boolean }) {
  return <label className={wide ? "sm:col-span-2" : ""}><span className="mb-2 block text-[0.5rem] uppercase tracking-luxury text-mist/50">{label}</span><input type={type} required value={value} onChange={(event) => onChange(event.target.value)} className="h-14 w-full border border-white/10 bg-black/40 px-4 text-sm outline-none focus:border-gold-300/60" /></label>;
}

function AdminHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-[0.5rem] uppercase tracking-luxury text-gold-300">{eyebrow}</p><h1 className="mt-3 font-display text-5xl sm:text-6xl">{title}</h1><p className="mt-3 text-sm text-mist/50">{description}</p></div>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="border border-white/10 bg-white/[0.02] p-6"><p className="text-[0.5rem] uppercase tracking-luxury text-mist/45">{label}</p><p className="mt-5 font-display text-5xl text-gold-300">{value}</p></div>;
}

function AdminNav({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return <button onClick={onClick} className={cn("flex w-full items-center gap-3 px-4 py-3 text-left text-xs transition", active ? "bg-gold-300 text-ink" : "text-mist/55 hover:bg-white/[0.04] hover:text-ivory")}>{icon}{children}</button>;
}
