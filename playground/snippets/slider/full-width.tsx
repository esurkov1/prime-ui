import { Slider } from "@/components/slider/Slider";

/** Корень тянется на 100% ширины родителя — удобно в колонке карточки или формы. */
export default function SliderFullWidthSnippet() {
  return (
    <div
      style={{
        maxWidth: 280,
        padding: 16,
        border: "1px solid var(--prime-sys-color-border-subtle)",
        borderRadius: 12,
      }}
    >
      <Slider.Root label="Ширина в узкой колонке" defaultValue={40} />
    </div>
  );
}
