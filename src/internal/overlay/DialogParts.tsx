/**
 * The dialog of Modal, Drawer and Sheet: one root state, one panel mechanic (`DialogPanel`: the
 * portal, the scrim and the panel as siblings, the modal layer, the swipe of a sheet, the shell
 * context) and the shared header / body / footer parts. Not exported from the package root:
 * consumers use them as `Modal.*`, `Drawer.*` and `Sheet.*`.
 */
import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { COMPACT_QUERY } from "@/hooks/breakpoints";
import { useResizeEffect } from "@/hooks/useElementSize";
import { useEnterConfirm } from "@/hooks/useEnterConfirm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useModalLayer } from "@/hooks/useModalLayer";
import { readCssLengthPx } from "@/hooks/usePosition";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { useSwipeDismiss } from "@/hooks/useSwipeDismiss";
import { Icon } from "@/icons";
import { BlockStackContext } from "@/internal/blockStack";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import hairline from "@/internal/hairline.module.css";
import { hasContent } from "@/internal/hasContent";
import { iconBoxStyles } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { useMediaSlotHost } from "@/internal/mediaSlot";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import { usePartPresence } from "@/internal/partPresence";
import { splitParts } from "@/internal/parts";
import { useSwapIn } from "@/internal/RegionSwap";
import { RowCells } from "@/internal/rowCells";
import sheetStyles from "@/internal/sheet.module.css";
import { Slot, type SlotPartProps } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";

import styles from "./DialogParts.module.css";
import { SheetHandle } from "./FloatingPanel";
import type { FocusStart } from "./focus";
import { LayerProvider } from "./layerStack";
import { useOpenState } from "./useOpenState";

// ─── Root state (Modal.Root, Drawer.Root, Sheet.Root) ────────────────────────

/** System strings of a dialog: its close button and the built-in «discard changes?» confirm. */
export type DialogLabels = {
  /** `aria-label` of the header close button. */
  close: string;
  /** Title of the confirm a dismiss of a `dirty` dialog opens. */
  discardTitle: string;
  /** Its description. */
  discardDescription: string;
  /** Its confirm button: close and lose the changes. */
  discardConfirm: string;
  /** Its cancel button: back to the form. */
  discardCancel: string;
};

export const DIALOG_LABELS: DialogLabels = {
  close: "Закрыть",
  discardTitle: "Не сохранять изменения?",
  discardDescription: "Изменения в форме пропадут.",
  discardConfirm: "Не сохранять",
  discardCancel: "Продолжить",
};

export type DialogRootOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  labels?: Partial<DialogLabels>;
  /** Modal only: Enter clicks `Modal.Confirm`. */
  confirmOnEnter?: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
};

/** What a `Guard` inside the content holds the dialog to. */
type DialogGuardState = {
  /** A request runs: no way to dismiss; the close button is disabled. */
  busy: boolean;
  /** Unsaved changes: a dismiss asks first. */
  dirty: boolean;
};

const NO_GUARD: DialogGuardState = { busy: false, dirty: false };

type DialogRootState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /**
   * A person dismisses the dialog (Escape, scrim, swipe, the close button, `Close`): ignored while
   * `busy`, asks «discard changes?» while `dirty`, else closes. `setOpen(false)` from code is never
   * guarded.
   */
  requestClose: () => void;
  busy: boolean;
  dirty: boolean;
  setGuard: (guard: DialogGuardState) => void;
  /** The «discard changes?» confirm is open. */
  confirmingClose: boolean;
  setConfirmingClose: (open: boolean) => void;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  labels: DialogLabels;
  confirmOnEnter: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
};

const [DialogRootProvider, useDialogRootContext] =
  createComponentContext<DialogRootState>("Modal / Drawer / Sheet");

export { DialogRootProvider };

/**
 * State of Modal.Root / Drawer.Root / Sheet.Root: open (controlled or not), the dismiss policy, the
 * labels and the guard.
 */
