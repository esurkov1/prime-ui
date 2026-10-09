import * as React from "react";

import { Button } from "@/components/button/Button";
import { Dnd } from "@/components/dnd/Dnd";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import type { UploadItem } from "@/hooks/useUploadQueue";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatClock } from "@/internal/formatClock";
import { leaveInPlace } from "@/internal/leaveInPlace";
import { TransferOverlay } from "@/internal/transferDisk";
import { useNearView } from "@/internal/useNearView";

import styles from "./attachmentTile.module.css";

export { styles as attachmentTileStyles };

/** What a tile shows: a picture, a video's first frame, or a file placeholder. */
export type AttachmentTileKind = "image" | "video" | "file";

export type AttachmentTileProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "children" | "id" | "onKeyDown"
> & {
  /** The id of the item in its `Dnd.Sortable`. */
  id: string;
  kind: AttachmentTileKind;
  /** The picture or the video (a URL or a local object URL); not used for a file. */
  src?: string;
  /** The name, at the start of the bottom band (one line, ellipsis). */
  name?: string;
  /** The full file name for the tooltip of a trimmed `name` (the format badge shows the extension). */
  nameTitle?: string;
  /** The size, at the end of the bottom band; a video without it shows its duration. */
  meta?: string;
  /**
   * The pill at the top start — the format (JPG, PDF) or a word such as «Обложка»; decorative, the
   * name says it. On a picture or a video it stands on the media shade; a file passes a kit Badge.
   */
  badge?: React.ReactNode;
  /**
   * The upload of the item: a disk in the middle with the progress ring along its edge
   * (`TransferOverlay`); the content dims under it until the upload is done.
   */
  upload?: UploadItem;
  /** The upload state in words («Загрузка 45%»): the ring's name and the reason of a failure. */
  uploadState?: string | null;
  /** The name of the disk while the upload is in flight: pressing it calls `onRemove`. */
  cancelLabel?: string;
  retryLabel?: string;
  onRetry?: () => void;
  /**
   * The delete button (and Delete / Backspace on the tile); without it there is none. While the
   * upload is in flight the disk in the middle is the delete (a cancel) and the corner one is not drawn.
   */
  onRemove?: () => void;
  removeLabel?: string;
  /** A change of this tile is being saved: dimmed, its delete button spins, it does not drag. */
  pending?: boolean;
  /** Arrived after the first render: it enters (`enterMotion`). */
  arrived?: boolean;
  /**
   * Ids of tiles their delete button took out: such a tile closes up in place (`leaveInPlace`)
   * when it unmounts. Give it only to a row of tiles (a strip).
   */
  leaving?: React.RefObject<Set<string>>;
  ref?: React.Ref<HTMLElement>;
};

/**
 * One tile of a set of attachments, rendered as a `Dnd.SortableItem` (it drags, Alt + arrows move
 * it). Every kind has the same slots: the pill at the top start, the remove button at the top end, a
 * band across the bottom (the name, then the size or a video's duration) and in the middle a
 * picture, a video's first frame (lazy) with its play mark, or the sheet of a file; the upload disk
 * with its progress ring stands over the middle. Shared by FileUpload tiles and the Composer tray.
 */
