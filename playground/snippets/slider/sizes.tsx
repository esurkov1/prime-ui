import { Slider } from "@/components/slider/Slider";

/** Четыре размера: трек, бегунок и подпись из `--prime-sys-size-control-{s|m|l|xl}-*`. */
export default function SliderSizesSnippet() {
  return (
    <>
      <Slider.Root size="s" label="Размер s" defaultValue={30} />
      <Slider.Root size="m" label="Размер m" defaultValue={40} />
      <Slider.Root size="l" label="Размер l" defaultValue={50} />
      <Slider.Root size="xl" label="Размер xl" defaultValue={60} />
    </>
  );
}
