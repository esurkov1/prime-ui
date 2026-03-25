import { Avatar } from "@/components/avatar/Avatar";

const sampleSrc =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/** Два видимых участника + слот «ещё 3» (всего в списке 5). */
export default function AvatarGroupOverflowSnippet() {
  return (
    <Avatar.Group.Root size="xl" aria-label="Участники: показаны 2, ещё 3">
      <Avatar.Root>
        <Avatar.Image src={sampleSrc} alt="" />
        <Avatar.Fallback>A</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Fallback>B</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Group.Overflow aria-label="Ещё три участника">+3</Avatar.Group.Overflow>
    </Avatar.Group.Root>
  );
}
