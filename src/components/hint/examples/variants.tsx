import { Hint } from "prime-ui-kit";

/** `variant` on default size `m`: secondary, error, and disabled tones. */
export default function HintVariantsExample() {
  return (
    <>
      <Hint.Root size="m" variant="default">
        Neutral helper or format guidance.
      </Hint.Root>
      <Hint.Root size="m" variant="error">
        Value does not meet password policy requirements.
      </Hint.Root>
      <Hint.Root size="m" variant="disabled">
        Editing is not available for the selected role.
      </Hint.Root>
    </>
  );
}
