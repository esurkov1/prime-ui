import * as React from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Crossfade } from "@/components/crossfade/Crossfade";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { FileUpload, type FileUploadPicker } from "@/components/file-upload/FileUpload";
import { GALLERY_MAX } from "@/components/gallery/Gallery";
import { Hint } from "@/components/hint/Hint";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Textarea } from "@/components/textarea/Textarea";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { TOUCH_QUERY } from "@/hooks/breakpoints";
import { useControllableState } from "@/hooks/useControllableState";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { prefersReducedMotion, usePresence } from "@/hooks/usePresence";
import type { UploadItem, UploadQueue } from "@/hooks/useUploadQueue";
import { Icon, type IconName } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { Disclosure } from "@/internal/Disclosure";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { GlyphSwap } from "@/internal/glyphSwap";
import { iconBoxClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { type MediaKind, mediaKind } from "@/internal/mediaKind";
import { useEnterOnAppear, usePartPresence } from "@/internal/partPresence";
import { Ring } from "@/internal/ring";
import { type ControlSize, stepDown } from "@/internal/states";
import statusLoop from "@/internal/statusLoop.module.css";
import { TEXT_FORMATTING_LABELS, type TextFormattingLabels } from "@/internal/textFormatting";
import { useTextFormatting } from "@/internal/textFormattingToolbar";
import { type AsyncHandler, isPromiseLike, usePendingKeys } from "@/internal/usePendingChanges";
import styles from "./Composer.module.css";
import { drawLiveWave, type LiveWaveSize, type LiveWaveStyle } from "./liveWave";
import {
  type ComposerRecording,
  type ComposerRecordMode,
  canRecord,
  type RecorderError,
  recordedMs,
  SAMPLE_MS,
  useRecorder,
  VIDEO_MAX_MS,
} from "./useRecorder";

export type { ComposerRecording, ComposerRecordMode } from "./useRecorder";

/** Every built-in string; the formatting toolbar's names are shared with Textarea. */
export type ComposerLabels = TextFormattingLabels & {
  /** Accessible name of the composer `<form>`. */
  region: string;
  /** Placeholder and accessible name of the message field. */
  placeholder: string;
  /** Name of the send button. */
  send: string;
  /** Name of the send button while a message is edited. */
  save: string;
  /** Name of the record button in voice mode. */
  recordVoice: string;
  /** Name of the record button in video mode. */
  recordVideo: string;
  /** Description of the record button: how to record. */
  recordHint: string;
  /** Description of the record button when it also switches voice and video. */
  recordSwitchHint: string;
  /** Announced when the record button switches to voice messages. */
  recordModeVoice: string;
  /** Announced when the record button switches to video messages. */
  recordModeVideo: string;
  /** Name of the send button while recording. */
  sendRecording: string;
  /** Name of the button that throws a recording away. */
  cancelRecording: string;
  /** Name of the button that pauses a recording. */
  pauseRecording: string;
  /** Name of the button that resumes a paused recording. */
  resumeRecording: string;
  /** Hint while a recording is held: slide the pointer away to cancel. */
  slideToCancel: string;
  /** Announced when a recording starts. */
  recordingStarted: string;
  /** Announced when a held recording is locked and goes on without holding. */
  recordingLocked: string;
  /** Announced when a recording is thrown away. */
  recordingCanceled: string;
  /** Announced when a recording is paused. */
  recordingPaused: string;
  /** Announced when a paused recording goes on. */
  recordingResumed: string;
  /** Announced when a recording is handed over to send. */
  recordingSent: string;
  /** Error when the browser refuses the microphone or the camera. */
  recordDenied: string;
  /** Error when there is no microphone or camera. */
  recordMissing: string;
  /** Error when a recording cannot start for another reason. */
  recordFailed: string;
  /** Name of the paperclip (the picker, or the menu of attachment kinds). */
  attach: string;
  /** Accessible name of the strip of attachments. */
  attachments: string;
  /** The option that sends the attached photos and videos as files, uncompressed. */
  sendAsFiles: string;
  /** Name of the close button of a reply bar. */
  cancelReply: string;
  /** Name of the close button of an edit bar. */
  cancelEdit: string;
  /** Name of the button that shows and hides the reply keyboard, and of the keyboard itself. */
  keyboard: string;
};

export const COMPOSER_LABELS: ComposerLabels = {
  region: "Новое сообщение",
  placeholder: "Сообщение",
  send: "Отправить",
  save: "Сохранить",
  recordVoice: "Записать голосовое",
  recordVideo: "Записать видеосообщение",
  recordHint: "Удерживайте, чтобы записать; нажмите, чтобы записывать без удержания",
  recordSwitchHint:
    "Нажмите или удерживайте, чтобы записать; двойное нажатие или стрелки вверх и вниз переключают голос и видео",
  recordModeVoice: "Голосовое сообщение",
  recordModeVideo: "Видеосообщение",
  sendRecording: "Отправить запись",
  cancelRecording: "Удалить запись",
  pauseRecording: "Приостановить запись",
  resumeRecording: "Продолжить запись",
  slideToCancel: "Влево — отмена",
  recordingStarted: "Идёт запись",
  recordingLocked: "Запись продолжается без удержания",
  recordingCanceled: "Запись удалена",
  recordingPaused: "Запись приостановлена",
  recordingResumed: "Запись продолжена",
  recordingSent: "Запись отправлена",
  recordDenied: "Нет доступа к микрофону или камере — разрешите его в настройках браузера",
  recordMissing: "Микрофон или камера не найдены",
  recordFailed: "Не удалось начать запись",
  attach: "Прикрепить",
  attachments: "Вложения",
  sendAsFiles: "Отправить как файлы, без сжатия",
  ...TEXT_FORMATTING_LABELS,
  cancelReply: "Отменить ответ",
  cancelEdit: "Отменить редактирование",
  keyboard: "Клавиатура бота",
};

/** An attached photo or video: the uploaded queue item and what it shows. */
export type ComposerMediaItem = UploadItem & { type: MediaKind };

/**
 * What `onSend` receives: the text (trimmed); the uploaded photos and videos as `albums` (in the
 * order of the tray, a new album every `GALLERY_MAX` items — one message each) and `files`
 * (everything else, or every file with «как файлы»); and the `messageId` of the shown
 * `Composer.Context` — `replyTo` for a reply, `editOf` for an edit.
 */
export type ComposerMessage = {
  text: string;
  albums: readonly (readonly ComposerMediaItem[])[];
  files: readonly UploadItem[];
  replyTo?: string;
  editOf?: string;
};

/**
 * What the person is doing in the composer, for the «печатает…» signal of the other side:
 * `typing`, recording a `voice` message or a `video` message.
 */
export type ComposerActivity = "typing" | "voice" | "video";

/** The queue the composer attaches files to (`useUploadQueue`). */
export type ComposerQueue = Pick<
  UploadQueue,
  "items" | "add" | "retry" | "remove" | "clear" | "move"
>;

/** Reply to a message, or edit one of yours. */
export type ComposerContextMode = "reply" | "edit";

type Bar = {
  id: string;
  mode: ComposerContextMode;
  /** The message the bar is about (`Composer.Context messageId`). */
  messageId: string | undefined;
  dismiss: (() => void) | undefined;
};

const [ComposerProvider, useComposerContext] = createComponentContext<{
  size: ControlSize;
  labels: ComposerLabels;
  disabled: boolean;
  addFiles: (files: File[]) => void;
  registerBar: (bar: Bar) => () => void;
  /** Focuses the field, unless the composer is mounting (a bar shown on page load steals nothing). */
  focusFieldIfLive: () => void;
  /** The start cell of the row: `Composer.Attach` renders itself into it from wherever it stands. */
  attachSlot: HTMLElement | null;
  /** The place under the row and the toggle's cell before the send button: `Composer.Keyboard`. */
  keyboardSlot: HTMLElement | null;
  keyboardToggleSlot: HTMLElement | null;
  /** The field's placeholder while a reply keyboard is shown (`null` — the default one). */
  setKeyboardPlaceholder: (placeholder: string | null) => void;
  /** Sends a key's text as a message through `onSend`; the field's draft stays. */
  sendText: (text: string) => unknown;
  recording: boolean;
}>("Composer");

/** A press shorter than this is a tap: it locks a recording. */
const HOLD_MS = 200;
/**
 * A second press this soon after the first is a double click / double tap: it switches voice and
 * video. The web cannot read the platform interval (often 500 ms); this is the common double-tap
 * reaction of touch screens, short enough that the delayed reveal of a recording reads as instant.
 */
const DOUBLE_MS = 300;
const EMPTY_UPLOADS: readonly UploadItem[] = [];
/** The field grows from one line to this many, then scrolls inside. */
const MAX_ROWS = 8;
/** `typing` ends this long after the last keystroke. */
const TYPING_IDLE_MS = 3000;

/** `0:07,4`: minutes, seconds and tenths of a recording. */
function formatElapsed(ms: number): string {
  const tenths = Math.floor(ms / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor((tenths % 600) / 10);
  return `${minutes}:${String(seconds).padStart(2, "0")},${tenths % 10}`;
}

/**
 * The files of a paste. Some apps put a screenshot on the clipboard as a file with no type (and
 * no extension): the clipboard item still says what it is, so the file takes that type and a name
 * the tray can show.
 */
function pastedFiles(data: DataTransfer | null): File[] {
  const files = Array.from(data?.files ?? []);
  const kinds = Array.from(data?.items ?? [])
    .filter((item) => item.kind === "file")
    .map((item) => item.type);
  return files.map((file, index) => {
    const type = kinds[index] ?? "";
    if (file.type !== "" || type === "") return file;
    const name = file.name || `${type.split("/")[0] ?? "file"}.${type.split("/")[1] ?? "bin"}`;
    return new File([file], name, { type, lastModified: file.lastModified });
  });
}

const ERROR_LABEL: Record<RecorderError, keyof ComposerLabels> = {
  denied: "recordDenied",
  missing: "recordMissing",
  failed: "recordFailed",
};

// ─── Root ────────────────────────────────────────────────────────────────────

export type ComposerRootProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "children" | "defaultValue" | "onSubmit"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: AsyncHandler<[message: ComposerMessage], unknown>;
  onActivityChange?: (activity: ComposerActivity | null) => void;
  onSendVoice?: AsyncHandler<[recording: ComposerRecording], unknown>;
  onSendVideoNote?: AsyncHandler<[recording: ComposerRecording], unknown>;
  onEditLast?: () => void;
  recordMode?: ComposerRecordMode;
  defaultRecordMode?: ComposerRecordMode;
  onRecordModeChange?: (mode: ComposerRecordMode) => void;
  queue?: ComposerQueue;
  formatting?: boolean;
  size?: ControlSize;
  disabled?: boolean;
  labels?: Partial<ComposerLabels>;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLFormElement>;
};

function ComposerRoot({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSend,
  onActivityChange,
  onSendVoice,
  onSendVideoNote,
  onEditLast,
  recordMode: recordModeProp,
  defaultRecordMode = "voice",
  onRecordModeChange,
  queue,
  formatting = true,
  size: sizeProp,
  disabled: disabledProp,
  labels: labelsProp,
  inputRef,
  className,
  children,
  ref,
  onKeyDown,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...rest
}: ComposerRootProps) {
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(COMPOSER_LABELS, labelsProp);
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [recordModeState, setRecordMode] = useControllableState<ComposerRecordMode>({
    value: recordModeProp,
    defaultValue: defaultRecordMode,
    onChange: onRecordModeChange,
  });
  const touch = useMediaQuery(TOUCH_QUERY);
  const fieldId = React.useId();
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const setTextareaRef = useMergedRefs(textareaRef, inputRef);
  const [pending, setPending] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  // Recording is feature-detected after mount: the server and the first paint never offer it.
  const [support, setSupport] = React.useState({ voice: false, video: false });
  React.useEffect(() => {
    setSupport({ voice: canRecord("voice"), video: canRecord("video") });
  }, []);

  // ── Reply / edit bars ──
  const [bars, setBars] = React.useState<readonly Bar[]>([]);
  const registerBar = React.useCallback((bar: Bar) => {
    setBars((list) => [...list.filter((item) => item.id !== bar.id), bar]);
    return () => setBars((list) => list.filter((item) => item.id !== bar.id));
  }, []);
  const bar = bars[bars.length - 1];
  const editing = bar?.mode === "edit";
  const live = React.useRef(false);
  React.useEffect(() => {
    live.current = true;
  }, []);
  const focusFieldIfLive = React.useCallback(() => {
    if (live.current) textareaRef.current?.focus();
  }, []);

  // ── Attachments ──
  const uploads = queue?.items ?? EMPTY_UPLOADS;
  const uploading = uploads.some((item) => item.status === "queued" || item.status === "loading");
  /**
   * «Отправить как файлы»: the photos and videos go as files, uncompressed. It changes only what
   * `onSend` receives; the tray keeps showing them as the strip.
   */
  const [asFiles, setAsFiles] = React.useState(false);
  // One strip of every attachment in the queue's order (the order attached, then reordered).
  const hasMediaFiles = uploads.some((item) => mediaKind(item.file) !== null);
  // The option belongs to the photos it was set for: with none left it resets.
  if (asFiles && !hasMediaFiles) setAsFiles(false);
  const done = uploads.filter((item) => item.status === "done");
  // Photos and videos keep their order inside the album, the other files theirs; «как файлы»
  // sends every file as a file, in the order of the tray.
  const sentMedia = asFiles
    ? []
    : done.flatMap((item): ComposerMediaItem[] => {
        const type = mediaKind(item.file);
        return type === null ? [] : [{ ...item, type }];
      });
  // An album lays out at most `GALLERY_MAX` items: a longer set goes as several.
  const albums = Array.from({ length: Math.ceil(sentMedia.length / GALLERY_MAX) }, (_, index) =>
    sentMedia.slice(index * GALLERY_MAX, (index + 1) * GALLERY_MAX),
  );
  const doneFiles = asFiles ? done : done.filter((item) => mediaKind(item.file) === null);
  const addFiles = React.useCallback(
    (files: File[]) => {
      if (!queue || disabled || files.length === 0) return;
      queue.add(files);
    },
    [queue, disabled],
  );

  // ── Send ──
  const text = value.trim();
  const hasContent = text !== "" || done.length > 0;
  const canSend = hasContent && !uploading && !pending && !disabled;

  const finishSend = (result: unknown, onDone: () => void) => {
    if (!isPromiseLike(result)) {
      onDone();
      return;
    }
    setPending(true);
    Promise.resolve(result).then(
      () => {
        setPending(false);
        onDone();
      },
      () => setPending(false),
    );
  };

  const send = () => {
    if (!canSend) return;
    const sentBar = bar;
    const message: ComposerMessage = { text, albums, files: doneFiles };
    if (sentBar?.messageId !== undefined) {
      if (sentBar.mode === "edit") message.editOf = sentBar.messageId;
      else message.replyTo = sentBar.messageId;
    }
    const result = onSend?.(message);
    finishSend(result, () => {
      setValue("");
      setTyping(false);
      // The previews are revoked with the queue: `onSend` keeps what it needs (`file`, `result`).
      queue?.clear();
      setAsFiles(false);
      sentBar?.dismiss?.();
      textareaRef.current?.focus();
    });
  };

  // ── Activity: the «печатает…» signal ──
  const [typing, setTyping] = React.useState(false);
  const typingTimer = React.useRef<number | undefined>(undefined);
  /** A keystroke: typing holds until the field rests for `TYPING_IDLE_MS` or empties. */
  const noteTyping = (next: string) => {
    window.clearTimeout(typingTimer.current);
    if (next.trim() === "") {
      setTyping(false);
      return;
    }
    setTyping(true);
    typingTimer.current = window.setTimeout(() => setTyping(false), TYPING_IDLE_MS);
  };
  React.useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  // ── Recording ──
  const videoAvailable = Boolean(onSendVideoNote) && support.video;
  const voiceAvailable = Boolean(onSendVoice) && support.voice;
  const recordMode: ComposerRecordMode =
    recordModeState === "video" && videoAvailable ? "video" : voiceAvailable ? "voice" : "video";
  const canRecordNow = recordMode === "video" ? videoAvailable : voiceAvailable;
  const recorder = useRecorder((mode, recording) => {
    setAnnouncement(labels.recordingSent);
    const handler = mode === "video" ? onSendVideoNote : onSendVoice;
    finishSend(handler?.(recording), () => {});
  });
  /** A first press that may still turn double records out of sight (see `beginTap`). */
  const [concealed, setConcealed] = React.useState(false);
  const recording = recorder.status !== "idle" && !concealed;
  // Kept after a stop so the leaving row keeps its look while it fades out.
  const [locked, setLocked] = React.useState(false);
  const holding = recording && !locked;
  /** Voice and video both offered: a double click / double tap (or ↑ ↓) switches them. */
  const switches = videoAvailable && voiceAvailable;
  /** The microphone answered before: a new recording asks no permission. */
  const micGranted = React.useRef(false);
  const tap = React.useRef<{
    at: number;
    mode: ComposerRecordMode;
    lock: boolean;
    /** The device was asked for at the press (out of sight), not at the reveal. */
    started: boolean;
    timer: number;
  } | null>(null);
  const rootRef = React.useRef<HTMLFormElement | null>(null);
  const setRootRef = useMergedRefs(rootRef, ref);
  const actionRef = React.useRef<HTMLButtonElement | null>(null);
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const timerRef = React.useRef<HTMLSpanElement | null>(null);
  const waveRef = React.useRef<HTMLCanvasElement | null>(null);
  const previewRef = React.useRef<HTMLDivElement | null>(null);
  const press = React.useRef<{
    pointerId: number;
    x: number;
    y: number;
    at: number;
    /** `choose` — a tap or a hold is not decided yet (voice / video switch); `hold` — recording. */
    phase: "choose" | "hold";
    timer: number;
  } | null>(null);
  React.useEffect(() => {
    // Best effort: where the browser tells, a granted microphone records from the first press.
    const permissions = typeof navigator === "undefined" ? undefined : navigator.permissions;
    let alive = true;
    try {
      permissions
        ?.query({ name: "microphone" as PermissionName })
        .then((status) => {
          if (alive && status.state === "granted") micGranted.current = true;
        })
        .catch(() => {});
    } catch {
      // The browser does not know this permission name.
    }
    return () => {
      alive = false;
      if (tap.current) window.clearTimeout(tap.current.timer);
    };
  }, []);
  React.useEffect(() => {
    if (recorder.status === "recording") micGranted.current = true;
  }, [recorder.status]);
  /** The click that follows a handled pointer press (or a lock by sliding) does nothing. */
  const swallowClick = React.useRef(false);
  const showRecord =
    !recording && text === "" && uploads.length === 0 && !editing && canRecordNow && !pending;

  /** The slide of a held recording, written straight to the root (no render per move). */
  const setDrag = (dx: number, dy: number, cancelAt = 1) => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--composer-slide", `${dx}px`);
    root.style.setProperty("--composer-slide-progress", String(Math.min(1, dx / cancelAt)));
    root.style.setProperty("--composer-lift", `${dy}px`);
  };

  const endPress = () => {
    const current = press.current;
    if (current) window.clearTimeout(current.timer);
    press.current = null;
    setDrag(0, 0);
  };

  const startRecording = (
    mode: ComposerRecordMode,
    lock: boolean,
    pressedAt: number,
    announce = true,
  ) => {
    setDrag(0, 0);
    setLocked(lock);
    if (announce) setAnnouncement(labels.recordingStarted);
    recorder.start(mode, pressedAt);
  };

  /**
   * The first press while voice and video are both offered: it may still become a double one.
   * Starting a recording and throwing it away on the second press would flash the row: the swap
   * fades in on a steep ease-out over `base`, so a second click 100–200 ms later meets it mostly
   * opaque (and at once under reduced motion). So the press records at once but out of sight —
   * the button keeps its look, nothing is announced — and the row shows when `DOUBLE_MS` passes
   * (a hold shows it at `HOLD_MS`); the timer counts from the press, so the reveal looks continuous.
   * The device is asked for at the press only when that shows nothing either: a granted microphone
   * (no permission prompt) and voice (no camera light). Otherwise it is asked for at the reveal.
   */
  const beginTap = (at: number, lock: boolean) => {
    const mode = recordMode;
    const started = mode === "voice" && micGranted.current;
    if (started) {
      setConcealed(true);
      startRecording(mode, lock, at, false);
    }
    const timer = window.setTimeout(revealTap, DOUBLE_MS);
    tap.current = { at, mode, lock, started, timer };
  };

  /** No second press came (or the finger holds on): the recording shows. */
  const revealTap = () => {
    const current = tap.current;
    if (!current) return;
    window.clearTimeout(current.timer);
    tap.current = null;
    if (!current.started) {
      startRecording(current.mode, current.lock, current.at);
      return;
    }
    setConcealed(false);
    // A refused device has already rolled back and shows its error.
    if (recorder.meter()) setAnnouncement(labels.recordingStarted);
  };

  /** The first press turned out double (or was cancelled): its recording goes, unseen and unsaid. */
  const discardTap = () => {
    const current = tap.current;
    if (!current) return;
    window.clearTimeout(current.timer);
    tap.current = null;
    if (current.started) recorder.stop(false);
    setConcealed(false);
  };

  const lockRecording = () => {
    endPress();
    // The leaving lock pill stays at the threshold: it snaps closed where the finger left it.
    rootRef.current?.style.setProperty("--composer-lift", "var(--prime-space-12)");
    setLocked(true);
    setAnnouncement(labels.recordingLocked);
  };

  const stopRecording = (sendIt: boolean) => {
    endPress();
    if (!recorder.meter()) return;
    if (!sendIt) setAnnouncement(labels.recordingCanceled);
    // Focus on the leaving row (the delete button) comes back to the action button.
    if (barRef.current?.contains(document.activeElement)) actionRef.current?.focus();
    recorder.stop(sendIt);
  };

  /** Pauses or resumes a hands-free recording (Space, the pause button). */
  const togglePause = () => {
    if (!recording || !locked) return;
    const next = !recorder.paused;
    if (recorder.setPaused(next)) {
      setAnnouncement(next ? labels.recordingPaused : labels.recordingResumed);
    }
  };

  const switchMode = () => {
    const next = recordMode === "voice" ? "video" : "voice";
    setRecordMode(next);
    setAnnouncement(next === "voice" ? labels.recordModeVoice : labels.recordModeVideo);
  };

  const actionProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    onPointerDown: (event) => {
      if (event.button !== 0 || !showRecord || disabled || press.current) return;
      // Captured, the finger keeps reporting moves after it leaves the button (slide to lock).
      event.currentTarget.setPointerCapture?.(event.pointerId);
      swallowClick.current = true;
      const at = performance.now();
      const base = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, at };
      if (switches) {
        if (tap.current) {
          // The second press of a double click / double tap.
          discardTap();
          switchMode();
          return;
        }
        // A click records hands-free; a finger may still hold (it records while held).
        if (event.pointerType === "mouse") {
          beginTap(at, true);
          return;
        }
        beginTap(at, false);
        const timer = window.setTimeout(() => {
          if (press.current?.phase !== "choose") return;
          press.current.phase = "hold";
          revealTap();
        }, HOLD_MS);
        press.current = { ...base, phase: "choose", timer };
        return;
      }
      // A mouse click records hands-free at once; a finger records while it is held.
      if (event.pointerType === "mouse") {
        startRecording(recordMode, true, at);
        return;
      }
      press.current = { ...base, phase: "hold", timer: 0 };
      startRecording(recordMode, false, at);
    },
    onPointerMove: (event) => {
      const current = press.current;
      if (current?.phase !== "hold" || current.pointerId !== event.pointerId) return;
      const dx = Math.max(0, current.x - event.clientX);
      const dy = Math.max(0, current.y - event.clientY);
      if (dy >= readCssLengthPx("--prime-space-12", 48)) {
        lockRecording();
        return;
      }
      const cancelAt = readCssLengthPx("--prime-space-24", 96);
      if (dx >= cancelAt) {
        stopRecording(false);
        return;
      }
      setDrag(dx, dy, cancelAt);
    },
    onPointerUp: (event) => {
      const current = press.current;
      window.setTimeout(() => {
        swallowClick.current = false;
      }, 0);
      if (!current || current.pointerId !== event.pointerId) return;
      if (current.phase === "choose") {
        // A short press is a tap: hands-free, shown once no second tap comes.
        endPress();
        if (tap.current) tap.current.lock = true;
        setLocked(true);
        return;
      }
      // A short press of a finger is a tap: the recording goes on hands-free.
      if (!switches && performance.now() - current.at < HOLD_MS) lockRecording();
      else stopRecording(true);
    },
    onPointerCancel: (event) => {
      const current = press.current;
      window.setTimeout(() => {
        swallowClick.current = false;
      }, 0);
      if (!current || current.pointerId !== event.pointerId) return;
      if (current.phase === "hold") stopRecording(false);
      else {
        endPress();
        discardTap();
      }
    },
    // A long press on touch opens no context menu over the record button.
    onContextMenu: (event) => {
      if (showRecord || recording) event.preventDefault();
    },
    onKeyDown: (event) => {
      if (!showRecord || disabled) return;
      if (switches && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        discardTap();
        switchMode();
        return;
      }
      if ((event.key !== "Enter" && event.key !== " ") || event.repeat) return;
      // Handled on the key: no click follows, the row switches before the key is released.
      event.preventDefault();
      discardTap();
      startRecording(recordMode, true, performance.now());
    },
    onKeyUp: (event) => {
      // Space clicks on release: the key that started a recording must not send it.
      if (event.key === " " && recording) event.preventDefault();
    },
    onClick: (event) => {
      if (swallowClick.current) {
        swallowClick.current = false;
        // The platform counted a double click our pointer timing missed (one press reported).
        if (event.detail >= 2 && tap.current) {
          discardTap();
          switchMode();
        }
        return;
      }
      if (recording) {
        if (locked) stopRecording(true);
        return;
      }
      if (showRecord) {
        // A click with no pointer press before it (assistive tech) records at once.
        startRecording(recordMode, true, performance.now());
        return;
      }
      send();
    },
  };

  // ── Live meter: the timer, the waveform and the video ring follow the frame, not React ──
  React.useLayoutEffect(() => {
    if (!recording) return;
    const reduce = prefersReducedMotion();
    let frame = 0;
    let shown = "";
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let wave: LiveWaveStyle | null = null;
    let rtl = false;
    let styledAt = Number.NEGATIVE_INFINITY;
    // The canvas box follows a ResizeObserver: a frame reads no layout.
    const size: LiveWaveSize = { width: 0, height: 0 };
    const sizer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(([entry]) => {
            const box = entry?.contentBoxSize?.[0];
            size.width = box ? box.inlineSize : (entry?.contentRect.width ?? 0);
            size.height = box ? box.blockSize : (entry?.contentRect.height ?? 0);
          });
    const tick = () => {
      const meter = recorder.meter();
      if (!meter) return;
      const now = performance.now();
      // Reads first, while the frame's style is clean: the canvas, its first size and, now and
      // then, its colors (a theme switch mid-recording repaints the bars). Writes follow.
      const node = waveRef.current;
      if (node !== canvas) {
        if (canvas) sizer?.unobserve(canvas);
        canvas = node;
        ctx = null;
        styledAt = Number.NEGATIVE_INFINITY;
        try {
          ctx = canvas?.getContext("2d") ?? null;
        } catch {
          ctx = null;
        }
        if (canvas) {
          size.width = canvas.clientWidth;
          size.height = canvas.clientHeight;
          sizer?.observe(canvas);
        }
      }
      if (canvas && ctx && now - styledAt > 500) {
        const computed = getComputedStyle(canvas);
        const unit = readCssLengthPx("--prime-space-1", 4);
        wave = {
          bar: unit * 0.75,
          gap: unit / 2,
          color: computed.color,
          idleColor: computed.borderTopColor,
        };
        rtl = computed.direction === "rtl";
        styledAt = now;
      }
      const elapsed = recordedMs(meter, now);
      const label = formatElapsed(elapsed);
      if (label !== shown && timerRef.current) {
        timerRef.current.textContent = label;
        shown = label;
      }
      previewRef.current?.style.setProperty(
        "--ring-value",
        String(Math.min(1, elapsed / VIDEO_MAX_MS)),
      );
      if (canvas && ctx && wave) {
        drawLiveWave(canvas, ctx, size, wave, {
          samples: meter.samples,
          phase: reduce || meter.pausedAt !== null ? 1 : (now - meter.sampledAt) / SAMPLE_MS,
          rtl,
        });
      }
      frame = window.requestAnimationFrame(tick);
    };
    tick();
    return () => {
      window.cancelAnimationFrame(frame);
      sizer?.disconnect();
    };
  }, [recording, recorder.meter]);

  const activity: ComposerActivity | null = recording
    ? recorder.mode
    : typing && !pending
      ? "typing"
      : null;
  const onActivityChangeRef = React.useRef(onActivityChange);
  onActivityChangeRef.current = onActivityChange;
  const reportedActivity = React.useRef<ComposerActivity | null>(null);
  React.useEffect(() => {
    if (activity === reportedActivity.current) return;
    reportedActivity.current = activity;
    onActivityChangeRef.current?.(activity);
  }, [activity]);
  React.useEffect(
    () => () => {
      if (reportedActivity.current !== null) onActivityChangeRef.current?.(null);
    },
    [],
  );

  // The recording bar rises in over the field and closes up in place when the recording ends.
  const recordBar = usePartPresence<HTMLDivElement>({ present: recording, axis: "inline" });
  const setBarRef = useMergedRefs(barRef, recordBar.ref);
  const lockPill = usePresence(holding, { exitDuration: "fast" });
  const preview = usePresence(recording && recorder.mode === "video", { exitDuration: "fast" });

  // ── Formatting ──
  const format = useTextFormatting({
    textareaRef,
    enabled: formatting,
    toolbar: !disabled && !recording,
    labels,
    size,
    controlsId: fieldId,
  });

  // ── Drop ──
  const [dropping, setDropping] = React.useState(false);
  const dragDepth = React.useRef(0);
  const carriesFiles = (event: React.DragEvent) =>
    Boolean(queue) && !disabled && Array.from(event.dataTransfer?.types ?? []).includes("Files");

  // ── Field keys ──
  const onFieldKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || format.onKeyDown(event)) return;
    const mod = event.metaKey || event.ctrlKey;
    if (event.key === "Enter") {
      if (mod || (!event.shiftKey && !event.altKey && !touch)) {
        event.preventDefault();
        send();
      }
      return;
    }
    if (event.key === "Escape") {
      if (bar?.dismiss) {
        event.preventDefault();
        bar.dismiss();
      }
      return;
    }
    if (
      event.key === "ArrowUp" &&
      value === "" &&
      onEditLast &&
      !mod &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      onEditLast();
    }
  };

  // ── Children: rendered above the row; `Composer.Attach` places itself in the row's start cell
  // (a portal), so neither the order of the children, a wrapper around the paperclip, nor a
  // hot-reloaded component type can move it out of the row ──
  const [attachSlot, setAttachSlot] = React.useState<HTMLDivElement | null>(null);
  const [keyboardSlot, setKeyboardSlot] = React.useState<HTMLDivElement | null>(null);
  const [keyboardToggleSlot, setKeyboardToggleSlot] = React.useState<HTMLDivElement | null>(null);
  const [keyboardPlaceholder, setKeyboardPlaceholder] = React.useState<string | null>(null);
  const sendRef = React.useRef(onSend);
  sendRef.current = onSend;
  const sendText = React.useCallback(
    (keyText: string) => sendRef.current?.({ text: keyText, albums: [], files: [] }),
    [],
  );

  const contextValue = React.useMemo(
    () => ({
      size,
      labels,
      disabled,
      addFiles,
      registerBar,
      focusFieldIfLive,
      attachSlot,
      keyboardSlot,
      keyboardToggleSlot,
      setKeyboardPlaceholder,
      sendText,
      recording,
    }),
    [
      size,
      labels,
      disabled,
      addFiles,
      registerBar,
      focusFieldIfLive,
      attachSlot,
      keyboardSlot,
      keyboardToggleSlot,
      sendText,
      recording,
    ],
  );

  const actionKind = recording ? "send" : editing ? "save" : showRecord ? recordMode : "send";
  const pauseIcon: IconName = recorder.paused ? "action.play" : "action.pause";
  const actionLabel =
    actionKind === "save"
      ? labels.save
      : actionKind === "voice"
        ? labels.recordVoice
        : actionKind === "video"
          ? labels.recordVideo
          : recording
            ? labels.sendRecording
            : labels.send;
  const actionIcon: Record<typeof actionKind, IconName> = {
    send: "action.send",
    save: "action.check",
    voice: "action.voice",
    video: "action.video",
  };
  const recordState = recording ? (locked ? "locked" : "hold") : undefined;
  const hintId = `${fieldId}-record-hint`;
  const errorId = `${fieldId}-error`;
  const contextIds = bars.map((item) => item.id).join(" ") || undefined;

  return (
    <ComposerProvider value={contextValue}>
      {tier.provide(
        <form
          aria-label={labels.region}
          {...rest}
          ref={setRootRef}
          className={cx(fieldTierClass, styles.root, className)}
          {...toDataAttributes({
            size,
            disabled: disabled || undefined,
            recording: recordState,
            dropping: dropping || undefined,
          })}
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!recording || event.defaultPrevented) return;
            if (event.key === "Escape") {
              // Throws the recording away and stops here: an enclosing overlay stays open.
              event.preventDefault();
              event.stopPropagation();
              stopRecording(false);
              return;
            }
            // A held recording is the finger's: the keys wait until it is hands-free.
            if (!locked || event.repeat) return;
            // The recording row's own buttons (delete, pause) keep their keys.
            const target = event.target as Element;
            const ownButton = target !== actionRef.current && target.closest?.("button") !== null;
            if (ownButton && (event.key === "Enter" || event.key === " ")) return;
            if (event.key === "Enter") {
              event.preventDefault();
              stopRecording(true);
            } else if (event.key === " ") {
              event.preventDefault();
              togglePause();
            }
          }}
          onKeyUp={(event) => {
            // Space activates a button on release: the key that paused must not press it too.
            if (event.key === " " && recording && locked && event.target === actionRef.current) {
              event.preventDefault();
            }
          }}
          onDragEnter={(event) => {
            onDragEnter?.(event);
            if (!carriesFiles(event)) return;
            event.preventDefault();
            dragDepth.current += 1;
            setDropping(true);
          }}
          onDragOver={(event) => {
            onDragOver?.(event);
            if (carriesFiles(event)) event.preventDefault();
          }}
          onDragLeave={(event) => {
            onDragLeave?.(event);
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setDropping(false);
          }}
          onDrop={(event) => {
            onDrop?.(event);
            if (!carriesFiles(event)) return;
            event.preventDefault();
            dragDepth.current = 0;
            setDropping(false);
            addFiles(Array.from(event.dataTransfer.files));
          }}
        >
          {preview.mounted ? (
            <VideoPreview
              ref={previewRef}
              stream={recorder.stream}
              state={preview.state}
              onExitEnd={preview.onExitEnd}
            />
          ) : null}
          <div className={styles.top}>
            {/* The tray: one strip of tiles — photos, videos and files in the order attached and
                reordered (drag, Alt + arrows). One row that scrolls sideways, so the composer
                never pushes the thread away. It opens and closes with a cross-fade and a height
                glide; the row below never changes. */}
            <Crossfade state={uploads.length > 0 ? "tray" : "empty"} className={styles.tray}>
              {queue && uploads.length > 0 ? (
                <div className={styles.trayBody} inert={disabled || pending}>
                  <FileUpload.Queue
                    layout="strip"
                    queue={queue}
                    aria-label={labels.attachments}
                    data-composer-tray=""
                  />
                  {hasMediaFiles ? (
                    <Checkbox.Root
                      size={stepDown(size)}
                      checked={asFiles}
                      onCheckedChange={setAsFiles}
                      disabled={disabled || pending}
                      className={styles.asFiles}
                    >
                      <Checkbox.Label>{labels.sendAsFiles}</Checkbox.Label>
                    </Checkbox.Root>
                  ) : null}
                </div>
              ) : null}
            </Crossfade>
            {children}
            {recorder.error ? (
              <Hint.Root
                id={errorId}
                size={size}
                invalid
                role="alert"
                className={cx(styles.error, enterMotion.enter)}
              >
                {labels[ERROR_LABEL[recorder.error]]}
              </Hint.Root>
            ) : null}
          </div>
          {/* One row, always: paperclip · field · send / record (a grid of three cells). While
              recording the recording bar covers the first two cells. */}
          <div className={styles.row} data-composer-row="">
            <div ref={setAttachSlot} className={styles.start} inert={recording} />
            {/* The field is the kit Textarea; this box anchors the toolbar. */}
            <div inert={recording} className={styles.field} {...format.anchorProps}>
              <Textarea.Root
                ref={setTextareaRef}
                id={fieldId}
                rows={1}
                maxRows={MAX_ROWS}
                // The caret is the focus indicator of the one field of the composer (foundation §7).
                focusRing={false}
                value={value}
                placeholder={keyboardPlaceholder ?? labels.placeholder}
                aria-label={labels.placeholder}
                aria-describedby={
                  [contextIds, recorder.error ? errorId : undefined].filter(Boolean).join(" ") ||
                  undefined
                }
                disabled={disabled}
                readOnly={pending}
                enterKeyHint={touch ? "enter" : "send"}
                onValueChange={(next) => {
                  setValue(next);
                  noteTyping(next);
                  if (recorder.error) recorder.clearError();
                }}
                onSelect={format.onSelect}
                onKeyDown={onFieldKeyDown}
                onPaste={(event) => {
                  const files = pastedFiles(event.clipboardData);
                  if (files.length === 0 || !queue) return;
                  event.preventDefault();
                  addFiles(files);
                }}
              />
              {format.toolbar}
            </div>
            {recording ? (
              <div
                ref={setBarRef}
                className={cx(styles.recording, recordBar.className)}
                data-locked={locked || undefined}
                data-paused={recorder.paused || undefined}
              >
                {locked ? (
                  <Button.Root
                    variant="ghost"
                    tone="danger"
                    aria-label={labels.cancelRecording}
                    className={cx(styles.cancel, enterMotion.enter)}
                    onClick={() => stopRecording(false)}
                  >
                    <Button.Icon>
                      <Icon name="action.delete" />
                    </Button.Icon>
                  </Button.Root>
                ) : null}
                {locked ? (
                  <Button.Root
                    variant="ghost"
                    tone="neutral"
                    aria-label={recorder.paused ? labels.resumeRecording : labels.pauseRecording}
                    aria-keyshortcuts="Space"
                    className={cx(styles.cancel, enterMotion.enter)}
                    onClick={togglePause}
                    disabled={recorder.status !== "recording"}
                  >
                    <Button.Icon>
                      <Icon name={pauseIcon} />
                    </Button.Icon>
                  </Button.Root>
                ) : null}
                {/* The breathing dot in the pause glyph's box; paused, the glyph in its place. */}
                <GlyphSwap className={styles.status}>
                  {recorder.paused ? (
                    <Icon name="action.pause" size={stepDown(size)} animated={false} />
                  ) : (
                    <span
                      key="dot"
                      className={cx(iconBoxClass(stepDown(size), undefined), styles.dotBox)}
                      aria-hidden="true"
                    >
                      <span className={cx(styles.dot, statusLoop.breathe)} />
                    </span>
                  )}
                </GlyphSwap>
                <span ref={timerRef} className={styles.timer} aria-hidden="true" />
                {locked ? (
                  // A canvas without fallback content is not exposed: the timer and the live
                  // region speak for the recording.
                  <canvas ref={waveRef} className={cx(styles.wave, enterMotion.enter)} />
                ) : (
                  <span className={styles.slide} aria-hidden="true">
                    <Icon name="nav.chevronLeft" />
                    {labels.slideToCancel}
                  </span>
                )}
              </div>
            ) : null}
            <div className={styles.end}>
              <div
                ref={setKeyboardToggleSlot}
                className={styles.keyboardToggle}
                inert={recording}
              />
              {lockPill.mounted ? (
                <span
                  className={cx(
                    styles.lock,
                    lockPill.state === "open" ? enterMotion.enter : enterMotion.exit,
                  )}
                  data-state={lockPill.state}
                  data-depth="floating"
                  aria-hidden="true"
                  onAnimationEnd={lockPill.onExitEnd}
                >
                  <Icon name="status.locked" size={stepDown(size)} />
                  <span className={styles.lockArrow}>
                    <Icon name="nav.chevronUp" size={stepDown(size)} />
                  </span>
                </span>
              ) : null}
              <Button.Root
                {...actionProps}
                ref={actionRef}
                type="button"
                variant={actionKind === "voice" || actionKind === "video" ? "ghost" : "solid"}
                tone={actionKind === "voice" || actionKind === "video" ? "neutral" : "accent"}
                className={styles.action}
                aria-label={actionLabel}
                aria-describedby={showRecord ? hintId : undefined}
                aria-keyshortcuts={showRecord && switches ? "ArrowUp ArrowDown" : undefined}
                loading={pending}
                disabled={disabled || (!recording && !showRecord && !canSend && !pending)}
                data-action={actionKind}
              >
                <Button.Icon>
                  <Icon name={actionIcon[actionKind]} />
                </Button.Icon>
              </Button.Root>
              <VisuallyHidden id={hintId}>
                {videoAvailable && voiceAvailable ? labels.recordSwitchHint : labels.recordHint}
              </VisuallyHidden>
            </div>
          </div>
          {/* `Composer.Keyboard` folds open here, under the row, in place of a phone's keyboard. */}
          <div ref={setKeyboardSlot} className={styles.keyboardSlot} />
          <VisuallyHidden live="polite">{announcement}</VisuallyHidden>
        </form>,
      )}
    </ComposerProvider>
  );
}
ComposerRoot.displayName = "Composer.Root";

