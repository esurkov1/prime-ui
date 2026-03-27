import { Avatar } from "@/components/avatar/Avatar";
import { Icon } from "@/icons";

const sampleSrc =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/** Слоты Image и Fallback: фото с запасными инициалами и плейсхолдер с иконкой. */
export default function AvatarCompositionSnippet() {
  return (
    <div className="row rowAlignCenter rowGapMedium">
      <Avatar.Root size="xl">
        <Avatar.Image src={sampleSrc} alt="" />
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Fallback>
          <Icon name="field.email" size="xl" tone="subtle" />
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
