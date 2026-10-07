/** The path to this page: links to the levels above and the current page last — `href`, `current`. */
import { Breadcrumb } from "prime-ui-kit";

export default function BreadcrumbOverviewExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="#crm">CRM</Breadcrumb.Item>
      <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
      <Breadcrumb.Item current>ООО «Северный ветер»</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
