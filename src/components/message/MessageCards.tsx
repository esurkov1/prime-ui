import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { formatLabel } from "@/internal/formatLabel";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import type { PaletteColor } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./MessageCards.module.css";

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
  /** A map picture of the place (your static map service: the kit ships no map). */
  src: string;
  /** Opens the place in a map (a new tab). */
  href?: string;
  /** The place («Склад на Складочной»). */
  title?: string;
  /** Its address. */
  address?: string;
  /** A location shared live: a pulsing pin and a «Трансляция» mark. */
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
  const labels = { ...MESSAGE_LOCATION_LABELS, ...labelsProp };
  const { spacer } = useMessagePart();
  const map = (
    <>
      {/* No fallback glyph: the pin below already marks the place; a second, animated pin under it
          showed around the disk while the map loaded. */}
      <Thumbnail.Root fullWidth ratio="16:9" size="xs" className={styles.map}>
        <Thumbnail.Image src={src} />
      </Thumbnail.Root>
      <span className={styles.pin} data-live={live || undefined} aria-hidden="true">
        <Icon name="object.mapPin" animated={false} />
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
        {title || live ? (
          <div className={styles.placeTitle}>
            {title ? <span data-message-selectable="">{title}</span> : null}
            {live ? (
              <Badge.Root size="xs" color="green">
                <Badge.Dot />
                {labels.live}
              </Badge.Root>
            ) : null}
          </div>
        ) : null}
        <div className={styles.placeAddress}>
          {address ? <span data-message-selectable="">{address}</span> : null}
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
  /** The person's photo; without it the initials. */
  src?: string;
  /** Hue of the initials. Default `blue`. */
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
  return (
    <div {...rest} ref={ref} className={cx(styles.contact, className)}>
      <div className={styles.person}>
        <Avatar.Root size="l" color={color}>
          {src ? <Avatar.Image src={src} /> : null}
          <Avatar.Fallback>{initials(name)}</Avatar.Fallback>
        </Avatar.Root>
        <div className={styles.personText}>
          <div className={styles.personName}>
            <span data-message-selectable="">{name}</span>
          </div>
          <div className={styles.personPhone}>
            {phone ? <span data-message-selectable="">{phone}</span> : null}
            {actions ? null : spacer}
          </div>
        </div>
      </div>
      {actions ? (
        <div className={styles.contactActions}>
          {children}
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
  /** The site's name, in the accent color. */
  site?: string;
  title?: string;
  description?: string;
  /** The page's picture, full width under the text (16 : 9, its box final before it loads). */
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
              <Icon name="object.globe" />
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
