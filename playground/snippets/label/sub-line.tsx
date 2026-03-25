import { Label } from "@/components/label/Label";

/** Вторая строка через `Label.Sub` — пояснение без отдельного компонента подсказки. */
export default function LabelSubLineSnippet() {
  return (
    <Label.Root htmlFor="demo-label-sub">
      Бюджет кампании
      <Label.Sub>в рублях, без НДС</Label.Sub>
    </Label.Root>
  );
}
