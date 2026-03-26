import { Breadcrumb } from "prime-ui-kit";

/** Docs IA: section → subsection → article (no ellipsis). */
export default function BreadcrumbDeepDocumentationExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item href="/docs">Documentation</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/docs/guides">Guides</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item href="/docs/guides/accessibility">Accessibility</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item current>Focus order</Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
