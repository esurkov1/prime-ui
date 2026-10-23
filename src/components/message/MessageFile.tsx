import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { extensionOf, formatColor } from "@/internal/fileFormat";
import { splitFileName } from "@/internal/fileName";
import { formatFileSize } from "@/internal/fileSize";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import palette from "@/internal/palette.module.css";
import { FRAME_DESCRIPTION, FRAME_TITLE } from "@/internal/surfaceFrame";
import textRole from "@/internal/textRole.module.css";
import {
  inFlight,
  TRANSFER_LABELS,
  type TransferLabels,
  type TransferProps,
  transferDiskLabels,
} from "@/internal/transfer";
import { TransferDisk } from "@/internal/transferDisk";
import styles from "./MessageFile.module.css";

/**
 * The file strings, and the transfer strings every transferring part shares; `download` (the
 * link of `href` and the arrow of a `remote` file) takes `{name}`.
 */
export type MessageFileLabels = {
  /** The line under the name while it transfers: `{done}`, `{total}`. */
  transferred: string;
} & TransferLabels;

export const MESSAGE_FILE_LABELS: MessageFileLabels = {
  transferred: "{done} из {total}",
  ...TRANSFER_LABELS,
  download: "Скачать {name}",
};

export type MessageFileProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> &
  TransferProps & {
    name: string;
    fileSize?: number;
    formatSize?: (bytes: number) => string;
    href?: string;
    preview?: string;
    labels?: Partial<MessageFileLabels>;
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * A document, the row anatomy of a card on the `s` step of the frame (the bubble's text scale): a round 40 tile with the format (or the file's picture), the name and the size (or
 * «{done} из {total}», or the failure) beside it. The tile is the file's one action, in one spot:
 * download, cancel, retry. While the file transfers, failed or is not fetched yet, the shared
 * transfer disk (`internal/transferDisk`, size `l`) covers the tile: the cross on the media shade
 * with the ring of the share, the danger retry, the download arrow. The download of `href` is a
 * link drawn as a `Button shape="circle"` (`asChild`) over the tile.
 */
export function MessageFile({
  name,
  fileSize,
  formatSize = formatFileSize,
  href,
  preview,
  transfer,
  transferProgress: progressProp,
  transferDirection = "upload",
  onCancel,
  onRetry,
  onDownload,
  labels: labelsProp,
  className,
  ref,
  ...rest
}: MessageFileProps) {
  const labels = useLabels(MESSAGE_FILE_LABELS, labelsProp);
  const { spacer } = useMessagePart();
  const transferring = inFlight(transfer);
  const failed = transfer === "failed";
  const progress = Math.min(1, Math.max(0, progressProp ?? 0));
  const format = extensionOf(name);
  const size = fileSize !== undefined ? formatSize(fileSize) : null;
  const description = failed
    ? transferDirection === "upload"
      ? labels.notSent
      : labels.notReceived
    : transferring && fileSize !== undefined
      ? formatLabel(labels.transferred, {
          done: formatSize(fileSize * progress),
          total: size ?? "",
        })
      : size;

  // What the tile shows at rest: the file's picture, its format, or a document glyph.
  const face = preview ? (
    <Thumbnail.Root size="m" className={styles.preview} aria-hidden="true">
      <Thumbnail.Image src={preview} />
      <Thumbnail.Fallback>
        <Icon name="object.document" />
      </Thumbnail.Fallback>
    </Thumbnail.Root>
  ) : format ? (
    <span className={cx(textRole.caption, styles.format)} aria-hidden="true">
      {format.slice(0, 4).toUpperCase()}
    </span>
  ) : (
    <Icon name="object.document" />
  );

  // The download link, drawn in the tile itself over the face; a transfer is the transfer disk's.
  const download = href && (transfer === undefined || transfer === "done");

  return (
    <div {...rest} ref={ref} className={cx(styles.file, className)}>
      <span
        className={cx(styles.tile, palette.hue)}
        {...toDataAttributes({
          color: formatColor(format),
          action: download ? "download" : undefined,
          transfer,
        })}
      >
        {download ? (
          <Button.Root
            asChild
            shape="circle"
            size="l"
            className={styles.action}
            aria-label={formatLabel(labels.download, { name })}
          >
            <a href={href} download={name}>
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
            </a>
          </Button.Root>
        ) : null}
        {/* After the download: the face under a shown download fades (`.action ~ .face`). */}
        <span className={styles.face}>{face}</span>
        {/* Mounted for any transfer state: it fills, and fades out once the file is done. */}
        {transfer !== undefined ? (
          <TransferDisk
            size="l"
            className={styles.disk}
            state={transfer}
            progress={progressProp}
            // The reason is the size line beside the tile, not a second copy in the disk.
            labels={{
              ...transferDiskLabels(labels, transferDirection, progressProp, { name }),
              failed: null,
            }}
            onCancel={onCancel}
            onRetry={onRetry}
            onDownload={onDownload}
          />
        ) : null}
      </span>
      <div className={cx(FRAME_TITLE.m, styles.name)} title={name}>
        <span data-message-selectable="">{preview ? name : splitFileName(name).base}</span>
      </div>
      <div className={cx(FRAME_DESCRIPTION.m, styles.meta)} data-failed={failed || undefined}>
        {description ? <span className={styles.size}>{description}</span> : null}
        {spacer}
      </div>
    </div>
  );
}
MessageFile.displayName = "Message.File";

defineMessagePart(MessageFile, { shell: "fill", meta: "inline", sized: true });
