/**
 * The dialog of Modal, Drawer and Sheet: one root state, one panel mechanic (`DialogPanel`: the
 * portal, the scrim and the panel as siblings, the modal layer, the swipe of a sheet, the shell
 * context) and the shared header / body / footer parts. Not exported from the package root:
 * consumers use them as `Modal.*`, `Drawer.*` and `Sheet.*`.
 */
import * as React from "react";

import { Avatar, type AvatarRootProps } from "@/components/avatar/Avatar";
import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { COMPACT_QUERY } from "@/hooks/breakpoints";
import { useEnterConfirm } from "@/hooks/useEnterConfirm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useModalLayer } from "@/hooks/useModalLayer";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { useSwipeDismiss } from "@/hooks/useSwipeDismiss";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import hairline from "@/internal/hairline.module.css";
import { iconBoxStyles } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import sheetStyles from "@/internal/sheet.module.css";
import { Slot, type SlotPartProps } from "@/internal/slot";
import type { ControlSize, Tone } from "@/internal/states";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";

import styles from "./DialogParts.module.css";
import { SheetHandle } from "./FloatingPanel";
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
        <SurfaceDepthProvider value="floating">{children}</SurfaceDepthProvider>
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
  registerTitle: (present: boolean) => void;
  registerDescription: (present: boolean) => void;
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

  const value = React.useMemo<DialogShellContextValue>(
    () => ({
      titleId,
      descriptionId,
      hasDescription,
      registerTitle: setHasTitle,
      registerDescription: setHasDescription,
      onClose,
      closeLabel,
      busy,
      footerLayout,
      confirmRef,
    }),
    [titleId, descriptionId, hasDescription, onClose, closeLabel, busy, footerLayout, confirmRef],
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
 * A person or an object stands for itself: a picture child needs no filled tile around it. An
 * avatar fills the 40px icon box (size `l`); a thumbnail keeps its `m` height (40) and its ratio.
 */
function mediaOf(children: React.ReactNode): React.ReactNode | null {
  if (!React.isValidElement(children)) return null;
  if (children.type === Avatar.Root) {
    return React.cloneElement(children as React.ReactElement<AvatarRootProps>, { size: "l" });
  }
  return children.type === Thumbnail.Root ? children : null;
}

export function DialogIcon({ tone = "neutral", children, className, ...rest }: DialogIconProps) {
  const media = mediaOf(children);
  return (
    <span
      {...rest}
      className={cx(media ? undefined : iconBoxStyles.tile, styles.icon, className)}
      data-tone={media ? undefined : tone}
      data-media={media ? true : undefined}
      aria-hidden="true"
    >
      {media ?? children}
    </span>
  );
}
DialogIcon.displayName = "Dialog.Icon";

// ─── Title / Description ──────────────────────────────────────────────────────

export type DialogTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id"> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

export function DialogTitle({ className, ...rest }: DialogTitleProps) {
  const { titleId, registerTitle } = useDialogShell("Title");
  React.useLayoutEffect(() => {
    registerTitle(true);
    return () => registerTitle(false);
  }, [registerTitle]);
  return <h2 id={titleId} className={cx(textRole.titleM, styles.title, className)} {...rest} />;
}
DialogTitle.displayName = "Dialog.Title";

export type DialogDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id"> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

export function DialogDescription({ className, ...rest }: DialogDescriptionProps) {
  const { descriptionId, registerDescription } = useDialogShell("Description");
  React.useLayoutEffect(() => {
    registerDescription(true);
    return () => registerDescription(false);
  }, [registerDescription]);
  return (
    <p id={descriptionId} className={cx(textRole.bodyS, styles.description, className)} {...rest} />
  );
}
DialogDescription.displayName = "Dialog.Description";

// ─── Header ───────────────────────────────────────────────────────────────────

export type DialogHeaderProps = React.HTMLAttributes<HTMLElement> & {
  showClose?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * `[Icon] [Title + Description] [Actions] [close]` in one row. Layout is a CSS grid, so child
 * order does not matter; text children stack in the text column.
 */
export function DialogHeader({
  showClose = true,
  className,
  children,
  ...rest
}: DialogHeaderProps) {
  const { onClose, closeLabel, busy, hasDescription } = useDialogShell("Header");

  return (
    <header
      className={cx(hairline.bottom, styles.header, className)}
      data-has-description={hasDescription ? "true" : undefined}
      {...rest}
    >
      {children}
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

/**
 * A row of controls at the end of the header, before the close button: a status Badge, a ⋯
 * Dropdown, an icon button. Controls inside take tier `s`, the close button's tier.
 */
export function DialogActions({ className, children, ...rest }: DialogActionsProps) {
  useDialogShell("Actions");
  return (
    <div className={cx(fieldTierClass, styles.actions, className)} data-size="s" {...rest}>
      <ControlSizeProvider value="s">{children}</ControlSizeProvider>
    </div>
  );
}
DialogActions.displayName = "Dialog.Actions";

// ─── Body ─────────────────────────────────────────────────────────────────────

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The only scrolling zone; header and footer stay put. */
export function DialogBody({ className, ...rest }: DialogBodyProps) {
  return <ScrollContainer className={cx(styles.body, className)} {...rest} />;
}
DialogBody.displayName = "Dialog.Body";

// ─── Footer ───────────────────────────────────────────────────────────────────

export type DialogFooterProps = React.HTMLAttributes<HTMLElement> & {
  layout?: DialogFooterLayout;
  ref?: React.Ref<HTMLElement>;
};

/** Actions in DOM order, primary last. Stacks full width when the dialog is narrower than 360px. */
export function DialogFooter({ layout, className, ...rest }: DialogFooterProps) {
  const { footerLayout } = useDialogShell("Footer");
  return (
    <footer
      className={cx(hairline.top, styles.footer, className)}
      data-layout={layout ?? footerLayout}
      {...rest}
    />
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
