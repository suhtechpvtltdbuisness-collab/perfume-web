"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { defaultSiteContent } from "@/constants/site-content";
import { perfumeApi } from "@/lib/perfume-api";
import type { Product } from "@/types/product";
import type { LandingContent, ManagedSiteContent } from "@/types/site-content";

interface SiteContentContextValue extends ManagedSiteContent {
  updateLanding: (landing: LandingContent) => void;
  saveProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  resetContent: () => void;
  productsLoading: boolean;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);
const storageKey = "autoroma-site-content";

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [content, setContent] = useState<ManagedSiteContent>(defaultSiteContent);
  const [ready, setReady] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const hydrate = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as ManagedSiteContent;
          setContent((current) => ({ ...current, landing: parsed.landing ?? current.landing }));
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrate);
  }, []);

  useEffect(() => {
    let active = true;
    setProductsLoading(true);
    void perfumeApi
      .list()
      .then(({ perfumes }) => {
        if (!active) return;
        setContent((current) => ({ ...current, products: perfumes }));
      })
      .catch(() => {
        if (!active) return;
        setContent((current) => ({ ...current, products: [] }));
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ landing: content.landing }),
    );
  }, [content.landing, ready]);

  const updateLanding = useCallback((landing: LandingContent) => {
    setContent((current) => ({ ...current, landing }));
  }, []);

  const saveProduct = useCallback(
    async (product: Product) => {
      if (!accessToken) throw new Error("Admin authentication required");

      const isNew = !content.products.some((item) => item.id === product.id);
      const response = isNew
        ? await perfumeApi.create(product, accessToken)
        : await perfumeApi.update(product.id, product, accessToken);

      const saved = response.perfume;
      setContent((current) => {
        const exists = current.products.some((item) => item.id === saved.id);
        return {
          ...current,
          products: exists
            ? current.products.map((item) => (item.id === saved.id ? saved : item))
            : [saved, ...current.products],
        };
      });
      return saved;
    },
    [accessToken, content.products],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!accessToken) throw new Error("Admin authentication required");
      await perfumeApi.remove(id, accessToken);
      setContent((current) => ({
        ...current,
        products: current.products.filter((product) => product.id !== id),
      }));
    },
    [accessToken],
  );

  const resetContent = useCallback(() => {
    setContent((current) => ({
      ...defaultSiteContent,
      products: current.products,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...content,
      updateLanding,
      saveProduct,
      deleteProduct,
      resetContent,
      productsLoading,
    }),
    [content, deleteProduct, productsLoading, resetContent, saveProduct, updateLanding],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return context;
}