export function useDialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  labels: labelsProp,
  confirmOnEnter = false,
  onEnterConfirm,
}: DialogRootOptions): DialogRootState {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  const labels = useLabels(DIALOG_LABELS, labelsProp);
  const [guard, setGuardState] = React.useState<DialogGuardState>(NO_GUARD);
  const [confirmingClose, setConfirmingClose] = React.useState(false);
  // A closed dialog has no pending question.
  if (!isOpen && confirmingClose) setConfirmingClose(false);

  const guardRef = React.useRef(guard);
  guardRef.current = guard;
  const setGuard = React.useCallback((next: DialogGuardState) => {
    setGuardState((current) =>
      current.busy === next.busy && current.dirty === next.dirty ? current : next,
    );
  }, []);
  const requestClose = React.useCallback(() => {
    if (guardRef.current.busy) return;
    if (guardRef.current.dirty) setConfirmingClose(true);
    else setOpen(false);
  }, [setOpen]);

  return React.useMemo(
    () => ({
      open: isOpen,
      setOpen,
      requestClose,
      busy: guard.busy,
      dirty: guard.dirty,
      setGuard,
      confirmingClose,
      setConfirmingClose,
      closeOnEscape,
      closeOnOutsideClick,
      labels,
      confirmOnEnter,
      onEnterConfirm,
    }),
    [
      isOpen,
      setOpen,
      requestClose,
      guard,
      setGuard,
      confirmingClose,
      closeOnEscape,
      closeOnOutsideClick,
      labels,
      confirmOnEnter,
      onEnterConfirm,
    ],
  );
}

/**
 * Registers a guard from inside the content (`Modal.Guard`, `Drawer.Guard`, `Sheet.Guard`,
 * ConfirmDialog while it runs); it is lifted when the part unmounts.
 */
export function useDialogGuard({ busy, dirty }: DialogGuardState): DialogRootState {
  const root = useDialogRootContext("Guard");
  const { setGuard } = root;
  React.useLayoutEffect(() => setGuard({ busy, dirty }), [busy, dirty, setGuard]);
  React.useLayoutEffect(() => () => setGuard(NO_GUARD), [setGuard]);
  return root;
}

// ─── Panel (Modal.Content, Drawer.Content, Sheet.Content) ────────────────────

/** Footer actions: `fill` — equal-width buttons in one row; `end` — auto-width, right-aligned. */
type DialogFooterLayout = "fill" | "end";

/**
 * When the panel is a bottom sheet that swipes down to close: `never` (Drawer, a Modal near the
 * top), `compact` (a centred Modal on a viewport below 640px), `always` (Sheet).
 */
type DialogSwipe = "never" | "compact" | "always";

/**
 * Which dialog the panel is: it picks the side padding of the zones (`--prime-<kind>-padding`) and
 * the enter / exit motion while the panel is not a bottom sheet (a drawer slides from its side).
 */
type DialogKind = "modal" | "drawer" | "sheet";

type DialogPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  kind: DialogKind;
  /** The component's own panel class: its geometry and width tiers. */
  panelClassName: string;
  swipe: DialogSwipe;
  footerLayout: DialogFooterLayout;
  /** Portal target. Default `document.body`. */
  container?: HTMLElement | null;
  /** Class on the full-screen scrim. */
  overlayClassName?: string;
  /** Enter clicks the action in `Confirm` (Modal: per the Root's `confirmOnEnter`). */
  enterConfirm?: boolean;
  /** The tier of the controls inside (Modal: `m`); without it they keep the surrounding tier. */
  controlSize?: ControlSize;
  /** Where focus lands on open (`useModalLayer`): the first tab stop, or the panel (Drawer). */
  focusStart?: FocusStart;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The content of a closing dialog: while the exit motion plays it keeps showing the last children
 * it had open, so a record cleared together with `open` does not empty the panel mid-motion.
 */
function useExitSnapshot<T>(open: boolean, children: T): T {
  const last = React.useRef(children);
  if (open) last.current = children;
  return open ? children : last.current;
}

