import { SegmentedProgressBar } from "@/components/segmented-progress-bar/SegmentedProgressBar";

const segments = [
  { value: 2, label: "A", tone: "danger" as const },
  { value: 3, label: "B", tone: "pending" as const },
  { value: 5, label: "C", tone: "success" as const },
];

export default function SegmentedSizesSnippet() {
  return (
    <>
      <SegmentedProgressBar.Root size="s" segments={segments} />
      <SegmentedProgressBar.Root size="m" segments={segments} />
      <SegmentedProgressBar.Root size="l" segments={segments} />
      <SegmentedProgressBar.Root size="xl" segments={segments} />
    </>
  );
}
