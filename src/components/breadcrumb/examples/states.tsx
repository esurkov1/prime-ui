import { Breadcrumb } from "prime-ui-kit";

/**
 * Top: ancestors as links, leaf with `current`. Bottom: middle segment without `href` renders as plain text (`span`).
 * Matches playground `snippets/breadcrumb/states.tsx`.
 */
export default function BreadcrumbStatesExample() {
  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item href="/orders">Orders</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>Order #1042</Breadcrumb.Item>
      </Breadcrumb.Root>
      <Breadcrumb.Root>
        <Breadcrumb.Item href="/courses">Courses</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Module 3</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item current>Lesson: introduction</Breadcrumb.Item>
      </Breadcrumb.Root>
    </>
  );
}
