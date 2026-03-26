import { LinkButton } from "prime-ui-kit";

/** Dense footer legal row: smaller control tier keeps the strip compact. */
export default function LinkButtonFooterLegalExample() {
  return (
    <footer>
      <nav aria-label="Legal">
        <LinkButton.Root href="/privacy" size="s">
          Privacy
        </LinkButton.Root>
        <span aria-hidden> · </span>
        <LinkButton.Root href="/terms" size="s">
          Terms
        </LinkButton.Root>
        <span aria-hidden> · </span>
        <LinkButton.Root href="/cookies" size="s">
          Cookie policy
        </LinkButton.Root>
      </nav>
    </footer>
  );
}
