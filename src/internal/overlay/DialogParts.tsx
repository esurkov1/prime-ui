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
import { ControlSizeProvider, useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import { hasContent } from "@/internal/hasContent";
import {
  HeaderLineContent,
  HeaderRowContent,
  headerRowStyles,
  SectionTitle,
  useTitleFloor,
} from "@/internal/headerRow";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { useMediaSlotHost } from "@/internal/mediaSlot";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import { usePartPresence } from "@/internal/partPresence";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import { useSwapIn } from "@/internal/RegionSwap";
import { RowCells } from "@/internal/rowCells";
import sheetStyles from "@/internal/sheet.module.css";
import { Slot, type SlotPartProps } from "@/internal/slot";
import { type ControlSize, cardMarkSize, type Tone, tierMappings } from "@/internal/states";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";
import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "@/internal/surfaceFrame";
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
          surfaceFrameClass,
          styles.shell,
          panelClassName,
          sheet
            ? cx(sheetStyles.surface, sheetStyles.swipeY, overlayMotion.sheet)
            : overlayMotion[kind === "drawer" ? "drawer" : "dialog"],
          className,
        )}
        data-kind={kind}
        data-frame="l"
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
 * The leading mark of the header row, 48 (frame `l`: the dialog's title-m 16/24 with its line):
 * a glyph on the tone tile, or the record's picture (an `Avatar.Root` or a `Thumbnail.Root`
 * anywhere inside, internal/mediaSlot) with no tile, in the same box.
 */
