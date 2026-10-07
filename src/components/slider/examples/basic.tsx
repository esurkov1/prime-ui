/** A single labelled slider with its value. Use it to check the track and thumb on canvas, cards and floating layers. */
import { Slider } from "prime-ui-kit";

export default function SliderBasicExample() {
  return <Slider.Root label="Громкость" showValue defaultValue={60} />;
}
