import { Breadcrumb } from "prime-ui-kit";

/** Org → area → section → leaf screen in admin / settings. */
export default function BreadcrumbSaasSettingsExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/orgs/acme">Acme Inc</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/orgs/acme/settings">Workspace settings</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/orgs/acme/settings/billing">Billing</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Invoices</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
