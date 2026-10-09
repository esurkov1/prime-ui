/** Brand colors under the channels in the panel and a translucent overlay color — `presets`, `alpha`. */
import { ColorField } from "prime-ui-kit/color-picker";

const BRAND_COLORS = [
  { value: "#5b5bd6", label: "Индиго" },
  { value: "#0090ff", label: "Синий" },
  { value: "#12a594", label: "Бирюзовый" },
  { value: "#30a46c", label: "Зелёный" },
  { value: "#f76b15", label: "Оранжевый" },
  { value: "#e5484d", label: "Красный" },
];

export default function ColorFieldPresetsExample() {
  return (
    <>
      <ColorField label="Цвет проекта" defaultValue="#12a594" presets={BRAND_COLORS} />
      <ColorField label="Затемнение обложки" defaultValue="#0000008C" alpha />
    </>
  );
}
