import { SegmentedProgressBar } from "prime-ui-kit";

/** Non-status categories: tones differentiate segments without implying pass/fail. */
export default function StorageMixExample() {
  return (
    <SegmentedProgressBar.Root
      label="Disk usage by type"
      segmentGap="hairline"
      segments={[
        { value: 42, label: "Documents", tone: "primary" },
        { value: 33, label: "Media", tone: "neutral" },
        { value: 25, label: "Applications", tone: "warning" },
      ]}
    />
  );
}
