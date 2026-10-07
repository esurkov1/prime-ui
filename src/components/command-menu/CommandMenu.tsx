import * as React from "react";

import modalShellStyles from "@/components/modal/DialogParts.module.css";
import { Modal, type ModalContentProps, type ModalRootProps } from "@/components/modal/Modal";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import scrollContainerStyles from "@/components/scroll-container/ScrollContainer.module.css";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Variant } from "@/internal/states";
import styles from "./CommandMenu.module.css";

// ─── Filtering & item registry ───────────────────────────────────────────────

type ItemEntry = {
  id: string;
  order: number;
  value: string;
  keywords: string;
  disabled: boolean;
  groupId: string;
  onSelectRef: React.MutableRefObject<(() => void) | undefined>;
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function matchesQuery(entry: ItemEntry, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  const hay = `${normalize(entry.value)} ${normalize(entry.keywords)}`;
  return hay.includes(q);
}

export type CommandMenuLabels = {
  /** Default placeholder and accessible name of `CommandMenu.Input`. */
  search: string;
  /** `CommandMenu.Empty`: nothing matches the query. */
  empty: string;
  /** Second line of `CommandMenu.Empty`. */
  emptyHint: string;
};

const COMMAND_MENU_LABELS: CommandMenuLabels = {
  search: "Поиск",
  empty: "Ничего не найдено",
  emptyHint: "Попробуйте изменить запрос",
};

// ─── Context ─────────────────────────────────────────────────────────────────

type CommandMenuContextValue = {
  labels: CommandMenuLabels;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  listboxId: string;
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  registerItem: (
    id: string,
    patch: Omit<ItemEntry, "id" | "order" | "onSelectRef"> & {
      onSelectRef: ItemEntry["onSelectRef"];
    },
  ) => () => void;
  visibleIds: string[];
  itemGet: (id: string) => ItemEntry | undefined;
  moveActive: (delta: number) => void;
  activateSelected: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const [CommandMenuProvider, useCommandMenuContext] =
  createComponentContext<CommandMenuContextValue>("CommandMenu");

const CommandMenuGroupContext = React.createContext<string>("");

function CommandMenuRootProvider({
  labels,
  children,
}: {
  labels: CommandMenuLabels;
  children: React.ReactNode;
}) {
  const listboxId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const itemsRef = React.useRef<Map<string, ItemEntry>>(new Map());
  const orderSeqRef = React.useRef(0);
  const orderMapRef = React.useRef<Map<string, number>>(new Map());
  const [version, bump] = React.useReducer((n: number) => n + 1, 0);

  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    orderSeqRef.current = 0;
    orderMapRef.current.clear();
  }, []);

  React.useEffect(() => {
    setSearch("");
    setActiveId(null);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  const registerItem = React.useCallback(
    (
      id: string,
      patch: Omit<ItemEntry, "id" | "order" | "onSelectRef"> & {
        onSelectRef: ItemEntry["onSelectRef"];
      },
    ) => {
      let order = orderMapRef.current.get(id);
      if (order === undefined) {
        order = orderSeqRef.current++;
        orderMapRef.current.set(id, order);
      }
      itemsRef.current.set(id, { ...patch, id, order });
      bump();
      return () => {
        itemsRef.current.delete(id);
        bump();
      };
    },
    [],
  );

  const visibleIds = React.useMemo(() => {
    void version;
    const list = [...itemsRef.current.values()].sort((a, b) => a.order - b.order);
    return list
      .filter((e) => matchesQuery(e, search))
      .filter((e) => !e.disabled)
      .map((e) => e.id);
  }, [search, version]);

  const itemGet = React.useCallback((id: string) => itemsRef.current.get(id), []);

  React.useLayoutEffect(() => {
    setActiveId((prev) => {
      if (visibleIds.length === 0) return null;
      if (prev && visibleIds.includes(prev)) return prev;
      return visibleIds[0] ?? null;
    });
  }, [visibleIds]);

  const moveActive = React.useCallback(
    (delta: number) => {
      if (visibleIds.length === 0) return;
      setActiveId((prev) => {
        const idx = prev ? visibleIds.indexOf(prev) : -1;
        const next = idx < 0 ? 0 : (idx + delta + visibleIds.length) % visibleIds.length;
        return visibleIds[next] ?? null;
      });
    },
    [visibleIds],
  );

  const activateSelected = React.useCallback(() => {
    if (!activeId) return;
    itemsRef.current.get(activeId)?.onSelectRef.current?.();
  }, [activeId]);

  const value = React.useMemo(
    () => ({
      labels,
      search,
      setSearch,
      listboxId,
      activeId,
      setActiveId,
      registerItem,
      visibleIds,
      itemGet,
      moveActive,
      activateSelected,
      inputRef,
    }),
    [
      labels,
      search,
      listboxId,
      activeId,
      registerItem,
      visibleIds,
      itemGet,
      moveActive,
      activateSelected,
    ],
  );

  return <CommandMenuProvider value={value}>{children}</CommandMenuProvider>;
}

// ─── Dialog ──────────────────────────────────────────────────────────────────

export type CommandMenuDialogProps = Pick<
  ModalRootProps,
  "open" | "defaultOpen" | "onOpenChange" | "closeOnEscape" | "closeOnOutsideClick"
> &
  Pick<
    ModalContentProps,
    | "children"
    | "className"
    | "overlayClassName"
    | "aria-label"
    | "aria-labelledby"
    | "aria-describedby"
  > & {
    /** Tier of the list rows and the search row: item height, text, icon. Default `m`. */
    size?: ControlSize;
    labels?: Partial<CommandMenuLabels>;
  };

function CommandMenuDialog({
  children,
  overlayClassName,
  className,
  open,
  defaultOpen,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  size = "m",
  labels: labelsProp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: CommandMenuDialogProps) {
  const labels = React.useMemo(() => ({ ...COMMAND_MENU_LABELS, ...labelsProp }), [labelsProp]);
  return (
    <Modal.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
    >
      <Modal.Content
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        className={cx(styles.dialogContent, styles.root, className)}
        overlayClassName={cx(
          scrollContainerStyles.root,
          scrollContainerStyles.vertical,
          scrollContainerStyles.flexItem,
          scrollContainerStyles.touch,
          scrollContainerStyles.overscrollContain,
          styles.dialogOverlay,
          overlayClassName,
        )}
      >
        {/* `display: contents`: carries the tier variables without breaking the panel's flex column. */}
        <div className={styles.tier} data-size={size}>
          <ControlSizeProvider value={size}>
            <CommandMenuRootProvider labels={labels}>{children}</CommandMenuRootProvider>
          </ControlSizeProvider>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}

function CommandMenuDialogTitle({ className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx(modalShellStyles.title, styles.dialogTitle, className)} {...rest} />;
}

function CommandMenuDialogDescription({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cx(modalShellStyles.description, styles.dialogDescription, className)}
      {...rest}
    />
  );
}

// ─── Input row + input ───────────────────────────────────────────────────────

export type CommandMenuInputRowProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Слот слева; по умолчанию — иконка поиска. `null` — без иконки. */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

/** Search row; its height follows the Dialog `size` (taller on `l` / `xl`). */
function CommandMenuInputRow({
  leading,
  trailing,
  children,
  className,
  ...rest
}: CommandMenuInputRowProps) {
  return (
    // The search field is the permanent focus of the palette: no ring (foundation §7).
    <div className={cx(styles.inputRow, className)} data-focus-ring="false" {...rest}>
      {leading === undefined ? <SearchGlyph className={styles.inputIcon} /> : leading}
      {children}
      {trailing}
    </div>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth={1.7}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export type CommandMenuInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  /** Called with the new query; native `onChange` still fires. */
  onValueChange?: (value: string) => void;
};

const CommandMenuInput = React.forwardRef<HTMLInputElement, CommandMenuInputProps>(
  (
    {
      className,
      onKeyDown,
      value: valueProp,
      onChange,
      onValueChange,
      placeholder,
      "aria-label": ariaLabel,
      ...rest
    },
    forwardedRef,
  ) => {
    const {
      labels,
      search,
      setSearch,
      listboxId,
      activeId,
      moveActive,
      activateSelected,
      inputRef,
      setActiveId,
      visibleIds,
    } = useCommandMenuContext();

    const isControlled = valueProp !== undefined;

    React.useEffect(() => {
      if (isControlled) {
        setSearch(valueProp !== undefined && valueProp !== null ? String(valueProp) : "");
      }
    }, [isControlled, valueProp, setSearch]);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef, inputRef],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
      if (!isControlled) {
        setSearch(e.target.value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveActive(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveActive(-1);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        if (visibleIds[0]) setActiveId(visibleIds[0]);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        const last = visibleIds[visibleIds.length - 1];
        if (last) setActiveId(last);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        activateSelected();
      }
    };

    return (
      <input
        {...rest}
        ref={setRefs}
        type="search"
        placeholder={placeholder ?? labels.search}
        aria-label={ariaLabel ?? (rest["aria-labelledby"] ? undefined : labels.search)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        role="combobox"
        aria-expanded="true"
        aria-controls={listboxId}
        aria-activedescendant={activeId ? `${activeId}-option` : undefined}
        className={cx(styles.input, className)}
        value={isControlled ? valueProp : search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

CommandMenuInput.displayName = "CommandMenu.Input";

// ─── List ────────────────────────────────────────────────────────────────────

export type CommandMenuListProps = React.HTMLAttributes<HTMLDivElement>;

const CommandMenuList = React.forwardRef<HTMLDivElement, CommandMenuListProps>(
  ({ className, children, ...rest }, ref) => {
    const { listboxId } = useCommandMenuContext();

    return (
      <ScrollContainer
        ref={ref}
        id={listboxId}
        role="listbox"
        aria-multiselectable={false}
        className={cx(styles.list, className)}
        {...rest}
      >
        {children}
      </ScrollContainer>
    );
  },
);

CommandMenuList.displayName = "CommandMenu.List";

// ─── Group ───────────────────────────────────────────────────────────────────

export type CommandMenuGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  heading?: React.ReactNode;
};

function CommandMenuGroup({ heading, className, children, ...rest }: CommandMenuGroupProps) {
  const groupId = React.useId();
  const { visibleIds, itemGet } = useCommandMenuContext();

  const hasVisible = visibleIds.some((id) => itemGet(id)?.groupId === groupId);
  const hasHeading = heading !== undefined && heading !== null;
  const headingId = `${groupId}-heading`;

  return (
    <CommandMenuGroupContext.Provider value={groupId}>
      {/* biome-ignore lint/a11y/useSemanticElements: role="group" внутри role="listbox"; <fieldset> там недопустим */}
      <div
        role="group"
        aria-labelledby={hasHeading ? headingId : undefined}
        className={cx(styles.group, className)}
        hidden={hasVisible ? undefined : true}
        {...rest}
      >
        {hasHeading ? (
          typeof heading === "string" ? (
            <div id={headingId} className={styles.groupHeading}>
              {heading}
            </div>
          ) : (
            <div id={headingId} className={styles.groupHeadingRich}>
              {heading}
            </div>
          )
        ) : null}
        {children}
      </div>
    </CommandMenuGroupContext.Provider>
  );
}

// ─── Item ────────────────────────────────────────────────────────────────────

export type CommandMenuItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onSelect"
> & {
  /** Text matched with `keywords`; with `""` the item shows only while the query is empty or `keywords` match. */
  value: string;
  keywords?: string;
  onSelect?: () => void;
};

const CommandMenuItem = React.forwardRef<HTMLButtonElement, CommandMenuItemProps>(
  (
    { className, value, keywords = "", disabled, onSelect, onClick, onPointerMove, ...rest },
    forwardedRef,
  ) => {
    const id = React.useId();
    const optionId = `${id}-option`;
    const groupId = React.useContext(CommandMenuGroupContext);
    const { registerItem, activeId, setActiveId, visibleIds } = useCommandMenuContext();
    const onSelectRef = React.useRef(onSelect);

    React.useEffect(() => {
      onSelectRef.current = onSelect;
    }, [onSelect]);

    React.useLayoutEffect(() => {
      return registerItem(id, {
        value,
        keywords,
        disabled: Boolean(disabled),
        groupId,
        onSelectRef,
      });
    }, [id, value, keywords, disabled, groupId, registerItem]);

    const filteredIn = visibleIds.includes(id);
    const selected = activeId === id;
    const listRef = React.useRef<HTMLButtonElement>(null);

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        listRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      if (selected && listRef.current) {
        listRef.current.scrollIntoView?.({ block: "nearest" });
      }
    }, [selected]);

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(e);
      if (e.defaultPrevented || disabled) return;
      if (filteredIn) setActiveId(id);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      if (!filteredIn) return;
      setActiveId(id);
      onSelectRef.current?.();
    };

    return (
      <button
        ref={setRefs}
        type="button"
        id={optionId}
        role="option"
        tabIndex={-1}
        aria-selected={selected}
        hidden={filteredIn ? undefined : true}
        disabled={disabled}
        className={cx(styles.item, className)}
        {...toDataAttributes({
          selected: selected ? true : undefined,
          disabled: disabled ? true : undefined,
        })}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        {...rest}
      />
    );
  },
);

CommandMenuItem.displayName = "CommandMenu.Item";

// ─── Item icon (polymorphic) ─────────────────────────────────────────────────

export type CommandMenuItemIconProps<T extends React.ElementType = "span"> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function CommandMenuItemIcon<T extends React.ElementType = "span">({
  as,
  className,
  ...rest
}: CommandMenuItemIconProps<T>) {
  const Comp = as ?? "span";
  return <Comp className={cx(styles.itemIcon, className)} aria-hidden {...rest} />;
}

// ─── Секция тегов под строкой поиска ─────────────────────────────────────────

export type CommandMenuBadgeSectionProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuBadgeSection({ className, ...rest }: CommandMenuBadgeSectionProps) {
  return <div className={cx(styles.badgeSection, className)} {...rest} />;
}

export type CommandMenuBadgeSectionLabelProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuBadgeSectionLabel({ className, ...rest }: CommandMenuBadgeSectionLabelProps) {
  return <div className={cx(styles.badgeSectionLabel, className)} {...rest} />;
}

export type CommandMenuBadgeRowProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuBadgeRow({ className, ...rest }: CommandMenuBadgeRowProps) {
  return <div className={cx(styles.badgeRow, className)} {...rest} />;
}

// ─── Footer ──────────────────────────────────────────────────────────────────

export type CommandMenuFooterProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuFooter({ className, ...rest }: CommandMenuFooterProps) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}

export type CommandMenuFooterKeyBoxProps = Omit<React.HTMLAttributes<HTMLElement>, "color"> & {
  /** `soft` — клавиша на мягкой подложке (по умолчанию), `ghost` — только текст. */
  variant?: Extract<Variant, "soft" | "ghost">;
};

/** Клавиша в подсказках футера (стиль Kbd). */
const CommandMenuFooterKeyBox = React.forwardRef<HTMLElement, CommandMenuFooterKeyBoxProps>(
  ({ className, variant = "soft", ...rest }, ref) => (
    <kbd
      ref={ref}
      className={cx(styles.key, className)}
      {...toDataAttributes({ variant })}
      {...rest}
    />
  ),
);

CommandMenuFooterKeyBox.displayName = "CommandMenu.FooterKeyBox";

export type CommandMenuFooterHintProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Клавиши (строки или иконки), каждая — отдельный `FooterKeyBox`. */
  keys: React.ReactNode[];
};

/** Подсказка футера: клавиши + подпись («↑ ↓ Навигация»). */
function CommandMenuFooterHint({ keys, children, className, ...rest }: CommandMenuFooterHintProps) {
  return (
    <span className={cx(styles.footerHintItem, className)} {...rest}>
      {keys.map((k, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: статичный список клавиш
        <CommandMenuFooterKeyBox key={i}>{k}</CommandMenuFooterKeyBox>
      ))}
      <span className={styles.footerHint}>{children}</span>
    </span>
  );
}

// ─── Empty ───────────────────────────────────────────────────────────────────

export type CommandMenuEmptyProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Пустое состояние: показывается, только когда по запросу нет ни одного пункта.
 * Текст — `labels.empty` / `labels.emptyHint` у Dialog; `children` — действие под ним.
 */
function CommandMenuEmpty({ children, className, ...rest }: CommandMenuEmptyProps) {
  const { visibleIds, labels } = useCommandMenuContext();
  if (visibleIds.length > 0) return null;
  return (
    <div role="status" className={cx(styles.empty, className)} {...rest}>
      <span className={styles.emptyText}>{labels.empty}</span>
      {labels.emptyHint ? <span className={styles.emptyHint}>{labels.emptyHint}</span> : null}
      {children}
    </div>
  );
}

// ─── Item parts ──────────────────────────────────────────────────────────────

export type CommandMenuItemShortcutProps = React.HTMLAttributes<HTMLElement>;

/** Сочетание клавиш справа в пункте (приглушённый Kbd). */
function CommandMenuItemShortcut({ className, ...rest }: CommandMenuItemShortcutProps) {
  return <kbd className={cx(styles.itemShortcut, className)} {...rest} />;
}

export type CommandMenuItemTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Вторая строка (путь, описание) — caption, muted. */
  description?: React.ReactNode;
};

/** Текст пункта: заголовок с многоточием + необязательное описание. */
function CommandMenuItemText({
  description,
  children,
  className,
  ...rest
}: CommandMenuItemTextProps) {
  return (
    <span className={cx(styles.itemText, className)} {...rest}>
      <span className={styles.itemLabel}>{children}</span>
      {description ? <span className={styles.itemDescription}>{description}</span> : null}
    </span>
  );
}

// ─── Namespace ───────────────────────────────────────────────────────────────

export const CommandMenu = {
  Dialog: CommandMenuDialog,
  DialogTitle: CommandMenuDialogTitle,
  DialogDescription: CommandMenuDialogDescription,
  InputRow: CommandMenuInputRow,
  Input: CommandMenuInput,
  List: CommandMenuList,
  Group: CommandMenuGroup,
  Item: CommandMenuItem,
  ItemIcon: CommandMenuItemIcon,
  ItemText: CommandMenuItemText,
  ItemShortcut: CommandMenuItemShortcut,
  Empty: CommandMenuEmpty,
  BadgeSection: CommandMenuBadgeSection,
  BadgeSectionLabel: CommandMenuBadgeSectionLabel,
  BadgeRow: CommandMenuBadgeRow,
  Footer: CommandMenuFooter,
  FooterKeyBox: CommandMenuFooterKeyBox,
  FooterHint: CommandMenuFooterHint,
};
