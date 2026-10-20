/**
 * The media slot of a leading mark (`Modal.Icon`, `Drawer.Icon`, `Sheet.Icon`, `Card.Icon`): a box
 * that is a filled glyph tile, unless the record's picture stands in it. A person or an object
 * stands for itself, so an `Avatar.Root` or a `Thumbnail.Root` anywhere inside the slot — a direct
 * child, under a wrapper, or rendered by the consumer's own component — reports itself and takes the
 * slot's size, the size of the tile it replaces (40): an avatar `l`, a thumbnail `m` (its height).
 * The report runs in a layout effect, so the tile never paints around a picture. A host of another
 * box passes its own sizes (`Badge.Avatar`: the avatar of the chip tier).
 *
 * A `ProgressCircle` is the record's state mark (the term of a rental): it reports itself too, so the
 * tile gives way, keeps its own size (a host gives a `ring` size only when it wants one) and keeps its
 * own name — `named` tells the host not to hide the slot from assistive tech, as it does a picture.
 */
import * as React from "react";

import type { ControlSize } from "./states";

/** The size a picture takes in a slot: an avatar may go below the control tiers (`2xs`). */
type MediaSlotSizes = { avatar: "2xs" | ControlSize; thumbnail?: ControlSize; ring?: ControlSize };

type MediaKind = keyof MediaSlotSizes;

type MediaSlotValue = {
  /** A mark of `kind` mounted (`true`) or left (`false`) in the slot. */
  report: (kind: MediaKind, present: boolean) => void;
  sizes: MediaSlotSizes;
};

/** A ring carries its own accessible name (`role="progressbar"`); a picture repeats the title. */
const NAMED_KINDS: ReadonlySet<MediaKind> = new Set(["ring"]);

const MediaSlotContext = React.createContext<MediaSlotValue | null>(null);

/** The sizes a picture takes in the slot: the 40 box of the glyph tile. */
const MEDIA_SLOT_SIZE: MediaSlotSizes = { avatar: "l", thumbnail: "m" };

/**
 * The host side: wraps the slot's children and tells whether a picture stands in it. Children
 * render inside `provide(…)`.
 */
export function useMediaSlotHost(sizes: MediaSlotSizes = MEDIA_SLOT_SIZE): {
  /** A mark stands in the slot: the host drops its tile. */
  media: boolean;
  /** A mark with its own accessible name stands in the slot (a ring): the host does not hide it. */
  named: boolean;
  provide: (children: React.ReactNode) => React.ReactElement;
} {
  const [count, setCount] = React.useState({ pictures: 0, named: 0 });
  const { avatar, thumbnail, ring } = sizes;
  const report = React.useCallback((kind: MediaKind, present: boolean) => {
    const key = NAMED_KINDS.has(kind) ? "named" : "pictures";
    setCount((n) => ({ ...n, [key]: Math.max(0, n[key] + (present ? 1 : -1)) }));
  }, []);
  const value = React.useMemo<MediaSlotValue>(
    () => ({ report, sizes: { avatar, thumbnail, ring } }),
    [report, avatar, thumbnail, ring],
  );
  const provide = (children: React.ReactNode) => (
    <MediaSlotContext.Provider value={value}>{children}</MediaSlotContext.Provider>
  );
  return { media: count.pictures + count.named > 0, named: count.named > 0, provide };
}

/**
 * The mark side (Avatar.Root, Thumbnail.Root, ProgressCircle): inside a media slot it reports
 * itself and returns the size it must take there; outside one, `undefined`.
 */
export function useMediaSlotSize<K extends MediaKind>(kind: K): MediaSlotSizes[K] | undefined {
  const slot = React.useContext(MediaSlotContext);
  const report = slot?.report;
  React.useLayoutEffect(() => {
    if (!report) return;
    report(kind, true);
    return () => report(kind, false);
  }, [report, kind]);
  return slot ? slot.sizes[kind] : undefined;
}
