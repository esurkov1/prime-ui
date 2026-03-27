import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import { Icon } from "@/icons";

export default function BreadcrumbCompositionSnippet() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/help" aria-label="Справка">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
          }}
        >
          <Icon surface="raised" name="nav.home" tone="default" />
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item href="/help/billing">Оплата</Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item current>Возврат средств</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
