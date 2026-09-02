import type { JSONContent } from "@tiptap/core";
import { proxiedCoverPath } from "@/lib/image-proxy";

// Renderiza o JSON do Tiptap para HTML sem depender de nenhuma implementação
// de DOM (jsdom/happy-dom). O `@tiptap/html` (generateHTML) resolve, em
// ambiente servidor, para uma variante que usa `happy-dom`, que por sua vez
// usa o módulo `vm` do Node — não suportado no runtime do Cloudflare
// Workers (erro "contextifiedObject must be a vm.Context"). Este serializer
// cobre exatamente os nós/marcas habilitados em lib/tiptap-extensions.ts.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function applyMarks(escapedText: string, marks: JSONContent["marks"]): string {
  if (!marks || marks.length === 0) return escapedText;

  return marks.reduce((html, mark) => {
    switch (mark.type) {
      case "bold":
        return `<strong>${html}</strong>`;
      case "italic":
        return `<em>${html}</em>`;
      case "underline":
        return `<u>${html}</u>`;
      case "strike":
        return `<s>${html}</s>`;
      case "code":
        return `<code>${html}</code>`;
      case "link": {
        const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
        if (!href) return html;
        const target = typeof mark.attrs?.target === "string" ? mark.attrs.target : "_blank";
        const rel =
          typeof mark.attrs?.rel === "string" ? mark.attrs.rel : "noopener noreferrer nofollow";
        return `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}" rel="${escapeHtml(rel)}">${html}</a>`;
      }
      default:
        return html;
    }
  }, escapedText);
}

function renderChildren(node: JSONContent): string {
  if (!node.content || node.content.length === 0) return "";
  return node.content.map(renderNode).join("");
}

function renderNode(node: JSONContent): string {
  switch (node.type) {
    case "doc":
      return renderChildren(node);
    case "paragraph":
      return `<p>${renderChildren(node)}</p>`;
    case "heading": {
      const level = Math.min(6, Math.max(1, Number(node.attrs?.level) || 2));
      return `<h${level}>${renderChildren(node)}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${renderChildren(node)}</ul>`;
    case "orderedList": {
      const start = Number(node.attrs?.start);
      const startAttr = start && start !== 1 ? ` start="${start}"` : "";
      return `<ol${startAttr}>${renderChildren(node)}</ol>`;
    }
    case "listItem":
      return `<li>${renderChildren(node)}</li>`;
    case "blockquote":
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${renderChildren(node)}</code></pre>`;
    case "horizontalRule":
      return "<hr>";
    case "hardBreak":
      return "<br>";
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      if (!src) return "";
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      const title = typeof node.attrs?.title === "string" ? node.attrs.title : "";
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<img src="${escapeHtml(proxiedCoverPath(src))}" alt="${escapeHtml(alt)}"${titleAttr} loading="lazy">`;
    }
    case "text":
      return applyMarks(escapeHtml(node.text ?? ""), node.marks);
    default:
      // tipo de nó desconhecido: renderiza só os filhos, sem quebrar a página
      return renderChildren(node);
  }
}

export function renderTiptapContent(doc: JSONContent | null | undefined): string {
  if (!doc) return "";
  return renderNode(doc);
}
