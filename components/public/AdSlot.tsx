"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slot, className }: { slot: string; className?: string }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle ainda não carregado
    }
  }, [clientId]);

  if (!clientId) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        className={`flex items-center justify-center rounded-sm border border-dashed border-line bg-paper-muted text-xs text-muted ${className ?? "min-h-24"}`}
      >
        Espaço reservado para anúncio (AdSense não configurado)
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
