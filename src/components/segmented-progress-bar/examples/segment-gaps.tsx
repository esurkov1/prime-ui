import { SegmentedProgressBar } from "prime-ui-kit";

const segments = [
  { value: 50, label: "Region A", tone: "primary" as const },
  { value: 50, label: "Region B", tone: "neutral" as const },
];

/** Default continuous bar vs hairline separators — weights and tones are unchanged. */
export default function SegmentGapsExample() {
  return (
    <>
      <SegmentedProgressBar.Root
        segments={segments}
        label="Continuous (default, segmentGap none)"
      />
      <SegmentedProgressBar.Root
        segmentGap="hairline"
        segments={segments}
        label="Hairline separators"
      />
    </>
  );
}
