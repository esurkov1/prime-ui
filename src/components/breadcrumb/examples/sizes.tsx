import { Breadcrumb, type BreadcrumbSize } from "prime-ui-kit";

function BreadcrumbSizeRow({ size }: { size: BreadcrumbSize }) {
  return (
    <Breadcrumb.Root size={size}>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog">Catalog</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Page</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}

/** Four stacked trails: `size` `s` → `xl` on `Breadcrumb.Root` (matches playground `snippets/breadcrumb/sizes.tsx`). */
export default function BreadcrumbSizesExample() {
  return (
    <>
      <BreadcrumbSizeRow size="s" />
      <BreadcrumbSizeRow size="m" />
      <BreadcrumbSizeRow size="l" />
      <BreadcrumbSizeRow size="xl" />
    </>
  );
}
