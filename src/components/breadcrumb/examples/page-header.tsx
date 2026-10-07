/** Page header: an `s` breadcrumb above the title and actions, the first link is a home icon with `aria-label`. Use at the top of detail pages. */
import { Breadcrumb, Button, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BreadcrumbPageHeaderExample() {
  return (
    <header className={styles.header}>
      <Breadcrumb.Root size="s">
        <Breadcrumb.Item href="#" aria-label="Главная">
          <Icon name="nav.home" />
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item href="#">Клиенты</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>ООО «Северный ветер»</Breadcrumb.Item>
      </Breadcrumb.Root>
      <div className={styles.titleRow}>
        <Typography.Root as="h2" variant="heading-m">
          ООО «Северный ветер»
        </Typography.Root>
        <div className={styles.actions}>
          <Button.Root variant="outline" tone="neutral">
            Изменить
          </Button.Root>
          <Button.Root>Новый счёт</Button.Root>
        </div>
      </div>
    </header>
  );
}
