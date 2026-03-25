import { Tag } from "@/components/tag/Tag";
import { Icon } from "@/icons";

export default function TagWithIconSnippet() {
  return (
    <div className="row rowGapTight">
      <Tag.Root>
        <Tag.Icon>
          <Icon name="status.locked" />
        </Tag.Icon>
        <span>Secured</span>
      </Tag.Root>
      <Tag.Root>
        <Tag.Icon>
          <Icon name="field.email" />
        </Tag.Icon>
        <span>Newsletter</span>
      </Tag.Root>
    </div>
  );
}
