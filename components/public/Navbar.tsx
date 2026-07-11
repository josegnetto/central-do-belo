"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { SearchBox } from "@/components/public/SearchBox";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="shadow-soft-sm sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-5">
          {CATEGORIES.map((category, index) => (
            <span key={category.value} className="flex items-center gap-5">
              {index > 0 ? <span className="star-divider text-xs select-none">★</span> : null}
              <Link
                href={`/${category.slug}`}
                className="text-sm font-medium text-ink-soft hover:text-accent transition-colors"
              >
                {category.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="hidden md:block w-56">
          <SearchBox />
        </div>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-ink"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden border-t border-line px-4 pb-4 pt-2">
          <div className="mb-3">
            <SearchBox />
          </div>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2 text-sm font-medium text-ink-soft hover:bg-paper-muted"
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
