import { Button, Hint } from "prime-ui-kit";
import * as React from "react";

/** Parent drives `variant` (and copy) from state — e.g. after validation. */
export default function HintControlledVariantExample() {
  const [variant, setVariant] = React.useState<"default" | "error">("default");

  return (
    <>
      <Button.Root size="s" variant="neutral" mode="stroke" onClick={() => setVariant("default")}>
        Reset
      </Button.Root>
      <Button.Root size="s" variant="error" mode="lighter" onClick={() => setVariant("error")}>
        Show error
      </Button.Root>
      <Hint.Root size="m" variant={variant}>
        {variant === "error"
          ? "Fill the field before saving the draft."
          : "You can save the draft without required fields."}
      </Hint.Root>
    </>
  );
}
