/** Own bounds and a coarse or fractional step; a slider without a visible label — `min`, `max`, `step`, `aria-label`. */
import { Slider } from "prime-ui-kit";

export default function SliderRangeStepExample() {
  return (
    <>
      <Slider label="Готовность проекта" step={25} defaultValue={50} showValue />
      <Slider
        label="Минимальный рейтинг поставщика"
        min={1}
        max={5}
        step={0.5}
        defaultValue={4}
        showValue
      />
      <Slider defaultValue={30} aria-label="Масштаб карты складов" />
    </>
  );
}
