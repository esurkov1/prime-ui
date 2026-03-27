import { Slider } from "prime-ui-kit";

/** Custom range and stepping: `min` / `max` / `step` — e.g. whole degrees or coarse percentage stops. */
export default function SliderFeaturesExample() {
  return (
    <>
      <Slider.Root label="Temperature, °C" min={16} max={30} step={1} defaultValue={22} />
      <Slider.Root
        label="Position by quarters (step 25)"
        min={0}
        max={100}
        step={25}
        defaultValue={50}
      />
    </>
  );
}
