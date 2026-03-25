import * as React from "react";

import { Hint } from "@/components/hint/Hint";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { FileUploadSize, HintSize } from "@/internal/states";

import styles from "./FileUpload.module.css";

export type { FileUploadSize };

export type FileUploadFormatBadgeColor =
  | "gray"
  | "red"
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "sky"
  | "yellow";

export type FileUploadItemVariant = "default" | "error";

/** `dashed` — дефолтная зона; `solid` — как в модалках Align (сплошная обводка, фон canvas → elevated при hover). */
export type FileUploadAppearance = "dashed" | "solid";

// ─── Drop zone slots (как AlignUI FileUpload.Icon / Title / Button) ─────────

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
  /** `muted` — как `text-sub-600` в Align (строка подсказки в модалке). */
  tone?: "default" | "muted";
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
    <Hint.Root size={controlSize as HintSize} className={className} {...rest}>
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

/** Кнопка «browse» внутри заголовка модалки (primary + underline, не открывает picker по клику сама по себе — навесьте `onClick`). */
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

/** Обёртка для модалок: `pointer-events: none` + колонка; вложенные кнопки/ссылки с `pointer-events: auto`. */
export type FileUploadDropBodyProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadDropBody({ className, children, ...rest }: FileUploadDropBodyProps) {
  return (
    <div className={cx(styles.dropBody, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadDropBody.displayName = "FileUpload.DropBody";

/** Ряд чипов «My Device / Dropbox» — `pointer-events: auto`. */
export type FileUploadActionsRowProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadActionsRow({ className, children, ...rest }: FileUploadActionsRowProps) {
  return (
    <div className={cx(styles.actionsRow, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadActionsRow.displayName = "FileUpload.ActionsRow";

/** Кнопка-источник внутри `Root` — останавливает всплытие к `label`, не открывает файловый диалог. */
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

// ─── File row (блоки 01 / списки загрузки) ───────────────────────────────────

export type FileUploadFormatBadgeProps = {
  format: string;
  color?: FileUploadFormatBadgeColor;
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
  variant?: FileUploadItemVariant;
  /** Типографика, отступы, бейдж формата, прогресс и иконки статуса — из того же яруса, что контролы. */
  size?: FileUploadSize;
};

function FileUploadItem({
  className,
  variant = "default",
  size = "m",
  ...rest
}: FileUploadItemProps) {
  return (
    <div
      className={cx(styles.item, className)}
      {...toDataAttributes({ variant, size })}
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

/** Вертикальный стек внутри `ItemMain` (колонка ошибки: текст + «Try again»). */
export type FileUploadItemStackProps = React.HTMLAttributes<HTMLDivElement>;

function FileUploadItemStack({ className, children, ...rest }: FileUploadItemStackProps) {
  return (
    <div className={cx(styles.itemStack, className)} {...rest}>
      {children}
    </div>
  );
}
FileUploadItemStack.displayName = "FileUpload.ItemStack";

/** Группа имени файла + мета-строки (`space-y-1`). */
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
      {children ?? (value !== undefined ? <ProgressBar.Root value={value} max={max} /> : null)}
    </div>
  );
}
FileUploadItemProgress.displayName = "FileUpload.ItemProgress";

// ─── Root ────────────────────────────────────────────────────────────────────

export type FileUploadRootProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children"> & {
  size?: FileUploadSize;
  appearance?: FileUploadAppearance;
  /** Доступ к скрытому input (программный клик из модалки и т.п.). */
  inputRef?: React.Ref<HTMLInputElement>;
  accept?: string;
  multiple?: boolean;
  /** Блокирует выбор файлов и drag-and-drop. */
  disabled?: boolean;
  onFilesChange?: (files: File[]) => void;
  children?: React.ReactNode;
};

const FileUploadRoot = React.forwardRef<HTMLLabelElement, FileUploadRootProps>(
  (
    {
      size = "m",
      appearance = "dashed",
      inputRef: inputRefProp,
      accept,
      multiple,
      disabled,
      onFilesChange,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const mergeInputRef = useMergedRefs(inputRefProp);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      const files = list ? Array.from(list) : [];
      onFilesChange?.(files);
      e.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
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
        const files = Array.from(e.dataTransfer.files);
        onFilesChange?.(files);
      }
    };

    const defaultBody = (
      <div className={styles.inner}>
        <FileUploadIcon>
          <Icon name="action.upload" size={size} tone="subtle" />
        </FileUploadIcon>
        <div className={styles.copy}>
          <FileUploadTitle>{"Choose a file or drag & drop it here."}</FileUploadTitle>
          <FileUploadHint>JPEG, PNG, PDF, MP4 up to 50 MB.</FileUploadHint>
        </div>
        <FileUploadBrowseLabel>Browse file</FileUploadBrowseLabel>
      </div>
    );

    return (
      <label
        ref={ref}
        {...rest}
        className={cx(styles.root, className)}
        {...toDataAttributes({ size, appearance })}
        data-dragover={isDragOver ? true : undefined}
        data-disabled={disabled ? true : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={mergeInputRef}
          type="file"
          className={styles.input}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          aria-disabled={disabled || undefined}
        />
        <ControlSizeProvider value={size}>{children ?? defaultBody}</ControlSizeProvider>
      </label>
    );
  },
);

FileUploadRoot.displayName = "FileUploadRoot";

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
