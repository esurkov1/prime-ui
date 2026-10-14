/** Levels skipped on purpose shown as «…» whose hidden text names them for screen readers — `Breadcrumb.Ellipsis`, `labels`. */
import { Breadcrumb } from "prime-ui-kit";

export default function BreadcrumbEllipsisExample() {
  return (
    <Breadcrumb.Root labels={{ ellipsis: "Скрытые разделы: Мебель, Офисные кресла" }}>
      <Breadcrumb.Item href="#catalog">Каталог</Breadcrumb.Item>
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Item current>Кресло «Оптима»</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
