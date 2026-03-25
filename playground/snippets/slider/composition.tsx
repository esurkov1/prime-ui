import { Slider } from "@/components/slider/Slider";

/**
 * С подписью через `label` (связь `label`/`htmlFor` с ползунком) и без видимой подписи —
 * тогда нужен `aria-label` для скринридеров.
 */
export default function SliderCompositionSnippet() {
  return (
    <>
      <Slider.Root label="Яркость экрана" defaultValue={55} />
      <Slider.Root defaultValue={20} min={0} max={1} step={0.05} aria-label="Прозрачность слоя" />
    </>
  );
}
