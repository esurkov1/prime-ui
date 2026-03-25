import { Avatar } from "@/components/avatar/Avatar";

const okSrc = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/** Три ситуации: нет картинки (контекст idle), успешная загрузка, ошибка URL. */
export default function AvatarStatesSnippet() {
  return (
    <div className="row rowAlignCenter rowGapMedium">
      <Avatar.Root size="xl">
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Image src={okSrc} alt="Пользователь" />
        <Avatar.Fallback>CD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Image src="https://example.com/missing-avatar.png" alt="" />
        <Avatar.Fallback>!</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
