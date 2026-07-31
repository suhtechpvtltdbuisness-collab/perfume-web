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

import { defaultSiteContent } from "@/constants/site-content";
import type { Product } from "@/types/product";
import type { LandingContent, ManagedSiteContent } from "@/types/site-content";

interface SiteContentContextValue extends ManagedSiteContent {
  updateLanding: (landing: LandingContent) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetContent: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);
const storageKey = "aurelia-site-content";

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ManagedSiteContent>(defaultSiteContent);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrate = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) setContent(JSON.parse(stored) as ManagedSiteContent);
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrate);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(content));
  }, [content, ready]);

  const updateLanding = useCallback((landing: LandingContent) => {
    setContent((current) => ({ ...current, landing }));
  }, []);

  const saveProduct = useCallback((product: Product) => {
    setContent((current) => {
      const exists = current.products.some((item) => item.id === product.id);
      return {
        ...current,
        products: exists
          ? current.products.map((item) => (item.id === product.id ? product : item))
          : [product, ...current.products],
      };
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setContent((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    }));
  }, []);

  const resetContent = useCallback(() => setContent(defaultSiteContent), []);

  const value = useMemo(
    () => ({ ...content, updateLanding, saveProduct, deleteProduct, resetContent }),
    [content, deleteProduct, resetContent, saveProduct, updateLanding],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return context;
}
