"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Crosshair, ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { compressImage } from "@/lib/image-compress";
import {
  DEFAULT_FRAMING,
  parseCoverFraming,
  withCoverFraming,
} from "@/lib/cover-framing";
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
  const frameRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const dragCounter = useRef(0);

  const framing = parseCoverFraming(value);
  const hasCustomFraming = framing.x !== DEFAULT_FRAMING.x || framing.y !== DEFAULT_FRAMING.y;

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

  // --- Ajuste de enquadramento (ponto focal) ---

  function applyFramingFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (!value || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    onChange(withCoverFraming(value, { x, y }));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // não inicia ajuste quando o clique foi num botão sobreposto (ex.: remover)
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    frameRef.current?.setPointerCapture(event.pointerId);
    setIsAdjusting(true);
    applyFramingFromPointer(event);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isAdjusting) return;
    applyFramingFromPointer(event);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isAdjusting) return;
    setIsAdjusting(false);
    frameRef.current?.releasePointerCapture(event.pointerId);
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
            ref={frameRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              "shadow-soft-sm relative aspect-[16/9] w-full max-w-md touch-none select-none overflow-hidden rounded-md border transition-colors",
              isAdjusting ? "cursor-grabbing border-accent" : "cursor-crosshair",
              !isAdjusting && (isDraggingOver ? "border-accent" : "border-line"),
            )}
          >
            <Image
              src={value}
              alt="Capa da publicação"
              fill
              className="pointer-events-none object-cover"
              style={{ objectPosition: `${framing.x}% ${framing.y}%` }}
            />

            {/* marcador do ponto focal */}
            <span
              className="pointer-events-none absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-paper bg-accent/80 shadow-[0_0_0_2px_var(--color-accent-soft)]"
              style={{ left: `${framing.x}%`, top: `${framing.y}%` }}
              aria-hidden
            >
              <Crosshair className="h-3.5 w-3.5 text-paper" />
            </span>

            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-paper hover:bg-ink cursor-pointer"
              aria-label="Remover imagem"
            >
              <X className="h-4 w-4" />
            </button>

            {isDraggingOver ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/60 text-sm font-medium text-paper">
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
        <>
          <p className="mt-2 text-xs text-muted">
            Clique ou arraste sobre a imagem para escolher o ponto de enquadramento — ele fica
            sempre visível nos cortes do site (cards, destaque e página da notícia).
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Trocar imagem
            </Button>
            {hasCustomFraming ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(withCoverFraming(value, DEFAULT_FRAMING))}
              >
                Centralizar enquadramento
              </Button>
            ) : null}
          </div>
        </>
      ) : null}

      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
    </div>
  );
}
