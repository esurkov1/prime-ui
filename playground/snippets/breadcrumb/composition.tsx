import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import styles from "@/components/breadcrumb/Breadcrumb.module.css";
import { Icon } from "@/icons";

export default function BreadcrumbCompositionSnippet() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/help" className={styles.itemHome} aria-label="Справка">
        <Icon name="nav.home" tone="default" />
      </Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item href="/help/billing">Оплата</Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item current>Возврат средств</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
