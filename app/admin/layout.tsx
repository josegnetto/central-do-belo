import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Painel administrativo",
    template: "%s | Painel administrativo",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-full bg-paper-muted">{children}</div>;
}
