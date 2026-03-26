import { SegmentedProgressBar } from "prime-ui-kit";

/** Rollout mix by phase: weights reflect share of accounts or environments on each tier. */
export default function MultiPhaseRolloutExample() {
  return (
    <SegmentedProgressBar.Root
      label="Feature rollout"
      segments={[
        { value: 15, label: "Internal", tone: "neutral" },
        { value: 35, label: "Beta", tone: "warning" },
        { value: 50, label: "General availability", tone: "success" },
      ]}
    />
  );
}
