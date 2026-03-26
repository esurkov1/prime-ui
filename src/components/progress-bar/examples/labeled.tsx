import { ProgressBar } from "prime-ui-kit";

/** Visible label above the track; the native `progress` gets `aria-labelledby` for the same text. */
export default function ProgressBarLabeledExample() {
  return <ProgressBar.Root value={60} max={100} label="Profile completion" size="m" />;
}
