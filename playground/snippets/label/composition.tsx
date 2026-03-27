import { Label } from "@/components/label/Label";
import { Icon } from "@/icons";

/** Иконка в `Label.Icon`: размер иконки согласован с `size` корня через контекст. */
export default function LabelCompositionSnippet() {
  return (
    <Label.Root htmlFor="demo-label-comp">
      <Label.Icon>
        <Icon aria-hidden name="field.email" />
      </Label.Icon>
      Контактный email
    </Label.Root>
  );
}
