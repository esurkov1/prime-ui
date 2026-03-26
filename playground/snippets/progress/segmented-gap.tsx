import { SegmentedProgressBar } from "@/components/segmented-progress-bar/SegmentedProgressBar";

const segments = [
  { value: 50, label: "A", tone: "primary" as const },
  { value: 50, label: "B", tone: "neutral" as const },
];

export default function SegmentedGapSnippet() {
  return (
    <div className="stack examplePreviewBleed">
      <SegmentedProgressBar.Root segments={segments} label="none (по умолчанию)" />
      <SegmentedProgressBar.Root segmentGap="hairline" segments={segments} label="hairline" />
    </div>
  );
}
