import { Label } from "@/components/label/Label";
import { Icon } from "@/icons";

/** Текст и с иконкой в `Label.Icon` — по одному размеру на строку. */
export default function LabelSizesSnippet() {
  return (
    <>
      <Label.Root size="s">Label s</Label.Root>
      <Label.Root size="m">Label m</Label.Root>
      <Label.Root size="l">Label l</Label.Root>
      <Label.Root size="xl">Label xl</Label.Root>
      <Label.Root size="s">
        <Label.Icon>
          <Icon aria-hidden name="nav.home" />
        </Label.Icon>
        Label s
      </Label.Root>
      <Label.Root size="m">
        <Label.Icon>
          <Icon aria-hidden name="nav.home" />
        </Label.Icon>
        Label m
      </Label.Root>
      <Label.Root size="l">
        <Label.Icon>
          <Icon aria-hidden name="nav.home" />
        </Label.Icon>
        Label l
      </Label.Root>
      <Label.Root size="xl">
        <Label.Icon>
          <Icon aria-hidden name="nav.home" />
        </Label.Icon>
        Label xl
      </Label.Root>
    </>
  );
}
