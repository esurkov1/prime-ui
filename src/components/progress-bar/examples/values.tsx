import { ProgressBar } from "prime-ui-kit";

/** Determinate fill at 0%, 25%, 75%, and 100% without labels (playground: `snippets/progress/bar-values.tsx`). */
export default function ProgressBarValuesExample() {
  return (
    <>
      <ProgressBar.Root value={0} />
      <ProgressBar.Root value={25} />
      <ProgressBar.Root value={75} />
      <ProgressBar.Root value={100} />
    </>
  );
}
