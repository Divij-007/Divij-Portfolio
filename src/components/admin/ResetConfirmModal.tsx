import { useState, useEffect } from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetConfirmModalProps) {
  const [typedText, setTypedText] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTypedText("");
      setIsResetting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = typedText.trim().toUpperCase() === "RESET";

  const handleExecute = async () => {
    if (!isConfirmed || isResetting) return;
    setIsResetting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl border border-rose-500/30 bg-[hsl(var(--surface-glass))] backdrop-blur-2xl shadow-2xl space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isResetting}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50] transition-colors"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-foreground">
              Confirm Factory Reset
            </h3>
            <p className="text-xs text-rose-400/90 font-medium mt-0.5">
              Warning: Destructive Action
            </p>
          </div>
        </div>

        {/* Warning explanation */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          This will permanently revert all sections, personal biography, work experience, certifications, and theme preferences back to initial factory defaults.
        </p>

        {/* Type to confirm box */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
          <label className="block text-xs font-semibold text-foreground/90">
            To proceed, type <span className="font-mono text-rose-400 font-bold">RESET</span> below:
          </label>
          <input
            type="text"
            autoFocus
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type RESET to confirm"
            disabled={isResetting}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono bg-[hsl(var(--bg))] border border-rose-500/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 tracking-wider text-center uppercase"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isResetting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-border))/50] transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExecute}
            disabled={!isConfirmed || isResetting}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
              isConfirmed && !isResetting
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 scale-[1.02]"
                : "bg-rose-500/20 text-rose-300/40 cursor-not-allowed border border-rose-500/20"
            )}
          >
            <RotateCcw className={cn("w-3.5 h-3.5", isResetting && "animate-spin")} />
            <span>{isResetting ? "Resetting..." : "Reset All Content"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
