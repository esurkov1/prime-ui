import * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { iconSlotClass } from "@/internal/iconBox";
import {
  createImageSlot,
  type ImageSlotFallbackProps,
  type ImageSlotImageProps,
} from "@/internal/imageSlot";
import { useMediaSlotSize } from "@/internal/mediaSlot";
import { namedRole } from "@/internal/namedRole";
import palette from "@/internal/palette.module.css";
import type { ControlSize, PaletteColor } from "@/internal/states";

import styles from "./Avatar.module.css";

/** `2xs` 16 · `xs` 20 · `s` 24 · `m` 32 · `l` 40 · `xl` 48 · `2xl` 64 (`--prime-avatar-*`). */
export type AvatarSize = "2xs" | ControlSize | "2xl";

const slot = createImageSlot("Avatar", {
  image: styles.image,
  fallback: cx(styles.fallback, iconSlotClass),
});

/** Size of the surrounding `Avatar.Group`; members without their own `size` take it. */
const AvatarGroupSizeContext = React.createContext<AvatarSize | undefined>(undefined);

// ─── Root ─────────────────────────────────────────────────────────────────────

export type AvatarRootProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: AvatarSize;
  color?: PaletteColor;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The person's picture. Named by `aria-label` it is one image of that name (`role="img"`), so the
 * name holds whether the photo, the initials or an icon shows.
 */
function AvatarRoot({ size, color = "gray", className, children, ...rest }: AvatarRootProps) {
  const groupSize = React.useContext(AvatarGroupSizeContext);
  // In a media slot (a dialog or card mark) the picture takes the slot's size.
  const slotSize = useMediaSlotSize("avatar");

  return (
    <slot.ImageSlotProvider>
      <div
        role={namedRole(rest, "img")}
        className={cx(styles.root, palette.hue, className)}
        {...toDataAttributes({ size: slotSize ?? size ?? groupSize ?? "m", color })}
        {...rest}
      >
        {children}
      </div>
    </slot.ImageSlotProvider>
  );
}
AvatarRoot.displayName = "Avatar.Root";

// ─── Image / Fallback ─────────────────────────────────────────────────────────

/** `alt` is empty by default: the name next to the avatar already says who it is. */
export type AvatarImageProps = ImageSlotImageProps;

/** The photo; while it loads or after an error the Fallback shows through. */
const AvatarImage = slot.Image;

export type AvatarFallbackProps = ImageSlotFallbackProps;

/** Initials or an icon, shown without a photo, while it loads and when it fails. */
const AvatarFallback = slot.Fallback;

// ─── Status ───────────────────────────────────────────────────────────────────

export type AvatarPresence = "online" | "offline" | "away" | "busy";

export type AvatarStatusLabels = Record<AvatarPresence, string>;

export const AVATAR_STATUS_LABELS: AvatarStatusLabels = {
  online: "В сети",
  offline: "Не в сети",
  away: "Отошёл",
  busy: "Занят",
};

export type AvatarStatusProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  status: AvatarPresence;
  labels?: Partial<AvatarStatusLabels>;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Presence dot; announced as an image with the state name (`labels`). */
function AvatarStatus({ status, labels, className, ...rest }: AvatarStatusProps) {
  slot.useImageSlot();
  return (
    <span
      role="img"
      aria-label={labels?.[status] ?? AVATAR_STATUS_LABELS[status]}
      className={cx(styles.status, className)}
      {...toDataAttributes({ status })}
      {...rest}
    />
  );
}
AvatarStatus.displayName = "Avatar.Status";

// ─── Group / Overflow ─────────────────────────────────────────────────────────

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: AvatarSize;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * An overlapping row of avatars (`role="group"`); rings match the surface. Its `size` is the size
 * of every member without its own (they default to `m`).
 */
function AvatarGroup({ size, className, role = "group", ...rest }: AvatarGroupProps) {
  return (
    <AvatarGroupSizeContext.Provider value={size}>
      <div
        role={role}
        className={cx(styles.group, className)}
        {...toDataAttributes({ size })}
        {...rest}
      />
    </AvatarGroupSizeContext.Provider>
  );
}
AvatarGroup.displayName = "Avatar.Group";

export type AvatarOverflowProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: AvatarSize;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The «+N» cell at the end of a group, the same diameter as its avatars; named by `aria-label`
 * («Ещё 3 участника») it is an image of that name.
 */
function AvatarOverflow({ size, className, ...rest }: AvatarOverflowProps) {
  const groupSize = React.useContext(AvatarGroupSizeContext);
  return (
    <div
      role={namedRole(rest, "img")}
      className={cx(styles.overflow, className)}
      {...toDataAttributes({ size: size ?? groupSize ?? "m" })}
      {...rest}
    />
  );
}
AvatarOverflow.displayName = "Avatar.Overflow";

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Status: AvatarStatus,
  Group: AvatarGroup,
  Overflow: AvatarOverflow,
};
