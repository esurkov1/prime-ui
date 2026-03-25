import { Slider } from "@/components/slider/Slider";

export default function SliderCustomRangeSnippet() {
  return <Slider.Root label="Temperature" min={16} max={30} step={1} defaultValue={22} />;
}
