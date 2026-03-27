import { Breadcrumb, Icon } from "prime-ui-kit";

/** Icon-only first item (`aria-label`) and custom `Separator` children. Matches playground `snippets/breadcrumb/composition.tsx`. */
export default function BreadcrumbCompositionExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/help" aria-label="Help home">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
          }}
        >
          <Icon name="nav.home" tone="default" />
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item href="/help/billing">Billing</Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item current>Refunds</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
