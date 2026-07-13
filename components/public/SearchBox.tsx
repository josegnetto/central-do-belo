"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

export function SearchBox({ initialQuery = "", className }: { initialQuery?: string; className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/busca?q=${encodeURIComponent(trimmed)}` : "/busca");
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label className="relative flex items-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-within:scale-[1.02]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar no portal"
          className="peer w-full rounded-sm border border-line bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted transition-all duration-300 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-soft"
        />
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted transition-colors duration-300 peer-focus:text-accent" />
      </label>
    </form>
  );
}
