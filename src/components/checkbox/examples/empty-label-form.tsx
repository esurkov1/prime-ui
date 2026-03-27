import { Checkbox } from "prime-ui-kit";

/**
 * Matches playground `snippets/checkbox/specific.tsx`: no visible label text — set an accessible name on
 * Root; optional name/value for form submission.
 */
export function EmptyLabelFormExample() {
  return (
    <>
      <Checkbox.Root size="m" aria-label="Receive digest by email (no visible label)">
        <Checkbox.Label />
      </Checkbox.Root>
      <Checkbox.Root
        size="m"
        name="newsletter"
        value="weekly"
        defaultChecked
        aria-label="Subscribe to weekly newsletter"
      >
        <Checkbox.Label />
      </Checkbox.Root>
    </>
  );
}
