import * as React from "react";
import { Button } from "@/components/button/Button";
import { Spinner } from "@/components/spinner/Spinner";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { CircleAlert } from "@/icons/glyphs/circle-alert";
import { Download } from "@/icons/glyphs/download";
import { RefreshCw } from "@/icons/glyphs/refresh-cw";
import { X } from "@/icons/glyphs/x";
import { cx } from "@/internal/cx";
import { mediaDiskClass } from "@/internal/mediaDisk";
import { Ring } from "@/internal/ring";
import {
  inFlight,
  type TransferDiskLabels,
  type TransferHandler,
  type TransferState,
} from "@/internal/transfer";
import { isPromiseLike, usePendingKeys } from "@/internal/usePendingChanges";

import styles from "./transferDisk.module.css";

export type TransferDiskProps = {
  state: TransferState;
  /** Share transferred, 0…1. Without it a transfer in flight turns an indeterminate arc. */
  progress?: number;
  /**
   * `shade` (default) — Button `variant="shade"`: the media shade with a blur, over a picture, a
   * video circle or a file's tile; `solid` — the accent disk of a voice message (recoloured by an
   * outgoing bubble).
   */
  look?: "shade" | "solid";
  /**
   * `l` (default) — the control `l` disk (over media, the voice play disk); `xl` — the control
   * `xl` round tile of a file in a bubble.
   */
  size?: "l" | "xl";
  labels: TransferDiskLabels;
  /** The cross while in flight; without it the disk carries only the ring. */
  onCancel?: TransferHandler;
  /** The retry after a failure; without it the failed disk only marks the failure. */
  onRetry?: TransferHandler;
  /** The download arrow of a `remote` content; without it the disk only marks it. */
  onDownload?: TransferHandler;
  /** The host saves the cancel itself (a tile's pending delete): the disk spins. */
  cancelPending?: boolean;
  /** The host is disabled: its action is off. */
  disabled?: boolean;
  className?: string;
};

type Action = "cancel" | "retry" | "download";

type TransferDiskModel = {
  /** What a press does now, or `null` when the disk only shows the state. */
  action: Action | null;
  /** The handler of `action` was given. */
  pressable: boolean;
  /** A handler's promise (or the host's pending cancel) is in flight. */
  busy: boolean;
  /** The glyph in the disk: ×, the retry or download arrow, the failure mark, or a Spinner. */
  glyph: React.ReactNode;
  /** The disk's name. */
  name: string | undefined;
  /** For Button `progress`: the share in flight (`null` unknown), full when done, else none. */
  progress: number | null | undefined;
  failed: boolean;
  /** The id of the disk's description (the share in flight, the reason of a failure). */
  describedBy: string | undefined;
  /** Hidden texts the disk refers to: its description and the live region of refusals. */
  texts: React.ReactNode;
  run: () => void;
};

/**
 * The logic of a transfer disk, shared by `TransferDisk` and the play disk of the players (which
 * draw it as one `Button shape="circle"`): what a press does in each state, a pending promise (no
 * second press, `aria-busy`), the announcement of a refusal, the names and the description (the
 * share in flight — «Отправка 45%» — or the reason of a failure).
 */
