import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { cx } from "@/internal/cx";
import { Disclosure } from "@/internal/Disclosure";
import { HighlightMatch } from "@/internal/HighlightMatch";
import { useMessageHighlight, useMessagePart } from "@/internal/messagePart";
import type { SurfaceDepth } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import { type AsyncHandler, isPromiseLike } from "@/internal/usePendingChanges";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./transcript.module.css";

/**
 * The transcript of a voice or video message (VoicePlayer, VideoNote): a button that opens the
 * text under the media, the text itself, and its request when the text is not known yet (each
 * prop is described in `transcript.api.ts`). An `onTranscribe` that returns nothing keeps the
 * button spinning until the owner passes `transcript`.
 */
export type TranscriptProps = {
  transcript?: string;
  onTranscribe?: AsyncHandler<[], string>;
  transcriptExpanded?: boolean;
  defaultTranscriptExpanded?: boolean;
  onTranscriptExpandedChange?: (expanded: boolean) => void;
};

export type TranscriptLabels = {
  /** Name of the transcript button while the text is closed. */
  transcribe: string;
  /** Name of the transcript button while the text is open. */
  hideTranscript: string;
  /** Announced when `onTranscribe` rejects. */
  transcribeFailed: string;
};

export const TRANSCRIPT_LABELS: TranscriptLabels = {
  transcribe: "Расшифровать",
  hideTranscript: "Скрыть расшифровку",
  transcribeFailed: "Не удалось расшифровать сообщение",
};

/** What a message keeps of its transcript while its row is out of a windowed group. */
type Memory = { expanded: boolean; text: string | undefined };

const MEMORY_KEY = "transcript";

type RegionOptions = {
  /** The message meta's spacer, at the end of the text's last line. */
  spacer?: React.ReactNode;
  /** The block that holds the text (a fill and padding under a video circle). */
  className?: string;
  /** The block is a surface of its own (under a video circle). */
  depth?: SurfaceDepth;
};

export type Transcript = {
  expanded: boolean;
  /** Asked to open, the text is not there yet: the button spins, the area stays closed. */
  pending: boolean;
  toggle: () => void;
  /** Props of the toggle button: its name and its relation to the text. */
  buttonProps: {
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-label": string;
  };
  /** The disclosure of the text and the announcement of a failed request. */
  region: (options?: RegionOptions) => React.ReactNode;
};

/**
 * The transcript's state: the expanded triad, the text (`transcript`, or what `onTranscribe`
 * resolved), the request and its rollback. `null` when there is nothing to transcribe.
 *
 * The text always sits in a collapsed `Disclosure` under the media: opening and closing are one
 * instant layout (the height and the text together) after `holdPosition` asks the chat to keep the
 * view still. No JS measures or animates anything. Asked to open before the text is known, the
 * area stays closed and only the button spins; the text opens once it is there — no placeholder
 * that would change the bubble twice.
 */
export function useTranscript(
  {
    transcript,
    onTranscribe,
    transcriptExpanded,
    defaultTranscriptExpanded = false,
    onTranscriptExpandedChange,
  }: TranscriptProps,
  labels: TranscriptLabels,
): Transcript | null {
  const highlight = useMessageHighlight().trim();
  // `holdPosition`: in a chat, the reader's view stays still while the text grows or shrinks below
  // the player, even at the end of the list — the row never moves.
  const { memory, holdPosition } = useMessagePart();
  // A row of a windowed group unmounts when it scrolls away: its state waits in the message memory.
  const [kept] = React.useState(() => memory?.get(MEMORY_KEY) as Memory | undefined);
  const [expanded, setExpanded] = useControllableState<boolean>({
    value: transcriptExpanded,
    defaultValue: kept?.expanded ?? defaultTranscriptExpanded,
    onChange: onTranscriptExpandedChange,
  });
  const [resolved, setResolved] = React.useState<string | undefined>(kept?.text);
  const [pending, setPending] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const regionId = React.useId();
  const text = transcript ?? resolved;
  const available = transcript !== undefined || onTranscribe !== undefined;

  const alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const requested = React.useRef(false);
  const request = () => {
    if (!onTranscribe || requested.current) return;
    requested.current = true;
    const result = onTranscribe();
    if (!isPromiseLike(result)) return;
    setPending(true);
    result.then(
      (value) => {
        if (!alive.current) return;
        holdPositionRef.current?.();
        setResolved(typeof value === "string" ? value : undefined);
        setPending(false);
      },
      () => {
        if (!alive.current) return;
        requested.current = false;
        holdPositionRef.current?.();
        setPending(false);
        setExpanded(false);
        setAnnouncement(labels.transcribeFailed);
      },
    );
  };
  const requestRef = React.useRef(request);
  requestRef.current = request;
  const holdPositionRef = React.useRef(holdPosition);
  holdPositionRef.current = holdPosition;

  // Open without a text: ask for it (a press, `defaultTranscriptExpanded`, the owner opening it).
  React.useEffect(() => {
    if (expanded && text === undefined) requestRef.current();
  }, [expanded, text]);

  React.useEffect(() => {
    memory?.set(MEMORY_KEY, { expanded, text: resolved } satisfies Memory);
  }, [memory, expanded, resolved]);

  // Open only with a text to show: while it is asked for, the button spins instead.
  const open = expanded && text !== undefined;
  const waiting = pending || (expanded && text === undefined);

  if (!available) return null;

  const toggle = () => {
    if (waiting) return;
    setAnnouncement("");
    holdPosition?.();
    setExpanded(!expanded);
  };

  const region = ({ spacer, className, depth }: RegionOptions = {}) => (
    <>
      <Disclosure id={regionId} open={open} className={styles.disclosure} data-transcript="">
        {/* Rendered while open: in a chat its coming and going are part of the message's morph
            (it fades in where it stands, and out where it stood, as the bubble glides). */}
        {open ? (
          <div className={cx(styles.block, className)} data-depth={depth} data-morph-item="">
            <p className={cx(textRole.bodyM, styles.text)}>
              <span data-message-selectable="">
                {highlight ? <HighlightMatch text={text} query={highlight} all /> : text}
              </span>
              {spacer}
            </p>
          </div>
        ) : null}
      </Disclosure>
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </>
  );

  return {
    expanded: open,
    pending: waiting,
    toggle,
    buttonProps: {
      "aria-expanded": open,
      "aria-controls": regionId,
      "aria-label": open ? labels.hideTranscript : labels.transcribe,
    },
    region,
  };
}
