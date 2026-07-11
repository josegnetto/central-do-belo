import type { JSONContent } from "@tiptap/core";

const WORDS_PER_MINUTE = 200;

function extractTextFromNode(node: JSONContent): string {
  let text = node.text ?? "";
  if (node.content) {
    text += " " + node.content.map(extractTextFromNode).join(" ");
  }
  return text;
}

export function extractPlainText(doc: JSONContent | null | undefined): string {
  if (!doc) return "";
  return extractTextFromNode(doc).replace(/\s+/g, " ").trim();
}

export function estimateReadingTimeMinutes(doc: JSONContent | null | undefined): number {
  const text = extractPlainText(doc);
  if (!text) return 1;
  const wordCount = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
