import { LinkButton } from "prime-ui-kit";

/** External URL opened in a new tab: always set <code>rel="noopener noreferrer"</code> with <code>target="_blank"</code>. */
export default function LinkButtonExternalExample() {
  return (
    <p>
      Documentation in a separate tab:{" "}
      <LinkButton.Root
        href="https://example.com/docs"
        target="_blank"
        rel="noopener noreferrer"
        size="m"
      >
        Open help
      </LinkButton.Root>
    </p>
  );
}
