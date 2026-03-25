import { ProgressBar } from "@/components/progress-bar/ProgressBar";

/** Четыре размера: высота трека, подпись и gap из `--prime-sys-size-control-{s|m|l|xl}-*`, как у Slider. */
export default function ProgressBarSizesSnippet() {
  return (
    <>
      <ProgressBar.Root size="s" value={30} label="Размер s" />
      <ProgressBar.Root size="m" value={40} label="Размер m" />
      <ProgressBar.Root size="l" value={50} label="Размер l" />
      <ProgressBar.Root size="xl" value={60} label="Размер xl" />
    </>
  );
}
