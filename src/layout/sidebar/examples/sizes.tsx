/** Every size tier: item height, text, icon and counter follow the tier; the rail width stays — `size`. */
import { Icon, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SidebarSizesExample() {
  return (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.sizeColumn}>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
          <div className={`${styles.stage} ${styles.stageAuto}`}>
            <Sidebar.Root size={size} responsive={false}>
              <Sidebar.Content>
                <Sidebar.Item current>
                  <Sidebar.ItemIcon>
                    <Icon name="nav.home" />
                  </Sidebar.ItemIcon>
                  Главная
                </Sidebar.Item>
                <Sidebar.Item>
                  <Sidebar.ItemIcon>
                    <Icon name="field.email" />
                  </Sidebar.ItemIcon>
                  Входящие
                  <Sidebar.ItemCount>4</Sidebar.ItemCount>
                </Sidebar.Item>
              </Sidebar.Content>
            </Sidebar.Root>
          </div>
        </div>
      ))}
    </div>
  );
}
