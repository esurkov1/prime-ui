/** A loaded photo, a broken URL that falls back to initials, and an icon fallback for a guest — `Avatar.Image`, `Avatar.Fallback`. */
import { Avatar, Icon, Typography } from "prime-ui-kit";

const PHOTO = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

export default function AvatarStatesExample() {
  return (
    <div>
      <div>
        <Avatar.Root color="green" aria-label="Михаил Котов">
          <Avatar.Image src={PHOTO} />
          <Avatar.Fallback>МК</Avatar.Fallback>
        </Avatar.Root>
        <Typography as="span" variant="caption" tone="muted">
          loaded
        </Typography>
      </div>
      <div>
        <Avatar.Root color="orange" aria-label="Сергей Лебедев">
          <Avatar.Image src="https://example.com/missing-avatar.png" />
          <Avatar.Fallback>СЛ</Avatar.Fallback>
        </Avatar.Root>
        <Typography as="span" variant="caption" tone="muted">
          error
        </Typography>
      </div>
      <div>
        <Avatar.Root aria-label="Гость">
          <Avatar.Fallback>
            <Icon name="object.user" />
          </Avatar.Fallback>
        </Avatar.Root>
        <Typography as="span" variant="caption" tone="muted">
          icon
        </Typography>
      </div>
    </div>
  );
}
