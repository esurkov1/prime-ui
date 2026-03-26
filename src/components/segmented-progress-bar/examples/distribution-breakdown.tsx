import { SegmentedProgressBar } from "prime-ui-kit";

/** Part-to-whole job outcomes with a visible title and per-segment labels for tooltips and SR distribution. */
export default function DistributionBreakdownExample() {
  return (
    <SegmentedProgressBar.Root
      label="Pipeline results"
      segments={[
        { value: 30, label: "Failed", tone: "danger" },
        { value: 25, label: "Queued", tone: "warning" },
        { value: 35, label: "Succeeded", tone: "success" },
        { value: 10, label: "Skipped", tone: "neutral" },
      ]}
    />
  );
}
