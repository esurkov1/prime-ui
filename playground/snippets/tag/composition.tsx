import { Tag } from "@/components/tag/Tag";
import { Icon } from "@/icons";

export default function TagCompositionSnippet() {
  return (
    <div className="row rowGapTight rowAlignCenter">
      <Tag.Root>
        <Tag.Icon>
          <Icon surface="none" name="field.email" />
        </Tag.Icon>
        <span>Рассылка</span>
      </Tag.Root>
      <Tag.Root>Только подпись</Tag.Root>
      <Tag.Root onRemove={() => undefined}>Снять метку</Tag.Root>
    </div>
  );
}
