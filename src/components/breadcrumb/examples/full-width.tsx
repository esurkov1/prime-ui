import { Breadcrumb } from "prime-ui-kit";

/**
 * Narrow container so the inner `ol` wraps (`flex-wrap` in component styles). Matches playground `snippets/breadcrumb/full-width.tsx`.
 */
export default function BreadcrumbFullWidthExample() {
  return (
    <div
      style={{
        maxWidth: 200,
        padding: "8px",
        border: "1px dashed var(--prime-sys-color-border-default)",
      }}
    >
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/org">Transit LLC</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item href="/org/hubs">Hubs</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>East terminal</Breadcrumb.Item>
      </Breadcrumb.Root>
    </div>
  );
}
