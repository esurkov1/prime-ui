/** Photo, initials without a photo, a broken URL (initials again) and an icon fallback. Always pair `Avatar.Image` with `Avatar.Fallback`. */
import { Avatar, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const photo = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

export default function AvatarStatesExample() {
  return (
    <div className={styles.sizes}>
      <div className={styles.sizeCell}>
        <Avatar.Root size="xl" color="green">
          <Avatar.Image src={photo} alt="Михаил Котов" />
          <Avatar.Fallback>МК</Avatar.Fallback>
        </Avatar.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          фото
        </Typography.Root>
      </div>
      <div className={styles.sizeCell}>
        <Avatar.Root size="xl" color="purple" aria-label="Ольга Белова">
          <Avatar.Fallback>ОБ</Avatar.Fallback>
        </Avatar.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          инициалы
        </Typography.Root>
      </div>
      <div className={styles.sizeCell}>
        <Avatar.Root size="xl" color="orange">
          <Avatar.Image src="https://example.com/missing-avatar.png" alt="Сергей Лебедев" />
          <Avatar.Fallback>СЛ</Avatar.Fallback>
        </Avatar.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          ошибка загрузки
        </Typography.Root>
      </div>
      <div className={styles.sizeCell}>
        <Avatar.Root size="xl" aria-label="Гость">
          <Avatar.Fallback>
            <Icon name="field.email" size="l" />
          </Avatar.Fallback>
        </Avatar.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          иконка
        </Typography.Root>
      </div>
    </div>
  );
}
