/** The root level as a home icon; a link without text is named for screen readers — `aria-label`. */
import { Breadcrumb, Icon, Typography } from "prime-ui-kit";

export default function BreadcrumbWithIconExample() {
  return (
    <div>
      <div>
        <Breadcrumb.Root>
          <Breadcrumb.Item href="#home" aria-label="Главная">
            <Icon name="nav.home" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#invoices">Счета</Breadcrumb.Item>
          <Breadcrumb.Item current>Счёт № 2041</Breadcrumb.Item>
        </Breadcrumb.Root>
        <Typography as="span" variant="caption" tone="muted">
          aria-label
        </Typography>
      </div>
    </div>
  );
}
