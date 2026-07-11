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
      <label className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar no portal"
          className="w-full rounded-sm border border-line bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
      </label>
    </form>
  );
}
