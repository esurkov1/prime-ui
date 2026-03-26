import { Breadcrumb } from "prime-ui-kit";

/** Storefront hierarchy down to a product detail page. */
export default function BreadcrumbEcommerceProductExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog">Catalog</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog/furniture">Furniture</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog/furniture/chairs">Chairs</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Ergo Mesh Pro</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
