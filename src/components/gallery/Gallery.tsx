import * as React from "react";

import { MediaViewer, type MediaViewerItem } from "@/components/media-viewer/MediaViewer";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon, type IconName } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { MediaPlayMark } from "@/internal/mediaDisk";
import pill from "@/internal/mediaPill.module.css";
import { useMessagePart } from "@/internal/messagePart";
import press from "@/internal/press.module.css";
import textRole from "@/internal/textRole.module.css";
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

import styles from "./Gallery.module.css";
import { type GalleryLayout, itemRatio, layoutGallery } from "./layout";

/** The most items one album lays out: a longer set goes as several albums. */
export { GALLERY_MAX } from "./layout";

export type GalleryItem = {
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
export type GalleryLabels = {
  /** The name of a tile that opens the viewer; `{name}` is `alt`, else `photo` / `video`. */
  open: string;
  photo: string;
  video: string;
} & TransferLabels;

export const GALLERY_LABELS: GalleryLabels = {
  open: "Открыть: {name}",
  photo: "фото",
  video: "видео",
  ...TRANSFER_LABELS,
  download: "Скачать {name}",
};

/** The album's props; each is described in `api.ts`. */
export type GalleryProps = React.HTMLAttributes<HTMLDivElement> & {
  items: readonly GalleryItem[];
  maxSize?: string;
  viewer?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  onCancel?: (index: number) => void | Promise<void>;
  onRetry?: (index: number) => void | Promise<void>;
  onDownload?: (index: number) => void | Promise<void>;
  labels?: Partial<GalleryLabels>;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** The layout of `items`: their ratios read once, nothing measured. */
export function galleryLayoutOf(items: readonly GalleryItem[]): GalleryLayout {
  const single = items.length === 1;
  return layoutGallery(items.map((item) => itemRatio(item.width, item.height, single)));
}

/** Rounds a fraction for a custom property (a stable string, no float noise). */
const frac = (value: number) => String(Math.round(value * 1e5) / 1e5);
/** A tile edge inside the gallery (not on its outer edge) is inset by half a gap. */
const inner = (value: number) => (value > 1e-4 && value < 1 - 1e-4 ? 1 : 0);

type TileProps = {
  item: GalleryItem;
  index: number;
  style: React.CSSProperties;
  labels: GalleryLabels;
  /** Opens the viewer at this tile; the tile is a button with it. */
  onOpen?: (index: number) => void;
  /** The viewer opens out of this tile and closes back into it. */
  tileRef?: (element: HTMLDivElement | null) => void;
  /** In a message: a press on the tile starts (`true`) or ends, and the message gives under it. */
  onPress?: (pressed: boolean) => void;
  onCancel?: (index: number) => void | Promise<void>;
  onRetry?: (index: number) => void | Promise<void>;
  onDownload?: (index: number) => void | Promise<void>;
};

/**
 * One tile: the picture (lazy, async decode) or a video's first frame (mounted once the tile nears
 * the view of its scroller), a play mark and the length; a button over it when it opens a viewer;
 * the transfer disk over it while it is on its way.
 */
function GalleryTileView({
  item,
  index,
  style,
  labels,
  onOpen,
  tileRef,
  onPress,
  onCancel,
  onRetry,
  onDownload,
}: TileProps) {
  const cellRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(cellRef, tileRef);
  const video = item.type === "video";
  const near = useNearView(cellRef);
  const [metaDuration, setMetaDuration] = React.useState<number | null>(null);
  const name = item.alt || (video ? labels.video : labels.photo);
  const transfer = item.transfer;
  const covered = transferCovers(transfer);
  const length = metaDuration ?? item.duration ?? null;
  const fallbackGlyph: IconName = video ? "action.video" : "object.image";

  return (
    <div ref={mergedRef} className={styles.tile} style={style} data-gallery-tile="">
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
          <Thumbnail.Image src={item.src} alt={onOpen ? "" : (item.alt ?? "")} />
        )}
        <Thumbnail.Fallback>
          <Icon name={fallbackGlyph} />
        </Thumbnail.Fallback>
      </Thumbnail.Root>
      {video ? (
        <>
          {/* A transfer takes the middle: the mark gives it up and comes back once it is done. */}
          <MediaPlayMark shown={!covered} className={styles.play} />
          {length !== null ? (
            <span className={cx(textRole.caption, pill.pill, styles.length)} aria-hidden="true">
              {formatClock(length)}
            </span>
          ) : null}
        </>
      ) : null}
      {onOpen ? (
        <button
          type="button"
          className={styles.open}
          aria-label={formatLabel(labels.open, { name })}
          aria-haspopup="dialog"
          onClick={() => onOpen(index)}
          {...(onPress
            ? {
                onPointerDown: () => onPress(true),
                onPointerUp: () => onPress(false),
                onPointerCancel: () => onPress(false),
                onPointerLeave: () => onPress(false),
                onKeyDown: (event: React.KeyboardEvent) => {
                  if (event.key === " " || event.key === "Enter") onPress(true);
                },
                onKeyUp: () => onPress(false),
                onBlur: () => onPress(false),
              }
            : {})}
        />
      ) : null}
      {/* Mounted through `done`: the ring fills, then the disk fades and shrinks away. */}
      {transfer ? (
        <span className={styles.transfer} data-covered={covered || undefined}>
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
 * Photos and videos as a messenger album: one, or 2–10 laid out by their aspect ratios (side by
 * side, stacked, a tall one beside a column, rows for larger albums), every tile in its final box
 * before anything loads — nothing is measured. A video tile shows its first frame, a play mark and
 * its length; a tile opens the album in `MediaViewer` at that item (or your own viewer:
 * `viewer={false}` with the open and index triads); a tile on its way, either way, dims under the
 * shared transfer disk.
 */
export function Gallery({
  items,
  maxSize,
  viewer = true,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  onCancel,
  onRetry,
  onDownload,
  labels: labelsProp,
  className,
  style,
  children,
  ...rest
}: GalleryProps) {
  const labels = useLabels(GALLERY_LABELS, labelsProp);
  const layout = galleryLayoutOf(items);
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [index, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  // A press on a tile presses the whole album (`press.press` on the root: a tile never scales
  // alone inside the album's rounded clip) — or, in a message, the whole bubble: the message
  // takes the press.
  const part = useMessagePart();
  // The tiles the viewer opens out of and closes back into.
  const tiles = React.useRef<(HTMLDivElement | null)[]>([]);
  const opens = viewer || onOpenChange !== undefined || onIndexChange !== undefined;
  const openAt = (at: number) => {
    setIndex(at);
    setOpen(true);
  };
  const shownCount = layout.tiles.length;
  const viewerItems = React.useMemo<MediaViewerItem[]>(
    () =>
      items.slice(0, shownCount).map((item) => ({
        type: item.type,
        src: item.src,
        thumbnail: item.type === "video" ? undefined : item.src,
        poster: item.poster,
        alt: item.alt,
        width: item.width,
        height: item.height,
      })),
    [items, shownCount],
  );

  return (
    <div
      {...rest}
      className={cx(styles.root, part.press ? undefined : press.press, className)}
      style={
        {
          "--gallery-ratio": frac(layout.ratio),
          "--gallery-factor": frac(layout.widthFactor),
          ...(maxSize === undefined ? {} : { "--gallery-limit": maxSize }),
          ...style,
        } as React.CSSProperties
      }
      {...toDataAttributes({
        count: shownCount,
        "max-size": maxSize === undefined ? undefined : true,
      })}
    >
      {layout.tiles.map((tile, at) => {
        const item = items[at] as GalleryItem;
        const tileStyle = {
          "--x": frac(tile.x),
          "--y": frac(tile.y),
          "--w": frac(tile.w),
          "--h": frac(tile.h),
          "--gs": inner(tile.x),
          "--ge": inner(tile.x + tile.w),
          "--gt": inner(tile.y),
          "--gb": inner(tile.y + tile.h),
        } as React.CSSProperties;
        return (
          <GalleryTileView
            // biome-ignore lint/suspicious/noArrayIndexKey: a tile is its place in the album
            key={at}
            item={item}
            index={at}
            style={tileStyle}
            labels={labels}
            onOpen={opens ? openAt : undefined}
            onPress={part.press}
            tileRef={(element) => {
              tiles.current[at] = element;
            }}
            onCancel={onCancel}
            onRetry={onRetry}
            onDownload={onDownload}
          />
        );
      })}
      {children}
      {viewer ? (
        <MediaViewer
          items={viewerItems}
          open={open}
          onOpenChange={setOpen}
          index={index}
          onIndexChange={setIndex}
          getOrigin={(at) => tiles.current[at] ?? null}
        />
      ) : null}
    </div>
  );
}
Gallery.displayName = "Gallery";
