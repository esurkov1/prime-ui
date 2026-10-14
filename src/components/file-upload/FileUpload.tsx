import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dnd, useDragAnnouncer } from "@/components/dnd/Dnd";
import { Hint } from "@/components/hint/Hint";
import { LinkButton } from "@/components/link-button/LinkButton";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { VisuallyHidden, visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import type { UploadItem, UploadQueue } from "@/hooks/useUploadQueue";
import { Icon } from "@/icons";
import {
  AttachmentStripScroller,
  AttachmentTile,
  type AttachmentTileKind,
  attachmentTileStyles as tileStyles,
} from "@/internal/attachmentTile";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import enterMotion from "@/internal/enterMotion.module.css";
import {
  type FieldFocusRingProps,
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { extensionOf, formatColor } from "@/internal/fileFormat";
import { splitFileName } from "@/internal/fileName";
import { formatFileSize } from "@/internal/fileSize";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { leaveInPlace } from "@/internal/leaveInPlace";
import { MorphText } from "@/internal/MorphText";
import { mediaKind } from "@/internal/mediaKind";
import { RollingNumber } from "@/internal/RollingNumber";
import type { ControlSize, PaletteColor, TextTone, Tone } from "@/internal/states";
import { isPromiseLike, usePendingChanges } from "@/internal/usePendingChanges";

import styles from "./FileUpload.module.css";

/** The look of the drop zone: `dashed` — the drop affordance line; `solid` — its fill only. */
export type FileUploadVariant = "dashed" | "solid";

/**
 * How files are added: `dropzone` — the drop area; `button` — a compact picker button (a paperclip)
 * with no zone and no drop; `tile` — an add tile at the end of the files, the whole set a drop target.
 */
export type FileUploadTrigger = "dropzone" | "button" | "tile";

/**
 * `list` — rows: badge or preview, name, size and status, a progress bar across the row. `grid` —
 * square tiles that follow the set's width (5 · 4 · 3 · 2 across); `strip` — one row of tiles that
 * scrolls sideways. Tiles show a picture, a video's first frame or the format badge.
 */
export type FileUploadLayout = "list" | "grid" | "strip";

/** One file of the set (application data, drawn in array order): on the server or on its way. */
export type FileUploadFile = {
  /** Stable unique id: survives a reorder. An upload of the `queue` shares its item's id. */
  id: string;
  /** File name with its extension: the format badge and the accessible name come from it. */
  name: string;
  /** Size in bytes, shown under the name; omitted — no size. */
  size?: number;
  /** MIME type; without it the kind is read from the name's extension. */
  type?: string;
  /** A picture or a video (a URL, or a local object URL); without it the file shows its format. */
  src?: string;
  /** What the picture shows: spoken in place of the name, never drawn. */
  alt?: string;
  /**
   * The file's address on the server: the row's name or the whole tile becomes a link that opens it
   * in a new tab (the server's `Content-Disposition` decides open or download).
   */
  href?: string;
};

export type FileUploadLabels = {
  /** Title of the built-in drop zone body. */
  title: string;
  /** Description under the title (formats, size limit). An empty string hides it. */
  description: string;
  /** Text of the browse button: decorative in a zone, the control itself with `trigger="button"`. */
  browse: string;
  /** Muted marker after the field label when `optional`. */
  optional: string;
  /** Text of the add tile (`trigger="tile"`). */
  add: string;
  /** Accessible name of the add tile's file input. */
  addLabel: string;
  /** The add tile of an empty set: it spans the row. */
  empty: string;
  /** Second line of the empty add tile without `max`. */
  emptyHint: string;
  /** Text of the add tile when `max` is reached. */
  full: string;
  /** Counter on the add tile: `{count}`, `{max}`. */
  count: string;
  /** Pill of the first tile with `cover`. */
  cover: string;
  /** A file waiting for a free slot. */
  queued: string;
  /** A file in flight: `{percent}`. */
  uploading: string;
  /** A failed file whose upload gave no reason. */
  failed: string;
  /** Name of the progress bar of a row: `{name}`. */
  progress: string;
  /** Name of a `FileUpload.ItemProgress` that has no `aria-label` of its own. */
  upload: string;
  /** Name of the disk that cancels a tile's upload in flight: `{name}`. */
  cancel: string;
  /** Name of the retry button of a failed file: `{name}`. */
  retry: string;
  /** Name of the remove button of a file: `{name}`. */
  remove: string;
  /** Name of a tile's link to the file (`href`): `{name}`. */
  open: string;
  /** Live region: a file was removed: `{name}`. */
  removed: string;
  /** Live region: a reorder put another file first, the new cover: `{name}`. */
  coverChanged: string;
  /** Live region: the `onValueChange` promise of a change rejected, the files are as they were. */
  changeFailed: string;
  /** Live region: a file finished uploading: `{name}`. */
  uploaded: string;
  /** Live region: a file failed to upload: `{name}`, `{reason}`. */
  uploadFailed: string;
  /** Name of an image tile: `{position}`, `{name}`, `{status}` (` · ` and the upload state). */
  tileImage: string;
  /** Name of a video tile: `{position}`, `{name}`, `{status}`. */
  tileVideo: string;
  /** Name of any other file's tile: `{position}`, `{name}`, `{status}`. */
  tileFile: string;
};

export const FILE_UPLOAD_LABELS: FileUploadLabels = {
  title: "Выберите файл или перетащите его сюда",
  description: "JPEG, PNG, PDF, MP4 до 50 МБ",
  browse: "Выбрать файл",
  optional: "необязательно",
  add: "Добавить",
  addLabel: "Добавить файлы",
  empty: "Нажмите или перетащите файлы",
  emptyHint: "Можно несколько сразу",
  full: "Лимит файлов",
  count: "{count} из {max}",
  cover: "Обложка",
  queued: "В очереди",
  uploading: "Загрузка {percent}%",
  failed: "Не удалось загрузить",
  progress: "Загрузка: {name}",
  upload: "Загрузка файла",
  cancel: "Отменить загрузку: {name}",
  retry: "Повторить загрузку: {name}",
  remove: "Убрать {name}",
  open: "Открыть {name}",
  removed: "{name}: убран",
  coverChanged: "Обложка: {name}",
  changeFailed: "Не удалось сохранить изменение, файлы на прежних местах",
  uploaded: "{name}: загружен",
  uploadFailed: "{name}: {reason}",
  tileImage: "Фото {position}: {name}{status}",
  tileVideo: "Видео {position}: {name}{status}",
  tileFile: "Файл {position}: {name}{status}",
};

// ─── Drop zone parts ─────────────────────────────────────────────────────────

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

export type FileUploadBodyProps = DivProps;

/** Custom body of the drop zone: a centered column; nested buttons and links stay interactive. */
function FileUploadBody({ className, ...rest }: FileUploadBodyProps) {
  return <div className={cx(styles.body, className)} {...rest} />;
}
FileUploadBody.displayName = "FileUpload.Body";

export type FileUploadIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Round tinted slot for the zone icon; kit icons inside take the zone tier. */
function FileUploadIcon({ className, ...rest }: FileUploadIconProps) {
  return <span className={cx(styles.icon, className)} aria-hidden {...rest} />;
}
FileUploadIcon.displayName = "FileUpload.Icon";

export type FileUploadTitleProps = ParagraphProps & {
  /** `muted` — secondary color, regular weight (an instruction line in custom bodies). */
  tone?: Extract<TextTone, "default" | "muted">;
};

function FileUploadTitle({ className, tone = "default", ...rest }: FileUploadTitleProps) {
  return (
    <p
      className={cx(styles.title, className)}
      data-tone={tone === "muted" ? tone : undefined}
      {...rest}
    />
  );
}
FileUploadTitle.displayName = "FileUpload.Title";

export type FileUploadDescriptionProps = ParagraphProps;

/** Secondary line of the zone (formats, size limit), the kit Hint of the zone tier. */
function FileUploadDescription(props: FileUploadDescriptionProps) {
  return <Hint.Root size={useControlSize(undefined)} {...props} />;
}
FileUploadDescription.displayName = "FileUpload.Description";

// ─── File row ────────────────────────────────────────────────────────────────

export type FileUploadItemProps = DivProps & {
  /** Failed upload: danger wash and ring, danger description. */
  invalid?: boolean;
  /** Typography, spacing and the format badge follow the control tier (default: the host tier, else `m`). */
  size?: ControlSize;
};

/** A file row: format badge or preview · name over description · actions, then the progress bar. */
function FileUploadItem({
  className,
  invalid = false,
  size: sizeProp,
  ...rest
}: FileUploadItemProps) {
  const size = useControlSize(sizeProp);
  return (
    <ControlSizeProvider value={size}>
      <div
        className={cx(styles.item, className)}
        {...toDataAttributes({ size, invalid: invalid || undefined })}
        {...rest}
      />
    </ControlSizeProvider>
  );
}
FileUploadItem.displayName = "FileUpload.Item";

export type FileUploadFormatBadgeProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> & {
  /** File extension; shown upper-case, cut to 8 characters. */
  format: string;
  color?: PaletteColor;
  ref?: React.Ref<HTMLSpanElement>;
};

/** The file format as a square kit Badge (decorative: the name already carries the extension). */
function FileUploadFormatBadge({
  format,
  color = "gray",
  className,
  ...rest
}: FileUploadFormatBadgeProps) {
  return (
    <Badge.Root {...rest} color={color} className={cx(styles.formatBadge, className)} aria-hidden>
      {format.trim().slice(0, 8).toUpperCase()}
    </Badge.Root>
  );
}
FileUploadFormatBadge.displayName = "FileUpload.FormatBadge";

export type FileUploadItemPreviewProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "color"
> & {
  /** The picture: a URL, or the local preview of a file being uploaded. */
  src: string;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * An image file's picture in place of the format badge: a square kit Thumbnail of the row tier
 * (decorative: the name names the file); an icon shows while it loads or if it fails.
 */
function FileUploadItemPreview({ src, className, ...rest }: FileUploadItemPreviewProps) {
  const size = useControlSize(undefined);
  return (
    <Thumbnail.Root
      {...rest}
      size={size}
      className={cx(styles.preview, className)}
      aria-hidden="true"
    >
      <Thumbnail.Image src={src} />
      <Thumbnail.Fallback>
        <Icon name="object.image" />
      </Thumbnail.Fallback>
    </Thumbnail.Root>
  );
}
FileUploadItemPreview.displayName = "FileUpload.ItemPreview";

export type FileUploadItemTextProps = DivProps;

function FileUploadItemText({ className, ...rest }: FileUploadItemTextProps) {
  return <div className={cx(styles.itemText, className)} {...rest} />;
}
FileUploadItemText.displayName = "FileUpload.ItemText";

export type FileUploadItemDescriptionProps = DivProps;

/** Size, progress or the error of the file; turns danger in an invalid row. */
function FileUploadItemDescription({ className, ...rest }: FileUploadItemDescriptionProps) {
  return <div className={cx(styles.itemDescription, className)} {...rest} />;
}
FileUploadItemDescription.displayName = "FileUpload.ItemDescription";

export type FileUploadItemActionsProps = DivProps;

/** Buttons at the end of the row (remove, retry). */
function FileUploadItemActions({ className, ...rest }: FileUploadItemActionsProps) {
  return <div className={cx(styles.itemActions, className)} {...rest} />;
}
FileUploadItemActions.displayName = "FileUpload.ItemActions";

export type FileUploadItemProgressProps = Omit<DivProps, "children"> & {
  value: number;
  max?: number;
  /** Fill color: `success` for a finished file, `danger` where a failed one stopped. Default `accent`. */
  tone?: Tone;
  /** Accessible name of the bar; name the file. Default `FILE_UPLOAD_LABELS.upload`. */
  "aria-label"?: string;
};

/** Upload progress across the whole row: the kit ProgressBar. */
function FileUploadItemProgress({
  value,
  max,
  tone,
  className,
  "aria-label": ariaLabel = FILE_UPLOAD_LABELS.upload,
  ...rest
}: FileUploadItemProgressProps) {
  return (
    <div {...rest} className={cx(styles.itemProgress, className)}>
      <ProgressBar value={value} max={max} tone={tone} aria-label={ariaLabel} />
    </div>
  );
}
FileUploadItemProgress.displayName = "FileUpload.ItemProgress";

// ─── The set of files: value, queue, changes ─────────────────────────────────

/**
 * What the set needs of an upload queue (`useUploadQueue`): its files, and a hand to retry and
 * remove them. `add` lets the field put picked files into it; `move` keeps its order in step with
 * the tiles.
 */
export type FileUploadQueueSource = Pick<UploadQueue, "items" | "retry" | "remove"> &
  Partial<Pick<UploadQueue, "add" | "move">>;

/** The props of the set itself, shared by `FileUpload.Root` and `FileUpload.Queue`. */
type FileSetProps = {
  /** Files in their order (controlled): on the server, or uploads of `queue` by their ids. */
  value?: readonly FileUploadFile[];
  /** Initial files (uncontrolled). */
  defaultValue?: readonly FileUploadFile[];
  /**
   * The set changed: reordered, a file removed, files added to `queue`. Return
   * the save's promise: the files it touches wait busy; a move or new files stand in
   * their new places meanwhile, a removed file stays until the answer. Resolve — the change stands
   * (a controlled owner applies `value` before resolving); reject — the set goes back (new files
   * leave the queue) and `labels.changeFailed` is announced.
   */
  onValueChange?: (value: readonly FileUploadFile[]) => void | Promise<void>;
  /** The uploads: `useUploadQueue(…)`. Its files that are not in `value` follow it in its order. */
  queue?: FileUploadQueueSource;
  layout?: FileUploadLayout;
  /**
   * Tiles (`grid`, `strip`): the first file is the cover — «Обложка» in place of its format pill,
   * two by two in a grid. A file reordered first becomes the cover, and that is announced.
   */
  cover?: boolean;
  /** Display of a file size. Default: Russian digits with Б · КБ · МБ · ГБ. */
  formatSize?: (bytes: number) => string;
  /** Read-only set: no add tile, no reorder, no remove. */
  disabled?: boolean;
  labels?: Partial<FileUploadLabels>;
};

const EMPTY_FILES: readonly FileUploadFile[] = [];
const EMPTY_UPLOADS: readonly UploadItem[] = [];
const getFileId = (file: FileUploadFile) => file.id;

/** A queue upload as a file of the set. */
const fileOfUpload = (upload: UploadItem): FileUploadFile => ({
  id: upload.id,
  name: upload.file.name,
  size: upload.file.size,
  type: upload.file.type || undefined,
  src: upload.preview,
});

/** One change of the set, applied to any version of it (the same change twice changes nothing). */
type SetChange =
  | { kind: "remove"; id: string }
  | { kind: "move"; id: string; beforeId: string | null }
  | { kind: "add"; files: readonly FileUploadFile[] };

function applyChange(
  value: readonly FileUploadFile[],
  change: SetChange,
): readonly FileUploadFile[] {
  if (change.kind === "add") {
    const fresh = change.files.filter((file) => !value.some((other) => other.id === file.id));
    return fresh.length ? [...value, ...fresh] : value;
  }
  const file = value.find((other) => other.id === change.id);
  if (!file) return value;
  const rest = value.filter((other) => other.id !== change.id);
  if (change.kind === "remove") return rest;
  const at =
    change.beforeId === null ? -1 : rest.findIndex((other) => other.id === change.beforeId);
  const next = at === -1 ? [...rest, file] : [...rest.slice(0, at), file, ...rest.slice(at)];
  return next.every((other, index) => other === value[index]) ? value : next;
}

/** The files a change touches: they wait busy while it is saved. */
const touched = (change: SetChange) =>
  change.kind === "add" ? change.files.map((file) => file.id) : [change.id];

/** Whether a file is one of the types of an `accept` list (MIME, `type/*` or `.ext`). */
function acceptsFile(file: File, accept: string | undefined): boolean {
  if (!accept?.trim()) return true;
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (rule === "") return false;
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) {
      const family = rule.slice(0, -2);
      // A drop with no MIME type is read by its extension (images and videos).
      return type ? type.startsWith(`${family}/`) : mediaKind(file) === family;
    }
    return type === rule;
  });
}

