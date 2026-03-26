import { Slider } from "@/components/slider/Slider";

/** Корень тянется на 100% ширины родителя — удобно в колонке карточки или формы. */
export default function SliderFullWidthSnippet() {
  return (
    <div className="previewBannerNarrowColumn">
      <Slider.Root label="Ширина в узкой колонке" defaultValue={40} />
    </div>
  );
}
