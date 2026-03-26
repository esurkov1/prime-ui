import { Checkbox } from "prime-ui-kit";
import * as React from "react";

/**
 * Terms / consent: required submission, hint for context, error after failed validation.
 */
export function TermsAcceptanceExample() {
  const [accepted, setAccepted] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accepted) {
      setShowError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Checkbox.Root
        name="terms"
        value="accept"
        required
        checked={accepted}
        onChange={(e) => {
          setAccepted(e.target.checked);
          if (e.target.checked) {
            setShowError(false);
          }
        }}
        variant={showError ? "error" : "default"}
      >
        <Checkbox.Label>I accept the Terms of Service and Privacy Policy</Checkbox.Label>
        <Checkbox.Hint>
          Required to create an account. You can withdraw consent in settings.
        </Checkbox.Hint>
        {showError ? <Checkbox.Error>Please accept the terms to continue.</Checkbox.Error> : null}
      </Checkbox.Root>
      <button type="submit">Continue</button>
    </form>
  );
}
