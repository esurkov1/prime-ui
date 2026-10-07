/** Long path: segments truncate, from five children the middle collapses into «…» below 30rem (still announced), plus a manual `Breadcrumb.Ellipsis`. Use for deep catalogs and long page names. */
import { Breadcrumb, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

function Path() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="#">Каталог</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="#">Мебель</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="#">Офисные кресла</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>
        Эргономичное кресло с подголовником и поддержкой поясницы
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}

export default function BreadcrumbCollapseExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          Полная ширина
        </Typography.Root>
        <Path />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          320px — автосворачивание
        </Typography.Root>
        <div className={styles.narrow}>
          <Path />
        </div>
      </div>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          Вручную:{" "}
          <Typography.Root as="span" variant="code" tone="muted">
            Breadcrumb.Ellipsis
          </Typography.Root>
        </Typography.Root>
        <Breadcrumb.Root>
          <Breadcrumb.Item href="#">Каталог</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Ellipsis />
          <Breadcrumb.Separator />
          <Breadcrumb.Item current>Кресло «Оптима»</Breadcrumb.Item>
        </Breadcrumb.Root>
      </div>
    </div>
  );
}
