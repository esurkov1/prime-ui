import { Breadcrumb } from "prime-ui-kit";

/** Smallest valid trail: previous level as link, current page as text with `current`. */
export default function BreadcrumbCanonicalExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Current page</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
