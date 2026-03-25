import { Slider } from "@/components/slider/Slider";

/** Обычный ползунок и заблокированный: `disabled` снижает непрозрачность и отключает ввод. */
export default function SliderStatesSnippet() {
  return (
    <>
      <Slider.Root label="Громкость" defaultValue={45} />
      <Slider.Root label="Отключённый пример" defaultValue={35} disabled />
    </>
  );
}