/**
 * The panel of a dialog: portaled while open and during its exit motion (showing the children it
 * had open), the scrim and the `role="dialog"` panel side by side, the modal layer (Escape and the
 * scrim ask the Root to close through its guard; focus returns to the opener, foundation §8), and
 * on a bottom sheet the grab handle and the swipe down — a guarded swipe asks first.
 */
export function DialogPanel({ container, children, ...props }: DialogPanelProps) {
  const { open } = useDialogRootContext("Content");
  const presence = usePresence(open, { exitDuration: "base" });
  const shown = useExitSnapshot(open, children);
  if (!presence.mounted) return null;
  return (
    <Portal container={container}>
      <DialogPanelBody {...props} state={presence.state} onExitEnd={presence.onExitEnd}>
        {shown}
      </DialogPanelBody>
    </Portal>
  );
}

type DialogPanelBodyProps = Omit<DialogPanelProps, "container"> & {
  state: PresenceState;
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
};

/** Mounted inside the portal so the modal layer sees the attached node. */
function DialogPanelBody({
  kind,
  panelClassName,
  swipe: swipePolicy,
  footerLayout,
  overlayClassName,
  enterConfirm = false,
  controlSize,
  focusStart,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  state,
  onExitEnd,
  onPointerDown,
  ref,
  ...rest
}: DialogPanelBodyProps) {
  const root = useDialogRootContext("Content");
  const confirmRef = React.useRef<HTMLElement | null>(null);
  const scrimRef = React.useRef<HTMLDivElement>(null);
  const { ref: layerRef, layer } = useModalLayer<HTMLDivElement>({
    open: root.open,
    closeOnEscape: root.closeOnEscape,
    closeOnOutsideClick: root.closeOnOutsideClick,
    onDismiss: root.requestClose,
    focusStart,
  });
  const panelRef = useMergedRefs(layerRef, ref);
  const compact = useMediaQuery(COMPACT_QUERY, swipePolicy === "compact");
  const sheet = swipePolicy === "always" || (swipePolicy === "compact" && compact);
  // Swiping down is a dismiss from outside the content, like a scrim click: it follows
  // `closeOnOutsideClick` and the guard (busy holds the panel, dirty asks first).
  const swipe = useSwipeDismiss({
    enabled: sheet && root.closeOnOutsideClick,
    guard: root.busy ? "busy" : root.dirty ? "dirty" : null,
    onDismiss: root.requestClose,
    scrimRef,
  });

  const shell = useDialogShellValue({
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onClose: root.requestClose,
    closeLabel: root.labels.close,
    busy: root.busy,
    footerLayout,
    confirmRef,
  });

  useEnterConfirm({
    enabled: enterConfirm && root.open && root.confirmOnEnter,
    containerRef: layerRef,
    onEnterConfirm: root.onEnterConfirm,
    confirmRef,
  });

  const content = (
    <DialogShellProvider value={shell.value}>
      <LayerProvider value={layer}>
        {/* A dialog opened from another one's footer starts outside any footer. */}
        <DialogFooterContext.Provider value={false}>
          <SurfaceDepthProvider value="floating">{children}</SurfaceDepthProvider>
        </DialogFooterContext.Provider>
      </LayerProvider>
    </DialogShellProvider>
  );

  return (
    <div className={styles.root}>
      <div
        ref={scrimRef}
        role="presentation"
        className={cx(sheetStyles.scrim, overlayMotion.scrim, overlayClassName)}
        data-state={state}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cx(
          styles.shell,
          panelClassName,
          sheet
            ? cx(sheetStyles.surface, sheetStyles.swipeY, overlayMotion.sheet)
            : overlayMotion[kind === "drawer" ? "drawer" : "dialog"],
          className,
        )}
        data-kind={kind}
        data-state={state}
        data-depth="floating"
        data-sheet={sheet ? "" : undefined}
        onAnimationEnd={onExitEnd}
        {...shell.aria}
        {...swipe.panelProps}
        {...rest}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          swipe.onPointerDown(event);
        }}
      >
        <SheetHandle swipe={swipe} />
        {controlSize ? (
          <ControlSizeProvider value={controlSize}>{content}</ControlSizeProvider>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

// ─── Shell context (ids, close, footer layout) ───────────────────────────────

type DialogShellContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  /** The header has a line under the title: `Badges` or `Description`. */
  multiline: boolean;
  registerTitle: (present: boolean) => void;
  registerDescription: (present: boolean) => void;
  registerBadges: (present: boolean) => void;
  onClose: () => void;
  closeLabel: string;
  /** The guard is busy: the close button stays in place, disabled. */
  busy: boolean;
  footerLayout: DialogFooterLayout;
  /** Enter-confirm target (Modal only). */
  confirmRef: React.RefObject<HTMLElement | null>;
};

const DialogShellContext = React.createContext<DialogShellContextValue | null>(null);

function useDialogShell(part: string): DialogShellContextValue {
  const value = React.useContext(DialogShellContext);
  if (value === null) {
    throw new Error(
      `[prime-ui-kit] ${part} must be used inside Modal.Content, Drawer.Content or Sheet.Content.`,
    );
  }
  return value;
}

type UseDialogShellOptions = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  onClose: () => void;
  closeLabel: string;
  busy: boolean;
  footerLayout: DialogFooterLayout;
  confirmRef: React.RefObject<HTMLElement | null>;
};

