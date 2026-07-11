"use client";

import { useState } from "react";
import { Link2, MessageCircle } from "lucide-react";
import { FacebookIcon, XIcon } from "@/components/icons/BrandIcons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // navegador sem suporte à Clipboard API
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">Compartilhar</span>
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartilhar no ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent transition-colors"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar link"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent transition-colors cursor-pointer"
      >
        <Link2 className="h-4 w-4" />
      </button>
      {copied ? <span className="text-xs text-accent">Link copiado!</span> : null}
    </div>
  );
}
