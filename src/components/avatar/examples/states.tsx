/** A loaded photo, a broken URL that falls back to initials, and an icon fallback for a guest. */
import { Avatar, Icon, Typography } from "prime-ui-kit";

const PHOTO = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

export default function AvatarStatesExample() {
  return (
    <div>
      <div>
        <Avatar.Root size="xl" color="green">
          <Avatar.Image src={PHOTO} alt="Михаил Котов" />
          <Avatar.Fallback>МК</Avatar.Fallback>
        </Avatar.Root>
        <Typography as="span" variant="caption" tone="muted">
          loaded
        </Typography>
      </div>
      <div>
        <Avatar.Root size="xl" color="orange">
          <Avatar.Image src="https://example.com/missing-avatar.png" alt="Сергей Лебедев" />
          <Avatar.Fallback>СЛ</Avatar.Fallback>
        </Avatar.Root>
        <Typography as="span" variant="caption" tone="muted">
          error
        </Typography>
      </div>
      <div>
        <Avatar.Root size="xl" aria-label="Гость">
          <Avatar.Fallback>
            <Icon name="field.email" />
          </Avatar.Fallback>
        </Avatar.Root>
        <Typography as="span" variant="caption" tone="muted">
          icon
        </Typography>
      </div>
    </div>
  );
}
