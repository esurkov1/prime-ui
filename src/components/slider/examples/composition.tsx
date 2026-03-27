import { Slider } from "prime-ui-kit";

/**
 * Visible `label` (linked `label` / `htmlFor` to the input) vs no visible label — then set `aria-label`
 * for screen readers (fractional step for “layer opacity”).
 */
export default function SliderCompositionExample() {
  return (
    <>
      <Slider.Root label="Screen brightness" defaultValue={55} />
      <Slider.Root defaultValue={20} min={0} max={1} step={0.05} aria-label="Layer opacity" />
    </>
  );
}
