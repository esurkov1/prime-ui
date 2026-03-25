import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";

export default function BreadcrumbLongEllipsisSnippet() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog">Каталог</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/catalog/furniture/chairs/office">Офисные кресла</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Модель X</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
