/**
 * The media slot of a leading mark (`Modal.Icon`, `Drawer.Icon`, `Sheet.Icon`, `Card.Icon`): a box
 * that is a filled glyph tile, unless the record's picture stands in it. A person or an object
 * stands for itself, so an `Avatar.Root` or a `Thumbnail.Root` anywhere inside the slot — a direct
 * child, under a wrapper, or rendered by the consumer's own component — reports itself and takes the
 * slot's size, the size of the tile it replaces (40): an avatar `l`, a thumbnail `m` (its height).
 * The report runs in a layout effect, so the tile never paints around a picture. A host of another
 * box passes its own sizes (`Badge.Avatar`: the avatar of the chip tier).
 */
import * as React from "react";

import type { ControlSize } from "./states";

/** The size a picture takes in a slot: an avatar may go below the control tiers (`2xs`). */
type MediaSlotSizes = { avatar: "2xs" | ControlSize; thumbnail?: ControlSize };

type MediaSlotValue = {
  /** A picture mounted (`true`) or left (`false`) in the slot. */
  report: (present: boolean) => void;
  sizes: MediaSlotSizes;
};

const MediaSlotContext = React.createContext<MediaSlotValue | null>(null);

/** The sizes a picture takes in the slot: the 40 box of the glyph tile. */
const MEDIA_SLOT_SIZE: MediaSlotSizes = { avatar: "l", thumbnail: "m" };

/**
 * The host side: wraps the slot's children and tells whether a picture stands in it. Children
 * render inside `provide(…)`.
 */
export function useMediaSlotHost(sizes: MediaSlotSizes = MEDIA_SLOT_SIZE): {
  media: boolean;
  provide: (children: React.ReactNode) => React.ReactElement;
} {
  const [count, setCount] = React.useState(0);
  const { avatar, thumbnail } = sizes;
  const report = React.useCallback(
    (present: boolean) => setCount((n) => Math.max(0, n + (present ? 1 : -1))),
    [],
  );
  const value = React.useMemo<MediaSlotValue>(
    () => ({ report, sizes: { avatar, thumbnail } }),
    [report, avatar, thumbnail],
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
export function useMediaSlotSize<K extends keyof MediaSlotSizes>(
  kind: K,
): MediaSlotSizes[K] | undefined {
  const slot = React.useContext(MediaSlotContext);
  const report = slot?.report;
  React.useLayoutEffect(() => {
    if (!report) return;
    report(true);
    return () => report(false);
  }, [report]);
  return slot ? slot.sizes[kind] : undefined;
}
