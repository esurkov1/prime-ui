import * as React from "react";

import { Button } from "@/components/button/Button";
import { DragControllerContext } from "@/components/dnd/context";
import { Dnd } from "@/components/dnd/Dnd";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import { formatLabel } from "@/internal/formatLabel";
import { RollingNumber } from "@/internal/RollingNumber";
import { visuallyHiddenClass } from "@/internal/VisuallyHidden";

import styles from "./ImageUpload.module.css";

/** One picture of the set: application data, drawn in array order. */
export type ImageUploadItem = {
  /** Stable unique id: survives a reorder. */
  id: string;
  /** The picture: a URL, or an object URL of a file just picked. */
  src: string;
  /** What the picture shows; spoken with its position, never drawn. */
  alt?: string;
};

/** `grid`: equal tiles in rows. `cover`: the first picture is the cover, two rows tall. */
export type ImageUploadVariant = "grid" | "cover";

/** System strings. `{token}` values are substituted. */
export type ImageUploadLabels = {
  /** Text of the add tile. */
  add: string;
  /** Accessible name of the add tile. */
  addLabel: string;
  /** The add tile of an empty set: the whole row is the drop target. */
  empty: string;
  /** Second line of the empty add tile without `max`. */
  emptyHint: string;
  /** Text of the add tile when `max` is reached. */
  full: string;
  /** Badge of the first picture with `cover`. */
  cover: string;
  /** Action that puts a picture first (`cover`). */
  makeCover: string;
  /** Accessible name of a tile: `{position}`, `{alt}`. */
  item: string;
  /** Accessible name of the delete button: `{position}`. */
  remove: string;
  /** Counter on the add tile: `{count}`, `{max}`. */
  count: string;
  /** Live region: a picture was removed: `{position}`. */
  removed: string;
  /** Live region: a picture became the cover: `{position}` (its place before). */
  coverChanged: string;
  /** Muted marker after the label for `optional`. */
  optional: string;
};

export const defaultImageUploadLabels: ImageUploadLabels = {
  add: "Добавить",
  addLabel: "Добавить фото",
  empty: "Нажмите или перетащите фото",
  emptyHint: "Можно несколько сразу",
  full: "Лимит фото",
  cover: "Обложка",
  makeCover: "Сделать обложкой",
  item: "Фото {position}{alt}",
  remove: "Удалить фото {position}",
  count: "{count} из {max}",
  removed: "Фото {position} удалено",
  coverChanged: "Фото {position} стало обложкой",
  optional: "необязательно",
};

export type ImageUploadProps = FieldRootDomProps &
  Omit<FieldFrameProps, "focusRing"> & {
    /** Pictures in their order (controlled). */
    value?: readonly ImageUploadItem[];
    /** Initial pictures (uncontrolled). */
    defaultValue?: readonly ImageUploadItem[];
    /** The set changed: reordered, a picture removed or made the cover. */
    onValueChange?: (value: readonly ImageUploadItem[]) => void;
    /**
     * Files picked or dropped (images only, cut to the room left under `max`). Turn them into items
     * — upload, or `URL.createObjectURL` — and add them to `value`. Without it there is no add tile.
     */
    onFilesAdd?: (files: File[]) => void;
    variant?: ImageUploadVariant;
    /** Most pictures: the add tile counts `count из max` and turns off when it is reached. */
    max?: number;
    /** File types of the picker. */
    accept?: string;
    /** No adding, reordering or removing. */
    disabled?: boolean;
    /** Invalid state: `aria-invalid` and the danger support row. A non-empty `error` implies it. */
    invalid?: boolean;
    /** Id of the file input; generated when omitted. */
    id?: string;
    labels?: Partial<ImageUploadLabels>;
  };

/**
 * A set of pictures as tiles, the last tile adds more: reorder by drag, touch hold or Alt + ← / →,
 * remove with the corner button or Delete. With `cover` the first picture is the cover, shown large.
 * Mounts its own `Dnd.Root` unless one is already above it.
 */
export function ImageUpload(props: ImageUploadProps) {
  const outer = React.useContext(DragControllerContext);
  const field = <ImageUploadField {...props} />;
  return outer ? field : <Dnd.Root>{field}</Dnd.Root>;
}
ImageUpload.displayName = "ImageUpload";

const EMPTY: readonly ImageUploadItem[] = [];
const getItemId = (item: ImageUploadItem) => item.id;

