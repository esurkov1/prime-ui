import * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor, TextTone } from "@/internal/states";

import styles from "./FileUpload.module.css";

/** Drop zone treatment: `dashed` shows the drop affordance line, `solid` keeps only the fill. */
export type FileUploadVariant = "dashed" | "solid";

export type FileUploadLabels = {
  /** Title of the built-in drop zone body. */
  title: string;
  /** Hint under the title (formats, size limit). An empty string hides it. */
  hint: string;
  /** Decorative «browse» button text of the built-in body. */
  browse: string;
};

const FILE_UPLOAD_LABELS: FileUploadLabels = {
  title: "Выберите файл или перетащите его сюда",
  hint: "JPEG, PNG, PDF, MP4 до 50 МБ",
  browse: "Выбрать файл",
};

// ─── Drop zone slots ─────────────────────────────────────────────────────────

export type FileUploadIconProps = React.HTMLAttributes<HTMLSpanElement>;

function FileUploadIcon({ className, children, ...rest }: FileUploadIconProps) {
  return (
    <span className={cx(styles.iconWrap, className)} aria-hidden {...rest}>
      {children}
    </span>
  );
}
FileUploadIcon.displayName = "FileUpload.Icon";

export type FileUploadTitleProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** `muted` — secondary text color, regular weight (instruction line in custom bodies). */
  tone?: Extract<TextTone, "default" | "muted">;
};

function FileUploadTitle({ className, children, tone = "default", ...rest }: FileUploadTitleProps) {
  return (
    <p className={cx(styles.title, tone === "muted" && styles.titleMuted, className)} {...rest}>
      {children}
    </p>
  );
}
FileUploadTitle.displayName = "FileUpload.Title";

export type FileUploadHintProps = React.HTMLAttributes<HTMLParagraphElement>;

function FileUploadHint({ className, children, ...rest }: FileUploadHintProps) {
  const controlSize = useOptionalControlSize() ?? "m";
  return (
    <Hint.Root size={controlSize} className={className} {...rest}>
      {children}
    </Hint.Root>
  );
}
FileUploadHint.displayName = "FileUpload.Hint";

export type FileUploadBrowseLabelProps = React.HTMLAttributes<HTMLSpanElement>;

function FileUploadBrowseLabel({ className, children, ...rest }: FileUploadBrowseLabelProps) {
  return (
    <span className={cx(styles.browse, className)} {...rest}>
      {children}
    </span>
  );
}
FileUploadBrowseLabel.displayName = "FileUpload.BrowseLabel";

/** Inline «browse» link inside a custom title; does not open the picker by itself — pass `onClick`. */
export type FileUploadBrowseLinkProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const FileUploadBrowseLink = React.forwardRef<HTMLButtonElement, FileUploadBrowseLinkProps>(
  ({ className, type = "button", onClick, ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cx(styles.browseLink, className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
      }}
      {...rest}
    />
  ),
);
FileUploadBrowseLink.displayName = "FileUpload.BrowseLink";