/** What a tile of a file shows: a picture or a clip needs its `src`, else it is a file. */
function kindOf(file: FileUploadFile, src: string | undefined): AttachmentTileKind {
  const kind = mediaKind({ type: file.type ?? "", name: file.name });
  return kind !== null && src ? kind : "file";
}

/** Speaks through the shared Dnd live region (tiles), else through the set's own region. */
function useAnnouncer() {
  const announce = useDragAnnouncer();
  const [message, setMessage] = React.useState("");
  // The same words twice still change the region (a no-break space), so they are spoken again.
  const say = React.useCallback(
    (text: string) => {
      if (announce) announce(text);
      else setMessage((current) => (current === text ? `${text} ` : text));
    },
    [announce],
  );
  return { say, message, own: announce === null };
}

/**
 * The state of a set: `value` (controlled or not) with the changes still being saved, then the
 * queue's uploads that are not in it. Every change goes through `onValueChange` with the async
 * contract; the queue follows: a removed upload leaves it, a moved one keeps its order in step.
 */
function useFileSet({
  value: valueProp,
  defaultValue,
  onValueChange,
  queue,
  cover,
  disabled,
  labels,
}: FileSetProps & { labels: FileUploadLabels }) {
  const controlled = valueProp !== undefined;
  const [stored, setValue] = useControllableState<readonly FileUploadFile[]>({
    value: valueProp,
    defaultValue: defaultValue ?? EMPTY_FILES,
  });
  const queueItems = queue?.items ?? EMPTY_UPLOADS;
  const queueRef = React.useRef(queueItems);
  queueRef.current = queueItems;
  const uploads = React.useMemo(
    () => new Map(queueItems.map((upload) => [upload.id, upload])),
    [queueItems],
  );
  // Uploads the queue ever had: an uncontrolled set lets go of one the queue let go (a tray cleared
  // after sending); a controlled owner keeps its `value` itself.
  const queueSeen = React.useRef(new Set<string>());
  React.useEffect(() => {
    for (const upload of queueItems) queueSeen.current.add(upload.id);
  }, [queueItems]);
  const base = React.useMemo(
    () =>
      controlled
        ? stored
        : stored.filter((file) => uploads.has(file.id) || !queueSeen.current.has(file.id)),
    [controlled, stored, uploads],
  );
  const changes = usePendingChanges(base, applyChange);
  /** The value with the uploads of the queue that are not in it, after it in the queue's order. */
  const withQueue = React.useCallback(
    (list: readonly FileUploadFile[], items: readonly UploadItem[]) => {
      const ids = new Set(list.map(getFileId));
      const loose = items.filter((upload) => !ids.has(upload.id)).map(fileOfUpload);
      return loose.length ? [...list, ...loose] : list;
    },
    [],
  );
  const files = React.useMemo(
    () => withQueue(changes.shown, queueItems),
    [withQueue, changes.shown, queueItems],
  );
  /** Removals the owner is still saving: the file stays, busy, until the answer. */
  const [removing, setRemoving] = React.useState<ReadonlySet<string>>(() => new Set());
  const busy = React.useMemo(
    () => new Set([...removing, ...changes.pending.flatMap(touched)]),
    [removing, changes.pending],
  );
  const announcer = useAnnouncer();
  const { say } = announcer;
  // Reorder needs a place to keep the order: the value, or the queue's own `move`.
  const ordered =
    valueProp !== undefined || defaultValue !== undefined || onValueChange !== undefined;
  const canReorder = !disabled && (ordered || queue?.move !== undefined);

  // Speaks an upload that finished or failed since the last render.
  const statuses = React.useRef(new Map<string, UploadItem["status"]>());
  React.useEffect(() => {
    const before = statuses.current;
    const next = new Map<string, UploadItem["status"]>();
    for (const upload of queueItems) {
      next.set(upload.id, upload.status);
      const was = before.get(upload.id);
      if (was === undefined || was === upload.status) continue;
      const name = upload.file.name;
      if (upload.status === "done") say(formatLabel(labels.uploaded, { name }));
      if (upload.status === "failed") {
        say(formatLabel(labels.uploadFailed, { name, reason: upload.error || labels.failed }));
      }
    }
    statuses.current = next;
  }, [queueItems, labels.uploaded, labels.uploadFailed, labels.failed, say]);

  /** The queue takes the new place of a moved upload: in front of the next upload after it. */
  const followQueue = (list: readonly FileUploadFile[], id: string) => {
    if (!queue?.move || !uploads.has(id)) return;
    const order = list.filter((file) => uploads.has(file.id)).map(getFileId);
    const at = order.indexOf(id);
    if (at !== -1) queue.move(id, order[at + 1] ?? null);
  };

  /**
   * Hands a change to the owner. Answered at once, it is stored; a promise holds it (a removal keeps
   * the file busy in place, anything else stands drawn) until it settles.
   */
  const change = (
    next: SetChange,
    handlers: { applied?: (list: readonly FileUploadFile[]) => void; refused?: () => void } = {},
  ): void | Promise<void> => {
    const nextFiles = applyChange(files, next);
    if (nextFiles === files) return;
    const outcome = onValueChange?.(nextFiles);
    const store = () =>
      setValue((current) => applyChange(withQueue(current, queueRef.current), next));
    const applied = () => {
      store();
      handlers.applied?.(nextFiles);
    };
    if (!isPromiseLike(outcome)) {
      applied();
      return;
    }
    const refused = () => {
      handlers.refused?.();
      say(labels.changeFailed);
    };
    if (next.kind === "remove") {
      const settle = () =>
        setRemoving((current) => {
          const left = new Set(current);
          left.delete(next.id);
          return left;
        });
      setRemoving((current) => new Set(current).add(next.id));
      outcome.then(
        () => {
          settle();
          applied();
        },
        () => {
          settle();
          refused();
        },
      );
    } else {
      changes.track(next, outcome, { onResolve: applied, onReject: refused });
    }
    // Its refusal is handled above; Dnd reads it too, to glide a moved tile back.
    return outcome as Promise<void>;
  };

  const remove = (id: string, applied?: (index: number) => void) => {
    const index = files.findIndex((file) => file.id === id);
    const file = files[index];
    if (!file || disabled || busy.has(id)) return;
    void change(
      { kind: "remove", id },
      {
        applied: () => {
          applied?.(index);
          // An upload leaves the queue too: it stops and its preview is let go.
          if (uploads.has(id)) queue?.remove(id);
          say(formatLabel(labels.removed, { name: file.name }));
        },
      },
    );
  };

  // A reorder that puts another file first gives the set a new cover, spoken once it is drawn:
  // after Dnd's own «moved» words of the same gesture, so the cover is what is heard.
  const coverMoved = React.useRef(false);
  const first = files[0];
  React.useEffect(() => {
    if (!coverMoved.current) return;
    coverMoved.current = false;
    if (first) say(formatLabel(labels.coverChanged, { name: first.name }));
  }, [first, labels.coverChanged, say]);

  const move = (id: string, beforeId: string | null) => {
    const next: SetChange = { kind: "move", id, beforeId };
    if (cover && applyChange(files, next)[0]?.id !== files[0]?.id) coverMoved.current = true;
    return change(next, { applied: (list) => followQueue(list, id) });
  };

  /** Files picked or dropped: into the queue, and into the set at once as their previews. */
  const addToQueue = (picked: File[]) => {
    if (!queue?.add) return;
    const added = queue.add(picked).map(fileOfUpload);
    void change(
      { kind: "add", files: added },
      // Refused: the new files leave the queue with their tiles.
      {
        refused: () => {
          for (const file of added) queue.remove(file.id);
        },
      },
    );
  };

  return {
    files,
    uploads,
    busy,
    canReorder,
    announcer,
    retry: (id: string) => queue?.retry(id),
    remove,
    move,
    addToQueue,
  };
}