// ─── Video preview ───────────────────────────────────────────────────────────

/**
 * The round camera preview above the composer while a video message records: the geometry of
 * `VideoNote`, a Skeleton circle until the camera answers, the progress ring toward
 * `VIDEO_MAX_MS` (the kit ring, `live`: its `--ring-value` is written every frame by the root).
 */
function VideoPreview({
  stream,
  state,
  onExitEnd,
  ref,
}: {
  stream: MediaStream | null;
  state: "open" | "closed";
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
  ref: React.Ref<HTMLDivElement>;
}) {
  const [ready, setReady] = React.useState(false);
  const videoRef = React.useCallback(
    (node: HTMLVideoElement | null) => {
      if (node && stream && node.srcObject !== stream) node.srcObject = stream;
    },
    [stream],
  );
  return (
    <div
      ref={ref}
      className={cx(styles.preview, state === "open" ? enterMotion.enterBase : enterMotion.exit)}
      data-state={state}
      data-ready={(ready && stream !== null) || undefined}
      aria-hidden="true"
      onAnimationEnd={onExitEnd}
    >
      <Skeleton shape="block" className={styles.previewSkeleton} />
      {stream ? (
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          playsInline
          onLoadedData={() => setReady(true)}
        />
      ) : null}
      <Ring value={0} live weight="band" track="none" className={styles.previewRing} />
    </div>
  );
}

