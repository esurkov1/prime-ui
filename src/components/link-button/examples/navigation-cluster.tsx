import { LinkButton } from "prime-ui-kit";

/** Horizontal cluster of primary nav targets; named <code>nav</code> + text separators (layout can move to page grid/flex). */
export default function LinkButtonNavigationClusterExample() {
  return (
    <nav aria-label="Product sections">
      <LinkButton.Root href="/product/overview">Overview</LinkButton.Root>
      <span aria-hidden> · </span>
      <LinkButton.Root href="/product/pricing">Pricing</LinkButton.Root>
      <span aria-hidden> · </span>
      <LinkButton.Root href="/product/security">Security</LinkButton.Root>
      <span aria-hidden> · </span>
      <LinkButton.Root href="/product/changelog">Changelog</LinkButton.Root>
    </nav>
  );
}