/** Builds the shell context and the resolved `aria-*` for the `role="dialog"` element. */
function useDialogShellValue({
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  onClose,
  closeLabel,
  busy,
  footerLayout,
  confirmRef,
}: UseDialogShellOptions) {
  const internalTitleId = React.useId();
  const internalDescriptionId = React.useId();
  const titleId = ariaLabelledBy ?? internalTitleId;
  const descriptionId = ariaDescribedBy ?? internalDescriptionId;

  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const [hasBadges, setHasBadges] = React.useState(false);
  const multiline = hasDescription || hasBadges;

  const value = React.useMemo<DialogShellContextValue>(
    () => ({
      titleId,
      descriptionId,
      hasDescription,
      multiline,
      registerTitle: setHasTitle,
      registerDescription: setHasDescription,
      registerBadges: setHasBadges,
      onClose,
      closeLabel,
      busy,
      footerLayout,
      confirmRef,
    }),
    [
      titleId,
      descriptionId,
      hasDescription,
      multiline,
      onClose,
      closeLabel,
      busy,
      footerLayout,
      confirmRef,
    ],
  );

  const aria = {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy ?? (hasTitle && !ariaLabel ? titleId : undefined),
    "aria-describedby": ariaDescribedBy ?? (hasDescription ? descriptionId : undefined),
  };

  return { value, aria };
}

function DialogShellProvider({
  value,
  children,
}: {
  value: DialogShellContextValue;
  children: React.ReactNode;
}) {
  return <DialogShellContext.Provider value={value}>{children}</DialogShellContext.Provider>;
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

export type DialogIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  tone?: Tone;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The leading mark: a glyph on the tone tile, or the record's picture (an `Avatar.Root` or a
 * `Thumbnail.Root` anywhere inside, internal/mediaSlot) with no tile, at the tile's 40 box.
 */
export function DialogIcon({ tone = "neutral", children, className, ...rest }: DialogIconProps) {
  const { media, provide } = useMediaSlotHost();
  return (
    <span
      {...rest}
      className={cx(media ? undefined : iconBoxStyles.tile, styles.icon, className)}
      data-tone={media ? undefined : tone}
      data-media={media ? true : undefined}
      aria-hidden="true"
    >
      {provide(children)}
    </span>
  );
}
DialogIcon.displayName = "Dialog.Icon";

// ─── Title / Description / Badges ────────────────────────────────────────────

/**
 * A line of a record header cut with an ellipsis tells its whole text on hover (`title`), only
 * while it is cut and only when the consumer gave no `title` of its own; assistive tech always
 * reads the whole text (the dialog's name and description).
 */