type FileSet = ReturnType<typeof useFileSet>;

/** The upload state of a file in words, or null for a settled file. */
function stateOf(upload: UploadItem | undefined, labels: FileUploadLabels): string | null {
  if (!upload) return null;
  if (upload.status === "queued") return labels.queued;
  if (upload.status === "loading") {
    return formatLabel(labels.uploading, { percent: Math.round(upload.progress * 100) });
  }
  if (upload.status === "failed") return upload.error || labels.failed;
  return null;
}

const TILE_LABEL = { image: "tileImage", video: "tileVideo", file: "tileFile" } as const;

type FileSetViewProps = {
  set: FileSet;
  layout: FileUploadLayout;
  cover: boolean;
  disabled: boolean;
  formatSize: (bytes: number) => string;
  labels: FileUploadLabels;
  /** The add tile (`trigger="tile"`): the last cell, it never moves. */
  addTile?: React.ReactNode;
  /** Attributes of the `<ul>`: its name, `className`, the consumer's rest. */
  listProps: Omit<React.HTMLAttributes<HTMLUListElement>, "children">;
  listRef?: React.Ref<HTMLUListElement>;
};

/** The files as rows or tiles, and the set's live region when no Dnd region speaks for it. */
function FileSetView({
  set,
  layout,
  cover,
  disabled,
  formatSize,
  labels,
  addTile,
  listProps,
  listRef,
}: FileSetViewProps) {
  const { files, uploads, busy, canReorder, announcer } = set;
  const ownRef = React.useRef<HTMLUListElement | null>(null);
  const setListRef = useMergedRefs(ownRef, listRef);
  const kindId = `file-upload-${React.useId()}`;
  const strip = layout === "strip";
  /** Files their remove button took out: a row or a strip tile closes up in place. */
  const leaving = React.useRef(new Set<string>());
  // After a removal focus moves to the file that took its place (or the add tile).
  const pendingFocus = React.useRef<number | null>(null);
  // Files drawn so far: one that was not there before enters; the first render draws in place.
  const seen = React.useRef<Set<string> | null>(null);
  const firstRender = seen.current === null;
  seen.current ??= new Set();
  React.useEffect(() => {
    for (const file of files) seen.current?.add(file.id);
  });
  React.useLayoutEffect(() => {
    const index = pendingFocus.current;
    if (index === null) return;
    pendingFocus.current = null;
    const cells = Array.from(ownRef.current?.children ?? []) as HTMLElement[];
    const target = cells[Math.min(index, cells.length - 1)];
    // The add tile is a label: its input takes the focus.
    (target?.querySelector<HTMLElement>("input") ?? target)?.focus({ preventScroll: true });
  });

  const remove = (id: string) =>
    set.remove(id, (index) => {
      leaving.current.add(id);
      if (layout !== "list") pendingFocus.current = index;
    });
  const nameOf = (file: FileUploadFile, position: number, status: string) => {
    const upload = uploads.get(file.id);
    const src = upload?.preview || file.src;
    return formatLabel(labels[TILE_LABEL[kindOf(file, src)]], {
      position,
      name: file.alt ?? file.name,
      status,
    });
  };

  const region = announcer.own ? (
    <VisuallyHidden live="polite">{announcer.message}</VisuallyHidden>
  ) : null;

  if (layout === "list") {
    return (
      <>
        {files.length > 0 || addTile ? (
          <ul {...listProps} ref={setListRef} className={cx(styles.queue, listProps.className)}>
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                upload={uploads.get(file.id)}
                pending={busy.has(file.id)}
                labels={labels}
                formatSize={formatSize}
                leaving={leaving}
                onRetry={disabled ? undefined : () => set.retry(file.id)}
                onRemove={disabled ? undefined : () => remove(file.id)}
              />
            ))}
            {addTile}
          </ul>
        ) : null}
        {region}
      </>
    );
  }

  const list = (
    <Dnd.Sortable
      {...(listProps as React.HTMLAttributes<HTMLElement>)}
      ref={setListRef as React.Ref<HTMLElement>}
      as="ul"
      axis={strip ? "x" : "grid"}
      kind={kindId}
      className={cx(strip ? tileStyles.strip : styles.grid, listProps.className)}
      items={files}
      getId={getFileId}
      getLabel={(file) => nameOf(file, files.indexOf(file) + 1, "")}
      disabled={!canReorder}
      // A returned promise keeps Dnd's drawn order and glides the tile back on a refusal.
      onReorder={(id, beforeId) => set.move(id, beforeId)}
      renderItem={(file, index) => {
        const upload = uploads.get(file.id);
        const src = upload?.preview || file.src;
        const kind = kindOf(file, src);
        const format = extensionOf(file.name);
        const state = stateOf(upload, labels);
        return (
          <AttachmentTile
            id={file.id}
            kind={kind}
            src={src}
            name={splitFileName(file.name).base}
            nameTitle={file.name}
            // A video shows its duration where a size would stand.
            meta={kind === "video" || file.size === undefined ? undefined : formatSize(file.size)}
            href={file.href}
            openLabel={formatLabel(labels.open, { name: file.name })}
            badge={
              cover && index === 0 ? (
                // A new cover: the word comes in where the format stood.
                kind === "file" ? (
                  <Badge.Root key="cover" className={enterMotion.enter}>
                    {labels.cover}
                  </Badge.Root>
                ) : (
                  <span key="cover" className={enterMotion.enter}>
                    {labels.cover}
                  </span>
                )
              ) : kind === "file" ? (
                <FileUploadFormatBadge format={format || "—"} color={formatColor(format)} />
              ) : format ? (
                format.toUpperCase()
              ) : undefined
            }
            upload={upload}
            uploadState={state}
            cancelLabel={formatLabel(labels.cancel, { name: file.name })}
            retryLabel={formatLabel(labels.retry, { name: file.name })}
            onRetry={disabled ? undefined : () => set.retry(file.id)}
            removeLabel={formatLabel(labels.remove, { name: file.name })}
            onRemove={disabled ? undefined : () => remove(file.id)}
            pending={busy.has(file.id)}
            arrived={!firstRender && !seen.current?.has(file.id)}
            leaving={strip ? leaving : undefined}
            className={styles.tile}
            aria-label={nameOf(file, index + 1, state === null ? "" : ` · ${state}`)}
            aria-keyshortcuts={
              disabled ? undefined : canReorder ? "Alt+ArrowLeft Alt+ArrowRight Delete" : "Delete"
            }
          />
        );
      }}
    >
      {/* The last cell of the same grid: it never moves, and a drop past the last file opens the
          gap in front of it. */}
      {addTile}
    </Dnd.Sortable>
  );

  return (
    <>
      {files.length > 0 || addTile ? (
        <div className={styles.tiles} {...toDataAttributes({ layout, cover: cover || undefined })}>
          <ControlSizeProvider value="xs">
            {strip ? <AttachmentStripScroller>{list}</AttachmentStripScroller> : list}
          </ControlSizeProvider>
        </div>
      ) : null}
      {region}
    </>
  );
}

