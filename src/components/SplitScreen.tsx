import { ScripturePanel } from "@/components/ScripturePanel";
import type { PassageView } from "@/types/scripture";

interface SplitScreenProps {
  bible: PassageView;
  quran: PassageView;
  onRetryBible?: () => void;
  onRetryQuran?: () => void;
}

export function SplitScreen({
  bible,
  quran,
  onRetryBible,
  onRetryQuran,
}: SplitScreenProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex flex-col lg:grid lg:grid-cols-2">
        <ScripturePanel
          source="bible"
          passage={bible}
          onRetry={onRetryBible}
        />

        <div
          role="separator"
          aria-hidden
          className="flex items-center gap-3 px-6 lg:hidden"
        >
          <span className="h-px flex-1 bg-line" />
          <span className="text-[0.65rem] font-medium tracking-[0.22em] text-muted uppercase">
            et
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="lg:border-l lg:border-line">
          <ScripturePanel
            source="quran"
            passage={quran}
            onRetry={onRetryQuran}
          />
        </div>
      </div>
    </div>
  );
}