// ─── Context (reply / edit bar) ──────────────────────────────────────────────

export type ComposerContextProps = React.HTMLAttributes<HTMLDivElement> & {
  mode?: ComposerContextMode;
  messageId?: string;
  onDismiss?: () => void;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

const CONTEXT_ICON: Record<ComposerContextMode, IconName> = {
  reply: "action.reply",
  edit: "action.edit",
};

/** The bar above the field: «Ответ Анне» with the quoted text, or «Редактирование». */
function ComposerContext({
  mode = "reply",
  messageId,
  onDismiss,
  id: idProp,
  className,
  children,
  ref,
  ...rest
}: ComposerContextProps) {
  const { size, labels, registerBar, focusFieldIfLive } = useComposerContext();
  // A bar a reply brings enters; one the composer mounts with (a saved draft) is just there.
  const appear = useEnterOnAppear<HTMLDivElement>();
  const mergedRef = useMergedRefs(appear.ref, ref);
  const ownId = React.useId();
  const id = idProp ?? ownId;
  const dismissRef = React.useRef(onDismiss);
  dismissRef.current = onDismiss;
  const dismissable = onDismiss !== undefined;

  React.useEffect(
    () =>
      registerBar({
        id,
        mode,
        messageId,
        dismiss: dismissable ? () => dismissRef.current?.() : undefined,
      }),
    [registerBar, id, mode, messageId, dismissable],
  );
  // A bar that appears (a reply picked in the chat), or turns from a reply into an edit, brings
  // the caret to the field.
  const focusedMode = React.useRef<ComposerContextMode | null>(null);
  React.useEffect(() => {
    if (focusedMode.current === mode) return;
    focusedMode.current = mode;
    focusFieldIfLive();
  });

  return (
    <div
      {...rest}
      ref={mergedRef}
      id={id}
      className={cx(styles.context, appear.entering && enterMotion.enter, className)}
      data-mode={mode}
    >
      <span className={styles.contextIcon} aria-hidden="true">
        <GlyphSwap>
          <Icon name={CONTEXT_ICON[mode]} />
        </GlyphSwap>
      </span>
      <div className={styles.contextText}>{children}</div>
      {dismissable ? (
        <Button.Root
          variant="ghost"
          tone="neutral"
          size={stepDown(size)}
          aria-label={mode === "edit" ? labels.cancelEdit : labels.cancelReply}
          onClick={() => {
            onDismiss?.();
            focusFieldIfLive();
          }}
        >
          <Button.Icon>
            <Icon name="action.close" />
          </Button.Icon>
        </Button.Root>
      ) : null}
    </div>
  );
}
ComposerContext.displayName = "Composer.Context";

export type ComposerTitleProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The first line of the bar: who is answered («Ответ Анне»), or «Редактирование». */
function ComposerTitle({ className, ...rest }: ComposerTitleProps) {
  return <div {...rest} className={cx(styles.title, className)} />;
}
ComposerTitle.displayName = "Composer.Title";

export type ComposerDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The second line: the quoted message, one line. */
function ComposerDescription({ className, ...rest }: ComposerDescriptionProps) {
  return <div {...rest} className={cx(styles.description, className)} />;
}
ComposerDescription.displayName = "Composer.Description";

// ─── Attach ──────────────────────────────────────────────────────────────────

const AttachPickContext = React.createContext<((accept: string) => void) | null>(null);

export type ComposerAttachProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  accept?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The paperclip at the start of the row. Alone it opens the file picker (FileUpload
 * `trigger="button"`); with `Composer.Item` kinds it opens a menu, each item a picker of its types.
 * Picked files go to the root's `queue`.
 */
function ComposerAttach({
  accept,
  children,
  className,
  "aria-label": ariaLabel,
  ...rest
}: ComposerAttachProps) {
  const { size, labels, disabled, addFiles, attachSlot } = useComposerContext();
  const picker = React.useRef<FileUploadPicker>(null);
  const name = ariaLabel ?? labels.attach;
  const icon = (
    <Button.Icon>
      <Icon name="action.attach" />
    </Button.Icon>
  );
  const pick = React.useCallback((types: string) => picker.current?.open({ accept: types }), []);

  // Rendered into the row's start cell, wherever it stands among the root's children; nothing
  // until the cell exists (the first commit), so the server render and hydration agree.
  if (!attachSlot) return null;

  if (React.Children.count(children) === 0) {
    return createPortal(
      <div {...rest} className={cx(styles.attach, className)}>
        <FileUpload.Root
          trigger="button"
          size={size}
          multiple
          accept={accept}
          disabled={disabled}
          aria-label={name}
          onFilesChange={addFiles}
        >
          {icon}
        </FileUpload.Root>
      </div>,
      attachSlot,
    );
  }

  return createPortal(
    <div {...rest} className={cx(styles.attach, className)}>
      {/* One picker serves every item: each opens it with its own `accept`. */}
      <FileUpload.Root
        trigger="none"
        picker={picker}
        multiple
        disabled={disabled}
        onFilesChange={addFiles}
      />
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="ghost" tone="neutral" aria-label={name} disabled={disabled}>
            {icon}
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content side="top" size={size}>
          <AttachPickContext.Provider value={pick}>{children}</AttachPickContext.Provider>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>,
    attachSlot,
  );
}
ComposerAttach.displayName = "Composer.Attach";

export type ComposerItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect" | "type"
> & {
  accept?: string;
  onSelect?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

/** A kind of attachment in the paperclip menu: `Composer.ItemIcon` and the label. */
function ComposerItem({ accept, onSelect, ...rest }: ComposerItemProps) {
  const pick = React.useContext(AttachPickContext);
  return (
    <Dropdown.Item
      {...rest}
      onSelect={() => {
        if (accept !== undefined) pick?.(accept);
        onSelect?.();
      }}
    />
  );
}
ComposerItem.displayName = "Composer.Item";

export type ComposerItemIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The leading glyph of a menu item. */
function ComposerItemIcon(props: ComposerItemIconProps) {
  return <Dropdown.ItemIcon {...props} />;
}
ComposerItemIcon.displayName = "Composer.ItemIcon";

// ─── Reply keyboard ──────────────────────────────────────────────────────────

/**
 * A key of the reply keyboard: its text (sent as the message), or the text with an `icon` before
 * it and a `tone` (Telegram's `primary` is `accent`).
 */
export type ComposerKey =
  | string
  | { label: string; icon?: React.ReactNode; tone?: "accent" | "success" | "danger" };

export type ComposerKeyboardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  rows: readonly (readonly ComposerKey[])[];
  placeholder?: string;
  oneTime?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  ref?: React.Ref<HTMLDivElement>;
};

const keyLabel = (key: ComposerKey) => (typeof key === "string" ? key : key.label);

/**
 * A bot's reply keyboard: rows of keys under the composer's row, in place of a phone's keyboard;
 * a key sends its text through `onSend`. The toggle before the send button shows and hides it;
 * `oneTime` hides it after a key is used.
 */
function ComposerKeyboard({
  rows,
  placeholder,
  oneTime = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  id: idProp,
  className,
  "aria-label": ariaLabel,
  ref,
  ...rest
}: ComposerKeyboardProps) {
  const {
    labels,
    disabled,
    keyboardSlot,
    keyboardToggleSlot,
    setKeyboardPlaceholder,
    sendText,
    focusFieldIfLive,
    recording,
  } = useComposerContext();
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { pending, track } = usePendingKeys<string>();
  const autoId = React.useId();
  const id = idProp ?? autoId;

  // The field asks for a key while the keyboard is shown.
  React.useEffect(() => {
    if (!open || placeholder === undefined) return;
    setKeyboardPlaceholder(placeholder);
    return () => setKeyboardPlaceholder(null);
  }, [open, placeholder, setKeyboardPlaceholder]);

  const press = (key: ComposerKey, position: string) => {
    const outcome = track(position, sendText(keyLabel(key)));
    if (!oneTime) return;
    const hide = () => {
      setOpen(false);
      // The keys leave: the field takes the focus, as the letters come back on a phone.
      focusFieldIfLive();
    };
    if (isPromiseLike(outcome)) outcome.then(hide, () => {});
    else hide();
  };

  if (!keyboardSlot || !keyboardToggleSlot) return null;
  // The grid of keys while they are hidden, the chevron that hides them while shown; `Button.Icon`
  // cross-fades one into the other.
  const toggleIcon: IconName = open ? "nav.chevronDown" : "nav.layoutGrid";

  return (
    <>
      {createPortal(
        <Button.Root
          variant="ghost"
          tone="neutral"
          aria-label={ariaLabel ?? labels.keyboard}
          aria-expanded={open}
          aria-controls={id}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          <Button.Icon>
            <Icon name={toggleIcon} />
          </Button.Icon>
        </Button.Root>,
        keyboardToggleSlot,
      )}
      {createPortal(
        <Disclosure
          {...rest}
          ref={ref}
          id={id}
          role="group"
          aria-label={ariaLabel ?? labels.keyboard}
          open={open}
          inert={recording || undefined}
          className={className}
        >
          <div className={styles.keyboardKeys}>
            {rows.map((row, rowIndex) => (
              <div
                // Rows are positions: a bot sends the whole keyboard again to change it.
                // biome-ignore lint/suspicious/noArrayIndexKey: rows have no identity of their own.
                key={rowIndex}
                className={styles.keyboardRow}
              >
                {row.map((key, keyIndex) => {
                  const position = `${rowIndex}:${keyIndex}`;
                  const custom = typeof key === "string" ? undefined : key;
                  return (
                    <Button.Root
                      key={position}
                      variant="soft"
                      tone={custom?.tone ?? "neutral"}
                      fullWidth
                      disabled={disabled}
                      loading={pending.has(position)}
                      onClick={() => press(key, position)}
                    >
                      {custom?.icon ? <Button.Icon>{custom.icon}</Button.Icon> : null}
                      {keyLabel(key)}
                    </Button.Root>
                  );
                })}
              </div>
            ))}
          </div>
        </Disclosure>,
        keyboardSlot,
      )}
    </>
  );
}
ComposerKeyboard.displayName = "Composer.Keyboard";

export const Composer = {
  Root: ComposerRoot,
  Context: ComposerContext,
  Title: ComposerTitle,
  Description: ComposerDescription,
  Attach: ComposerAttach,
  Item: ComposerItem,
  ItemIcon: ComposerItemIcon,
  Keyboard: ComposerKeyboard,
};
