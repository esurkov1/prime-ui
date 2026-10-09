import * as React from "react";

import { Spinner } from "@/components/spinner/Spinner";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import progressRing from "@/internal/progressRing.module.css";
import round from "@/internal/roundButton.module.css";
import {
  inFlight,
  type TransferDiskLabels,
  type TransferHandler,
  type TransferState,
} from "@/internal/transfer";
import { isPromiseLike } from "@/internal/usePendingChanges";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./transferDisk.module.css";

export type TransferDiskProps = {
  state: TransferState;
  /** Share transferred, 0…1. Without it a transfer in flight turns an indeterminate arc. */
  progress?: number;
  /**
   * `shade` (default) — a disk on the media shade with a blur, over a picture, a video circle or a
   * file's tile; `solid` — the accent disk of a voice message's play disk (recoloured by an
   * outgoing bubble like it). Over a play disk (`mediaPlayer` `PlayDisk`) it takes the look of
   * that disk, and the transfer takes the play glyph's place.
   */
  look?: "shade" | "solid";
  /**
   * `l` (default) — the control `l` disk (over media, the voice play disk); `xl` — the control
   * `xl` round tile of a file in a bubble. The ring is one proportion of the disk at both.
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
  /** The host is disabled: its action is off (native `disabled`, the round button's disabled look). */
  disabled?: boolean;
  className?: string;
};

type Action = "cancel" | "retry" | "download";

/**
 * The transfer disk — the one look of a transfer in the kit, both ways: a round disk
 * (`roundButton`) with the share as a ring along its inner edge (`progressRing`: a 32% track and a
 * solid arc in the glyph's colour clockwise from 12 o'clock, 7.5% of the disk at every size). In
 * flight it is the cancel (×); `remote` — the download arrow; a failure turns it danger with a
 * retry arrow; done, it fades and shrinks away (`fast`) and leaves the focus order (`inert`). A
 * promise from a handler keeps it pending (a spinner, `aria-busy`, no second press); a rejection
 * is announced. The progress is one CSS variable on the ring, gliding by itself (`base`). Not
 * ProgressCircle — that is a labelled data ring painted on the theme ladder in tones.
 */
export function TransferDisk({
  state,
  progress,
  look = "shade",
  size = "l",
  labels,
  onCancel,
  onRetry,
  onDownload,
  cancelPending = false,
  disabled = false,
  className,
}: TransferDiskProps) {
  const reasonId = React.useId();
  const [pending, setPending] = React.useState<Action | null>(null);
  const [notice, setNotice] = React.useState("");
  const alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const active = inFlight(state);
  const failed = state === "failed";
  const remote = state === "remote";
  const done = state === "done";
  const indeterminate = state === "loading" && progress === undefined;
  // The ring: empty while queued, the share while loading, full when done.
  const share = Math.min(1, Math.max(0, progress ?? 0));
  const fill = indeterminate ? 0.25 : state === "loading" ? share : state === "done" ? 1 : 0;
  const kind: Action | null = active ? "cancel" : failed ? "retry" : remote ? "download" : null;
  const handler =
    kind === "cancel"
      ? onCancel
      : kind === "retry"
        ? onRetry
        : kind === "download"
          ? onDownload
          : undefined;
  const busy = (kind !== null && pending === kind) || (active && cancelPending);

  const run = () => {
    if (!handler || !kind || busy || disabled) return;
    setNotice("");
    const result = handler();
    if (!isPromiseLike(result)) return;
    setPending(kind);
    result.then(
      () => {
        if (alive.current) setPending(null);
      },
      () => {
        if (!alive.current) return;
        setPending(null);
        const refused =
          kind === "cancel"
            ? labels.cancelFailed
            : kind === "retry"
              ? labels.retryFailed
              : labels.downloadFailed;
        setNotice(refused ?? "");
      },
    );
  };

  const glyph = busy ? (
    <Spinner aria-hidden="true" />
  ) : (
    <Icon
      name={
        remote
          ? "action.download"
          : failed
            ? onRetry
              ? "action.refresh"
              : "status.failed"
            : "action.close"
      }
    />
  );
  const buttonLook = failed ? "danger" : look;
  const name =
    kind === "cancel" ? labels.cancel : kind === "retry" ? labels.retry : labels.download;

  return (
    <span
      className={cx(styles.disk, className)}
      data-state={state}
      data-look={look}
      data-size={size}
      data-indeterminate={indeterminate || undefined}
      data-action={handler ? kind : undefined}
      inert={done || undefined}
      aria-hidden={done || undefined}
    >
      {handler ? (
        <button
          type="button"
          className={cx(round.round, styles.button)}
          data-look={buttonLook}
          aria-label={name}
          aria-describedby={failed && labels.failed ? reasonId : undefined}
          aria-busy={busy || undefined}
          aria-disabled={busy || undefined}
          disabled={disabled}
          onClick={run}
        >
          {glyph}
        </button>
      ) : (
        <span className={cx(round.round, styles.button)} data-look={buttonLook} aria-hidden="true">
          {failed || remote ? glyph : null}
        </span>
      )}
      <span
        className={cx(progressRing.ring, styles.ring)}
        style={{ "--transfer-progress": fill } as React.CSSProperties}
        {...(active
          ? {
              role: "progressbar",
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": indeterminate ? undefined : Math.round(fill * 100),
              "aria-label": labels.progress ?? undefined,
            }
          : { "aria-hidden": true })}
      />
      {failed && labels.failed ? (
        <VisuallyHidden id={reasonId}>{labels.failed}</VisuallyHidden>
      ) : null}
      {/* Only where a refusal has words to announce; a host with its own live region gives none. */}
      {labels.cancelFailed || labels.retryFailed || labels.downloadFailed ? (
        <VisuallyHidden role="status">{notice}</VisuallyHidden>
      ) : null}
    </span>
  );
}

export type TransferOverlayProps = TransferDiskProps;

/**
 * The transfer disk centred over a box (an attachment tile, a picture in a chat message, a video
 * circle). The host positions it (`position: absolute; inset: 0`) and dims its content while the
 * transfer is not done; only the disk takes the pointer.
 */
export function TransferOverlay({ className, ...props }: TransferOverlayProps) {
  return (
    <span className={cx(styles.overlay, className)} data-state={props.state}>
      <TransferDisk {...props} />
    </span>
  );
}
