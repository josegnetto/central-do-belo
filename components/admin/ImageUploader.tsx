"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { compressImage } from "@/lib/image-compress";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Configure o Supabase para fazer upload de imagens reais.");
      return;
    }

    setUploading(true);
    setError(null);

    // otimiza no navegador antes de subir (máx. 2000px, alta qualidade)
    const optimized = await compressImage(file);

    const supabase = createClient();
    const extension = optimized.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("covers").upload(path, optimized, {
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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) uploadFile(file);
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!event.dataTransfer.types.includes("Files")) return;
    dragCounter.current += 1;
    setIsDraggingOver(true);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDraggingOver(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDraggingOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink-soft">Imagem de capa</label>

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {value ? (
          <div
            className={cn(
              "shadow-soft-sm relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-md border transition-colors",
              isDraggingOver ? "border-accent" : "border-line",
            )}
          >
            <Image src={value} alt="Capa da publicação" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-paper hover:bg-ink cursor-pointer"
              aria-label="Remover imagem"
            >
              <X className="h-4 w-4" />
            </button>
            {isDraggingOver ? (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-medium text-paper">
                Solte para substituir
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex aspect-[16/9] w-full max-w-md flex-col items-center justify-center gap-2 rounded-sm border border-dashed bg-paper text-muted hover:border-ink hover:text-ink-soft cursor-pointer disabled:opacity-60 transition-colors",
              isDraggingOver ? "border-accent bg-accent-soft text-accent" : "border-line",
            )}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
            <span className="text-sm">
              {uploading
                ? "Enviando..."
                : isDraggingOver
                  ? "Solte a imagem aqui"
                  : "Selecionar ou arrastar imagem"}
            </span>
          </button>
        )}
      </div>

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
