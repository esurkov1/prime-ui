import * as React from "react";

type Entry<Change> = { key: number; change: Change };

/** Whether an event handler answered with a promise: the change it made is pending until it settles. */
export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function"
  );
}

/**
 * The changes an async event is still saving, drawn ahead of the owner's answer (the kit's
 * async-event contract): `shown` is `value` with every pending change applied in order.
 * `track(change, promise)` holds a change until its promise settles; on resolve `onResolve` runs in
 * the same update that drops it (apply it to the stored value there, so nothing snaps back), on
 * reject the change simply goes and `value` shows again. `apply` must be idempotent: an owner that
 * applied the change already keeps it applied.
 */
export function usePendingChanges<T, Change>(value: T, apply: (value: T, change: Change) => T) {
  const [entries, setEntries] = React.useState<readonly Entry<Change>[]>([]);
  const nextKey = React.useRef(0);

  const shown = React.useMemo(
    () => entries.reduce((current, entry) => apply(current, entry.change), value),
    [entries, value, apply],
  );

  const track = React.useCallback(
    (
      change: Change,
      promise: PromiseLike<unknown>,
      handlers: { onResolve?: () => void; onReject?: (reason: unknown) => void } = {},
    ) => {
      nextKey.current += 1;
      const key = nextKey.current;
      setEntries((current) => [...current, { key, change }]);
      const drop = () => setEntries((current) => current.filter((entry) => entry.key !== key));
      promise.then(
        () => {
          handlers.onResolve?.();
          drop();
        },
        (reason: unknown) => {
          drop();
          handlers.onReject?.(reason);
        },
      );
    },
    [],
  );

  const pending = React.useMemo(() => entries.map((entry) => entry.change), [entries]);

  return { shown, pending, track };
}
