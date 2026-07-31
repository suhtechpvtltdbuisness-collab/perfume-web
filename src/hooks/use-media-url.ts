"use client";

import { useEffect, useState } from "react";
import { getMediaBlob } from "@/lib/media-store";

export function useMediaUrl(id?: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let objectUrl: string | null = null;
    let active = true;
    void getMediaBlob(id).then((blob) => {
      if (!blob || !active) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  return url;
}
