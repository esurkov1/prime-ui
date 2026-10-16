import * as React from "react";

/**
 * Browser autofill and password managers stay off a kit text field: a product screen is full of
 * searches, filters and record fields that a saved login or address has no business filling.
 * `autocomplete="off"` turns off the browser's own suggestions where it is honoured (Chrome and
 * Firefox history and address autofill on desktop); browsers still read login-looking fields on
 * their own, and the password-manager extensions read only their own opt-outs: 1Password
 * `data-1p-ignore`, LastPass `data-lpignore`, Bitwarden `data-bwignore`, Dashlane
 * `data-form-type="other"`.
 */
export const AUTOFILL_OFF = {
  autoComplete: "off",
  "data-1p-ignore": "true",
  "data-lpignore": "true",
  "data-bwignore": "true",
  "data-form-type": "other",
} as const;

type AutofillProps = { autoComplete?: string } & Partial<Omit<typeof AUTOFILL_OFF, "autoComplete">>;

/** `true` inside a sign-in or sign-up form (`LoginForm.Form`): autofill is the point there. */
const AutofillContext = React.createContext(false);

export function AutofillScope({ children }: { children: React.ReactNode }) {
  return <AutofillContext.Provider value>{children}</AutofillContext.Provider>;
}

/**
 * The autofill attributes of a text field. A consumer's `autoComplete` token other than `"off"`
 * opts in: the token goes through and the opt-outs are dropped. Without a token the field is off,
 * except inside `AutofillScope`, where the browser and the password managers decide.
 */
export function useAutofill(autoComplete: string | undefined): AutofillProps {
  const scoped = React.useContext(AutofillContext);
  if (autoComplete && autoComplete !== "off") return { autoComplete };
  if (scoped && !autoComplete) return {};
  return AUTOFILL_OFF;
}
