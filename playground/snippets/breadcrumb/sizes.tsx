import { Breadcrumb, type BreadcrumbSize } from "@/components/breadcrumb/Breadcrumb";

function BreadcrumbSizeRow({ size }: { size: BreadcrumbSize }) {
  return (
    <Breadcrumb.Root size={size}>
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog">Каталог</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Страница</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}

export default function BreadcrumbSizesSnippet() {
  return (
    <>
      <BreadcrumbSizeRow size="s" />
      <BreadcrumbSizeRow size="m" />
      <BreadcrumbSizeRow size="l" />
      <BreadcrumbSizeRow size="xl" />
    </>
  );
}
