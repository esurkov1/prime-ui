import * as React from "react";
import { Avatar } from "@/components/avatar/Avatar";
import { StatusDot } from "@/components/status-dot/StatusDot";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { Globe } from "@/icons/glyphs/globe";
import { MapPin } from "@/icons/glyphs/map-pin";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { formatLabel } from "@/internal/formatLabel";
import { HeaderLineContent, headerRowStyles } from "@/internal/headerRow";
import { useLabels } from "@/internal/labels";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import type { PaletteColor } from "@/internal/states";
import statusLoop from "@/internal/statusLoop.module.css";
import { FRAME_DESCRIPTION, FRAME_TITLE } from "@/internal/surfaceFrame";

import styles from "./MessageCards.module.css";

/** A card in a bubble stands on the `m` step: the 14/20 title keeps the bubble's text scale. */
const CARD_FRAME = "m";

// ─── Location ─────────────────────────────────────────────────────────────────

export type MessageLocationLabels = {
  /** The name of the map link: `{place}`. */
  openMap: string;
  /** The mark of a live location. */
  live: string;
};

export const MESSAGE_LOCATION_LABELS: MessageLocationLabels = {
  openMap: "Открыть на карте: {place}",
  live: "Трансляция",
};

export type MessageLocationProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  src: string;
  href?: string;
  title?: string;
  address?: string;
  live?: boolean;
  labels?: Partial<MessageLocationLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A place: a 16 : 9 map picture with a pin, edge to edge at the top of the bubble (its box is
 * final before the picture loads), then the place and its address.
 */
export function MessageLocation({
  src,
  href,
  title,
  address,
  live = false,
  labels: labelsProp,
  className,
  ref,
  ...rest
}: MessageLocationProps) {
  const labels = useLabels(MESSAGE_LOCATION_LABELS, labelsProp);
  const { spacer } = useMessagePart();
  const map = (
    <>
      {/* No fallback glyph: the pin below already marks the place; a second, animated pin under it
          showed around the disk while the map loaded. */}
      <Thumbnail.Root fullWidth ratio="16:9" size="xs" className={styles.map}>
        <Thumbnail.Image src={src} />
      </Thumbnail.Root>
      <span
        className={cx(styles.pin, live && statusLoop.pulse)}
        data-live={live || undefined}
        aria-hidden="true"
      >
        <MapPin animated={false} />
      </span>
    </>
  );
  return (
    <div {...rest} ref={ref} data-message-bleed="" className={cx(styles.location, className)}>
      {href ? (
        <a
          className={styles.mapFrame}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={formatLabel(labels.openMap, { place: title ?? address ?? "" })}
        >
          {map}
        </a>
      ) : (
        <div className={styles.mapFrame}>{map}</div>
      )}
      <div className={styles.place}>
        {title ? (
          <div className={cx(FRAME_TITLE[CARD_FRAME], styles.placeTitle)}>
            <span data-message-selectable="">{title}</span>
          </div>
        ) : null}
        {/* A live place states it first: the dot, the word, then the address. */}
        <div
          className={cx(
            FRAME_DESCRIPTION[CARD_FRAME],
            headerRowStyles.description,
            styles.placeAddress,
          )}
        >
          <HeaderLineContent>
            {live ? <StatusDot tone="success">{labels.live}</StatusDot> : null}
            {address ? <span data-message-selectable="">{address}</span> : null}
          </HeaderLineContent>
          {spacer}
        </div>
      </div>
    </div>
  );
}
MessageLocation.displayName = "Message.Location";

defineMessagePart(MessageLocation, { shell: "fill", meta: "inline", bleed: true, sized: true });

// ─── Contact ──────────────────────────────────────────────────────────────────

export type MessageContactProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> & {
  name: string;
  phone?: string;
  src?: string;
  color?: PaletteColor;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

/** A shared contact: avatar, name and phone, with the actions in a row under them. */
export function MessageContact({
  name,
  phone,
  src,
  color = "blue",
  className,
  children,
  ref,
  ...rest
}: MessageContactProps) {
  const { spacer } = useMessagePart();
  const actions = React.Children.toArray(children).length > 0;
  // The buttons take the card's tier, like the fields of a surface.
  const controls = useHostTier(CARD_FRAME, "surface");
  return (
    <div {...rest} ref={ref} className={cx(styles.contact, className)}>
      <div className={styles.person}>
        <Avatar.Root size="l" color={color}>
          {src ? <Avatar.Image src={src} /> : null}
          <Avatar.Fallback>{initials(name)}</Avatar.Fallback>
        </Avatar.Root>
        <div className={styles.personText}>
          <div className={cx(FRAME_TITLE[CARD_FRAME], styles.personName)}>
            <span data-message-selectable="">{name}</span>
          </div>
          <div className={cx(FRAME_DESCRIPTION[CARD_FRAME], styles.personPhone)}>
            {phone ? <span data-message-selectable="">{phone}</span> : null}
            {actions ? null : spacer}
          </div>
        </div>
      </div>
      {actions ? (
        <div className={styles.contactActions}>
          {controls.provide(children)}
          {spacer}
        </div>
      ) : null}
    </div>
  );
}
MessageContact.displayName = "Message.Contact";

defineMessagePart(MessageContact, { shell: "fill", meta: "inline", sized: true });

// ─── Link preview ─────────────────────────────────────────────────────────────

export type MessageLinkPreviewProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  href: string;
  site?: string;
  title?: string;
  description?: string;
  image?: string;
  ref?: React.Ref<HTMLAnchorElement>;
};

/**
 * A card of the page a message links to: site, title, description and picture; the whole card
 * opens the page. It spans the bubble (at least the card width), long words and URLs wrap.
 */
export function MessageLinkPreview({
  href,
  site,
  title,
  description,
  image,
  className,
  ref,
  ...rest
}: MessageLinkPreviewProps) {
  const { spacer } = useMessagePart();
  return (
    <div className={styles.preview}>
      <a
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref}
        className={cx(styles.previewCard, className)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {site ? <span className={styles.previewSite}>{site}</span> : null}
        {title ? (
          <span className={styles.previewTitle} data-message-selectable="">
            {title}
          </span>
        ) : null}
        {description ? (
          <span className={styles.previewDescription} data-message-selectable="">
            {description}
          </span>
        ) : null}
        {image ? (
          <Thumbnail.Root fullWidth ratio="16:9" size="s" className={styles.previewImage}>
            <Thumbnail.Image src={image} />
            <Thumbnail.Fallback>
              <Globe />
            </Thumbnail.Fallback>
          </Thumbnail.Root>
        ) : null}
        {site || title ? null : <VisuallyHidden>{href}</VisuallyHidden>}
      </a>
      {spacer ? <div className={styles.previewEnd}>{spacer}</div> : null}
    </div>
  );
}
MessageLinkPreview.displayName = "Message.LinkPreview";

defineMessagePart(MessageLinkPreview, { shell: "fill", meta: "inline" });
