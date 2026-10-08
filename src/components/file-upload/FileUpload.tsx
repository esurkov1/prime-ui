import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Hint } from "@/components/hint/Hint";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { Icon } from "@/icons";
import { ControlSizeProvider, useControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  FieldFrame,
  type FieldFrameProps,
  type FieldRootDomProps,
  useFieldFrame,
} from "@/internal/FieldFrame";
import type { ControlSize, PaletteColor, TextTone } from "@/internal/states";
import { visuallyHiddenClass } from "@/internal/VisuallyHidden";

import styles from "./FileUpload.module.css";

/** Drop zone treatment: `dashed` shows the drop affordance line, `solid` keeps only the fill. */
export type FileUploadVariant = "dashed" | "solid";

export type FileUploadLabels = {
  /** Title of the built-in drop zone body. */
  title: string;
  /** Description under the title (formats, size limit). An empty string hides it. */
  description: string;
  /** Text of the decorative «browse» button of the built-in body. */
  browse: string;
  /** Muted marker after the field label when `optional`. */
  optional: string;
};

const FILE_UPLOAD_LABELS: FileUploadLabels = {
  title: "Выберите файл или перетащите его сюда",
  description: "JPEG, PNG, PDF, MP4 до 50 МБ",
  browse: "Выбрать файл",
  optional: "необязательно",
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

/** A file row: format badge · name over description · actions, then the progress bar. */
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

export type FileUploadItemNameProps = DivProps;

function FileUploadItemName({ className, ...rest }: FileUploadItemNameProps) {
  return <div className={cx(styles.itemName, className)} {...rest} />;
}
FileUploadItemName.displayName = "FileUpload.ItemName";

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
  /** Accessible name of the bar; name the file. Default «Загрузка файла». */
  "aria-label"?: string;
};

/** Upload progress across the whole row: the kit ProgressBar. */
function FileUploadItemProgress({
  value,
  max,
  className,
  "aria-label": ariaLabel = "Загрузка файла",
  ...rest
}: FileUploadItemProgressProps) {
  return (
    <div {...rest} className={cx(styles.itemProgress, className)}>
      <ProgressBar value={value} max={max} aria-label={ariaLabel} />
    </div>
  );
}
FileUploadItemProgress.displayName = "FileUpload.ItemProgress";

// ─── Root ────────────────────────────────────────────────────────────────────

export type FileUploadRootProps = FieldRootDomProps &
  Omit<FieldFrameProps, "focusRing"> & {
    /** Tier. Default: the tier of the surrounding control (a form, a panel), else `m`. */
    size?: ControlSize;
    variant?: FileUploadVariant;
    /** Access to the hidden file input (open the picker programmatically). */
    inputRef?: React.Ref<HTMLInputElement>;
    accept?: string;
    multiple?: boolean;
    /** Blocks picking and drag-and-drop. */
    disabled?: boolean;
    /** Invalid state: danger line and `aria-invalid`. A non-empty `error` implies it. */
    invalid?: boolean;
    /** Name of the file input inside a form. */
    name?: string;
    onFilesChange?: (files: File[]) => void;
    labels?: Partial<FileUploadLabels>;
    /** Id of the file input; generated when omitted. */
    id?: string;
    /** Custom body (`FileUpload.Body`); replaces the built-in icon, title, description and button. */
    children?: React.ReactNode;
  };

/**
 * The field: label · drop zone · hint or error. `className`, `ref` and the rest go to the frame,
 * `id` and `aria-label` to the hidden file input.
 */
function FileUploadRoot({
  size: sizeProp,
  variant = "dashed",
  inputRef,
  accept,
  multiple,
  disabled = false,
  invalid,
  name,
  onFilesChange,
  label,
  required,
  optional,
  hint,
  error,
  id,
  labels: labelsProp,
  "aria-label": ariaLabel,
  children,
  ...rest
}: FileUploadRootProps) {
  const size = useControlSize(sizeProp);
  const labels = { ...FILE_UPLOAD_LABELS, ...labelsProp };
  const ids = useFieldFrame(id, { label, hint, error, invalid });
  const [dragOver, setDragOver] = React.useState(false);
  // Enter / leave pairs fire for every child the pointer crosses; the zone is left at depth 0.
  const dragDepth = React.useRef(0);

  const onDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    if (!disabled) setDragOver(true);
  };

  const onDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragOver(false);
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragOver(false);
    if (!disabled) onFilesChange?.(Array.from(event.dataTransfer.files));
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
    >
      <label
        className={styles.root}
        {...toDataAttributes({
          size,
          variant,
          state: dragOver ? "active" : undefined,
          invalid: ids.invalid || undefined,
          disabled: disabled || undefined,
        })}
        onDragEnter={onDragEnter}
        // Allows the drop; the state itself follows enter / leave.
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={ids.controlId}
          type="file"
          className={cx(visuallyHiddenClass, styles.input)}
          name={name}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={ids.labelledBy}
          aria-describedby={ids.describedBy}
          aria-invalid={ids.invalid || undefined}
          onChange={(event) => {
            onFilesChange?.(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
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
    </FieldFrame>
  );
}
FileUploadRoot.displayName = "FileUpload.Root";

export const FileUpload = {
  Root: FileUploadRoot,
  Body: FileUploadBody,
  Icon: FileUploadIcon,
  Title: FileUploadTitle,
  Description: FileUploadDescription,
  Item: FileUploadItem,
  FormatBadge: FileUploadFormatBadge,
  ItemName: FileUploadItemName,
  ItemDescription: FileUploadItemDescription,
  ItemActions: FileUploadItemActions,
  ItemProgress: FileUploadItemProgress,
};
