import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "shine-sweep bg-accent text-paper hover:bg-accent-dark shadow-[0_8px_24px_-8px_var(--color-accent-soft)] hover:shadow-[0_12px_32px_-8px_var(--color-accent-soft)]",
  secondary: "bg-paper text-ink border border-line hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-ink hover:bg-paper-muted hover:text-accent",
  danger: "bg-transparent text-accent border border-accent hover:bg-accent hover:text-paper",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
