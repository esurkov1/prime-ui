/**
 * The media slot of a leading mark (`Modal.Icon`, `Drawer.Icon`, `Sheet.Icon`, `Card.Icon`): a box
 * that is a filled glyph tile, unless the record's picture stands in it. A person or an object
 * stands for itself, so an `Avatar.Root` or a `Thumbnail.Root` anywhere inside the slot — a direct
 * child, under a wrapper, or rendered by the consumer's own component — reports itself and takes the
 * slot's size, the size of the tile it replaces (40): an avatar `l`, a thumbnail `m` (its height).
 * The report runs in a layout effect, so the tile never paints around a picture.
 */
import * as React from "react";

import type { ControlSize } from "./states";

type MediaSlotValue = {
  /** A picture mounted (`true`) or left (`false`) in the slot. */
  report: (present: boolean) => void;
};

const MediaSlotContext = React.createContext<MediaSlotValue | null>(null);

/** The sizes a picture takes in the slot: the 40 box of the glyph tile. */
const MEDIA_SLOT_SIZE = { avatar: "l", thumbnail: "m" } as const satisfies Record<
  string,
  ControlSize
>;

/**
 * The host side: wraps the slot's children and tells whether a picture stands in it. Children
 * render inside `provide(…)`.
 */
export function useMediaSlotHost(): {
  media: boolean;
  provide: (children: React.ReactNode) => React.ReactElement;
} {
  const [count, setCount] = React.useState(0);
  const value = React.useMemo<MediaSlotValue>(
    () => ({ report: (present) => setCount((n) => Math.max(0, n + (present ? 1 : -1))) }),
    [],
  );
  const provide = (children: React.ReactNode) => (
    <MediaSlotContext.Provider value={value}>{children}</MediaSlotContext.Provider>
  );
  return { media: count > 0, provide };
}

/**
 * The picture side (Avatar.Root, Thumbnail.Root): inside a media slot it reports itself and
 * returns the size it must take there; outside one, `undefined`.
 */
export function useMediaSlotSize(kind: keyof typeof MEDIA_SLOT_SIZE): ControlSize | undefined {
  const slot = React.useContext(MediaSlotContext);
  React.useLayoutEffect(() => {
    if (!slot) return;
    slot.report(true);
    return () => slot.report(false);
  }, [slot]);
  return slot ? MEDIA_SLOT_SIZE[kind] : undefined;
}
