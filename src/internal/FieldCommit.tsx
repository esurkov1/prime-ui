import * as React from "react";

import { Spinner } from "@/components/spinner/Spinner";
import { usePresence } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { setControlValue, type ValueControl } from "@/internal/controlValue";
import { cx } from "@/internal/cx";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./FieldCommit.module.css";

/**
 * Saves one field on its own (inline editing of a record card). Returns nothing for a sync save or
 * a Promise: while it is pending the field shows a spinner and stays editable; a rejection puts the
 * last committed value back (the owner shows why through `error` or a notification).
 */
export type FieldCommitHandler = (value: string) => void | Promise<void>;

/** `idle` · `pending` (a Promise is running) · `saved` (a brief quiet confirmation). */
export type FieldCommitState = "idle" | "pending" | "saved";

/** How long the check stays after a save before it fades out. */
const SAVED_MS = 1600;

function isThenable(value: unknown): value is PromiseLike<void> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as PromiseLike<void>).then === "function"
  );
}

export type FieldCommit = {
  state: FieldCommitState;
  /** Commits the control's value when it differs from the last committed one. */
  commit: () => void;
  /** Puts the last committed value back; `true` when something changed. */
  revert: () => boolean;
  /** Takes the control's value as committed (on focus, unless a save is pending). */
  sync: () => void;
};

/**
 * The commit cycle of a field: the value at focus is the committed one; blur or the commit key
 * saves a changed value; Escape reverts; a rejected save restores the committed value unless the
 * person has typed on since. Unchanged values never fire. `onCommit` undefined → inert.
 */
export function useFieldCommit(
  controlRef: React.RefObject<ValueControl | null>,
  onCommit: FieldCommitHandler | undefined,
): FieldCommit {
  const [state, setState] = React.useState<FieldCommitState>("idle");
  const committed = React.useRef<string | null>(null);
  const started = React.useRef(0);
  const settled = React.useRef(0);
  const pending = React.useRef(0);
  const onCommitRef = React.useRef(onCommit);
  onCommitRef.current = onCommit;

  React.useLayoutEffect(() => {
    if (committed.current === null && controlRef.current) {
      committed.current = controlRef.current.value;
    }
  }, [controlRef]);

  React.useEffect(() => {
    if (state !== "saved") return;
    const timer = window.setTimeout(() => setState("idle"), SAVED_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  const sync = React.useCallback(() => {
    if (pending.current === 0 && controlRef.current) committed.current = controlRef.current.value;
  }, [controlRef]);

  const revert = React.useCallback(() => {
    const control = controlRef.current;
    if (!control || committed.current === null || control.value === committed.current) return false;
    setControlValue(control, committed.current);
    return true;
  }, [controlRef]);

  const commit = React.useCallback(() => {
    const control = controlRef.current;
    const handler = onCommitRef.current;
    if (!control || !handler) return;
    const value = control.value;
    if (value === (committed.current ?? value)) return;
    const id = ++started.current;
    const succeed = () => {
      if (id >= settled.current) {
        settled.current = id;
        committed.current = value;
      }
    };
    const fail = () => {
      if (id === started.current && control.value === value && committed.current !== null) {
        setControlValue(control, committed.current);
      }
    };
    let result: void | Promise<void>;
    try {
      result = handler(value);
    } catch {
      fail();
      return;
    }
    if (!isThenable(result)) {
      succeed();
      setState("saved");
      return;
    }
    pending.current += 1;
    setState("pending");
    result.then(
      () => {
        pending.current -= 1;
        succeed();
        if (id === started.current) setState("saved");
      },
      () => {
        pending.current -= 1;
        fail();
        if (id === started.current) setState("idle");
      },
    );
  }, [controlRef]);

  return { state, commit, revert, sync };
}

export type FieldCommitLabels = {
  /** Read while a save is pending. */
  saving: string;
  /** Read once a save succeeds. */
  saved: string;
};

/**
 * The commit status at the field's edge: a spinner while saving, then a check that fades out. A
 * polite live region says «saving» / «saved»; the glyphs are hidden from assistive tech.
 */
export function FieldCommitStatus({
  state,
  labels,
  className,
}: {
  state: FieldCommitState;
  labels: FieldCommitLabels;
  className?: string;
}) {
  const shown = state !== "idle";
  const presence = usePresence(shown, { exitDuration: "fast" });
  const last = React.useRef<FieldCommitState>(state);
  if (shown) last.current = state;
  const glyph = shown ? state : last.current;
  return (
    <>
      {presence.mounted ? (
        <span
          className={cx(styles.status, className)}
          data-state={presence.state}
          data-commit={glyph}
          aria-hidden="true"
          onAnimationEnd={presence.onExitEnd}
        >
          <Spinner aria-hidden="true" className={styles.glyph} data-glyph="pending" />
          <Icon name="action.check" className={styles.glyph} data-glyph="saved" />
        </span>
      ) : null}
      <VisuallyHidden aria-live="polite">
        {state === "pending" ? labels.saving : state === "saved" ? labels.saved : ""}
      </VisuallyHidden>
    </>
  );
}
