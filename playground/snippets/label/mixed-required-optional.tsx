import { Label } from "@/components/label/Label";

/** Рядом: обязательное поле со звёздочкой и необязательное с пометкой в `Label.Sub`. */
export default function LabelMixedRequiredOptionalSnippet() {
  return (
    <>
      <Label.Root htmlFor="demo-label-mx-1">
        Номер договора
        <Label.Asterisk />
      </Label.Root>
      <Label.Root htmlFor="demo-label-mx-2">
        Примечание к заказу
        <Label.Sub>необязательно</Label.Sub>
      </Label.Root>
    </>
  );
}
