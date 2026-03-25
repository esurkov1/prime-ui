import { Slider } from "@/components/slider/Slider";

/** Диапазон и шаг: `min`, `max`, `step` — например температура по целым или дискретные доли. */
export default function SliderFeaturesSnippet() {
  return (
    <>
      <Slider.Root label="Температура, °C" min={16} max={30} step={1} defaultValue={22} />
      <Slider.Root
        label="Позиция по долям (шаг 25)"
        min={0}
        max={100}
        step={25}
        defaultValue={50}
      />
    </>
  );
}
