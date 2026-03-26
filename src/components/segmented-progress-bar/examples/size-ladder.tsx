import { SegmentedProgressBar } from "prime-ui-kit";

const segments = [
  { value: 40, tone: "danger" as const },
  { value: 35, tone: "warning" as const },
  { value: 25, tone: "success" as const },
];

/** Same weights across the control size scale (aligned with ProgressBar). */
export default function SizeLadderExample() {
  return (
    <>
      <SegmentedProgressBar.Root size="s" segments={segments} />
      <SegmentedProgressBar.Root size="m" segments={segments} />
      <SegmentedProgressBar.Root size="l" segments={segments} />
      <SegmentedProgressBar.Root size="xl" segments={segments} />
    </>
  );
}
