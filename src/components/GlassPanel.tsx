import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  id?: string;
  label?: string;
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Whether this panel uses its own scroll container (desktop) */
  scrollable?: boolean;
  /** Highlight ring when focused via nav */
  highlighted?: boolean;
}

export const GlassPanel = forwardRef<HTMLElement, GlassPanelProps>(
  ({ id, label, header, children, className, scrollable = false, highlighted = false }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        aria-label={label}
        tabIndex={0}
        className={cn(
          "glass rounded-2xl flex flex-col relative",
          "motion-safe-transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-hsl))]",
          highlighted && "ring-2 ring-[hsl(var(--accent-hsl))]",
          className
        )}
      >
        {header && (
          <div className="sticky top-0 z-10 px-5 py-4 border-b border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-[var(--blur-intensity)]">
            {header}
          </div>
        )}

        {scrollable ? (
          <div className="flex-1 overflow-y-auto panel-scroll panel-scroll-area px-5 py-4">
            {children}
          </div>
        ) : (
          <div className="flex-1 px-5 py-4 overflow-hidden">
            {children}
          </div>
        )}
      </section>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
