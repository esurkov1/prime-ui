import { SegmentedProgressBar } from "@/components/segmented-progress-bar/SegmentedProgressBar";

const segments = [
  { value: 40, tone: "danger" as const },
  { value: 35, tone: "warning" as const },
  { value: 25, tone: "success" as const },
];

export default function SegmentedSizesSnippet() {
  return (
    <div className="stack examplePreviewBleed">
      <SegmentedProgressBar.Root size="s" segments={segments} />
      <SegmentedProgressBar.Root size="m" segments={segments} />
      <SegmentedProgressBar.Root size="l" segments={segments} />
      <SegmentedProgressBar.Root size="xl" segments={segments} />
    </div>
  );
}