export function AttachmentTile({
  id,
  kind,
  src,
  name,
  nameTitle,
  meta,
  badge,
  upload,
  uploadState = null,
  cancelLabel,
  retryLabel,
  onRetry,
  onRemove,
  removeLabel,
  pending = false,
  arrived = false,
  leaving,
  className,
  ref,
  ...rest
}: AttachmentTileProps) {
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const setRef = useMergedRefs(nodeRef, ref);
  const inFlight = upload?.status === "queued" || upload?.status === "loading";
  // A video tells its length once its metadata is read: the band shows it when no size is given.
  const [duration, setDuration] = React.useState<number | null>(null);
  const bandMeta = meta ?? (kind === "video" && duration !== null ? formatClock(duration) : null);
  // Unmounted while still drawn: a tile its button took out closes up in place.
  React.useLayoutEffect(() => {
    return () => {
      const node = nodeRef.current;
      if (node && leaving?.current.delete(id)) leaveInPlace(node, "inline");
    };
  }, [id, leaving]);
  return (
    <Dnd.SortableItem
      {...rest}
      ref={setRef}
      id={id}
      disabled={pending}
      aria-busy={pending || undefined}
      data-pending={pending || undefined}
      data-kind={kind}
      data-upload={upload?.status}
      className={cx(styles.tile, arrived && cx(enterMotion.enter, styles.arrived), className)}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        if (event.target !== event.currentTarget || !onRemove) return;
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          onRemove();
        }
      }}
    >
      {kind === "video" ? (
        <TileVideo src={src ?? ""} onDuration={setDuration} />
      ) : kind === "image" ? (
        src ? (
          <img className={styles.image} src={src} alt="" decoding="async" draggable={false} />
        ) : null
      ) : (
        <span className={styles.sheet} aria-hidden="true">
          <Icon name="object.file" size="xl" animated={false} />
        </span>
      )}
      {name || bandMeta ? (
        // Decorative: the tile's name carries the file name and its state.
        <span className={styles.band} aria-hidden="true">
          <span className={styles.name} title={nameTitle}>
            {name}
          </span>
          {bandMeta ? <span className={styles.meta}>{bandMeta}</span> : null}
        </span>
      ) : null}
      {upload ? (
        // `data-dnd-mirror`: a tile carried mid-upload keeps showing its progress.
        <span className={styles.uploadLayer} data-dnd-mirror="">
          <TransferOverlay
            state={upload.status}
            progress={upload.progress}
            labels={{
              cancel: cancelLabel,
              retry: retryLabel,
              progress: uploadState,
              failed: uploadState,
            }}
            onCancel={onRemove}
            cancelPending={pending}
            onRetry={onRetry}
          />
        </span>
      ) : null}
      {badge !== undefined ? (
        // `data-dnd-mirror`: the carried copy shows the pill too, as it changes in flight.
        <span className={cx(styles.chip, styles.badge)} aria-hidden="true" data-dnd-mirror="">
          <ControlSizeProvider value="xs">{badge}</ControlSizeProvider>
        </span>
      ) : null}
      {onRemove && !inFlight ? (
        <span className={cx(styles.chip, styles.remove)}>
          <Button.Root
            variant="ghost"
            tone="inherit"
            aria-label={removeLabel}
            loading={pending}
            onClick={onRemove}
          >
            <Button.Icon>
              <Icon name="action.close" />
            </Button.Icon>
          </Button.Root>
        </span>
      ) : null}
    </Dnd.SortableItem>
  );
}

/** A row of tiles scrolls sideways — its hidden edges fade, a scroll rests on a tile, a vertical
 * wheel moves it — with the bar hidden. */
export function AttachmentStripScroller({ children }: { children: React.ReactNode }) {
  return (
    <ScrollContainer axis="horizontal" snap scrollbar="hidden" className={styles.scroller}>
      {children}
    </ScrollContainer>
  );
}

/**
 * A video tile: the clip's first frame (Thumbnail.Video) with its play mark; its length goes to the
 * band (a Thumbnail of the `m` tier draws no duration of its own). The frame is decoded lazily —
 * the video mounts once the tile nears the view of its scroller.
 */
function TileVideo({ src, onDuration }: { src: string; onDuration: (seconds: number) => void }) {
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const near = useNearView(frameRef);
  return (
    <Thumbnail.Root ref={frameRef} size="m" className={styles.media}>
      {near && src ? (
        <Thumbnail.Video
          src={src}
          onLoadedMetadata={(event) => {
            const seconds = event.currentTarget.duration;
            if (Number.isFinite(seconds)) onDuration(seconds);
          }}
        />
      ) : null}
      <Thumbnail.Fallback>
        <Icon name="action.video" />
      </Thumbnail.Fallback>
    </Thumbnail.Root>
  );
}