function useCutLineTitle<T extends HTMLElement>(ref: React.RefObject<T | null>, own: unknown) {
  const sync = React.useCallback(() => {
    const line = ref.current;
    if (!line || own !== undefined) return;
    if (line.scrollWidth > line.clientWidth + 1) line.title = line.textContent ?? "";
    else line.removeAttribute("title");
  }, [ref, own]);
  React.useLayoutEffect(sync);
  useResizeEffect(ref, sync);
}

export type DialogTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id"> & {
  loading?: boolean;
  number?: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * The dialog's name, line 1 of the header. A record's `number` stands muted after the name and is
 * part of it; in a record header the name ellipsizes, the number never does. While it loads
 * (`loading`: a record opened by a link knows only its id) a Skeleton holds the title line, so the
 * header never moves when the name arrives; the name then fades in under the same element.
 */
export function DialogTitle({
  loading = false,
  number,
  className,
  children,
  ...rest
}: DialogTitleProps) {
  const { titleId, registerTitle } = useDialogShell("Title");
  const swap = useSwapIn(loading ? "loading" : "data");
  const nameRef = React.useRef<HTMLSpanElement>(null);
  useCutLineTitle(nameRef, rest.title);
  React.useLayoutEffect(() => {
    registerTitle(true);
    return () => registerTitle(false);
  }, [registerTitle]);
  return (
    <h2
      {...rest}
      key={swap.key}
      id={titleId}
      aria-busy={loading || undefined}
      className={cx(textRole.titleM, styles.title, swap.className, className)}
    >
      {loading ? (
        <Skeleton size="l" className={styles.titleSkeleton} />
      ) : (
        <>
          <span ref={nameRef} className={styles.titleName}>
            {children}
          </span>
          {number !== undefined && number !== null ? (
            <>
              {" "}
              <span className={styles.titleNumber}>{number}</span>
            </>
          ) : null}
        </>
      )}
    </h2>
  );
}
DialogTitle.displayName = "Dialog.Title";

