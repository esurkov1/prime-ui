import { ProgressBar } from "prime-ui-kit";

/** Four sizes: track height and label scale from `--prime-sys-size-control-{s|m|l|xl}-*` (playground: `snippets/progress/bar-sizes.tsx`). */
export default function ProgressBarSizesExample() {
  return (
    <>
      <ProgressBar.Root size="s" value={30} label="Size s" />
      <ProgressBar.Root size="m" value={40} label="Size m" />
      <ProgressBar.Root size="l" value={50} label="Size l" />
      <ProgressBar.Root size="xl" value={60} label="Size xl" />
    </>
  );
}
