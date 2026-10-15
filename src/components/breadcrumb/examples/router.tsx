/** Router links as the levels above: the path moves without a reload; render it inside a router — `asChild`, `current`. */
import { Breadcrumb } from "prime-ui-kit";
import { Link } from "react-router-dom";

export default function BreadcrumbRouterExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item asChild>
        <Link to="/crm">CRM</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item asChild>
        <Link to="/crm/clients">Клиенты</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item current>ООО «Северный ветер»</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