const PROGRESS_TONE: Record<UploadItem["status"], Tone | undefined> = {
  queued: undefined,
  loading: undefined,
  done: "success",
  failed: "danger",
};

/**
 * One row of the list. A file on its way shows its progress across the row; a row its remove button
 * took out closes up in place.
 */
function FileRow({
  file,
  upload,
  pending,
  labels,
  formatSize,
  leaving,
  onRetry,
  onRemove,
}: {
  file: FileUploadFile;
  upload: UploadItem | undefined;
  pending: boolean;
  labels: FileUploadLabels;
  formatSize: (bytes: number) => string;
  leaving: React.RefObject<Set<string>>;
  onRetry: (() => void) | undefined;
  onRemove: (() => void) | undefined;
}) {
  const rowRef = React.useRef<HTMLLIElement | null>(null);
  const { id } = file;
  React.useLayoutEffect(() => {
    const node = rowRef.current;
    return () => {
      if (node && leaving.current.delete(id)) leaveInPlace(node, "block");
    };
  }, [id, leaving]);
  const format = extensionOf(file.name);
  const src = upload?.preview || file.src;
  const status = upload?.status;
  const picture = src && kindOf(file, src) === "image" ? src : undefined;
  const state = stateOf(upload, labels);
  const parts = [file.size === undefined ? null : formatSize(file.size), state].filter(
    (part): part is string => part !== null,
  );
  return (
    <li
      ref={rowRef}
      className={cx(styles.queueRow, enterMotion.enter)}
      aria-busy={pending || undefined}
      data-pending={pending || undefined}
    >
      <FileUploadItem invalid={status === "failed"} data-status={status}>
        {/* A video's preview is a clip, not a picture: it keeps the format badge. */}
        {picture ? (
          <FileUploadItemPreview src={picture} />
        ) : (
          <FileUploadFormatBadge format={format || "—"} color={formatColor(format)} />
        )}
        <FileUploadItemText title={file.name}>
          {/* The extension stands in the badge; a picture row has none, so it keeps it. */}
          {file.href ? (
            <LinkButton
              href={file.href}
              target="_blank"
              rel="noopener noreferrer"
              tone="neutral"
              inline
            >
              {picture ? file.name : splitFileName(file.name).base}
            </LinkButton>
          ) : picture ? (
            file.name
          ) : (
            splitFileName(file.name).base
          )}
        </FileUploadItemText>
        {parts.length > 0 ? (
          <FileUploadItemDescription>
            {/* One text, so a change of status morphs and a new percentage changes in place. */}
            <MorphText>{parts.join(" · ")}</MorphText>
          </FileUploadItemDescription>
        ) : null}
        {onRetry || onRemove ? (
          <FileUploadItemActions>
            {status === "failed" && onRetry ? (
              <Button.Root
                variant="ghost"
                tone="neutral"
                aria-label={formatLabel(labels.retry, { name: file.name })}
                onClick={onRetry}
              >
                <Button.Icon>
                  <Icon name="action.refresh" />
                </Button.Icon>
              </Button.Root>
            ) : null}
            {onRemove ? (
              <Button.Root
                variant="ghost"
                tone="neutral"
                aria-label={formatLabel(labels.remove, { name: file.name })}
                loading={pending}
                onClick={onRemove}
              >
                <Button.Icon>
                  <Icon name="action.close" />
                </Button.Icon>
              </Button.Root>
            ) : null}
          </FileUploadItemActions>
        ) : null}
        {upload ? (
          <FileUploadItemProgress
            value={Math.round(upload.progress * 100)}
            tone={PROGRESS_TONE[upload.status]}
            aria-label={formatLabel(labels.progress, { name: file.name })}
          />
        ) : null}
      </FileUploadItem>
    </li>
  );
}