function ImageUploadField({
  value: valueProp,
  defaultValue,
  onValueChange,
  onFilesAdd,
  variant = "grid",
  max,
  accept = "image/*",
  disabled = false,
  invalid,
  id,
  label,
  required,
  optional,
  hint,
  error,
  labels: labelsProp,
  className,
  ...rest
}: ImageUploadProps) {
  const size = useControlSize(undefined);
  const labels = { ...defaultImageUploadLabels, ...labelsProp };
  const ids = useFieldFrame(id, { label, hint, error, invalid });
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const kind = `image-upload-${React.useId()}`;
  // After a removal focus moves to the picture that took its place (or the add tile).
  const pendingFocus = React.useRef<number | null>(null);
  const [value, setValue] = useControllableState<readonly ImageUploadItem[]>({
    value: valueProp,
    defaultValue: defaultValue ?? EMPTY,
  });
  const [dropping, setDropping] = React.useState(false);
  // Pictures drawn so far: one that was not there before enters; the first render draws in place.
  const seen = React.useRef<Set<string> | null>(null);
  const firstRender = seen.current === null;
  seen.current ??= new Set();
  const arrived = (itemId: string) => !firstRender && !seen.current?.has(itemId);
  React.useEffect(() => {
    for (const item of value) seen.current?.add(item.id);
  });
  const dragDepth = React.useRef(0);

  const room = max === undefined ? Number.POSITIVE_INFINITY : Math.max(0, max - value.length);
  // The add tile needs a hand to pass the files to: without `onFilesAdd` the set is only arranged.
  const showAdd = onFilesAdd !== undefined && !disabled;
  const full = room === 0;
  const canAdd = showAdd && !full;
  const cover = variant === "cover";

  const commit = (next: readonly ImageUploadItem[]) => {
    setValue(next);
    onValueChange?.(next);
  };

  const positionOf = (itemId: string) => value.findIndex((item) => item.id === itemId) + 1;
  const altPart = (item: ImageUploadItem) => (item.alt ? `: ${item.alt}` : "");

  const announce = useAnnounce();

  const remove = (itemId: string) => {
    const index = value.findIndex((item) => item.id === itemId);
    if (index === -1 || disabled) return;
    pendingFocus.current = index;
    commit(value.filter((item) => item.id !== itemId));
    announce(formatLabel(labels.removed, { position: index + 1 }));
  };

  const makeCover = (itemId: string) => {
    const index = value.findIndex((item) => item.id === itemId);
    if (index <= 0 || disabled) return;
    const item = value[index];
    if (!item) return;
    commit([item, ...value.filter((other) => other.id !== itemId)]);
    announce(formatLabel(labels.coverChanged, { position: index + 1 }));
  };

  React.useLayoutEffect(() => {
    const index = pendingFocus.current;
    if (index === null) return;
    pendingFocus.current = null;
    const tiles = Array.from(listRef.current?.children ?? []) as HTMLElement[];
    const target = tiles[Math.min(index, tiles.length - 1)];
    // The add tile is a label: its input takes the focus.
    (target?.querySelector<HTMLElement>("input") ?? target)?.focus({ preventScroll: true });
  });

  const addFiles = (files: FileList | File[] | null) => {
    if (!files || !canAdd) return;
    const images = Array.from(files)
      .filter((file) => file.type === "" || file.type.startsWith("image/"))
      .slice(0, room);
    if (images.length > 0) onFilesAdd?.(images);
  };

  const fileDrag = (event: React.DragEvent) => event.dataTransfer.types.includes("Files");

  const empty = value.length === 0;
  const countText =
    max === undefined ? null : formatLabel(labels.count, { count: value.length, max });
  const addTile = showAdd ? (
    <li className={styles.add} data-empty={empty || undefined} data-full={full || undefined}>
      <label className={styles.addTarget}>
        <input
          id={ids.controlId}
          type="file"
          accept={accept}
          multiple
          disabled={full}
          className={visuallyHiddenClass}
          aria-label={labels.addLabel}
          aria-describedby={ids.describedBy}
          aria-invalid={ids.invalid || undefined}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <span className={styles.addIcon} aria-hidden="true">
          <Icon name="action.add" />
        </span>
        <span className={styles.addText}>
          {full ? labels.full : empty ? labels.empty : labels.add}
        </span>
        {countText !== null ? (
          <span className={styles.addHint}>
            <RollingNumber>{countText}</RollingNumber>
          </span>
        ) : empty ? (
          <span className={styles.addHint}>{labels.emptyHint}</span>
        ) : null}
      </label>
    </li>
  ) : null;

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
      group
      className={className}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: files dropped anywhere on the set; the keyboard and picker path is the add tile's file input */}
      <div
        className={styles.root}
        {...toDataAttributes({
          variant,
          dropping: dropping || undefined,
          disabled: disabled || undefined,
        })}
        onDragEnter={(event) => {
          if (!fileDrag(event) || !canAdd) return;
          event.preventDefault();
          dragDepth.current += 1;
          setDropping(true);
        }}
        onDragOver={(event) => {
          if (fileDrag(event) && canAdd) event.preventDefault();
        }}
        onDragLeave={(event) => {
          if (!fileDrag(event)) return;
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDropping(false);
        }}
        onDrop={(event) => {
          if (!fileDrag(event)) return;
          event.preventDefault();
          dragDepth.current = 0;
          setDropping(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <ControlSizeProvider value="xs">
          <Dnd.Sortable
            ref={listRef as React.Ref<HTMLElement>}
            as="ul"
            axis="grid"
            kind={kind}
            className={styles.grid}
            aria-labelledby={ids.labelledBy}
            aria-describedby={ids.describedBy}
            items={value}
            getId={getItemId}
            getLabel={(item) =>
              formatLabel(labels.item, { position: positionOf(item.id), alt: altPart(item) })
            }
            disabled={disabled}
            onReorder={(itemId, beforeId) => {
              const item = value.find((other) => other.id === itemId);
              if (!item) return;
              const rest = value.filter((other) => other.id !== itemId);
              const at = beforeId === null ? -1 : rest.findIndex((other) => other.id === beforeId);
              commit(at === -1 ? [...rest, item] : [...rest.slice(0, at), item, ...rest.slice(at)]);
            }}
            renderItem={(item, index) => (
              <Dnd.SortableItem
                id={item.id}
                className={cx(
                  styles.tile,
                  arrived(item.id) && cx(enterMotion.enter, styles.arrived),
                )}
                aria-label={formatLabel(labels.item, { position: index + 1, alt: altPart(item) })}
                aria-keyshortcuts={disabled ? undefined : "Alt+ArrowLeft Alt+ArrowRight Delete"}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Delete" || event.key === "Backspace") {
                    event.preventDefault();
                    remove(item.id);
                  }
                }}
              >
                <img className={styles.image} src={item.src} alt="" draggable={false} />
                {/* `data-dnd-mirror`: the carried copy shows the place too, as it changes in flight. */}
                <span
                  className={cx(styles.chip, styles.badge)}
                  aria-hidden="true"
                  data-dnd-mirror=""
                >
                  {cover && index === 0 ? (
                    // A new cover: the word comes in where the number stood.
                    <span key="cover" className={enterMotion.enter}>
                      {labels.cover}
                    </span>
                  ) : (
                    // The position rolls to its new value once the photo settles in its place.
                    <RollingNumber key="index">{index + 1}</RollingNumber>
                  )}
                </span>
                {disabled ? null : (
                  <span className={cx(styles.chip, styles.remove)}>
                    <Button.Root
                      variant="ghost"
                      tone="inherit"
                      aria-label={formatLabel(labels.remove, { position: index + 1 })}
                      onClick={() => remove(item.id)}
                    >
                      <Button.Icon>
                        <Icon name="action.close" />
                      </Button.Icon>
                    </Button.Root>
                  </span>
                )}
                {cover && index > 0 && !disabled ? (
                  <>
                    {/* A wide tile spells the action out; a narrow one keeps an icon of the same size
                        as the delete button. One of the two is drawn, by the tile's own width. */}
                    <span className={styles.plate}>
                      <Button.Root
                        variant="ghost"
                        tone="inherit"
                        fullWidth
                        onClick={() => makeCover(item.id)}
                      >
                        {labels.makeCover}
                      </Button.Root>
                    </span>
                    <span className={cx(styles.chip, styles.plateIcon)}>
                      <Button.Root
                        variant="ghost"
                        tone="inherit"
                        aria-label={labels.makeCover}
                        onClick={() => makeCover(item.id)}
                      >
                        <Button.Icon>
                          <Icon name="object.image" />
                        </Button.Icon>
                      </Button.Root>
                    </span>
                  </>
                ) : null}
              </Dnd.SortableItem>
            )}
          >
            {/* The last cell of the same grid: it never moves, and a drop past the last picture
                opens the gap in front of it. */}
            {addTile}
          </Dnd.Sortable>
        </ControlSizeProvider>
      </div>
    </FieldFrame>
  );
}

/** Speaks through the shared Dnd live region. */
function useAnnounce() {
  const controller = React.useContext(DragControllerContext);
  return React.useCallback((message: string) => controller?.announce(message), [controller]);
}
