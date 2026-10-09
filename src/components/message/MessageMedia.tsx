import * as React from "react";

import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import pill from "@/internal/mediaPill.module.css";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import {
  TRANSFER_LABELS,
  type TransferDirection,
  type TransferLabels,
  type TransferState,
  transferCovers,
  transferDiskLabels,
} from "@/internal/transfer";
import { TransferOverlay } from "@/internal/transferDisk";
import { useNearView } from "@/internal/useNearView";
import styles from "./MessageMedia.module.css";

export type MessageMediaItem = {
  /** Default `image`. */
  type?: "image" | "video";
  src: string;
  /** A still of a video before it plays. */
  poster?: string;
  /** What the picture shows; names the tile that opens it. */
  alt?: string;
  /** The natural size: the tile keeps its aspect ratio before anything loads. Default 4 : 3. */
  width?: number;
  height?: number;
  /** A video's length in seconds, shown before its metadata loads. */
  duration?: number;
  /** The tile's transfer, either way (`UploadItem.status` of `useUploadQueue`, or `remote`). */
  transfer?: TransferState;
  /** Share transferred, 0…1 (`UploadItem.progress`). */
  transferProgress?: number;
  /** Which way it goes: the words only. Default `upload`. */
  transferDirection?: TransferDirection;
};

/** The tile strings, and the transfer strings every transferring part shares. */
export type MessageMediaLabels = {
  /** The name of a tile that opens the viewer; `{name}` is `alt`, else `photo` / `video`. */
  open: string;
  photo: string;
  video: string;
} & TransferLabels;

const MEDIA_LABELS: MessageMediaLabels = {
  open: "Открыть: {name}",
  photo: "фото",
  video: "видео",
  ...TRANSFER_LABELS,
  download: "Скачать {name}",
};

export type MessageMediaProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** One photo or video, or an album of 2–10 laid out in rows. */
  items: readonly MessageMediaItem[];
  /** A tile was activated: open your viewer at `index`. Makes the tiles buttons. */
  onItemOpen?: (index: number) => void;
  /**
   * Cancel the transfer of a tile (the disk with the cross in its middle). A returned promise keeps
   * the disk pending; a rejection leaves the transfer running and is announced.
   */
  onCancel?: (index: number) => void | Promise<void>;
  /** Transfer a failed tile again; a promise works the same. */
  onRetry?: (index: number) => void | Promise<void>;
  /** Fetch a `remote` tile (the download arrow); a promise works the same. */
  onDownload?: (index: number) => void | Promise<void>;
  labels?: Partial<MessageMediaLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

/** Rows of an album by its size: at most three tiles in a row, the fuller rows below. */
const ALBUM_ROWS: Record<number, number[]> = {
  1: [1],
  2: [2],
  3: [1, 2],
  4: [2, 2],
  5: [2, 3],
  6: [3, 3],
  7: [2, 2, 3],
  8: [2, 3, 3],
  9: [3, 3, 3],
  10: [2, 2, 3, 3],
};

const MAX_ALBUM = 10;
/** `--prime-message-media-max-height` at the default root size, for the off-screen estimate. */
const MEDIA_MAX_PX = 22.5 * 16;

/** Width ÷ height of a tile, kept between a tall portrait and a wide panorama. */
function ratioOf(item: MessageMediaItem, single: boolean): number {
  const raw = item.width && item.height ? item.width / item.height : 4 / 3;
  const [min, max] = single ? [0.6, 1.8] : [0.5, 2];
  return Math.min(max, Math.max(min, raw));
}

type Row = { ratio: number; tiles: { item: MessageMediaItem; index: number; ratio: number }[] };

/**
 * The album's geometry from the items alone — nothing is measured, so every tile has its final box
 * before a byte loads. A row's height comes from its aspect ratio (the sum of its tiles' ratios;
 * an album row never taller than two thirds of its width); a tile's width share is its ratio.
 */
function layout(items: readonly MessageMediaItem[]): { rows: Row[]; widthFactor: number } {
  const single = items.length === 1;
  const rows: Row[] = [];
  let next = 0;
  for (const count of ALBUM_ROWS[items.length] ?? []) {
    const tiles = items
      .slice(next, next + count)
      .map((item, i) => ({ item, index: next + i, ratio: ratioOf(item, single) }));
    const sum = tiles.reduce((total, tile) => total + tile.ratio, 0);
    rows.push({ ratio: Math.max(sum, single ? 0 : 1.5), tiles });
    next += count;
  }
  // A lone portrait is narrower than the cap: its height reaches the cap instead.
  const widthFactor = single && items[0] ? Math.min(1, ratioOf(items[0], true)) : 1;
  return { rows, widthFactor };
}

type TileProps = {
  item: MessageMediaItem;
  index: number;
  ratio: number;
  labels: MessageMediaLabels;
  onItemOpen?: (index: number) => void;
  onCancel?: (index: number) => void | Promise<void>;
  onRetry?: (index: number) => void | Promise<void>;
  onDownload?: (index: number) => void | Promise<void>;
};