// ─── Queue ───────────────────────────────────────────────────────────────────

export type FileUploadQueueProps = Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "children" | "defaultValue"
> &
  FileSetProps & {
    ref?: React.Ref<HTMLUListElement>;
  };

/**
 * The files of a set with no picker of its own (a tray whose paperclip lives elsewhere): rows or
 * tiles of `value` and the uploads of `queue`, with retry, remove and reorder.
 */
function FileUploadQueue(props: FileUploadQueueProps) {
  if ((props.layout ?? "list") === "list") return <FileUploadQueueSet {...props} />;
  // Tiles reorder through Dnd (a root inside another one is its children: one session).
  return (
    <Dnd.Root>
      <FileUploadQueueSet {...props} />
    </Dnd.Root>
  );
}
FileUploadQueue.displayName = "FileUpload.Queue";

function FileUploadQueueSet({
  value,
  defaultValue,
  onValueChange,
  queue,
  layout = "list",
  cover = false,
  formatSize = formatFileSize,
  disabled: disabledProp,
  labels: labelsProp,
  ref,
  ...rest
}: FileUploadQueueProps) {
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(FILE_UPLOAD_LABELS, labelsProp);
  const set = useFileSet({ value, defaultValue, onValueChange, queue, cover, disabled, labels });
  return (
    <FileSetView
      set={set}
      layout={layout}
      cover={cover}
      disabled={disabled}
      formatSize={formatSize}
      labels={labels}
      listProps={rest}
      listRef={ref}
    />
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

/** Opens the root's file picker from code (`FileUpload.Root` `picker`). */
export type FileUploadPicker = {
  /**
   * Opens the picker; `accept` narrows this one pick (a «Фото» item of a menu) and the files it
   * takes. Nothing happens while the field is disabled or its set is full.
   */
  open: (options?: { accept?: string }) => void;
};

export type FileUploadRootProps = FieldRootDomProps &
  FieldFrameProps &
  FieldFocusRingProps &
  FileSetProps & {
    /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
    size?: ControlSize;
    trigger?: FileUploadTrigger;
    variant?: FileUploadVariant;
    picker?: React.Ref<FileUploadPicker>;
    accept?: string;
    multiple?: boolean;
    /** Most files in the set: the add tile counts them; files past it are not taken. */
    max?: number;
    /** Invalid state: danger line and `aria-invalid`. A non-empty `error` implies it. */
    invalid?: boolean;
    /** Name of the file input inside a form. */
    name?: string;
    /** Files picked or dropped (of `accept`, cut to `max`). Not called with `queue.add`: they go there. */
    onFilesChange?: (files: File[]) => void;
    /** Id of the file input; generated when omitted. */
    id?: string;
    /**
     * A zone: a custom body (`FileUpload.Body`) instead of the built-in one. `trigger="button"`:
     * the button's content (`Button.Icon` and text; an icon alone makes it icon-only).
     */
    children?: React.ReactNode;
  };

/**
 * The field: label · the trigger (a drop zone, a picker button or an add tile) · the files of
 * `value` and `queue` · hint or error. `className`, `ref` and the rest go to the frame, `id` and
 * `aria-label` to the file input (the button with `trigger="button"`).
 */
function FileUploadRoot(props: FileUploadRootProps) {
  if ((props.layout ?? "list") === "list") return <FileUploadField {...props} />;
  return (
    <Dnd.Root>
      <FileUploadField {...props} />
    </Dnd.Root>
  );
}
FileUploadRoot.displayName = "FileUpload.Root";

/** A native file drag (not a tile carried by Dnd); jsdom gives no `types`. */
const carriesFiles = (event: React.DragEvent) => {
  const types = event.dataTransfer?.types;
  return !types || Array.from(types).includes("Files");
};

function FileUploadField({
  size: sizeProp,
  trigger = "dropzone",
  variant = "dashed",
  picker,
  accept,
  multiple,
  max,
  disabled: disabledProp,
  invalid,
  name,
  onFilesChange,
  value,
  defaultValue,
  onValueChange,
  queue,
  layout = "list",
  cover = false,
  formatSize = formatFileSize,
  label,
  required,
  optional,
  hint,
  error,
  id,
  focusRing,
  labels: labelsProp,
  "aria-label": ariaLabel,
  children,
  ...rest
}: FileUploadRootProps) {
  const size = useControlSize(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  const labels = useLabels(FILE_UPLOAD_LABELS, labelsProp);
  const ids = useFieldFrame(id, { label, hint, error, invalid });
  const set = useFileSet({ value, defaultValue, onValueChange, queue, cover, disabled, labels });
  const [dragOver, setDragOver] = React.useState(false);
  // Enter / leave pairs fire for every child the pointer crosses; the field is left at depth 0.
  const dragDepth = React.useRef(0);
  const ownInput = React.useRef<HTMLInputElement | null>(null);
  /** The types of the pick in progress: `open({ accept })` narrows one pick, else `accept`. */
  const pickAccept = React.useRef<string | undefined>(accept);
  /** Set by `picker.open` just before it clicks the input: the next pick's own types. */
  const requestedAccept = React.useRef<{ accept: string | undefined } | null>(null);

  const count = set.files.length;
  const room = max === undefined ? Number.POSITIVE_INFINITY : Math.max(0, max - count);
  const full = room === 0;
  const hasSet =
    trigger === "tile" || value !== undefined || defaultValue !== undefined || queue !== undefined;
  const button = trigger === "button";
  const tile = trigger === "tile";

  const addFiles = (picked: readonly File[], types: string | undefined = accept) => {
    if (disabled) return;
    const files = picked.filter((file) => acceptsFile(file, types)).slice(0, room);
    if (files.length === 0) return;
    if (queue?.add) set.addToQueue(files);
    else onFilesChange?.(files);
  };

  React.useImperativeHandle(
    picker,
    () => ({
      open: (options = {}) => {
        const input = ownInput.current;
        if (!input || disabled || full) return;
        requestedAccept.current = { accept: options.accept ?? accept };
        input.click();
      },
    }),
    [accept, disabled, full],
  );

  const input = (
    <input
      ref={ownInput}
      id={ids.controlId}
      type="file"
      className={cx(visuallyHiddenClass, styles.input)}
      name={name}
      accept={accept}
      multiple={multiple}
      required={required}
      disabled={disabled}
      // A full set keeps its input enabled, so the field (its label) does not read as disabled:
      // the add tile is only marked off and its click opens no picker.
      aria-disabled={(tile && full) || undefined}
      onClick={(event) => {
        if (tile && full) {
          event.preventDefault();
          return;
        }
        // The types of this pick: `picker.open({ accept })`, else the field's own.
        const requested = requestedAccept.current;
        requestedAccept.current = null;
        pickAccept.current = requested ? requested.accept : accept;
        if (pickAccept.current === undefined) event.currentTarget.removeAttribute("accept");
        else event.currentTarget.accept = pickAccept.current;
      }}
      // The button is the control: the input only holds the files.
      tabIndex={button ? -1 : undefined}
      aria-hidden={button || undefined}
      aria-label={button ? undefined : tile ? labels.addLabel : ariaLabel}
      aria-labelledby={button || tile ? undefined : ids.labelledBy}
      aria-describedby={button ? undefined : ids.describedBy}
      aria-invalid={(!button && ids.invalid) || undefined}
      onChange={(event) => {
        addFiles(Array.from(event.target.files ?? []), pickAccept.current);
        event.target.value = "";
      }}
    />
  );

  let control: React.ReactNode = null;
  if (button) {
    const content = children ?? (
      <>
        <Button.Icon>
          <Icon name="action.attach" />
        </Button.Icon>
        {labels.browse}
      </>
    );
    // An icon alone is a quiet ghost square (a composer's paperclip); with text the soft button.
    const iconOnly =
      React.Children.count(content) === 1 &&
      React.isValidElement(content) &&
      content.type === Button.Icon;
    // The field label stays the input's (a click on it opens the picker too).
    const buttonId = `${ids.controlId}-button`;
    control = (
      <span className={styles.buttonRoot}>
        {input}
        <Button.Root
          id={buttonId}
          variant={iconOnly ? "ghost" : "soft"}
          tone="neutral"
          size={size}
          disabled={disabled}
          aria-label={ariaLabel}
          // The field label and the button's own text both name it («Договор, Выбрать файл»).
          aria-labelledby={
            ids.labelledBy && !ariaLabel ? `${ids.labelledBy} ${buttonId}` : undefined
          }
          aria-describedby={ids.describedBy}
          aria-invalid={ids.invalid || undefined}
          onClick={() => ownInput.current?.click()}
        >
          {content}
        </Button.Root>
      </span>
    );
  } else if (!tile) {
    control = (
      // biome-ignore lint/a11y/noLabelWithoutControl: the file input (`input`) is its first child
      <label
        className={styles.root}
        {...toDataAttributes({
          size,
          variant,
          state: dragOver ? "active" : undefined,
          invalid: ids.invalid || undefined,
          disabled: disabled || undefined,
        })}
      >
        {input}
        <ControlSizeProvider value={size}>
          {children ?? (
            <FileUploadBody>
              <FileUploadIcon>
                <Icon name="action.upload" size={size} tone="secondary" />
              </FileUploadIcon>
              <div className={styles.copy}>
                <FileUploadTitle>{labels.title}</FileUploadTitle>
                {labels.description ? (
                  <FileUploadDescription>{labels.description}</FileUploadDescription>
                ) : null}
              </div>
              {/* Decorative: the whole zone is the target, so the «button» is a styled span. */}
              <Button.Root asChild variant="soft" tone="neutral" size={size} disabled={disabled}>
                <span>{labels.browse}</span>
              </Button.Root>
            </FileUploadBody>
          )}
        </ControlSizeProvider>
      </label>
    );
  }

  const empty = count === 0;
  const countText = max === undefined ? null : formatLabel(labels.count, { count, max });
  const addTile =
    tile && !disabled ? (
      <li className={styles.add} data-empty={empty || undefined} data-full={full || undefined}>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: the file input (`input`) is its first child */}
        <label className={styles.addTarget}>
          {input}
          <span className={styles.addIcon} aria-hidden="true">
            <Icon name="action.add" />
          </span>
          <span className={styles.addText}>
            <MorphText>{full ? labels.full : empty ? labels.empty : labels.add}</MorphText>
          </span>
          {countText !== null ? (
            <span className={styles.addHint}>
              <RollingNumber>{countText}</RollingNumber>
            </span>
          ) : empty ? (
            <span className={cx(styles.addHint, enterMotion.enter)}>{labels.emptyHint}</span>
          ) : null}
        </label>
      </li>
    ) : null;

  // The drop zone and an add tile take files dropped anywhere on the field; a button takes none.
  const drops = !button && !disabled;
  const dropHandlers = button
    ? {}
    : {
        onDragEnter: (event: React.DragEvent) => {
          if (!carriesFiles(event)) return;
          event.preventDefault();
          dragDepth.current += 1;
          if (drops && !full) setDragOver(true);
        },
        // Allows the drop; the state itself follows enter / leave.
        onDragOver: (event: React.DragEvent) => {
          if (carriesFiles(event)) event.preventDefault();
        },
        onDragLeave: (event: React.DragEvent) => {
          if (!carriesFiles(event)) return;
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragOver(false);
        },
        onDrop: (event: React.DragEvent) => {
          if (!carriesFiles(event)) return;
          event.preventDefault();
          dragDepth.current = 0;
          setDragOver(false);
          if (drops) addFiles(Array.from(event.dataTransfer?.files ?? []));
        },
      };

  return (
    <FieldFrame
      {...rest}
      size={size}
      ids={ids}
      label={label}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      disabled={disabled}
      optionalLabel={labels.optional}
      group={tile}
    >
      {/* Files dropped anywhere on the field go in; the keyboard and picker path is the file input. */}
      <div
        className={styles.field}
        {...toDataAttributes({
          trigger,
          dropping: (tile && dragOver) || undefined,
          "focus-ring": focusRing,
        })}
        {...dropHandlers}
      >
        {control}
        {hasSet ? (
          <ControlSizeProvider value={size}>
            <FileSetView
              set={set}
              layout={layout}
              cover={cover}
              disabled={disabled}
              formatSize={formatSize}
              labels={labels}
              addTile={addTile}
              listProps={{
                "aria-label": ids.labelledBy ? undefined : ariaLabel,
                "aria-labelledby": ids.labelledBy,
                "aria-describedby": tile ? ids.describedBy : undefined,
              }}
            />
          </ControlSizeProvider>
        ) : null}
      </div>
    </FieldFrame>
  );
}

export const FileUpload = {
  Root: FileUploadRoot,
  Body: FileUploadBody,
  Icon: FileUploadIcon,
  Title: FileUploadTitle,
  Description: FileUploadDescription,
  Item: FileUploadItem,
  FormatBadge: FileUploadFormatBadge,
  ItemPreview: FileUploadItemPreview,
  ItemText: FileUploadItemText,
  ItemDescription: FileUploadItemDescription,
  ItemActions: FileUploadItemActions,
  ItemProgress: FileUploadItemProgress,
  Queue: FileUploadQueue,
};
