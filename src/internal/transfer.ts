import { formatLabel } from "@/internal/formatLabel";
import type { AsyncHandler } from "@/internal/usePendingChanges";

/**
 * Where a transfer of a file or a recording is, in either direction: `remote` — not fetched yet
 * (the download arrow fetches it); `queued` — waiting its turn; `loading` — in flight; `failed` —
 * stopped by an error (a retry sends or fetches it again); `done` — through. The values of
 * `UploadItem.status` (without `remote`), so an upload queue item maps onto a message part as is.
 */
export type TransferState = "remote" | "queued" | "loading" | "failed" | "done";

/**
 * Which way it goes: `upload` — sending it, `download` — receiving it. It changes only the words
 * (labels and announcements), never the look.
 */
export type TransferDirection = "upload" | "download";

/** A cancel, a retry or a download: a returned promise keeps the disk pending until it settles. */
export type TransferHandler = AsyncHandler;

/**
 * The transfer props of every part that sends or receives its content (VoicePlayer, VideoNote,
 * Message.File; Message.Media per item, its handlers per index). Each prop is described in
 * `transfer.api.ts`.
 */
export type TransferProps = {
  transfer?: TransferState;
  transferProgress?: number;
  transferDirection?: TransferDirection;
  onCancel?: TransferHandler;
  onRetry?: TransferHandler;
  onDownload?: TransferHandler;
};

/** The strings of a transfer, one shape for every part that transfers its content. */
export type TransferLabels = {
  /** The cross while sending. */
  cancelUpload: string;
  /** The cross while receiving. */
  cancelDownload: string;
  /** The retry after a failed send. */
  retryUpload: string;
  /** The retry after a failed receive. */
  retryDownload: string;
  /** The ring while sending: `{percent}`. */
  uploadProgress: string;
  /** The ring while receiving: `{percent}`. */
  downloadProgress: string;
  /** Why a send failed: the retry's description. */
  notSent: string;
  /** Why a receive failed: the retry's description. */
  notReceived: string;
  /** The download arrow of a `remote` content. */
  download: string;
  /** Announced when `onCancel` rejected. */
  cancelFailed: string;
  /** Announced when `onRetry` rejected. */
  retryFailed: string;
  /** Announced when `onDownload` rejected. */
  downloadFailed: string;
};

export const TRANSFER_LABELS: TransferLabels = {
  cancelUpload: "Отменить отправку",
  cancelDownload: "Отменить загрузку",
  retryUpload: "Повторить отправку",
  retryDownload: "Повторить загрузку",
  uploadProgress: "Отправка {percent}%",
  downloadProgress: "Загрузка {percent}%",
  notSent: "Не отправилось",
  notReceived: "Не загрузилось",
  download: "Скачать",
  cancelFailed: "Не удалось отменить",
  retryFailed: "Не удалось повторить",
  downloadFailed: "Не удалось скачать",
};

/** A transfer still in flight. */
export const inFlight = (state: TransferState | undefined) =>
  state === "queued" || state === "loading";

/** The content is not there to use: in flight, failed or not fetched yet. */
export const transferCovers = (state: TransferState | undefined) =>
  state !== undefined && state !== "done";

/** The strings the transfer disk reads, already resolved for one direction. */
export type TransferDiskLabels = {
  cancel?: string;
  retry?: string;
  download?: string;
  /** The ring's name («Отправка 45%»). */
  progress?: string | null;
  /** On a failure: the reason, the retry's description. */
  failed?: string | null;
  cancelFailed?: string;
  retryFailed?: string;
  downloadFailed?: string;
};

/** The disk's strings from a part's transfer labels, for its direction and share. */
export function transferDiskLabels(
  labels: TransferLabels,
  direction: TransferDirection,
  progress: number | undefined,
  tokens: Record<string, string> = {},
): TransferDiskLabels {
  const up = direction === "upload";
  return {
    cancel: up ? labels.cancelUpload : labels.cancelDownload,
    retry: up ? labels.retryUpload : labels.retryDownload,
    download: formatLabel(labels.download, tokens),
    progress: formatLabel(up ? labels.uploadProgress : labels.downloadProgress, {
      percent: Math.round(Math.min(1, Math.max(0, progress ?? 0)) * 100),
    }),
    failed: up ? labels.notSent : labels.notReceived,
    cancelFailed: labels.cancelFailed,
    retryFailed: labels.retryFailed,
    downloadFailed: labels.downloadFailed,
  };
}
