"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { SearchBox } from "@/components/public/SearchBox";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { StarMark } from "@/components/ui/StarMark";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="shadow-soft-sm sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-5">
          {CATEGORIES.map((category, index) => (
            <span key={category.value} className="flex items-center gap-5">
              {index > 0 ? <StarMark className="h-3 w-3" /> : null}
              <Link
                href={`/${category.slug}`}
                className="nav-underline py-1 text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-accent"
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
            className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-ink transition-all duration-300 hover:bg-paper-muted hover:text-accent active:scale-90"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu
              className={cn(
                "absolute h-6 w-6 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
              )}
            />
            <X
              className={cn(
                "absolute h-6 w-6 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
              )}
            />
          </button>
        </div>
      </div>

      {open ? (
        <div className="menu-enter md:hidden border-t border-line px-4 pb-4 pt-2">
          <div className="mb-3">
            <SearchBox />
          </div>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2.5 text-sm font-medium text-ink-soft transition-all duration-300 hover:translate-x-1 hover:bg-paper-muted hover:text-accent active:translate-x-1 active:bg-paper-muted active:text-accent active:scale-[0.98]"
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