export function DialogIcon({ tone = "neutral", children, className, ...rest }: DialogIconProps) {
  const sizes = cardMarkSize.header;
  const { media, provide } = useMediaSlotHost({
    avatar: sizes.avatar.l,
    thumbnail: sizes.thumbnail.l,
    ring: sizes.ring.l,
  });
  return (
    <span
      {...rest}
      className={cx(
        media ? undefined : cx(iconBoxStyles.tile, iconSlotClass),
        headerRowStyles.mark,
        styles.icon,
        className,
      )}
      data-tone={media ? undefined : tone}
      data-size={media ? undefined : sizes.tile.l}
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
 * What the header row is: a `record` header (a mark, badges or a numbered title) holds one line per
 * line, cut with an ellipsis; a plain header (a title and a question under it) wraps.
 */
const DialogHeaderContext = React.createContext<{ record: boolean } | null>(null);

/** Badges inside a section stand on its title-s heading: the chip tier of a frame `m` title. */
const DialogSectionContext = React.createContext(false);

/**
 * A line of a record header cut with an ellipsis tells its whole text on hover (`title`), only
 * while it is cut and only when the consumer gave no `title` of its own; assistive tech always
 * reads the whole text (the dialog's name and description). `pick` names the cut element when it
 * is inside the line.
 */
function useCutLineTitle<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  own: unknown,
  pick?: (line: T) => HTMLElement | null,
) {
  const sync = React.useCallback(() => {
    const host = ref.current;
    const line = host && pick ? pick(host) : host;
    if (!line || own !== undefined) return;
    if (line.scrollWidth > line.clientWidth + 1) line.title = line.textContent ?? "";
    else line.removeAttribute("title");
  }, [ref, own, pick]);
  React.useLayoutEffect(sync);
  useResizeEffect(ref, sync);
}

export type DialogTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id"> & {
  loading?: boolean;
  number?: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * The dialog's name, on the first line of the header row. A record's `number` stands muted after
 * the name and is part of it; in a record header the name ellipsizes, the number never does. While
 * it loads (`loading`: a record opened by a link knows only its id) a Skeleton holds the title
 * line, so the header never moves when the name arrives; the name then fades in under the same
 * element.
 */
export function DialogTitle({
  loading = false,
  number,
  className,
  children,
  ref,
  ...rest
}: DialogTitleProps) {
  const { titleId, registerTitle } = useDialogShell("Title");
  const record = React.useContext(DialogHeaderContext)?.record ?? false;
  const swap = useSwapIn(loading ? "loading" : "data", children);
  const shownLoading = swap.state === "loading";
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const mergedRef = useMergedRefs(titleRef, ref);
  const nameRef = React.useRef<HTMLSpanElement>(null);
  const numberRef = React.useRef<HTMLSpanElement>(null);
  useCutLineTitle(nameRef, rest.title);
  useTitleFloor(titleRef, nameRef, numberRef);
  React.useLayoutEffect(() => {
    registerTitle(true);
    return () => registerTitle(false);
  }, [registerTitle]);
  return (
    <h2
      {...rest}
      ref={mergedRef}
      key={swap.key}
      id={titleId}
      aria-busy={shownLoading || undefined}
      className={cx(
        FRAME_TITLE.l,
        record ? cx(headerRowStyles.title, styles.titleLine) : styles.titleWrap,
        swap.className,
        className,
      )}
    >
      {shownLoading ? (
        <Skeleton size="l" className={styles.titleSkeleton} />
      ) : (
        <>
          <span ref={nameRef} className={styles.titleName}>
            {swap.content}
          </span>
          {number !== undefined && number !== null ? (
            <>
              {" "}
              <span ref={numberRef} className={styles.titleNumber}>
                {number}
              </span>
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
 * The badges after the title, on its line, 6 apart from it: one `Badge.Group` for every badge of
 * the record (a status, a role, a counter — the meaning is the badge's `tone` or `color`). The kit
 * sizes them (frame `l`: chip tier `m`) and never wraps the row: once the title has given way to
 * its text, what does not fit folds into «+N» (`overflow="count"`), whose tooltip lists it. A
 * picker of a status or a person is not a badge: it is a `Select` in `Fields`. While the record
 * loads (`loading`) a Skeleton holds the line, so the header never moves.
 */
export function DialogBadges({ loading = false, className, children, ...rest }: DialogBadgesProps) {
  useDialogShell("Badges");
  const swap = useSwapIn(loading ? "loading" : "data", children);
  const size = tierMappings.cardBadges[React.useContext(DialogSectionContext) ? "m" : "l"];
  if (swap.state === "loading") {
    return (
      <div
        {...rest}
        key={swap.key}
        aria-busy="true"
        className={cx(headerRowStyles.badges, styles.badges, swap.className, className)}
      >
        <Skeleton shape="chip" size={size} className={styles.badgesSkeleton} />
      </div>
    );
  }
  return (
    <Badge.Group
      {...rest}
      key={swap.key}
      size={size}
      overflow="count"
      className={cx(headerRowStyles.badges, swap.className, className)}
    >
      {swap.content}
    </Badge.Group>
  );
}
DialogBadges.displayName = "Dialog.Badges";

export type DialogDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id"> & {
  loading?: boolean;
  ref?: React.Ref<HTMLParagraphElement>;
};

/** The element of a description line that is cut with an ellipsis. */
const descriptionText = (line: HTMLElement) =>
  line.querySelector<HTMLElement>(`.${headerRowStyles.descriptionText}`);

/**
 * The text under the title: plain text, no badges. In a record header it is one line cut with an
 * ellipsis (the whole text in its `title` while cut) and a `StatusDot` first states the record's
 * state, followed by a «·»; in a question dialog it wraps. While its data loads (`loading`) it
 * keeps its place with a Skeleton, so the header never moves when the data arrives; the data then
 * fades in under the same element.
 */
export function DialogDescription({
  loading = false,
  className,
  children,
  ref,
  ...rest
}: DialogDescriptionProps) {
  const { descriptionId, registerDescription } = useDialogShell("Description");
  const record = React.useContext(DialogHeaderContext)?.record ?? false;
  const swap = useSwapIn(loading ? "loading" : "data", children);
  const shownLoading = swap.state === "loading";
  const lineRef = React.useRef<HTMLParagraphElement>(null);
  const mergedRef = useMergedRefs(lineRef, ref);
  useCutLineTitle(lineRef, rest.title, descriptionText);
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
      aria-busy={shownLoading || undefined}
      className={cx(
        FRAME_DESCRIPTION.l,
        record ? headerRowStyles.description : styles.descriptionWrap,
        swap.className,
        className,
      )}
    >
      {shownLoading ? (
        <Skeleton size="s" className={styles.descriptionSkeleton} />
      ) : record ? (
        <HeaderLineContent>{swap.content}</HeaderLineContent>
      ) : (
        swap.content
      )}
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
 * The header row of the surface (internal/headerRow), frame `l`: `[Icon] [Title + Badges /
 * Description] [Actions] [close]`, whatever order the parts are written in. One line each, nothing
 * wraps; the title gives way to its text before the badges fold into «+N». A header without a
 * description centres its controls on the title line. The record's `Fields` stand under the row;
 * anything else inside (a tab strip) closes the header under them.
 */
export function DialogHeader({
  showClose = true,
  className,
  children,
  ref,
  ...rest
}: DialogHeaderProps) {
  const { onClose, closeLabel, busy } = useDialogShell("Header");
  const items = flattenChildren(children);
  const pick = (type: React.ElementType) => items.filter((part) => isPart(part, type));
  const icon = pick(DialogIcon);
  const title = pick(DialogTitle);
  const badges = pick(DialogBadges);
  const description = pick(DialogDescription);
  const actions = pick(DialogActions);
  const fields = pick(DialogFields);
  const own: React.ElementType[] = [
    DialogIcon,
    DialogTitle,
    DialogBadges,
    DialogDescription,
    DialogActions,
    DialogFields,
  ];
  const extra = items.filter(
    (part) => !(React.isValidElement(part) && own.includes(part.type as React.ElementType)),
  );
  const numbered = title.some(
    (part) => isPart<DialogTitleProps>(part, DialogTitle) && part.props.number != null,
  );
  const record = icon.length > 0 || badges.length > 0 || numbered;
  const context = React.useMemo(() => ({ record }), [record]);

  return (
    <header ref={ref} className={cx(styles.header, className)} {...rest}>
      <DialogHeaderContext value={context}>
        <div className={styles.row} data-close={showClose || undefined}>
          <div
            className={headerRowStyles.header}
            data-lines={description.length > 0 ? "two" : "one"}
            data-nested=""
          >
            <HeaderRowContent
              mark={icon}
              title={title}
              badges={badges}
              description={description}
              end={actions.length > 0 ? <div className={headerRowStyles.end}>{actions}</div> : null}
            />
          </div>
          {showClose ? (
            <Button.Root
              variant="ghost"
              tone="neutral"
              type="button"
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
        </div>
        {fields}
        {extra}
      </DialogHeaderContext>
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
 * to the whole open tab (a `SegmentedControl`, a `Datepicker` period; the record's value pickers
 * stand in `Fields`), then the buttons — neutral buttons (each named, with a Tooltip)
 * and a ⋯ Dropdown; with a footer the header keeps «Ещё» and the picker, the accent button stands
 * in the footer. They take the dialog's own control tier, the close button's, and sit on the
 * title's line. Each child stands in a cell held to the row's end (`RowCells`): another control in
 * the same place (the language on one tab, the period on another) cross-fades in its cell while
 * its width glides, and a control shown only on some tabs rises in and closes up — the ⋯ and ×
 * never move. In a body `Section` it sits at the end of the heading row, tier `s`. In the footer
 * it is the start group — one thing apart from the main pair — and its controls keep the footer's
 * tier.
 */
export function DialogActions({ className, children, ...rest }: DialogActionsProps) {
  useDialogShell("Actions");
  const inFooter = React.useContext(DialogFooterContext);
  const inHeader = React.useContext(DialogHeaderContext) !== null;
  const tier = useHostTier(inHeader ? undefined : "s");
  if (inFooter) {
    return (
      <div className={cx(styles.footerStart, className)} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <div
      className={cx(fieldTierClass, styles.actions, className)}
      data-size={tier.size}
      data-zone={inHeader ? "header" : undefined}
      {...rest}
    >
      {tier.provide(<RowCells align="end">{children}</RowCells>)}
    </div>
  );
}
DialogActions.displayName = "Dialog.Actions";

// ─── Fields (header) ──────────────────────────────────────────────────────────

export type DialogFieldsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The record's value pickers (the status, the assignee, the priority — kit `Select`s) as one row
 * under the title row of the header, a zone gap below it and above a tab strip. Its controls take
 * tier `xs`, each at its content width; the row wraps when the dialog is narrower than they are
 * together. The title row then holds only icon buttons, «Ещё» and the close button. It stands
 * there whatever order the parts are written in; every picker carries its own name.
 */
export function DialogFields({ className, children, ref, ...rest }: DialogFieldsProps) {
  useDialogShell("Fields");
  const tier = useHostTier("xs");
  return (
    <div
      {...rest}
      ref={ref}
      className={cx(fieldTierClass, styles.fields, className)}
      data-size={tier.size}
    >
      {tier.provide(children)}
    </div>
  );
}
DialogFields.displayName = "Dialog.Fields";

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
  number?: React.ReactNode;
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
 * at the end of the heading row, then the content 16 below. A section about a record (a deal of a
 * feed) takes its `number` and the dialog's `Badges` on the heading's line, as a record header
 * does. Sections stand further apart than the plain blocks of the body.
 */
export function DialogSection({
  label,
  number,
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
  const { parts: actions, rest: other } = splitParts(children, DialogActions);
  const { parts: badges, rest: content } = splitParts(other, DialogBadges);
  return (
    <section
      aria-labelledby={headingId}
      {...rest}
      ref={mergedRef}
      className={cx(styles.section, className)}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeading}>
          <SectionTitle
            as="h3"
            id={headingId}
            number={number}
            badges={
              badges.length > 0 ? <DialogSectionContext value>{badges}</DialogSectionContext> : null
            }
            className={cx(textRole.titleS, styles.sectionTitle)}
          >
            {label}
          </SectionTitle>
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
      className={cx(styles.footer, presence.className, className)}
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
