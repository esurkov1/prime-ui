import * as React from "react";

/**
 * The draft text of an input bound to a value: it follows `source` (the value as text) while the
 * input is not focused, and is the person's own text while they edit. The host commits the draft
 * on blur / Enter and puts the committed value back with `setDraft` (an unreadable draft reverts
 * to `source`).
 */
export function useDraft<E extends HTMLElement = HTMLInputElement>(source: string) {
  const inputRef = React.useRef<E>(null);
  const [draft, setDraft] = React.useState(source);

  React.useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) return;
    setDraft(source);
  }, [source]);

  return { inputRef, draft, setDraft };
}
