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

  const updateLanding = useCallback(
    async (landing: LandingContent) => {
      if (!accessToken) throw new Error("Admin authentication required");
      const response = await landingApi.update(landing, accessToken);
      setContent((current) => ({ ...current, landing: response.landing }));
    },
    [accessToken],
  );

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

  const resetContent = useCallback(async () => {
    if (!accessToken) throw new Error("Admin authentication required");
    const response = await landingApi.reset(accessToken);
    setContent((current) => ({ ...current, landing: response.landing }));
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
