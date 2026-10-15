import * as React from "react";

/** What holds a page: a request runs (`busy`), changes are not saved (`dirty`). */
type LeaveGuardState = { busy: boolean; dirty: boolean };

type Entry = LeaveGuardState & {
  /** Opens the guard's confirm; `leave` replays the held navigation. */
  ask: (leave: () => void) => void;
  /** The person agreed to leave: the browser's own prompt is not shown on top until the state changes. */
  released: boolean;
};

/** The mounted guards, newest last. */
const guards: Entry[] = [];
/** Set while a confirmed leave replays its click, so the guards let it through. */
let replaying = false;

const opensElsewhere = (event: React.MouseEvent, target: HTMLElement) =>
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey ||
  (target instanceof HTMLAnchorElement &&
    (target.hasAttribute("download") || (target.target !== "" && target.target !== "_self")));

function holdLeave(event: React.MouseEvent<HTMLElement>): void {
  if (replaying) return;
  const active = guards.filter((guard) => guard.busy || guard.dirty);
  if (active.length === 0) return;
  const target =
    event.target instanceof Element ? event.target.closest<HTMLElement>("a, button") : null;
  if (!target || !event.currentTarget.contains(target)) return;
  if (target.matches(":disabled, [aria-disabled='true']") || opensElsewhere(event, target)) return;
  event.preventDefault();
  event.stopPropagation();
  if (active.some((guard) => guard.busy)) return;
  active[active.length - 1].ask(() => {
    for (const guard of guards) guard.released = true;
    replaying = true;
    try {
      target.click();
    } finally {
      replaying = false;
    }
  });
}

/**
 * The `onClickCapture` of a navigation item (`Sidebar.Item`, `BottomNav.Item`, a `Breadcrumb.Item`
 * level), chained before the consumer's own. While a page guard holds, the click stops before any
 * handler of the item or of its router link runs and before the browser follows `href`: `busy`
 * holds it, `dirty` asks the guard's confirm, which replays the click once the person agrees.
 * Router-agnostic: the replay is the same click. A click that opens a new tab or window, or one on
 * a disabled item, is never held.
 */
export function leaveGuardCapture(
  onClickCapture?: React.MouseEventHandler<HTMLElement>,
): React.MouseEventHandler<HTMLElement> {
  return (event) => {
    holdLeave(event);
    if (!event.isPropagationStopped()) onClickCapture?.(event);
  };
}

/**
 * Registers a page guard while mounted: the navigation items ask it through `holdLeave`, and while
 * it is `busy` or `dirty` the browser asks before the tab closes or reloads (`beforeunload`).
 */
export function useLeaveGuard(
  { busy, dirty }: LeaveGuardState,
  ask: (leave: () => void) => void,
): void {
  const [entry] = React.useState<Entry>(() => ({ busy, dirty, ask, released: false }));

  React.useLayoutEffect(() => {
    entry.ask = ask;
  });

  React.useLayoutEffect(() => {
    guards.push(entry);
    return () => {
      guards.splice(guards.indexOf(entry), 1);
    };
  }, [entry]);

  React.useLayoutEffect(() => {
    entry.busy = busy;
    entry.dirty = dirty;
    entry.released = false;
  }, [entry, busy, dirty]);

  useUnloadGuard(busy || dirty, () => entry.released);
}

/**
 * While `hold` is true the browser asks before the tab closes or reloads (`beforeunload`): a page
 * guard, and a dialog guard (`Modal.Guard`, `Drawer.Guard`, `Sheet.Guard`) whose form is not saved.
 * `released` lets a leave the person already agreed to go without a second prompt.
 */
export function useUnloadGuard(hold: boolean, released?: () => boolean): void {
  const releasedRef = React.useRef(released);
  React.useLayoutEffect(() => {
    releasedRef.current = released;
  });

  React.useEffect(() => {
    if (!hold) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (releasedRef.current?.()) return;
      event.preventDefault();
      // Older engines show the prompt only when `returnValue` is set.
      event.returnValue = true;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hold]);
}
