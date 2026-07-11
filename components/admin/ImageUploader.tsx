"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Button } from "@/components/ui/Button";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isSupabaseConfigured()) {
      setError("Configure o Supabase para fazer upload de imagens reais.");
      return;
    }

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("covers").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    setUploading(false);

    if (uploadError) {
      setError("Falha ao enviar a imagem. Tente novamente.");
      return;
    }

    const { data } = supabase.storage.from("covers").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink-soft">Imagem de capa</label>

      {value ? (
        <div className="shadow-soft-sm relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-md border border-line">
          <Image src={value} alt="Capa da publicação" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-paper hover:bg-ink cursor-pointer"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[16/9] w-full max-w-md flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-line bg-paper text-muted hover:border-ink hover:text-ink-soft cursor-pointer disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          <span className="text-sm">{uploading ? "Enviando..." : "Selecionar imagem"}</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {value ? (
        <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => inputRef.current?.click()}>
          Trocar imagem
        </Button>
      ) : null}

      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
    </div>
  );
}
