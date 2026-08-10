"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Pencil, Plus, Receipt, RotateCcw, TicketPercent, Trash2 } from "lucide-react";

import { CouponAdminView } from "@/components/admin/coupon-admin-view";
import { OrderAdminView } from "@/components/admin/order-admin-view";
import { useAuth } from "@/components/providers/auth-provider";
import { useCoupons } from "@/components/providers/coupon-provider";
import { useSiteContent } from "@/components/providers/site-content-provider";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/auth-api";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { LandingContent, LandingListKey, LandingTextKey } from "@/types/site-content";
import { PerfumeFormModal } from "@/components/admin/perfume-form-modal";

type AdminView = "overview" | "landing" | "products" | "coupons" | "orders";

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
  const { coupons } = useCoupons();
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
            <AdminNav active={view === "coupons"} onClick={() => setView("coupons")} icon={<TicketPercent className="size-4" />}>Coupons</AdminNav>
            <AdminNav active={view === "orders"} onClick={() => setView("orders")} icon={<Receipt className="size-4" />}>Orders</AdminNav>
          </nav>
          <button onClick={() => void logout()} className="mt-6 flex items-center gap-3 text-[0.62rem] uppercase tracking-editorial text-ivory hover:text-ivory lg:mt-12">
            <LogOut className="size-4" /> Sign out
          </button>
        </aside>

        <main className="min-w-0 p-6 sm:p-10 lg:p-14">
          {view === "overview" && (
            <>
              <AdminHeading eyebrow="Dashboard" title="Good evening." description="Manage the storefront experience from one place." />
              <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Products" value={String(content.products.length)} />
                <Stat label="Featured scents" value={String(content.products.filter((item) => item.featured).length)} />
                <Stat label="Active coupons" value={String(coupons.filter((coupon) => coupon.status === "active").length)} />
                <Stat label="Storefront" value="Live" />
              </div>
              <div className="mt-10 border border-white/20 bg-white/[0.06] p-7">
                <p className="text-[0.6rem] uppercase tracking-luxury text-gold-300">Storage mode</p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-ivory">
                  Landing content, products and coupons are stored on the server. Saved changes publish to every visitor immediately.
                </p>
              </div>
            </>
          )}

          {view === "landing" && (
            <LandingEditor
              value={content.landing}
              loading={content.landingLoading}
              onSave={content.updateLanding}
              onReset={content.resetContent}
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

          {view === "coupons" && <CouponAdminView products={content.products} />}

          {view === "orders" && <OrderAdminView />}
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

type TextField = { key: LandingTextKey; label: string; help: string; multiline?: boolean };

type ListField = {
  key: LandingListKey;
  title: string;
  help: string;
  addLabel: string;
  create: () => Record<string, string>;
  fields: { key: string; label: string; multiline?: boolean }[];
};

type LandingGroup = {
  number: string;
  title: string;
  help: string;
  fields?: TextField[];
  lists?: ListField[];
};

const landingGroups: LandingGroup[] = [
  {
    number: "01",
    title: "Hero — opening",
    help: "The main copy on the cinematic screen visitors see first.",
    fields: [
      { key: "heroEyebrow", label: "Small heading", help: "Small gold text above the headline." },
      { key: "heroTitleLead", label: "Headline line 1", help: "The first line, in the regular style." },
      { key: "heroTitleHighlight", label: "Headline line 2 (italic gold)", help: "The second line, shown in italic gold." },
      { key: "heroPrimaryCtaLabel", label: "Button label", help: "The hero's primary call to action." },
      { key: "heroPrimaryCtaHref", label: "Button link", help: "For example /shop or /collection." },
      { key: "heroScrollHint", label: "Scroll hint", help: "The prompt to scroll, shown at the bottom of the screen." },
    ],
  },
  {
    number: "02",
    title: "Hero — scroll stages",
    help: "The second and third hero panels that appear as visitors scroll.",
    fields: [
      { key: "heroSprayEyebrow", label: "Stage 2 small heading", help: "Small label for the spray moment." },
      { key: "heroSprayTitle", label: "Stage 2 heading", help: "Large headline for the spray moment." },
      { key: "heroSprayDescription", label: "Stage 2 description", help: "One or two lines of supporting text.", multiline: true },
      { key: "heroFinalEyebrow", label: "Stage 3 small heading", help: "Small label for the final panel." },
      { key: "heroFinalTitle", label: "Stage 3 heading", help: "Closing headline." },
      { key: "heroFinalCtaLabel", label: "Stage 3 button label", help: "Text on the closing button." },
      { key: "heroFinalCtaHref", label: "Stage 3 button link", help: "Where the button leads." },
    ],
  },
  {
    number: "03",
    title: "Announcement bar",
    help: "The slim information strip shown directly below the hero.",
    fields: [{ key: "announcement", label: "Announcement message", help: "Keep it short — delivery, an offer or a launch update." }],
  },
  {
    number: "04",
    title: "Signature section",
    help: "The brand's main introduction, shown beside the large bottle.",
    fields: [
      { key: "signatureEyebrow", label: "Small heading", help: "Small gold text above the heading." },
      { key: "signatureTitle", label: "Main heading", help: "The section's large luxury headline." },
      { key: "signatureDescription", label: "Description", help: "Two or three lines on the fragrance philosophy.", multiline: true },
      { key: "signatureBottleName", label: "Bottle label name", help: "The name printed on the illustrated bottle." },
      { key: "signatureBottleCaption", label: "Bottle caption", help: "Small caption below the bottle." },
    ],
    lists: [
      {
        key: "signatureStats",
        title: "Stats",
        help: "Three to six numbers that showcase craftsmanship.",
        addLabel: "Add stat",
        create: () => ({ value: "", label: "" }),
        fields: [
          { key: "value", label: "Value" },
          { key: "label", label: "Label" },
        ],
      },
    ],
  },
  {
    number: "05",
    title: "Collection section",
    help: "The heading above the product grid, plus its empty state message.",
    fields: [
      { key: "collectionEyebrow", label: "Small heading", help: "Small label above the grid." },
      { key: "collectionTitle", label: "Main heading", help: "The collection's headline." },
      { key: "collectionCtaLabel", label: "Button label", help: "Link text for the full catalogue." },
      { key: "collectionCtaHref", label: "Button link", help: "For example /shop." },
      { key: "collectionEmptyMessage", label: "Empty catalogue message", help: "Shown when no products have been published.", multiline: true },
    ],
  },
  {
    number: "06",
    title: "Our story",
    help: "The brand quotation, image and short history on the cream background.",
    fields: [
      { key: "storyEyebrow", label: "Small heading", help: "Label above the quotation." },
      { key: "storyQuote", label: "Story quotation", help: "Quotation marks are added automatically." },
      { key: "storyDescription", label: "Story summary", help: "A short introduction to the brand's history.", multiline: true },
      { key: "storyCtaLabel", label: "Button label", help: "Link text for the full story page." },
      { key: "storyCtaHref", label: "Button link", help: "For example /story." },
      { key: "storyFooterNote", label: "Footer note", help: "Short line shown beside the button." },
      { key: "storyImageUrl", label: "Image URL", help: "Either /images/… or a full https URL." },
      { key: "storyImageAlt", label: "Image alt text", help: "A description of the image, for accessibility." },
      { key: "storyImageEyebrow", label: "Image overlay label", help: "Small text laid over the image." },
      { key: "storyImageTitle", label: "Image overlay heading", help: "Headline laid over the image." },
    ],
  },
  {
    number: "07",
    title: "Ingredients",
    help: "The grid of rare materials and its heading.",
    fields: [
      { key: "ingredientsEyebrow", label: "Small heading", help: "Small label above the grid." },
      { key: "ingredientsTitle", label: "Main heading", help: "Headline for the materials section." },
      { key: "ingredientsDescription", label: "Description", help: "Your sourcing philosophy in two lines.", multiline: true },
    ],
    lists: [
      {
        key: "ingredients",
        title: "Ingredient cards",
        help: "Numbering is applied automatically.",
        addLabel: "Add ingredient",
        create: () => ({ name: "", description: "" }),
        fields: [
          { key: "name", label: "Name" },
          { key: "description", label: "Description", multiline: true },
        ],
      },
    ],
  },
  {
    number: "08",
    title: "Experience",
    help: "The full-width dark panel for private consultations.",
    fields: [
      { key: "experienceEyebrow", label: "Small heading", help: "Small label above the headline." },
      { key: "experienceTitle", label: "Main heading", help: "The panel's large headline." },
      { key: "experienceDescription", label: "Description", help: "Describe what the consultation is like.", multiline: true },
      { key: "experienceCtaLabel", label: "Button label", help: "Text on the appointment button." },
      { key: "experienceCtaHref", label: "Button link", help: "For example /contact." },
    ],
  },
  {
    number: "09",
    title: "Testimonials",
    help: "The scrolling strip of client quotes.",
    lists: [
      {
        key: "testimonials",
        title: "Client quotes",
        help: "Quotation marks are added automatically. Leave this empty to hide the section.",
        addLabel: "Add testimonial",
        create: () => ({ quote: "", author: "Verified client" }),
        fields: [
          { key: "quote", label: "Quote", multiline: true },
          { key: "author", label: "Author" },
        ],
      },
    ],
  },
  {
    number: "10",
    title: "Newsletter",
    help: "The email subscription section shown just above the footer.",
    fields: [
      { key: "newsletterEyebrow", label: "Small heading", help: "Small label above the heading." },
      { key: "newsletterTitle", label: "Newsletter heading", help: "Give visitors a clear reason to subscribe." },
      { key: "newsletterDescription", label: "Newsletter description", help: "Explain what subscribers will receive.", multiline: true },
      { key: "newsletterPlaceholder", label: "Email input placeholder", help: "Hint text shown inside the input box." },
    ],
  },
];

const inputClass = "h-16 w-full border border-white/30 bg-black/40 px-5 text-base text-ivory outline-none focus:border-gold-300";
const textareaClass = "w-full border border-white/30 bg-black/40 p-5 text-base text-ivory outline-none focus:border-gold-300";

function LandingEditor({
  value,
  loading,
  onSave,
  onReset,
}: {
  value: LandingContent;
  loading: boolean;
  onSave: (value: LandingContent) => Promise<void>;
  onReset: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const updateText = (key: LandingTextKey, nextValue: string) =>
    setDraft((current) => ({ ...current, [key]: nextValue }));

  const readList = (current: LandingContent, key: LandingListKey) =>
    current[key] as unknown as Record<string, string>[];

  const writeList = (key: LandingListKey, next: Record<string, string>[]) =>
    setDraft((current) => ({ ...current, [key]: next }) as LandingContent);

  const updateItem = (key: LandingListKey, index: number, field: string, nextValue: string) =>
    setDraft((current) => {
      const next = readList(current, key).map((item, position) =>
        position === index ? { ...item, [field]: nextValue } : item,
      );
      return { ...current, [key]: next } as LandingContent;
    });

  const addItem = (list: ListField) =>
    setDraft((current) => ({ ...current, [list.key]: [...readList(current, list.key), list.create()] }) as LandingContent);

  const removeItem = (key: LandingListKey, index: number) =>
    setDraft((current) => ({ ...current, [key]: readList(current, key).filter((_, position) => position !== index) }) as LandingContent);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus("saving");
    try {
      await onSave(draft);
      setStatus("saved");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Failed to save landing content");
    }
  };

  const reset = async () => {
    if (!window.confirm("Reset all landing content to defaults?")) return;
    setError(null);
    try {
      await onReset();
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Failed to reset landing content");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <AdminHeading eyebrow="Content" title="Landing page" description="Every section of the homepage, published live from the API." />
        <button type="button" onClick={() => void reset()} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-editorial text-ivory hover:text-gold-300"><RotateCcw className="size-4" /> Reset defaults</button>
      </div>

      {loading && <p className="mt-6 text-sm text-ivory/85">Loading published content…</p>}

      <form onSubmit={(event) => void submit(event)} className="mt-10 grid gap-5">
        {landingGroups.map((group) => (
          <section key={group.number} className="grid gap-8 border border-white/30 bg-white/[0.075] p-6 sm:p-8 lg:grid-cols-[15rem_1fr]">
            <div>
              <span className="text-xs font-semibold tracking-luxury text-gold-300">{group.number}</span>
              <h2 className="mt-3 font-display text-4xl text-ivory">{group.title}</h2>
              <p className="mt-4 text-base leading-7 text-ivory/90">{group.help}</p>
            </div>
            <div className="space-y-5">
              {group.fields?.map((item) => (
                <div key={item.key}>
                  <label htmlFor={item.key} className="mb-3 block text-xs font-semibold uppercase tracking-luxury text-ivory">{item.label}</label>
                  {item.multiline ? (
                    <textarea id={item.key} value={draft[item.key]} onChange={(event) => updateText(item.key, event.target.value)} rows={3} className={textareaClass} />
                  ) : (
                    <input id={item.key} value={draft[item.key]} onChange={(event) => updateText(item.key, event.target.value)} className={inputClass} />
                  )}
                  <p className="mt-2 text-sm leading-6 text-ivory/85">{item.help}</p>
                </div>
              ))}

              {group.lists?.map((list) => (
                <div key={list.key} className="border-t border-white/20 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-luxury text-ivory">{list.title}</p>
                      <p className="mt-2 text-sm leading-6 text-ivory/85">{list.help}</p>
                    </div>
                    <button type="button" onClick={() => addItem(list)} className="flex items-center gap-2 border border-white/25 px-4 py-2.5 text-xs uppercase tracking-editorial text-ivory hover:border-gold-300/50 hover:text-gold-300">
                      <Plus className="size-3.5" /> {list.addLabel}
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {readList(draft, list.key).map((item, index) => (
                      <div key={`${list.key}-${index}`} className="border border-white/20 bg-black/25 p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-editorial text-gold-300">{String(index + 1).padStart(2, "0")}</span>
                          <button type="button" aria-label={`Remove item ${index + 1}`} onClick={() => removeItem(list.key, index)} className="border border-white/20 p-2 text-ivory/95 hover:border-red-400/40 hover:text-red-300">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          {list.fields.map((field) => (
                            <div key={field.key} className={field.multiline ? "sm:col-span-2" : undefined}>
                              <label htmlFor={`${list.key}-${index}-${field.key}`} className="mb-2 block text-xs font-semibold uppercase tracking-luxury text-ivory">{field.label}</label>
                              {field.multiline ? (
                                <textarea id={`${list.key}-${index}-${field.key}`} value={item[field.key] ?? ""} onChange={(event) => updateItem(list.key, index, field.key, event.target.value)} rows={2} className={textareaClass} />
                              ) : (
                                <input id={`${list.key}-${index}-${field.key}`} value={item[field.key] ?? ""} onChange={(event) => updateItem(list.key, index, field.key, event.target.value)} className={inputClass} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="sticky bottom-5 z-10 mt-2 flex flex-wrap items-center justify-end gap-4 border border-white/20 bg-obsidian/90 p-4 backdrop-blur-xl">
          {error && <p className="mr-auto text-sm text-red-300">{error}</p>}
          {!error && status === "saved" && <p className="mr-auto text-sm text-gold-300">Published to the live site.</p>}
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save all landing changes"}
          </Button>
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
