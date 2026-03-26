import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Modal, type ModalPanelProps, type ModalRootProps } from "@/components/modal/Modal";
import modalShellStyles from "@/components/modal/Modal.module.css";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import scrollContainerStyles from "@/components/scroll-container/ScrollContainer.module.css";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
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

// ─── Context ─────────────────────────────────────────────────────────────────

type CommandMenuContextValue = {
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

function CommandMenuRootProvider({ children }: { children: React.ReactNode }) {
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
    [search, listboxId, activeId, registerItem, visibleIds, itemGet, moveActive, activateSelected],
  );

  return <CommandMenuProvider value={value}>{children}</CommandMenuProvider>;
}

// ─── Dialog ──────────────────────────────────────────────────────────────────

export type CommandMenuDialogProps = Omit<ModalRootProps, "children"> &
  Pick<
    ModalPanelProps,
    "children" | "className" | "overlayClassName" | "aria-labelledby" | "aria-describedby"
  > & {
    /** Дополнительный класс для панели (совмещается с `className` панели). */
    contentClassName?: string;
  };

function CommandMenuDialog({
  children,
  overlayClassName,
  className,
  contentClassName,
  open,
  defaultOpen,
  onOpenChange,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: CommandMenuDialogProps) {
  return (
    <Modal.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      closeOnEscape={closeOnEscape}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <Modal.Panel
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        className={cx(styles.dialogContent, styles.root, contentClassName, className)}
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
        <CommandMenuRootProvider>{children}</CommandMenuRootProvider>
      </Modal.Panel>
    </Modal.Root>
  );
}

function CommandMenuDialogTitle({ className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx(modalShellStyles.title, className)} {...rest} />;
}

function CommandMenuDialogDescription({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx(modalShellStyles.description, className)} {...rest} />;
}

// ─── Input row + input ───────────────────────────────────────────────────────

export type CommandMenuInputRowProps = React.HTMLAttributes<HTMLDivElement> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** `compact` — ниже строка поиска, `comfortable` — выше. */
  density?: "compact" | "comfortable";
};

function CommandMenuInputRow({
  leading,
  trailing,
  children,
  className,
  density = "compact",
  ...rest
}: CommandMenuInputRowProps) {
  return (
    <div
      className={cx(
        styles.inputRow,
        density === "comfortable" && styles.inputRowComfortable,
        className,
      )}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </div>
  );
}

export type CommandMenuInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
>;

const CommandMenuInput = React.forwardRef<HTMLInputElement, CommandMenuInputProps>(
  ({ className, onKeyDown, value: valueProp, onChange, ...rest }, forwardedRef) => {
    const {
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

  return (
    <CommandMenuGroupContext.Provider value={groupId}>
      <div className={cx(styles.group, className)} hidden={hasVisible ? undefined : true} {...rest}>
        {heading !== undefined && heading !== null ? (
          typeof heading === "string" ? (
            <div className={styles.groupHeading}>{heading}</div>
          ) : (
            <div className={styles.groupHeadingRich}>{heading}</div>
          )
        ) : null}
        {children}
      </div>
    </CommandMenuGroupContext.Provider>
  );
}

// ─── Item ────────────────────────────────────────────────────────────────────

export type CommandMenuItemSize = "s" | "m";

export type CommandMenuItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onSelect"
> & {
  /** Текст для фильтрации; пустая строка — пункт всегда виден при любом запросе. */
  value: string;
  keywords?: string;
  size?: CommandMenuItemSize;
  onSelect?: () => void;
};

const CommandMenuItem = React.forwardRef<HTMLButtonElement, CommandMenuItemProps>(
  (
    {
      className,
      value,
      keywords = "",
      disabled,
      size = "s",
      onSelect,
      onClick,
      onPointerMove,
      ...rest
    },
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
          size,
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
  return <Comp className={cx(styles.itemIcon, className)} {...rest} />;
}

// ─── Секция тегов под строкой поиска ─────────────────────────────────────────

export type CommandMenuTagSectionProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuTagSection({ className, ...rest }: CommandMenuTagSectionProps) {
  return <div className={cx(styles.tagSection, className)} {...rest} />;
}

export type CommandMenuTagSectionLabelProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuTagSectionLabel({ className, ...rest }: CommandMenuTagSectionLabelProps) {
  return <div className={cx(styles.tagSectionLabel, className)} {...rest} />;
}

export type CommandMenuTagRowProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuTagRow({ className, ...rest }: CommandMenuTagRowProps) {
  return <div className={cx(styles.tagRow, className)} {...rest} />;
}

// ─── Footer ──────────────────────────────────────────────────────────────────

export type CommandMenuFooterProps = React.HTMLAttributes<HTMLDivElement>;

function CommandMenuFooter({ className, ...rest }: CommandMenuFooterProps) {
  return <div className={cx(styles.footer, className)} {...rest} />;
}

export type CommandMenuFooterKeyBoxProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> & {
  /** На футере с `footerMuted` — бейдж `lighter`, иначе `stroke` (контур). */
  tone?: "default" | "muted";
};

const CommandMenuFooterKeyBox = React.forwardRef<HTMLDivElement, CommandMenuFooterKeyBoxProps>(
  ({ className, children, tone = "default", ...rest }, ref) => {
    const variant = tone === "muted" ? "lighter" : "stroke";
    return (
      <Badge.Root
        ref={ref}
        variant={variant}
        color="gray"
        size="s"
        className={cx(styles.footerKeyBadge, className)}
        {...rest}
      >
        <Badge.Icon>{children}</Badge.Icon>
      </Badge.Root>
    );
  },
);

CommandMenuFooterKeyBox.displayName = "CommandMenu.FooterKeyBox";

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
  TagSection: CommandMenuTagSection,
  TagSectionLabel: CommandMenuTagSectionLabel,
  TagRow: CommandMenuTagRow,
  Footer: CommandMenuFooter,
  FooterKeyBox: CommandMenuFooterKeyBox,
};
