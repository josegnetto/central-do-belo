"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";
const CHANGE_EVENT = "cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "accepted";
  } catch {
    return true;
  }
}

// Durante o SSR consideramos aceito para o banner não piscar; ele aparece após a hidratação.
function getServerSnapshot(): boolean {
  return true;
}

export function CookieBanner() {
  const accepted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (accepted) return null;

  function handleAccept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // armazenamento indisponível (modo privado); o banner voltará na próxima visita
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="text-sm text-ink-soft">
          Usamos cookies para melhorar sua experiência, medir audiência e exibir anúncios. Ao
          continuar navegando, você concorda com a nossa{" "}
          <Link href="/politica-de-privacidade" className="font-semibold text-accent hover:text-accent-dark">
            Política de Privacidade
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="shrink-0 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-paper hover:bg-accent-dark transition-colors cursor-pointer"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