export function useTransferDisk({
  state,
  progress,
  labels,
  onCancel,
  onRetry,
  onDownload,
  cancelPending = false,
  disabled = false,
}: Omit<TransferDiskProps, "look" | "size" | "className">): TransferDiskModel {
  const descriptionId = React.useId();
  const { pending, track } = usePendingKeys<Action>();
  const [notice, setNotice] = React.useState("");

  const active = inFlight(state);
  const failed = state === "failed";
  const remote = state === "remote";
  const action: Action | null = active ? "cancel" : failed ? "retry" : remote ? "download" : null;
  const handler =
    action === "cancel"
      ? onCancel
      : action === "retry"
        ? onRetry
        : action === "download"
          ? onDownload
          : undefined;
  const busy = (action !== null && pending.has(action)) || (active && cancelPending);

  const run = () => {
    if (!handler || !action || busy || disabled) return;
    setNotice("");
    // A returned promise keeps the action pending until it settles; a rejection is announced.
    const outcome = track(action, handler());
    if (!isPromiseLike(outcome)) return;
    const refused =
      action === "cancel"
        ? labels.cancelFailed
        : action === "retry"
          ? labels.retryFailed
          : labels.downloadFailed;
    outcome.then(undefined, () => setNotice(refused ?? ""));
  };

  // One glyph slot: the host's `Button.Icon` cross-fades a change of it in place.
  const TransferGlyph = remote ? Download : failed ? (onRetry ? RefreshCw : CircleAlert) : X;
  const glyph = busy ? <Spinner /> : <TransferGlyph />;
  const name =
    action === "cancel" ? labels.cancel : action === "retry" ? labels.retry : labels.download;
  // The ring: empty while queued (it turns at its least arc), the share while loading (`null`
  // unknown), full when done; none on a failure or a content not fetched.
  const share =
    state === "queued"
      ? 0
      : state === "loading"
        ? progress === undefined
          ? null
          : Math.min(1, Math.max(0, progress))
        : state === "done"
          ? 1
          : undefined;
  const description = active ? labels.progress : failed ? labels.failed : null;

  return {
    action,
    pressable: Boolean(handler),
    busy,
    glyph,
    name,
    progress: share,
    failed,
    describedBy: description ? descriptionId : undefined,
    texts: (
      <>
        {description ? <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden> : null}
        {/* Only where a refusal has words to announce; a host with its own live region gives none. */}
        {labels.cancelFailed || labels.retryFailed || labels.downloadFailed ? (
          <VisuallyHidden live="polite">{notice}</VisuallyHidden>
        ) : null}
      </>
    ),
    run,
  };
}

/**
 * The transfer disk — the one look of a transfer in the kit, both ways: a `Button
 * shape="circle"` whose `progress` ring runs along its inner edge in the glyph's color (the kit
 * ring at the line weight, turning). In flight it is the cancel (×), described by the share;
 * `remote` — the download arrow; a failure turns it danger with a retry arrow, described by the
 * reason; done, the ring fills, then the disk fades and shrinks to 0.9 and leaves the focus order
 * (`inert`). Without the handler of its state it is no button: a still disk with the ring, a
 * named `progressbar` while in flight.
 */
export function TransferDisk({
  look = "shade",
  size = "l",
  className,
  ...props
}: TransferDiskProps) {
  const disk = useTransferDisk(props);
  const { state, disabled = false } = props;
  const done = state === "done";
  const variant = look === "shade" ? "shade" : "solid";
  const tone = disk.failed ? "danger" : "accent";

  return (
    <span
      className={cx(styles.disk, className)}
      data-state={state}
      data-size={size}
      data-action={disk.pressable ? disk.action : undefined}
      inert={done || undefined}
      aria-hidden={done || undefined}
    >
      {disk.pressable ? (
        <Button.Root
          shape="circle"
          variant={variant}
          tone={tone}
          size={size}
          className={styles.button}
          aria-label={disk.name ?? ""}
          aria-describedby={disk.describedBy}
          aria-disabled={disk.busy || undefined}
          aria-busy={disk.busy || undefined}
          disabled={disabled}
          progress={disk.progress}
          onClick={disk.run}
        >
          <Button.Icon>{disk.glyph}</Button.Icon>
        </Button.Root>
      ) : (
        // A disk with no action is no button (a Button would be focusable and pressable): a still
        // disk in the same colors, with the same ring.
        <span
          className={cx(mediaDiskClass, styles.still)}
          data-size={size}
          data-variant={variant}
          data-state={disk.failed ? "failed" : undefined}
          {...(inFlight(state)
            ? {
                role: "progressbar",
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-valuenow":
                  disk.progress === null || disk.progress === undefined
                    ? undefined
                    : Math.round(disk.progress * 100),
                "aria-label": props.labels.progress ?? undefined,
              }
            : { "aria-hidden": true })}
        >
          {disk.progress !== undefined ? (
            <Ring value={disk.progress} spin={!done} className={styles.ring} />
          ) : null}
          {state === "failed" || state === "remote" ? disk.glyph : null}
        </span>
      )}
      {disk.texts}
    </span>
  );
}

/**
 * The transfer disk centred over a box (an attachment tile, a picture in a chat message, a video
 * circle). The host positions it (`position: absolute; inset: 0`) and dims its content while the
 * transfer is not done; only the disk takes the pointer.
 */
export function TransferOverlay({ className, ...props }: TransferDiskProps) {
  return (
    <span className={cx(styles.overlay, className)} data-state={props.state}>
      <TransferDisk {...props} />
    </span>
  );
}
