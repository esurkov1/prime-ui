import { ProgressBar } from "@/components/progress-bar/ProgressBar";

export default function ProgressBarValuesSnippet() {
  return (
    <>
      <ProgressBar.Root value={0} />
      <ProgressBar.Root value={25} />
      <ProgressBar.Root value={75} />
      <ProgressBar.Root value={100} />
    </>
  );
}
