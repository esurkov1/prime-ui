import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";

export default function BreadcrumbFullWidthSnippet() {
  return (
    <div
      style={{
        maxWidth: 200,
        padding: "8px",
        border: "1px dashed var(--prime-sys-color-border-default)",
      }}
    >
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/org">ООО «Транзит»</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item href="/org/hubs">Хабы</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>Восточный терминал</Breadcrumb.Item>
      </Breadcrumb.Root>
    </div>
  );
}