/** Custom body column: `pointer-events: none`; nested buttons and links get `pointer-events: auto`. */
export type FileUploadDropBodyProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadDropBody({ className, children, ...rest }: FileUploadDropBodyProps) {
  return (
    <div className={cx(styles.dropBody, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadDropBody.displayName = "FileUpload.DropBody";

/** Row of source chips (device, cloud…) — `pointer-events: auto`. */
export type FileUploadActionsRowProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadActionsRow({ className, children, ...rest }: FileUploadActionsRowProps) {
  return (
    <div className={cx(styles.actionsRow, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadActionsRow.displayName = "FileUpload.ActionsRow";

/** Source button inside `Root`: stops propagation to the label, does not open the file dialog. */
export type FileUploadChipProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const FileUploadChip = React.forwardRef<HTMLButtonElement, FileUploadChipProps>(
  ({ className, type = "button", onClick, ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cx(styles.chip, className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
      }}
      {...rest}
    />
  ),
);
FileUploadChip.displayName = "FileUpload.Chip";

export type FileUploadChipLabelProps = React.HTMLAttributes<HTMLSpanElement>;

function FileUploadChipLabel({ className, children, ...rest }: FileUploadChipLabelProps) {
  return (
    <span className={cx(styles.chipLabel, className)} {...rest}>
      {children}
    </span>
  );
}
FileUploadChipLabel.displayName = "FileUpload.ChipLabel";

// ─── File row ────────────────────────────────────────────────────────────────

export type FileUploadFormatBadgeProps = {
  format: string;
  color?: PaletteColor;
  className?: string;
};

function FileUploadFormatBadge({ format, color = "gray", className }: FileUploadFormatBadgeProps) {
  const label = format.trim().slice(0, 8).toUpperCase();
  return (
    <span
      className={cx(styles.formatBadge, className)}
      {...toDataAttributes({ color })}
      aria-hidden
    >
      {label}
    </span>
  );
}
FileUploadFormatBadge.displayName = "FileUpload.FormatBadge";

export type FileUploadItemProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Failed upload: danger wash and ring, danger meta text. */
  invalid?: boolean;
  /** Typography, spacing, format badge and status icons follow the control tier. */
  size?: ControlSize;
};

function FileUploadItem({ className, invalid = false, size = "m", ...rest }: FileUploadItemProps) {
  return (
    <div
      className={cx(styles.item, className)}
      {...toDataAttributes({ size, invalid: invalid || undefined })}
      {...rest}
    />
  );
}
FileUploadItem.displayName = "FileUpload.Item";

export type FileUploadItemRowProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemRow({ className, children, ...rest }: FileUploadItemRowProps) {
  return (
    <div className={cx(styles.itemRow, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemRow.displayName = "FileUpload.ItemRow";

export type FileUploadItemMainProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemMain({ className, children, ...rest }: FileUploadItemMainProps) {
  return (
    <div className={cx(styles.itemMain, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemMain.displayName = "FileUpload.ItemMain";

/** Vertical stack inside `ItemMain` (error column: text + retry action). */
export type FileUploadItemStackProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemStack({ className, children, ...rest }: FileUploadItemStackProps) {
  return (
    <div className={cx(styles.itemStack, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemStack.displayName = "FileUpload.ItemStack";

/** File name + meta line group. */
export type FileUploadItemTextGroupProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemTextGroup({ className, children, ...rest }: FileUploadItemTextGroupProps) {
  return (
    <div className={cx(styles.itemTextGroup, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemTextGroup.displayName = "FileUpload.ItemTextGroup";

export type FileUploadItemTryAgainProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const FileUploadItemTryAgain = React.forwardRef<HTMLButtonElement, FileUploadItemTryAgainProps>(
  ({ className, type = "button", ...rest }, ref) => (
    <button ref={ref} type={type} className={cx(styles.itemTryAgain, className)} {...rest} />
  ),
);
FileUploadItemTryAgain.displayName = "FileUpload.ItemTryAgain";

export type FileUploadItemNameProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemName({ className, children, ...rest }: FileUploadItemNameProps) {
  return (
    <div className={cx(styles.itemName, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemName.displayName = "FileUpload.ItemName";

export type FileUploadItemMetaProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemMeta({ className, children, ...rest }: FileUploadItemMetaProps) {
  return (
    <div className={cx(styles.itemMeta, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemMeta.displayName = "FileUpload.ItemMeta";

export type FileUploadItemMetaSepProps = React.HTMLAttributes<HTMLSpanElement>;

function FileUploadItemMetaSep({ className, ...rest }: FileUploadItemMetaSepProps) {
  return (
    <span className={cx(styles.itemMetaSep, className)} aria-hidden {...rest}>
      {"\u2219"}
    </span>
  );
}
FileUploadItemMetaSep.displayName = "FileUpload.ItemMetaSep";

export type FileUploadItemActionsProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemActions({ className, children, ...rest }: FileUploadItemActionsProps) {
  return (
    <div className={cx(styles.itemActions, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemActions.displayName = "FileUpload.ItemActions";

export type FileUploadItemFooterProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemFooter({ className, children, ...rest }: FileUploadItemFooterProps) {
  return (
    <div className={cx(styles.itemFooter, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemFooter.displayName = "FileUpload.ItemFooter";

export type FileUploadItemProgressProps = {
  value?: number;
  max?: number;
  className?: string;
  children?: React.ReactNode;
};

function FileUploadItemProgress({ value, max, className, children }: FileUploadItemProgressProps) {
  return (
    <div className={cx(styles.itemProgress, className)}>
      {children ?? (value !== undefined ? <ProgressBar value={value} max={max} /> : null)}
    </div>
  );
}
FileUploadItemProgress.displayName = "FileUpload.ItemProgress";

// ─── Root ────────────────────────────────────────────────────────────────────

export type FileUploadRootProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children"> & {
  size?: ControlSize;
  variant?: FileUploadVariant;
  /** Access to the hidden file input (open the picker programmatically). */
  inputRef?: React.Ref<HTMLInputElement>;
  accept?: string;
  multiple?: boolean;
  /** Blocks picking and drag-and-drop. */
  disabled?: boolean;
  /** Invalid state (e.g. a rejected file): danger line and `aria-invalid` on the input. */
  invalid?: boolean;
  /** Name of the hidden input inside a form. */
  name?: string;
  onFilesChange?: (files: File[]) => void;
  /** Texts of the built-in body (used when there are no `children`). */
  labels?: Partial<FileUploadLabels>;
  /** Custom body; replaces the built-in icon, title, hint and browse button. */
  children?: React.ReactNode;
};

const FileUploadRoot = React.forwardRef<HTMLLabelElement, FileUploadRootProps>(
  (
    {
      size = "m",
      variant = "dashed",
      inputRef: inputRefProp,
      accept,
      multiple,
      disabled = false,
      invalid = false,
      name,
      onFilesChange,
      labels: labelsProp,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const labels = { ...FILE_UPLOAD_LABELS, ...labelsProp };
    const [isDragOver, setIsDragOver] = React.useState(false);
    const mergeInputRef = useMergedRefs(inputRefProp);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      onFilesChange?.(list ? Array.from(list) : []);
      e.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      const related = e.relatedTarget as Node | null;
      if (!related || !e.currentTarget.contains(related)) {
        setIsDragOver(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (!disabled) {
        onFilesChange?.(Array.from(e.dataTransfer.files));
      }
    };

    const defaultBody = (
      <div className={styles.inner}>
        <FileUploadIcon>
          <Icon name="action.upload" size={size} tone="secondary" />
        </FileUploadIcon>
        <div className={styles.copy}>
          <FileUploadTitle>{labels.title}</FileUploadTitle>
          {labels.hint ? <FileUploadHint>{labels.hint}</FileUploadHint> : null}
        </div>
        <FileUploadBrowseLabel>{labels.browse}</FileUploadBrowseLabel>
      </div>
    );

    return (
      <label
        ref={ref}
        {...rest}
        className={cx(styles.root, className)}
        {...toDataAttributes({
          size,
          variant,
          state: isDragOver ? "active" : undefined,
          invalid: invalid || undefined,
          disabled: disabled || undefined,
        })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={mergeInputRef}
          type="file"
          className={styles.input}
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={invalid || undefined}
        />
        <ControlSizeProvider value={size}>{children ?? defaultBody}</ControlSizeProvider>
      </label>
    );
  },
);

FileUploadRoot.displayName = "FileUpload.Root";

export const FileUpload = {
  Root: FileUploadRoot,
  Icon: FileUploadIcon,
  Title: FileUploadTitle,
  Hint: FileUploadHint,
  BrowseLabel: FileUploadBrowseLabel,
  BrowseLink: FileUploadBrowseLink,
  DropBody: FileUploadDropBody,
  ActionsRow: FileUploadActionsRow,
  Chip: FileUploadChip,
  ChipLabel: FileUploadChipLabel,
  FormatBadge: FileUploadFormatBadge,
  Item: FileUploadItem,
  ItemRow: FileUploadItemRow,
  ItemMain: FileUploadItemMain,
  ItemStack: FileUploadItemStack,
  ItemTextGroup: FileUploadItemTextGroup,
  ItemTryAgain: FileUploadItemTryAgain,
  ItemName: FileUploadItemName,
  ItemMeta: FileUploadItemMeta,
  ItemMetaSep: FileUploadItemMetaSep,
  ItemActions: FileUploadItemActions,
  ItemFooter: FileUploadItemFooter,
  ItemProgress: FileUploadItemProgress,
};
