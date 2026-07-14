const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.9;
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024; // imagens já pequenas sobem intactas

/**
 * Reduz a imagem no navegador antes do upload, sem perda visual perceptível:
 * redimensiona para no máximo 2000px no lado maior e recomprime em alta
 * qualidade. PNG mantém transparência; GIF/SVG e falhas de qualquer tipo
 * caem no arquivo original.
 */
export async function compressImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));

    if (scale === 1 && file.size < SKIP_BELOW_BYTES) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }

    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const targetType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, targetType, JPEG_QUALITY),
    );

    // se a recompressão não diminuiu o arquivo, mantém o original
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "capa";
    const extension = targetType === "image/png" ? "png" : "jpg";
    return new File([blob], `${baseName}.${extension}`, { type: targetType });
  } catch {
    return file;
  }
}
