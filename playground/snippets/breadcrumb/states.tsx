import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";

export default function BreadcrumbStatesSnippet() {
  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item href="/orders">Заказы</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>Заказ № 1042</Breadcrumb.Item>
      </Breadcrumb.Root>
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/courses">Курсы</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Модуль 3</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>Урок: введение</Breadcrumb.Item>
      </Breadcrumb.Root>
    </>
  );
}
