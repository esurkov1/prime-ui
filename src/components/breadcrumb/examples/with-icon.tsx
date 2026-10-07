/** The root level as a home icon; a link without text is named for screen readers — `aria-label`. */
import { Breadcrumb, Icon } from "prime-ui-kit";

export default function BreadcrumbWithIconExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="#home" aria-label="Главная">
        <Icon name="nav.home" />
      </Breadcrumb.Item>
      <Breadcrumb.Item href="#invoices">Счета</Breadcrumb.Item>
      <Breadcrumb.Item current>Счёт № 2041</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
