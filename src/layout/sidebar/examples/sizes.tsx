/** Sidebar `size` xs → xl: item height, text and icon of the control tier; the rail width stays the same. Match the density of the app. */
import { Home, Inbox, Settings } from "lucide-react";
import { type ControlSize, Sidebar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function SidebarSizesExample() {
  return (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.sizeColumn}>
          <Typography.Root variant="caption" tone="muted">
            size="{size}"
          </Typography.Root>
          <div className={`${styles.stage} ${styles.stageAuto}`}>
            <Sidebar.Root size={size} responsive={false}>
              <Sidebar.Content>
                <Sidebar.Item icon={<Home />} active>
                  Главная
                </Sidebar.Item>
                <Sidebar.Item icon={<Inbox />} badge={4}>
                  Входящие
                </Sidebar.Item>
                <Sidebar.Item icon={<Settings />}>Настройки</Sidebar.Item>
              </Sidebar.Content>
            </Sidebar.Root>
          </div>
        </div>
      ))}
    </div>
  );
}
