import { Button } from "prime-ui-kit";
import * as React from "react";

/**
 * Form footer: explicit `type="button"` vs `type="submit"`, plus async submit with `loading` and Spinner.
 */
export default function FormSubmitRowExample() {
  const [loading, setLoading] = React.useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1200);
      }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--prime-sys-spacing-m)",
        justifyContent: "flex-end",
      }}
    >
      <Button.Root type="button" variant="neutral" mode="stroke">
        Cancel
      </Button.Root>
      <Button.Root type="submit" variant="primary" mode="filled" loading={loading}>
        <Button.Spinner />
        Save changes
      </Button.Root>
    </form>
  );
}
