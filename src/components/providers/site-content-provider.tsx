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
import { landingApi } from "@/lib/landing-api";
import { perfumeApi } from "@/lib/perfume-api";
import type { Product } from "@/types/product";
import type { LandingContent, ManagedSiteContent } from "@/types/site-content";

interface SiteContentContextValue extends ManagedSiteContent {
  updateLanding: (landing: LandingContent) => Promise<void>;
  saveProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  resetContent: () => Promise<void>;
  productsLoading: boolean;
  landingLoading: boolean;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [content, setContent] = useState<ManagedSiteContent>(defaultSiteContent);
  const [productsLoading, setProductsLoading] = useState(true);
  const [landingLoading, setLandingLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void landingApi
      .get()
      .then(({ landing }) => {
        if (!active) return;
        setContent((current) => ({ ...current, landing }));
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLandingLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void perfumeApi
      .list()
      .then(({ perfumes }) => {
        if (!active) return;
        try {
          const cached = window.localStorage.getItem("autoroma-local-products");
          if (cached) {
            const localList = JSON.parse(cached) as Product[];
            const merged = [...perfumes];
            for (const lp of localList) {
              if (!merged.some((p) => p.id === lp.id)) merged.push(lp);
            }
            setContent((current) => ({ ...current, products: merged }));
            return;
          }
        } catch {}
        setContent((current) => ({ ...current, products: perfumes }));
      })
      .catch(() => {
        if (!active) return;
        try {
          const cached = window.localStorage.getItem("autoroma-local-products");
          if (cached) {
            setContent((current) => ({ ...current, products: JSON.parse(cached) }));
            return;
          }
        } catch {}
        setContent((current) => ({ ...current, products: [] }));
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateLanding = useCallback(
    async (landing: LandingContent) => {
      if (!accessToken) throw new Error("Admin authentication required");
      try {
        const response = await landingApi.update(landing, accessToken);
        setContent((current) => ({ ...current, landing: response.landing }));
      } catch {
        setContent((current) => ({ ...current, landing }));
      }
    },
    [accessToken],
  );

  const saveProduct = useCallback(
    async (product: Product) => {
      if (!accessToken) throw new Error("Admin authentication required");

      let saved = product;
      try {
        const isNew = !content.products.some((item) => item.id === product.id);
        const response = isNew
          ? await perfumeApi.create(product, accessToken)
          : await perfumeApi.update(product.id, product, accessToken);
        saved = response.perfume;
      } catch (err) {
        console.warn("Backend API offline; persisting product locally:", err);
      }

      setContent((current) => {
        const exists = current.products.some((item) => item.id === saved.id);
        const next = exists
          ? current.products.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current.products];
        try {
          window.localStorage.setItem("autoroma-local-products", JSON.stringify(next));
        } catch {}
        return {
          ...current,
          products: next,
        };
      });
      return saved;
    },
    [accessToken, content.products],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!accessToken) throw new Error("Admin authentication required");
      try {
        await perfumeApi.remove(id, accessToken);
      } catch (err) {
        console.warn("Backend API offline; deleting product locally:", err);
      }
      setContent((current) => {
        const next = current.products.filter((product) => product.id !== id);
        try {
          window.localStorage.setItem("autoroma-local-products", JSON.stringify(next));
        } catch {}
        return {
          ...current,
          products: next,
        };
      });
    },
    [accessToken],
  );

  const resetContent = useCallback(async () => {
    if (!accessToken) throw new Error("Admin authentication required");
    try {
      const response = await landingApi.reset(accessToken);
      setContent((current) => ({ ...current, landing: response.landing }));
    } catch {
      setContent((current) => ({ ...current, landing: defaultSiteContent.landing }));
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({
      ...content,
      updateLanding,
      saveProduct,
      deleteProduct,
      resetContent,
      productsLoading,
      landingLoading,
    }),
    [
      content,
      deleteProduct,
      landingLoading,
      productsLoading,
      resetContent,
      saveProduct,
      updateLanding,
    ],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return context;
}
