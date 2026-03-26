import { Breadcrumb } from "prime-ui-kit";

/**
 * Collapsed middle: you choose which segments stay visible; `Ellipsis` is static text, not a menu.
 * Pair each part with `Separator` between items (including around the ellipsis).
 */
export default function BreadcrumbLongPathEllipsisExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog">Catalog</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog/furniture/chairs/office">Office chairs</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Model X</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
