import Link from "next/link";
import { FilePlus2, LayoutDashboard } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function AdminShell({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo href="/admin" />
              <span className="hidden text-sm font-medium text-muted sm:inline">· Admin</span>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Publicações
              </Link>
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors"
              >
                <FilePlus2 className="h-4 w-4" />
                Nova publicação
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {email ? <span className="hidden text-sm text-muted sm:inline">{email}</span> : null}
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}