export type DialogBadgesProps = React.HTMLAttributes<HTMLDivElement> & {
  loading?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Line 3 of a record header, under the description, right over the body or the tab strip (the
 * header's grid places it there, whatever the JSX order): the record's working controls in one
 * row — first the pickers (the status, the assignee: a `Badge.Root` in a `Dropdown.Trigger`), then
 * the plain statuses. The kit sizes them
 * (chip tier `m`) and never wraps the row: what does not fit waits behind «+N» (`Badge.Group`
 * `overflow="count"`), whose tooltip lists it. While the record loads (`loading`) a Skeleton
 * holds the line, so the header never moves.
 */
export function DialogBadges({ loading = false, className, children, ...rest }: DialogBadgesProps) {
  const { registerBadges } = useDialogShell("Badges");
  const swap = useSwapIn(loading ? "loading" : "data");
  React.useLayoutEffect(() => {
    registerBadges(true);
    return () => registerBadges(false);
  }, [registerBadges]);
  if (loading) {
    return (
      <div
        {...rest}
        key={swap.key}
        aria-busy="true"
        className={cx(styles.badges, swap.className, className)}
      >
        <Skeleton shape="chip" size="m" className={styles.badgesSkeleton} />
      </div>
    );
  }
  return (
    <Badge.Group
      {...rest}
      key={swap.key}
      size="m"
      overflow="count"
      className={cx(styles.badges, swap.className, className)}
    >
      {children}
    </Badge.Group>
  );
}
DialogBadges.displayName = "Dialog.Badges";

export type DialogDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id"> & {
  loading?: boolean;
  ref?: React.Ref<HTMLParagraphElement>;
};

/**
 * Line 2, the text right under the title (the badges go under it in a record header): plain text,
 * no badges — a status is a `Badges` line of its own. In a record header it is one line cut with
 * an ellipsis
 * (the whole text in its `title` while cut); in a question dialog it wraps. While its data loads
 * (`loading`) it keeps its place with a Skeleton, so the header never moves when the data
 * arrives; the data then fades in under the same element.
 */
export function DialogDescription({
  loading = false,
  className,
  children,
  ref,
  ...rest
}: DialogDescriptionProps) {
  const { descriptionId, registerDescription } = useDialogShell("Description");
  const swap = useSwapIn(loading ? "loading" : "data");
  const lineRef = React.useRef<HTMLParagraphElement>(null);
  const mergedRef = useMergedRefs(lineRef, ref);
  useCutLineTitle(lineRef, rest.title);
  React.useLayoutEffect(() => {
    registerDescription(true);
    return () => registerDescription(false);
  }, [registerDescription]);
  return (
    <p
      {...rest}
      ref={mergedRef}
      key={swap.key}
      id={descriptionId}
      aria-busy={loading || undefined}
      className={cx(textRole.bodyS, styles.description, swap.className, className)}
    >
      {loading ? <Skeleton size="s" className={styles.descriptionSkeleton} /> : children}
    </p>
  );
}
DialogDescription.displayName = "Dialog.Description";

// ─── Header ───────────────────────────────────────────────────────────────────

export type DialogHeaderProps = React.HTMLAttributes<HTMLElement> & {
  showClose?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * Places the header's `Actions`: beside the title while the title keeps its minimum width (the grid
 * track of `.header:has(> .actions)`), under the title and the description when it would not — the
 * header then overflows its box. The trial runs on the DOM, between two layouts of one frame.
 */
function placeHeaderActions(header: HTMLElement): boolean {
  header.removeAttribute("data-actions-below");
  const actions = header.querySelector<HTMLElement>(`:scope > .${styles.actions}`);
  if (!actions) return false;
  // A cell closing up (`leaveInPlace`) is already gone: the place is decided by the row it leaves,
  // so a control that goes never sends the row under the title for a moment.
  const leaving = Array.from(actions.querySelectorAll<HTMLElement>(":scope > [data-leaving]"));
  for (const ghost of leaving) ghost.style.display = "none";
  const overflows = header.scrollWidth > header.clientWidth + 1;
  for (const ghost of leaving) ghost.style.display = "";
  if (overflows) header.setAttribute("data-actions-below", "");
  return overflows;
}

/**
 * Whether the header's `Actions` stand under the text: the row then starts at the text's start
 * edge, so its cells hold to their start edge; beside the title they hold to the end, by the ×.
 */
const HeaderActionsBelowContext = React.createContext(false);

/**
 * `[Icon] [Title + Description] [Actions] [close]` in one row. Layout is a CSS grid, so child
 * order does not matter; text children stack in the text column. When the row is too narrow for
 * the title beside the actions (a phone), the actions move under the text.
 */
export function DialogHeader({
  showClose = true,
  className,
  children,
  ref,
  ...rest
}: DialogHeaderProps) {
  const { onClose, closeLabel, busy, multiline } = useDialogShell("Header");
  const headerRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(headerRef, ref);
  const [below, setBelow] = React.useState(false);
  const place = React.useCallback(() => {
    if (headerRef.current) setBelow(placeHeaderActions(headerRef.current));
  }, []);
  React.useLayoutEffect(place);
  useResizeEffect(headerRef, place, { children: true });

  return (
    <header
      ref={mergedRef}
      className={cx(hairline.bottom, styles.header, className)}
      data-multiline={multiline ? "true" : undefined}
      {...rest}
    >
      <HeaderActionsBelowContext value={below}>{children}</HeaderActionsBelowContext>
      {showClose ? (
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="button"
          size="s"
          aria-label={closeLabel}
          className={styles.close}
          disabled={busy}
          onClick={onClose}
        >
          <Button.Icon>
            <Icon name="action.close" tone="secondary" />
          </Button.Icon>
        </Button.Root>
      ) : null}
    </header>
  );
}
DialogHeader.displayName = "Dialog.Header";

// ─── Actions (header) ─────────────────────────────────────────────────────────

export type DialogActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The footer around a part: there `Actions` is the footer's start group. */
const DialogFooterContext = React.createContext(false);

/**
 * The controls at the end of the header, before the close button: first one switcher that applies
 * to the whole open tab (a `SegmentedControl`, a `Datepicker` period), then the buttons — ghost icon
 * buttons (each named, with a Tooltip) and a ⋯ Dropdown — never a status, which belongs to the
 * `Badges`. They take tier `s`, the close button's, and sit on the title's line. Each child
 * stands in a cell held to the row's edge (`RowCells`; the end beside the title, the start under
 * it): another control in the same place (the language on one tab, the period on another)
 * cross-fades in its cell while its width glides, and a control shown only on some tabs rises in
 * and closes up — beside the title the ⋯ and × never move.
 * In the footer it is the start group — an action apart from the main pair («Удалить», «Выйти») —
 * and its buttons keep the footer's tier.
 */
export function DialogActions({ className, children, ...rest }: DialogActionsProps) {
  useDialogShell("Actions");
  const inFooter = React.useContext(DialogFooterContext);
  const below = React.useContext(HeaderActionsBelowContext);
  if (inFooter) {
    return (
      <div className={cx(styles.footerStart, className)} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <div className={cx(fieldTierClass, styles.actions, className)} data-size="s" {...rest}>
      <ControlSizeProvider value="s">
        <RowCells align={below ? "start" : "end"}>{children}</RowCells>
      </ControlSizeProvider>
    </div>
  );
}
DialogActions.displayName = "Dialog.Actions";

// ─── Body ─────────────────────────────────────────────────────────────────────

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The only scrolling zone; header and footer stay put. An open layer: its end never scrolls the page. */
export function DialogBody({ className, children, ...rest }: DialogBodyProps) {
  return (
    <ScrollContainer overscrollBehavior="contain" className={cx(styles.body, className)} {...rest}>
      {/* A tab panel inside stacks its blocks the section step apart, like the body's sections. */}
      <BlockStackContext value>{children}</BlockStackContext>
    </ScrollContainer>
  );
}
DialogBody.displayName = "Dialog.Body";

// ─── Section (inside the body) ───────────────────────────────────────────────

export type DialogSectionProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/**
 * How the parent of a section lays out its blocks: `step` — a column whose gap already is the
 * section step (a `Tabs.Panel` in the body, a grid of 32), so the section adds nothing; `gap` — a
 * flex or grid column with a smaller gap (the body, a form with the body's rhythm), so the section
 * adds only its extra air; `block` — plain flow (a wrapper div), so the section keeps the whole
 * distance itself.
 */
function flowOf(parent: HTMLElement): "step" | "gap" | "block" {
  const { display, rowGap } = getComputedStyle(parent);
  const gap = Number.parseFloat(rowGap);
  if (!/flex|grid/.test(display) || !(gap > 0)) return "block";
  const step = readCssLengthPx("--prime-space-8", TOKEN_DEFAULTS["--prime-space-8"]);
  return gap >= step ? "step" : "gap";
}

/**
 * A titled group of the dialog body — what `Page.Section` is to a page: an `<h3>` (title-s, one
 * level under the dialog's `<h2>` title) with an optional description and the dialog's `Actions`
 * at the end of the heading row, then the content 16 below. Sections stand further apart than the
 * plain blocks of the body.
 */
export function DialogSection({
  label,
  description,
  className,
  children,
  ref,
  ...rest
}: DialogSectionProps) {
  useDialogShell("Section");
  const headingId = React.useId();
  const sectionRef = React.useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(sectionRef, ref);
  React.useLayoutEffect(() => {
    const section = sectionRef.current;
    if (section?.parentElement) section.dataset.flow = flowOf(section.parentElement);
  });
  const { parts: actions, rest: content } = splitParts(children, DialogActions);
  return (
    <section
      aria-labelledby={headingId}
      {...rest}
      ref={mergedRef}
      className={cx(styles.section, className)}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeading}>
          <h3 id={headingId} className={cx(textRole.titleS, styles.sectionTitle)}>
            {label}
          </h3>
          {description ? (
            <p className={cx(textRole.bodyS, styles.sectionDescription)}>{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {content}
    </section>
  );
}
DialogSection.displayName = "Dialog.Section";

// ─── Footer ───────────────────────────────────────────────────────────────────

export type DialogFooterProps = React.HTMLAttributes<HTMLElement> & {
  layout?: DialogFooterLayout;
  ref?: React.Ref<HTMLElement>;
};

/**
 * Actions in DOM order, primary last; with nothing in it the footer is not drawn. Stacks full width when the dialog is narrower than 360px.
 * An `Actions` holds the start group (an action apart from the main pair) and a `Meta` the status
 * text, both at the start; the buttons then move as one row at the end: when the line runs short
 * the start goes above them first, so the buttons never split over two lines while there is room
 * for them in one. Stacked, the start comes first and the primary stays last.
 */
export function DialogFooter({ layout, className, children, ref, ...rest }: DialogFooterProps) {
  const { footerLayout } = useDialogShell("Footer");
  // The footer is there only while it holds something: a save that comes with a change enters
  // with its footer, and the footer closes up in place when its last action goes.
  const present = hasContent(children);
  const presence = usePartPresence<HTMLElement>({ present, axis: "block" });
  const mergedRef = useMergedRefs(presence.ref, ref);
  const { parts: start, rest: other } = splitParts(children, DialogActions);
  const { parts: meta, rest: actions } = splitParts(other, DialogMeta);
  if (!present) return null;
  return (
    <footer
      ref={mergedRef}
      className={cx(hairline.top, styles.footer, presence.className, className)}
      data-layout={layout ?? footerLayout}
      {...rest}
    >
      <DialogFooterContext.Provider value={true}>
        {start.length + meta.length > 0 ? (
          <>
            {start}
            {meta}
            <div className={styles.footerActions}>{actions}</div>
          </>
        ) : (
          children
        )}
      </DialogFooterContext.Provider>
    </footer>
  );
}
DialogFooter.displayName = "Dialog.Footer";

export type DialogMetaProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

/**
 * Short status text at the start of the footer («Есть несохранённые изменения», «Сохранено в
 * 14:02»): muted body-s; the buttons keep the end. Not part of the dialog's description.
 */
export function DialogMeta({ className, ...rest }: DialogMetaProps) {
  useDialogShell("Meta");
  return <p className={cx(textRole.bodyS, styles.meta, className)} {...rest} />;
}
DialogMeta.displayName = "Dialog.Meta";

// ─── Trigger / Close / Confirm (slots around one child) ──────────────────────

export type DialogTriggerProps = SlotPartProps;

/** Adds "open the dialog" to the child's click (unless the child prevents default). */
export function DialogTrigger({ children }: DialogTriggerProps) {
  const { setOpen } = useDialogRootContext("Trigger");
  return <Slot onClick={() => setOpen(true)}>{children}</Slot>;
}
DialogTrigger.displayName = "Dialog.Trigger";

export type DialogCloseProps = SlotPartProps;

/**
 * Adds "close the dialog" to the child's click (unless the child prevents default); the close
 * goes through the guard, and the child is `disabled` while the guard is busy.
 */
export function DialogClose({ children }: DialogCloseProps) {
  const { onClose, busy } = useDialogShell("Close");
  return (
    <Slot onClick={onClose} disabled={busy || undefined}>
      {children}
    </Slot>
  );
}
DialogClose.displayName = "Dialog.Close";

export type DialogConfirmProps = SlotPartProps;

/**
 * Marks the primary action as the Enter target (`confirmOnEnter`): Enter inside the dialog clicks
 * it. It adds no handler of its own; the child's `onClick` (or its `type="submit"`) is the action.
 */
export function DialogConfirm({ children }: DialogConfirmProps) {
  const { confirmRef } = useDialogShell("Confirm");
  return <Slot ref={confirmRef}>{children}</Slot>;
}
DialogConfirm.displayName = "Dialog.Confirm";
