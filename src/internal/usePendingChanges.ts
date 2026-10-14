import * as React from "react";

type Entry<Change> = { key: number; change: Change };

/**
 * The kit's async event: a handler that returns nothing is a sync event; one that returns a
 * Promise keeps the change pending until it settles (resolve — done, reject — nothing changes).
 */
// biome-ignore lint/suspicious/noConfusingVoidType: the one async-event type; a handler that returns nothing must fit.
export type AsyncHandler<A extends unknown[] = [], R = void> = (...args: A) => void | Promise<R>;

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

/**
 * The keys whose async event is still running (a row being moved, an option being deleted).
 * `track(key, outcome)` holds the key while a returned promise is pending and returns the outcome
 * unchanged, so the caller can chain on it; a sync outcome holds nothing.
 */
export function usePendingKeys<K>() {
  const [pending, setPending] = React.useState<ReadonlySet<K>>(() => new Set());

  const track = React.useCallback(<T>(key: K, outcome: T): T => {
    if (!isPromiseLike(outcome)) return outcome;
    setPending((current) => new Set(current).add(key));
    const done = () =>
      setPending((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    outcome.then(done, done);
    return outcome;
  }, []);

  return { pending, track };
}

/**
 * One async action that runs once at a time (a retry, a reload): `run` calls the latest handler and
 * ignores calls while its promise is pending; `pending` is `true` until it settles. `run` is
 * `undefined` without a handler, so the host can hide the action.
 */
export function usePendingAction<A extends unknown[]>(
  handler: AsyncHandler<A, unknown> | undefined,
) {
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const latest = React.useRef(handler);
  latest.current = handler;

  const run = React.useCallback((...args: A) => {
    if (pendingRef.current) return;
    const outcome = latest.current?.(...args);
    if (!isPromiseLike(outcome)) return;
    pendingRef.current = true;
    setPending(true);
    const done = () => {
      pendingRef.current = false;
      setPending(false);
    };
    outcome.then(done, done);
  }, []);

  return { pending, run: handler ? run : undefined };
}
