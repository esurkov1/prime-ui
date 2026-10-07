/** Levels skipped on purpose shown as «…» with hidden text for screen readers — `Breadcrumb.Ellipsis`. */
import { Breadcrumb } from "prime-ui-kit";

export default function BreadcrumbEllipsisExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="#catalog">Каталог</Breadcrumb.Item>
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Item current>Кресло «Оптима»</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
