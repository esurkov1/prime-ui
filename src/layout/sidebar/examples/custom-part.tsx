/** A part of your own in the footer reads the rail state: the storage meter shows on the full rail and in the off-canvas panel and steps aside on the icon rail — `useSidebar`. */
import { Icon, ProgressBar, Sidebar, useSidebar } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Calls `useSidebar`, so it must render inside `Sidebar.Root`. */
function StorageUsage() {
  const { mode, offCanvas } = useSidebar();
  if (mode === "compact" && !offCanvas) return null;
  return (
    <div className={styles.footerBlock}>
      <ProgressBar value={72} label="Хранилище · 7,2 из 10 ГБ" />
    </div>
  );
}

export default function SidebarCustomPartExample() {
  return (
    <div className={styles.stage}>
      <Sidebar.Root offCanvas="never">
        <Sidebar.Header>
          <Sidebar.Brand href="#home" description="Отдел продаж">
            <Sidebar.BrandLogo>
              <span className={styles.logo}>
                <Icon name="nav.layoutGrid" />
              </span>
            </Sidebar.BrandLogo>
            Прайм CRM
          </Sidebar.Brand>
          <Sidebar.Toggle variant="header" />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Item current>
            <Sidebar.ItemIcon>
              <Icon name="object.file" />
            </Sidebar.ItemIcon>
            Документы
          </Sidebar.Item>
          <Sidebar.Item>
            <Sidebar.ItemIcon>
              <Icon name="object.image" />
            </Sidebar.ItemIcon>
            Медиатека
          </Sidebar.Item>
        </Sidebar.Content>
        <Sidebar.Footer>
          <StorageUsage />
        </Sidebar.Footer>
      </Sidebar.Root>
      <div className={styles.content} />
    </div>
  );
}
