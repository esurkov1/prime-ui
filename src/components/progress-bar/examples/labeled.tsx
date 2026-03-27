import { ProgressBar } from "prime-ui-kit";

/** Visible label above the track; `aria-labelledby` references the label (playground: `snippets/progress/bar-label.tsx`). */
export default function ProgressBarLabeledExample() {
  return <ProgressBar.Root value={60} label="Profile completion" />;
}
