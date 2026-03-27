import { Slider } from "prime-ui-kit";

/** Default interaction vs `disabled`: lower opacity and no pointer/keyboard input on the range control. */
export default function SliderStatesExample() {
  return (
    <>
      <Slider.Root label="Volume" defaultValue={45} />
      <Slider.Root label="Disabled example" defaultValue={35} disabled />
    </>
  );
}
