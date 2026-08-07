"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Posições de anúncio do site. Cada uma recebe o ID numérico da unidade de
 * anúncio criada no painel do AdSense (Anúncios > Por unidade de anúncio).
 *
 * IMPORTANTE: o `data-ad-slot` precisa ser o ID numérico gerado pelo AdSense
 * (ex.: "1234567890"). Nomes livres como "home-top" fazem a unidade não
 * renderizar e deixam espaços de anúncio quebrados durante a análise do Google.
 * Enquanto a variável correspondente não estiver definida, o bloco simplesmente
 * não é renderizado — melhor nenhum anúncio do que um anúncio quebrado.
 */
const SLOT_IDS: Record<AdSlotName, string | undefined> = {
  "home-top": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP,
  "article-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM,
  "category-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY_BOTTOM,
  "publicacoes-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_PUBLICACOES_BOTTOM,
};

export type AdSlotName =
  | "home-top"
  | "article-bottom"
  | "category-bottom"
  | "publicacoes-bottom";

export function AdSlot({ slot, className }: { slot: AdSlotName; className?: string }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId = SLOT_IDS[slot];
  const enabled = Boolean(clientId && slotId);
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle ainda não carregado
    }
  }, [enabled]);

  if (!enabled) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        className={`flex items-center justify-center rounded-sm border border-dashed border-line bg-paper-muted px-3 text-center text-xs text-muted ${className ?? "min-h-24"}`}
      >
        Espaço reservado para anúncio ({clientId ? `defina o ID da unidade "${slot}"` : "AdSense não configurado"})
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
