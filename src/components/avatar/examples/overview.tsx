/** A photo with initials underneath while it loads, and initials alone; the name is on the avatar itself — `Avatar.Image`, `Avatar.Fallback`, `aria-label`. */
import { Avatar } from "prime-ui-kit";

const PHOTO = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

export default function AvatarOverviewExample() {
  return (
    <>
      <Avatar.Root color="green" aria-label="Михаил Котов">
        <Avatar.Image src={PHOTO} />
        <Avatar.Fallback>МК</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root color="purple" aria-label="Ольга Белова">
        <Avatar.Fallback>ОБ</Avatar.Fallback>
      </Avatar.Root>
    </>
  );
}
