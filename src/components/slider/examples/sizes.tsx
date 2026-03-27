import { Slider } from "prime-ui-kit";

/**
 * Four `size` values (`s`–`xl`): track height, thumb, and label type ramp stay on one control token tier.
 */
export default function SliderSizesExample() {
  return (
    <>
      <Slider.Root size="s" label="Size s" defaultValue={30} />
      <Slider.Root size="m" label="Size m" defaultValue={40} />
      <Slider.Root size="l" label="Size l" defaultValue={50} />
      <Slider.Root size="xl" label="Size xl" defaultValue={60} />
    </>
  );
}