/**
 * One tile: the picture (lazy, async decode) or a video's first frame (mounted once the tile nears
 * the view), a play mark and the length; a button over it when it opens a viewer; the transfer
 * disk over it while it is on its way.
 */
function MediaTile({
  item,
  index,
  ratio,
  labels,
  onItemOpen,
  onCancel,
  onRetry,
  onDownload,
}: TileProps) {
  const cellRef = React.useRef<HTMLDivElement>(null);
  const video = item.type === "video";
  const near = useNearView(cellRef);
  const [metaDuration, setMetaDuration] = React.useState<number | null>(null);
  const name = item.alt || (video ? labels.video : labels.photo);
  const transfer = item.transfer;
  const length = metaDuration ?? item.duration ?? null;

  return (
    // A tile's width share is its ratio (scaled up: grow factors below 1 leave free space).
    <div ref={cellRef} className={styles.cell} style={{ flexGrow: ratio * 100 }}>
      <Thumbnail.Root size="xs" className={styles.thumb}>
        {video ? (
          near ? (
            <Thumbnail.Video
              src={item.src}
              poster={item.poster}
              onLoadedMetadata={(event) => {
                const seconds = event.currentTarget.duration;
                if (Number.isFinite(seconds)) setMetaDuration(seconds);
              }}
            />
          ) : null
        ) : (
          <Thumbnail.Image src={item.src} alt={onItemOpen ? "" : (item.alt ?? "")} />
        )}
        <Thumbnail.Fallback>
          <Icon name={video ? "action.video" : "object.image"} />
        </Thumbnail.Fallback>
      </Thumbnail.Root>
      {video ? (
        <>
          <span className={cx(pill.mark, styles.play)} aria-hidden="true">
            <Icon name="action.play" fill="currentColor" />
          </span>
          {length !== null ? (
            <span className={cx(pill.pill, styles.length)} aria-hidden="true">
              {formatClock(length)}
            </span>
          ) : null}
        </>
      ) : null}
      {onItemOpen ? (
        <button
          type="button"
          className={styles.open}
          aria-label={formatLabel(labels.open, { name })}
          onClick={() => onItemOpen(index)}
        />
      ) : null}
      {/* Mounted through `done`: the ring fills, then the disk fades and shrinks away. */}
      {transfer ? (
        <span className={styles.transfer} data-covered={transferCovers(transfer) || undefined}>
          <TransferOverlay
            state={transfer}
            progress={item.transferProgress}
            labels={transferDiskLabels(
              labels,
              item.transferDirection ?? "upload",
              item.transferProgress,
              { name },
            )}
            onCancel={onCancel ? () => onCancel(index) : undefined}
            onRetry={onRetry ? () => onRetry(index) : undefined}
            onDownload={onDownload ? () => onDownload(index) : undefined}
          />
        </span>
      ) : null}
    </div>
  );
}

/**
 * A photo, a video or an album of up to 10: a tiled grid with thin gaps, every tile in its final
 * box before anything loads. Alone in a message it is the shell itself (the message rounds and
 * clips it and lays the meta on a pill over it); with a caption (`Message.Text` after it) it sits
 * edge to edge at the top of the bubble. The gaps of an album show a neutral surface in both
 * directions.
 */
export function MessageMedia({
  items: itemsProp,
  onItemOpen,
  onCancel,
  onRetry,
  onDownload,
  labels: labelsProp,
  className,
  style,
  ref,
  ...rest
}: MessageMediaProps) {
  const labels = { ...MEDIA_LABELS, ...labelsProp };
  const { overlay, neutralDepth } = useMessagePart();
  const items = itemsProp.slice(0, MAX_ALBUM);
  const album = items.length > 1;
  const { rows, widthFactor } = layout(items);

  return (
    <div
      {...rest}
      ref={ref}
      data-message-bleed=""
      data-depth={album ? neutralDepth : undefined}
      className={cx(styles.media, className)}
      style={{ "--media-width": widthFactor, ...style } as React.CSSProperties}
      {...toDataAttributes({ album: album || undefined })}
    >
      {rows.map((row) => (
        <div
          key={row.tiles[0]?.index}
          className={styles.row}
          style={{ "--row-ratio": row.ratio } as React.CSSProperties}
        >
          {row.tiles.map(({ item, index, ratio }) => (
            <MediaTile
              key={index}
              item={item}
              index={index}
              ratio={ratio}
              labels={labels}
              onItemOpen={onItemOpen}
              onCancel={onCancel}
              onRetry={onRetry}
              onDownload={onDownload}
            />
          ))}
        </div>
      ))}
      {overlay}
    </div>
  );
}
MessageMedia.displayName = "Message.Media";

defineMessagePart(MessageMedia, {
  shell: "media",
  meta: "overlay",
  picture: true,
  bleed: true,
  sized: true,
  estimate: ({ items }: MessageMediaProps) => {
    const { rows, widthFactor } = layout(items.slice(0, MAX_ALBUM));
    const width = MEDIA_MAX_PX * widthFactor;
    return rows.reduce((height, row) => height + width / row.ratio, 0);
  },
});
