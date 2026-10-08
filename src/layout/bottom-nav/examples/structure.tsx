/** Counts on the icons and a section that is not available yet — `BottomNav.ItemCount`, `disabled`. */
import { BottomNav, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BottomNavStructureExample() {
  return (
    <div className={styles.phone}>
      <div className={styles.screen}>
        <Typography as="h2" variant="title-m">
          Главная
        </Typography>
        <Typography variant="body-m" tone="secondary">
          12 новых заказов и 3 сообщения от клиентов.
        </Typography>
      </div>
      <BottomNav.Root>
        <BottomNav.Item current>
          <BottomNav.ItemIcon>
            <Icon name="nav.home" />
          </BottomNav.ItemIcon>
          Главная
        </BottomNav.Item>
        <BottomNav.Item>
          <BottomNav.ItemIcon>
            <Icon name="object.package" />
          </BottomNav.ItemIcon>
          <BottomNav.ItemCount>12</BottomNav.ItemCount>
          Заказы
        </BottomNav.Item>
        <BottomNav.Item>
          <BottomNav.ItemIcon>
            <Icon name="object.message" />
          </BottomNav.ItemIcon>
          <BottomNav.ItemCount color="blue">3</BottomNav.ItemCount>
          Сообщения
        </BottomNav.Item>
        <BottomNav.Item disabled>
          <BottomNav.ItemIcon>
            <Icon name="object.chart" />
          </BottomNav.ItemIcon>
          Отчёты
        </BottomNav.Item>
      </BottomNav.Root>
    </div>
  );
}
