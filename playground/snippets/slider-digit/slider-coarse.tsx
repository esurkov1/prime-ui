import { Slider } from "@/components/slider/Slider";

export default function SliderCoarseSnippet() {
  return <Slider.Root label="Brightness" min={0} max={100} step={25} defaultValue={50} />;
}
