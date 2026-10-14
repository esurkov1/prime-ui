import * as React from "react";

import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Spinner } from "@/components/spinner/Spinner";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useModalLayer } from "@/hooks/useModalLayer";
import { readCssLengthPx } from "@/hooks/usePosition";
import { motionDurationMs, prefersReducedMotion, usePresence } from "@/hooks/usePresence";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatLabel } from "@/internal/formatLabel";
import pill from "@/internal/mediaPill.module.css";
import { activeElement } from "@/internal/overlay/focus";
import { LayerProvider } from "@/internal/overlay/layerStack";
import { Portal } from "@/internal/Portal";
import textRole from "@/internal/textRole.module.css";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./MediaViewer.module.css";
import { findItemMedia, originShape } from "./originShape";
import { clamp, fitBox, pageWindow, type Size } from "./physics";
import type { MediaViewerItem, MediaViewerLabels } from "./types";
import { type Sound, type VideoControls, ViewerVideo } from "./ViewerVideo";
import { type GestureKind, ViewerEngine, type ViewerOrigin } from "./viewerEngine";

export type { MediaViewerItem, MediaViewerLabels } from "./types";

const MEDIA_VIEWER_LABELS: MediaViewerLabels = {
  viewer: "Просмотр медиа",
  close: "Закрыть",
  previous: "Предыдущее",
  next: "Следующее",
  zoomIn: "Увеличить",
  zoomOut: "Уменьшить",
  counter: "{current} из {total}",
  slide: "слайд",
  photo: "Фото",
  video: "Видео",
  thumbnails: "Миниатюры",
  show: "Показать: {name}",
  announcement: "{name}, {current} из {total}",
  loadError: "Не удалось загрузить",
  retry: "Повторить",
  play: "Воспроизвести",
  pause: "Пауза",
  mute: "Выключить звук",
  unmute: "Включить звук",
  volume: "Громкость",
  volumeValue: "{value} %",
  seek: "Перемотка",
  position: "{current} из {duration}",
};

export type MediaViewerProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The photos and videos to page through, in order. */
  items: readonly MediaViewerItem[];
  /** Controlled visibility; together with `onOpenChange`. */
  open?: boolean;
  /** Initial visibility, uncontrolled. Default `false`. */
  defaultOpen?: boolean;
  /** Called on every open and close: the close button, Escape, a swipe, a click past the media. */
  onOpenChange?: (open: boolean) => void;
  /** The item on screen (controlled); together with `onIndexChange`. */
  index?: number;
  /** The item shown first, uncontrolled. Default `0`. */
  defaultIndex?: number;
  /** The page turned: a swipe, an arrow, a key, a thumbnail. */
  onIndexChange?: (index: number) => void;
  /** Past the last item comes the first (with three items or more). Default `false`. */
  loop?: boolean;
  /** How far a picture zooms, times its fitted size. Default `4`. */
  maxZoom?: number;
  /** A filmstrip of every item at the bottom. Default `false`. */
  thumbnails?: boolean;
  /**
   * A video starts as soon as its page settles on screen; where the browser refuses sound, it
   * starts muted. `false` — it waits for a press. Default `true`.
   */
  autoPlay?: boolean;
  /** Escape closes the viewer. Default `true`. */
  closeOnEscape?: boolean;
  /** A vertical swipe, or a click on the stage past the media, closes the viewer. Default `true`. */
  closeOnOutsideClick?: boolean;
  /**
   * The element item `index` opens from and closes into (its thumbnail). Without it the viewer
   * finds the picture in the element that opened it; with neither, it fades.
   */
  getOrigin?: (index: number) => Element | null;
  /** Actions for the item on screen, in the top bar before the close button. */
  renderActions?: (item: MediaViewerItem, index: number) => React.ReactNode;
  labels?: Partial<MediaViewerLabels>;
  /** The `role="dialog"` element. */
  ref?: React.Ref<HTMLDivElement>;
};

/** A thumbnail-like picture in or near `element`: what the viewer opens from. */
function findMedia(element: Element | null): HTMLElement | null {
  if (!element) return null;
  const anchor = element.getBoundingClientRect();
  let node: Element | null = element;
  for (let depth = 0; node && depth < 4; depth++, node = node.parentElement) {
    const media = node.matches("img, video") ? node : node.querySelector("img, video");
    if (media instanceof HTMLElement && overlaps(media.getBoundingClientRect(), anchor)) {
      return media;
    }
  }
  return null;
}

/** Most of the smaller rect lies inside the larger one: the picture is the pressed thing. */
function overlaps(a: DOMRect, b: DOMRect): boolean {
  const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  if (width <= 0 || height <= 0) return false;
  const smaller = Math.min(a.width * a.height, b.width * b.height);
  return smaller > 0 && (width * height) / smaller > 0.5;
}

type Origin = { shape: ViewerOrigin; media: HTMLElement };

/** The origin of an open or close: the picture in or near `element`, with its shape on the page. */
function originOf(element: Element | null): Origin | null {
  const media = findMedia(element);
  if (!media?.isConnected) return null;
  const shape = originShape(media);
  return shape ? { shape, media } : null;
}

/** Hides the origin's picture while the viewer flies out of it or back into it. */
function hideOrigin(origin: Origin | null): () => void {
  if (!origin) return () => {};
  const { media } = origin;
  const before = media.style.visibility;
  media.style.visibility = "hidden";
  return () => {
    media.style.visibility = before;
  };
}

/** The last element pressed on the page while the viewer is closed: the opener on a click. */
function useLastPress(active: boolean) {
  const press = React.useRef<{ element: Element; time: number } | null>(null);
  React.useEffect(() => {
    if (!active) return;
    const onPress = (event: PointerEvent) => {
      if (event.target instanceof Element)
        press.current = { element: event.target, time: Date.now() };
    };
    document.addEventListener("pointerdown", onPress, true);
    return () => document.removeEventListener("pointerdown", onPress, true);
  }, [active]);
  return press;
}

/** A press this recent opened the viewer; an older one did not (a key did). */
const PRESS_OPENS_MS = 1000;

/**
 * A full-screen viewer for photos and videos: pages slide under the finger and settle with a
 * spring, a pinch or a double tap zooms about the point, a zoomed picture pans with iOS momentum
 * and bounces off its edges, a swipe up or down carries it away to close. It opens out of the
 * thumbnail it was opened from and closes back into it. Only the page on screen and its
 * neighbours are mounted.
 */
export function MediaViewer({
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  ...rest
}: MediaViewerProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [index, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  const [mounted, setMounted] = React.useState(open);
  if (open && !mounted) setMounted(true);

  const press = useLastPress(!open);
  // Read while rendering the open transition, like the modal layer reads its opener.
  const openerRef = React.useRef<Element | null>(null);
  const openedIndexRef = React.useRef(index);
  const wasOpen = React.useRef(false);
  if (open !== wasOpen.current) {
    wasOpen.current = open;
    if (open) {
      const recent = press.current && Date.now() - press.current.time < PRESS_OPENS_MS;
      openerRef.current = recent ? (press.current?.element ?? null) : activeElement();
      openedIndexRef.current = index;
    }
  }

  const onExited = React.useCallback(() => setMounted(false), []);

  if (!mounted || items.length === 0) return null;
  return (
    <Portal>
      <ViewerDialog
        {...rest}
        items={items}
        open={open}
        setOpen={setOpen}
        index={Math.min(Math.max(0, index), items.length - 1)}
        setIndex={setIndex}
        onExited={onExited}
        opener={openerRef}
        openedIndex={openedIndexRef.current}
      />
    </Portal>
  );
}
MediaViewer.displayName = "MediaViewer";

type ViewerDialogProps = Omit<
  MediaViewerProps,
  "open" | "defaultOpen" | "onOpenChange" | "index" | "defaultIndex" | "onIndexChange"
> & {
  open: boolean;
  setOpen: (open: boolean) => void;
  index: number;
  setIndex: (index: number) => void;
  onExited: () => void;
  opener: React.RefObject<Element | null>;
  openedIndex: number;
};

type Phase = "opening" | "open" | "closing";

const viewport = (): Size =>
  typeof window === "undefined"
    ? { width: 0, height: 0 }
    : { width: window.innerWidth, height: window.innerHeight };

/** Mounted inside the portal, so the modal layer sees the attached node. */
function ViewerDialog({
  items,
  open,
  setOpen,
  index,
  setIndex,
  onExited,
  opener,
  openedIndex,
  loop = false,
  maxZoom = 4,
  thumbnails = false,
  autoPlay = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  getOrigin,
  renderActions,
  labels: labelsProp,
  className,
  onKeyDown,
  "aria-label": ariaLabel,
  ref,
  ...rest
}: ViewerDialogProps) {
  const labels = { ...MEDIA_VIEWER_LABELS, ...labelsProp };
  const count = items.length;
  const item = items[index] as MediaViewerItem;

  const { ref: layerRef, layer } = useModalLayer<HTMLDivElement>({
    open,
    closeOnEscape,
    // The viewer covers the viewport: a press beside the picture is its own (handled below).
    closeOnOutsideClick,
    onDismiss: () => setOpen(false),
  });
  const rootRef = useMergedRefs(layerRef, ref);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  const [area, setArea] = React.useState(viewport);
  const [ratios, setRatios] = React.useState<Record<string, number>>({});
  const [chrome, setChrome] = React.useState(true);
  const [zoomed, setZoomed] = React.useState(false);
  const [gesture, setGesture] = React.useState<GestureKind | null>(null);
  const [phase, setPhase] = React.useState<Phase>("opening");
  const [announcement, setAnnouncement] = React.useState("");
  const [rtl, setRtl] = React.useState(false);
  /** A far page the engine borrows as a neighbour while it slides in: kept mounted meanwhile. */
  const [transit, setTransit] = React.useState<number | null>(null);
  /** One sound setting for every video of the viewer. */
  const [sound, setSound] = React.useState<Sound>({ volume: 1, muted: false });
  /** The video on screen, for the keys and a click on it; `null` on a picture. */
  const videoControls = React.useRef<VideoControls | null>(null);
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  const latest = React.useRef({ setIndex, setOpen, closeOnOutsideClick });
  latest.current = { setIndex, setOpen, closeOnOutsideClick };

  const [engine] = React.useState(
    () =>
      new ViewerEngine({
        onIndexChange: (next) => latest.current.setIndex(next),
        onZoomChange: (next, byGesture) => {
          setZoomed(next);
          // A pinch or a double tap clears the view, as in Photos; back at the fit it returns.
          if (byGesture) setChrome(!next);
        },
        onTap: (target, pointerType) => {
          const media = target.closest("[data-viewer-media]");
          const onMedia = media !== null;
          // A mouse click on a video plays and pauses it, as in every desktop player.
          if (pointerType === "mouse" && media?.querySelector("video")) {
            videoControls.current?.toggle();
            return;
          }
          if (pointerType === "mouse" && !onMedia && latest.current.closeOnOutsideClick) {
            latest.current.setOpen(false);
            return;
          }
          setChrome((shown) => !shown);
        },
        onTransitChange: setTransit,
        onGestureChange: setGesture,
        onDismiss: () => latest.current.setOpen(false),
      }),
  );

  // The engine reads the props it needs on every render, before it paints.
  engine.count = count;
  engine.loop = loop;
  engine.maxZoom = Math.max(1, maxZoom);
  engine.canDismiss = closeOnOutsideClick;
  engine.rtl = rtl;

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    const backdrop = backdropRef.current;
    if (!stage || !backdrop) return;
    engine.reducedMotion = prefersReducedMotion();
    engine.gap = readCssLengthPx("--prime-media-viewer-page-gap", 24);
    setRtl(getComputedStyle(stage).direction === "rtl");
    const detach = engine.attach(stage, backdrop);
    if (typeof ResizeObserver === "undefined") return detach;
    const observer = new ResizeObserver(() => {
      const rect = stage.getBoundingClientRect();
      setArea((current) =>
        current.width === rect.width && current.height === rect.height
          ? current
          : { width: rect.width, height: rect.height },
      );
    });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      detach();
    };
  }, [engine]);

  // After every render: the engine takes the page React shows and paints the mounted slides.
  React.useLayoutEffect(() => {
    engine.setArea(area);
    engine.syncIndex(index);
    engine.paint();
  });

  // The thumbnail of the item on screen: `getOrigin`, else the opener for the item it opened
  // at, else the item's own picture found on the page — paging on, it still closes into its tile.
  const originFor = (at: number) => {
    if (getOrigin) return originOf(getOrigin(at));
    if (at === openedIndex) return originOf(opener.current);
    return originOf(findItemMedia(items[at], findMedia(opener.current), layerRef.current));
  };
  const originForRef = React.useRef(originFor);
  originForRef.current = originFor;
  // The picture the viewer opened from: a video page flies as its frame until it plays.
  const [still] = React.useState(() =>
    findMedia(getOrigin ? getOrigin(openedIndex) : opener.current),
  );

  // Open out of the thumbnail; close back into the thumbnail of the item on screen.
  React.useLayoutEffect(() => {
    const duration = motionDurationMs("base");
    if (open) {
      const origin = originForRef.current(engine.index);
      const show = hideOrigin(origin);
      setPhase("opening");
      engine.open(origin?.shape ?? null, duration, () => {
        show();
        setPhase("open");
      });
      return show;
    }
    const origin = originForRef.current(engine.index);
    const show = hideOrigin(origin);
    setPhase("closing");
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      show();
      onExited();
    };
    engine.close(origin?.shape ?? null, duration, finish);
    // Frames stop in a background tab: the viewer still goes away.
    const fallback = window.setTimeout(finish, duration + 200);
    return () => {
      window.clearTimeout(fallback);
      show();
    };
  }, [open, engine, onExited]);

  // A page change is read out (not the first page: the dialog's opening says enough).
  const shownIndex = React.useRef(index);
  const labelsRef = React.useRef(labels);
  labelsRef.current = labels;
  React.useEffect(() => {
    if (shownIndex.current === index) return;
    shownIndex.current = index;
    setAnnouncement(
      formatLabel(labelsRef.current.announcement, {
        name: nameOf(items[index], labelsRef.current),
        current: index + 1,
        total: count,
      }),
    );
  }, [index, items, count]);

  const looping = loop && count > 2;
  const canPrevious = looping || index > 0;
  const canNext = looping || index < count - 1;
  const zoomable = (item.type ?? "image") === "image";

  /**
   * The keys of the video on screen, as in every player: Space / K play and pause (Space on a
   * button presses the button), Shift + arrows seek 5 s, ↑ / ↓ the level, M the sound. The plain
   * arrows keep turning pages, as on a picture.
   */
  const videoKey = (event: React.KeyboardEvent, forward: string, back: string): boolean => {
    const video = videoControls.current;
    if (!video) return false;
    const onControl = (event.target as Element).closest("button, a[href]") !== null;
    if ((event.key === " " && !onControl) || event.code === "KeyK") video.toggle();
    else if (event.code === "KeyM") video.toggleMute();
    else if (event.shiftKey && event.key === forward) video.seekBy(VIDEO_SEEK_S);
    else if (event.shiftKey && event.key === back) video.seekBy(-VIDEO_SEEK_S);
    else if (event.key === "ArrowUp") video.volumeBy(VIDEO_LEVEL_STEP);
    else if (event.key === "ArrowDown") video.volumeBy(-VIDEO_LEVEL_STEP);
    else return false;
    return true;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
    const target = event.target as Element;
    if (target.closest("input, textarea, select, [role='slider'], [contenteditable]")) return;
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (videoKey(event, forward, back)) {
      event.preventDefault();
      setChrome(true);
      return;
    }
    switch (event.key) {
      case forward:
        engine.step(1);
        break;
      case back:
        engine.step(-1);
        break;
      case "Home":
        engine.go(0);
        break;
      case "End":
        engine.go(count - 1);
        break;
      case "+":
      case "=":
        engine.zoomBy(1.5);
        break;
      case "-":
        engine.zoomBy(1 / 1.5);
        break;
      case "0":
        engine.zoomBy(null);
        break;
      default:
        return;
    }
    event.preventDefault();
    setChrome(true);
  };

  const onVideo = (item.type ?? "image") === "video";
  const playingNow = onVideo && videoPlaying;
  // A video standing still keeps its bar; a picture or a playing video may clear the view.
  const hidden =
    phase !== "open" ||
    gesture === "dismiss" ||
    gesture === "pinch" ||
    (!chrome && !(onVideo && !videoPlaying));
  useIdleChrome(playingNow && phase === "open", layerRef, chrome, setChrome);

  return (
    // A dark island: media reads truest on near black, and the kit's controls take their dark
    // look on it in both themes.
    <div
      {...rest}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? labels.viewer}
      tabIndex={-1}
      className={cx(styles.root, className)}
      data-theme="dark"
      data-state={open ? "open" : "closed"}
      data-phase={phase}
      data-chrome={hidden ? "hidden" : "shown"}
      data-zoomed={zoomed || undefined}
      data-gesture={gesture ?? undefined}
      data-thumbnails={thumbnails || undefined}
      data-playing={playingNow || undefined}
      onKeyDown={handleKeyDown}
      // Moving focus into the bars brings them back (Tab while they are hidden).
      onFocus={(event) => {
        if (event.target.closest("[data-viewer-chrome]")) setChrome(true);
      }}
    >
      <LayerProvider value={layer}>
        <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />
        <div ref={stageRef} className={styles.stage} data-autofocus="" tabIndex={-1}>
          {mountedPages(index, count, loop, transit).map((at) => (
            <ViewerSlide
              key={at}
              engine={engine}
              item={items[at] as MediaViewerItem}
              at={at}
              current={at === index}
              active={at === index && open && phase === "open"}
              still={at === openedIndex ? still : null}
              autoPlay={autoPlay}
              sound={sound}
              onSoundChange={setSound}
              controlsRef={videoControls}
              onPlayingChange={setVideoPlaying}
              count={count}
              area={area}
              ratio={ratioOf(items[at] as MediaViewerItem, ratios)}
              onRatio={(ratio) => {
                const src = (items[at] as MediaViewerItem).src;
                setRatios((current) =>
                  current[src] === ratio ? current : { ...current, [src]: ratio },
                );
              }}
              labels={labels}
            />
          ))}
        </div>

        <div className={styles.top} data-viewer-chrome="">
          {count > 1 ? (
            <span className={cx(pill.pill, styles.counter)}>
              {formatLabel(labels.counter, { current: index + 1, total: count })}
            </span>
          ) : null}
          <div className={styles.actions}>
            {renderActions?.(item, index)}
            {zoomable ? (
              <Button.Root
                shape="circle"
                variant="shade"
                aria-label={zoomed ? labels.zoomOut : labels.zoomIn}
                onClick={() => engine.zoomBy(zoomed ? null : 2)}
              >
                <Button.Icon>
                  <Icon name={zoomed ? "action.zoomOut" : "action.zoomIn"} />
                </Button.Icon>
              </Button.Root>
            ) : null}
            <Button.Root
              shape="circle"
              variant="shade"
              aria-label={labels.close}
              onClick={() => setOpen(false)}
            >
              <Button.Icon>
                <Icon name="action.close" />
              </Button.Icon>
            </Button.Root>
          </div>
        </div>

        {count > 1 ? (
          <>
            <Button.Root
              shape="circle"
              variant="shade"
              className={cx(styles.nav, styles.previous)}
              data-viewer-chrome=""
              aria-label={labels.previous}
              disabled={!canPrevious}
              onClick={() => engine.step(-1)}
            >
              <Button.Icon>
                <Icon name="nav.chevronLeft" />
              </Button.Icon>
            </Button.Root>
            <Button.Root
              shape="circle"
              variant="shade"
              className={cx(styles.nav, styles.next)}
              data-viewer-chrome=""
              aria-label={labels.next}
              disabled={!canNext}
              onClick={() => engine.step(1)}
            >
              <Button.Icon>
                <Icon name="nav.chevronRight" />
              </Button.Icon>
            </Button.Root>
          </>
        ) : null}

        {thumbnails && count > 1 ? (
          <Filmstrip
            engine={engine}
            items={items}
            index={index}
            labels={labels}
            onSelect={(next) => engine.go(next)}
          />
        ) : null}

        <VisuallyHidden aria-live="polite">{announcement}</VisuallyHidden>
      </LayerProvider>
    </div>
  );
}

/** The pages to mount: the window around the current one, and a far page while it slides in. */
function mountedPages(index: number, count: number, loop: boolean, transit: number | null) {
  const pages = pageWindow(index, count, loop);
  if (transit !== null && transit < count && !pages.includes(transit)) pages.push(transit);
  return pages;
}

/** Seconds Shift + an arrow moves a video. */
const VIDEO_SEEK_S = 5;
/** The level ↑ / ↓ changes a video's sound by. */
const VIDEO_LEVEL_STEP = 0.1;
/** A playing video clears the view after this long without the pointer moving. */
const IDLE_MS = 2500;

/**
 * While a video plays, the chrome steps aside after `IDLE_MS` without the mouse moving or a key,
 * and the slightest move brings it back — never while the pointer rests on a bar, focus is in
 * one, or the level panel is open.
 */
function useIdleChrome(
  playing: boolean,
  rootRef: React.RefObject<HTMLElement | null>,
  chrome: boolean,
  setChrome: (shown: boolean) => void,
) {
  const overChrome = React.useRef(false);
  const timer = React.useRef(0);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!playing || !root) return;
    const arm = () => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const busy =
          overChrome.current ||
          root.querySelector("[data-viewer-chrome]:focus-within, [data-open]") !== null;
        if (busy) arm();
        else setChrome(false);
      }, IDLE_MS);
    };
    const onMove = (event: PointerEvent) => {
      overChrome.current = (event.target as Element).closest("[data-viewer-chrome]") !== null;
      if (event.pointerType !== "mouse") return;
      setChrome(true);
      arm();
    };
    const onKey = () => {
      setChrome(true);
      arm();
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("keydown", onKey);
    if (chrome) arm();
    return () => {
      window.clearTimeout(timer.current);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("keydown", onKey);
    };
  }, [playing, rootRef, chrome, setChrome]);
}

function nameOf(item: MediaViewerItem | undefined, labels: MediaViewerLabels): string {
  if (!item) return "";
  return item.alt || ((item.type ?? "image") === "video" ? labels.video : labels.photo);
}

/** Default 4 : 3 until the file tells its own ratio, as in Gallery. */
const DEFAULT_RATIO = 4 / 3;

function ratioOf(item: MediaViewerItem, measured: Record<string, number>): number {
  if (item.width && item.height) return item.width / item.height;
  return measured[item.src] ?? DEFAULT_RATIO;
}

type ViewerSlideProps = {
  engine: ViewerEngine;
  item: MediaViewerItem;
  at: number;
  current: boolean;
  /** On screen and the viewer is open: a video may play. */
  active: boolean;
  autoPlay: boolean;
  sound: Sound;
  onSoundChange: (sound: Sound) => void;
  controlsRef: React.MutableRefObject<VideoControls | null>;
  onPlayingChange: (playing: boolean) => void;
  /** The thumbnail it was opened from: a video shows this frame until its own is ready. */
  still: HTMLElement | null;
  count: number;
  area: Size;
  ratio: number;
  onRatio: (ratio: number) => void;
  labels: MediaViewerLabels;
};

type LoadStatus = "loading" | "loaded" | "error";

function ViewerSlide({
  engine,
  item,
  at,
  current,
  active,
  autoPlay,
  sound,
  onSoundChange,
  controlsRef,
  onPlayingChange,
  still,
  count,
  area,
  ratio,
  onRatio,
  labels,
}: ViewerSlideProps) {
  const slideRef = React.useRef<HTMLDivElement>(null);
  const zoomRef = React.useRef<HTMLDivElement>(null);
  const video = (item.type ?? "image") === "video";
  const box = fitBox(ratio, area);
  const [status, setStatus] = React.useState<LoadStatus>("loading");
  // The thumbnail stands in until the full picture has fully shown over it, never a frame less.
  const [covered, setCovered] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const onRatioRef = React.useRef(onRatio);
  onRatioRef.current = onRatio;

  React.useLayoutEffect(() => {
    const slide = slideRef.current;
    const zoom = zoomRef.current;
    if (!slide || !zoom) return;
    engine.setSlot(at, { slide, zoom, box, zoomable: !video && status === "loaded" });
    return () => engine.setSlot(at, null);
  });

  /**
   * The picture counts as loaded only once it is decoded: it never paints half-ready or blank for a
   * frame. A picture already in the cache (a neighbour seen before) is ready before the first paint.
   */
  const ready = React.useCallback(
    (image: HTMLImageElement) => {
      const settle = () => {
        if (!image.isConnected) return;
        if (!item.width && image.naturalWidth > 0 && image.naturalHeight > 0) {
          onRatioRef.current(image.naturalWidth / image.naturalHeight);
        }
        setStatus("loaded");
        if (prefersReducedMotion()) setCovered(true);
      };
      if (typeof image.decode === "function") image.decode().then(settle, settle);
      else settle();
    },
    [item.width],
  );

  const imageRef = React.useCallback(
    (image: HTMLImageElement | null) => {
      if (image?.complete && image.naturalWidth > 0) ready(image);
    },
    [ready],
  );

  const boxStyle = {
    "--viewer-box-width": `${box.width}px`,
    "--viewer-box-height": `${box.height}px`,
  } as React.CSSProperties;

  // The spinner and the error fade out as they leave; both stand in one cell, so they cross-fade.
  const busy = usePresence(status === "loading" && !item.thumbnail, { exitDuration: "fast" });
  const failed = usePresence(status === "error", { exitDuration: "fast" });

  const caption = item.caption ? (
    <p className={cx(textRole.bodyS, styles.caption)}>{item.caption}</p>
  ) : null;
  const retry = () => {
    setStatus("loading");
    setCovered(false);
    setAttempt((n) => n + 1);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: a carousel slide (APG), not a form fieldset
    <div
      ref={slideRef}
      className={styles.slide}
      role="group"
      aria-roledescription={labels.slide}
      aria-label={formatLabel(labels.counter, { current: at + 1, total: count })}
      aria-hidden={current ? undefined : true}
      inert={!current}
      data-current={current || undefined}
      data-status={status}
    >
      {video ? (
        <ViewerVideo
          key={attempt}
          item={item}
          active={active}
          autoPlay={autoPlay}
          sound={sound}
          onSoundChange={onSoundChange}
          controlsRef={controlsRef}
          onPlayingChange={onPlayingChange}
          still={still}
          labels={labels}
          onRatio={onRatio}
          onError={() => setStatus("error")}
          zoomRef={zoomRef}
          boxStyle={boxStyle}
          caption={caption}
        />
      ) : (
        <>
          <div ref={zoomRef} className={styles.zoom} style={boxStyle} data-viewer-media="">
            {item.thumbnail && !covered ? (
              <img className={styles.placeholder} src={item.thumbnail} alt="" draggable={false} />
            ) : null}
            <img
              key={attempt}
              ref={imageRef}
              className={styles.media}
              src={item.src}
              alt={item.alt ?? ""}
              decoding="async"
              draggable={false}
              data-loaded={status === "loaded" || undefined}
              onLoad={(event) => ready(event.currentTarget)}
              onError={() => setStatus("error")}
              onTransitionEnd={(event) => {
                if (event.propertyName === "opacity" && status === "loaded") setCovered(true);
              }}
            />
          </div>
          {busy.mounted ? (
            <div
              className={cx(styles.center, styles.slot, enterMotion.enter)}
              data-hidden={busy.state === "closed" || undefined}
              aria-hidden={busy.state === "closed" || undefined}
              onTransitionEnd={busy.onExitEnd}
            >
              <Spinner size="xl" />
            </div>
          ) : null}
          {caption ? (
            <div className={styles.bottom} data-viewer-chrome="">
              {caption}
            </div>
          ) : null}
        </>
      )}
      {failed.mounted ? (
        <div
          className={cx(styles.center, styles.slot, styles.error, enterMotion.enterBase)}
          data-viewer-chrome=""
          data-hidden={failed.state === "closed" || undefined}
          inert={failed.state === "closed"}
          onTransitionEnd={failed.onExitEnd}
        >
          <Icon name="object.image" />
          <p className={cx(textRole.bodyS, styles.errorText)}>{labels.loadError}</p>
          <Button.Root variant="soft" tone="neutral" size="s" onClick={retry}>
            {labels.retry}
          </Button.Root>
        </div>
      ) : null}
    </div>
  );
}

type FilmstripProps = {
  engine: ViewerEngine;
  items: readonly MediaViewerItem[];
  index: number;
  labels: MediaViewerLabels;
  onSelect: (index: number) => void;
};

/** Thumbnails mounted beyond the visible ones on each side, so a fast glide never shows a gap. */
const STRIP_OVERSCAN = 6;
/** Time constant of a detached row gliding back to the page. */
const STRIP_GLIDE_MS = 70;
/** A mouse moves this far before a press on the row becomes a drag. */
const STRIP_DRAG_SLOP = 4;

const swallow = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * Every item as a thumbnail, in a row that only mounts what is in view (hundreds of items cost a
 * screenful). The engine drives it on every frame: the row glides with the page under the finger
 * and the emphasis (size and strength) flows from one thumbnail to the next — nothing jumps
 * when the page settles. The person may scroll the row freely; a press slides to that item.
 */
function Filmstrip({ engine, items, index, labels, onSelect }: FilmstripProps) {
  const scrollerRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const positionRef = React.useRef(index);
  const count = items.length;
  const [metrics] = React.useState(() => {
    const thumb = readCssLengthPx("--prime-thumbnail-l-height", 48);
    return { thumb, pitch: thumb + readCssLengthPx("--prime-space-1", 4) };
  });
  const [width, setWidth] = React.useState(0);
  const [range, setRange] = React.useState(() => ({
    first: Math.max(0, index - 12),
    last: Math.min(count - 1, index + 12),
  }));
  const pad = Math.max(0, (width - metrics.thumb) / 2);

  /** The thumbnails in view of the row's scroll, with the overscan. */
  const showAt = React.useCallback(
    (left: number, view: number) => {
      const pad = Math.max(0, (view - metrics.thumb) / 2);
      const first = clamp(
        Math.floor((left - pad - metrics.thumb) / metrics.pitch) - STRIP_OVERSCAN,
        0,
        count - 1,
      );
      const last = clamp(
        Math.ceil((left + view - pad) / metrics.pitch) + STRIP_OVERSCAN,
        0,
        count - 1,
      );
      setRange((current) =>
        current.first === first && current.last === last ? current : { first, last },
      );
    },
    [count, metrics.pitch, metrics.thumb],
  );

  /**
   * The row follows the page while it is attached. A scroll by the person (wheel, trackpad,
   * finger, a mouse drag) detaches it: the row stays where they left it until the page turns, then
   * glides back to the page and follows it again.
   */
  const follow = React.useRef({ detached: false, written: Number.NaN, glide: 0, last: 0 });

  /** Scrolls the row to `left` (px from its start) and mounts what comes into view. */
  const write = React.useCallback(
    (left: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const rtl = getComputedStyle(scroller).direction === "rtl";
      scroller.scrollLeft = rtl ? -left : left;
      follow.current.written = Math.abs(scroller.scrollLeft);
      showAt(left, scroller.clientWidth);
    },
    [showAt],
  );

  /** Every mounted thumbnail's emphasis from where the page is: it flows with the swipe. */
  const emphasize = React.useCallback((position: number) => {
    const row = rowRef.current;
    if (!row) return;
    for (const thumb of row.children) {
      const at = Number((thumb as HTMLElement).dataset.thumb);
      const focus = 1 - Math.min(1, Math.abs(at - position));
      (thumb as HTMLElement).style.setProperty("--thumb-focus", focus.toFixed(3));
    }
  }, []);

  const targetOf = React.useCallback(
    (position: number) => clamp(position, 0, count - 1) * metrics.pitch,
    [count, metrics.pitch],
  );

  const stopGlide = React.useCallback(() => {
    cancelAnimationFrame(follow.current.glide);
    follow.current.glide = 0;
  }, []);

  /** Glides a detached row back to the page (an exponential approach, ~0.1 s), then attaches it. */
  const glideBack = React.useCallback(() => {
    if (follow.current.glide) return;
    if (prefersReducedMotion()) {
      follow.current.detached = false;
      write(targetOf(positionRef.current));
      return;
    }
    follow.current.last = 0;
    const step = (now: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const dt = follow.current.last ? Math.min(64, now - follow.current.last) : 16;
      follow.current.last = now;
      const target = targetOf(positionRef.current);
      const from = Math.abs(scroller.scrollLeft);
      const next = from + (target - from) * (1 - Math.exp(-dt / STRIP_GLIDE_MS));
      if (Math.abs(target - next) < 0.5) {
        follow.current.glide = 0;
        follow.current.detached = false;
        write(target);
        return;
      }
      write(next);
      follow.current.glide = requestAnimationFrame(step);
    };
    follow.current.glide = requestAnimationFrame(step);
  }, [targetOf, write]);

  /** The page moved: the emphasis follows; the row follows, or glides back if it was scrolled. */
  const apply = React.useCallback(
    (position: number) => {
      positionRef.current = position;
      emphasize(position);
      if (follow.current.detached) glideBack();
      else write(targetOf(position));
    },
    [emphasize, glideBack, targetOf, write],
  );

  /** A scroll the row did not write is the person's: detach and mount what came into view. */
  const onScroll = React.useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const left = Math.abs(scroller.scrollLeft);
    if (Math.abs(left - follow.current.written) > 1 && !follow.current.glide) {
      follow.current.detached = true;
    }
    showAt(left, scroller.clientWidth);
  }, [showAt]);

  React.useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setWidth(scroller.clientWidth);
    engine.positionListener = apply;
    engine.replayPosition();
    if (typeof ResizeObserver === "undefined")
      return () => {
        engine.positionListener = null;
      };
    const observer = new ResizeObserver(() => setWidth(scroller.clientWidth));
    observer.observe(scroller);
    return () => {
      observer.disconnect();
      engine.positionListener = null;
    };
  }, [engine, apply]);

  // The person's hands on the row: any of them stops a glide and leaves the row where they put it.
  // A vertical wheel scrolls it sideways; a mouse drags it like a finger.
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const take = () => {
      stopGlide();
      follow.current.detached = true;
    };
    const onWheel = (event: WheelEvent) => {
      take();
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientWidth : 1;
      scroller.scrollLeft += event.deltaY * unit;
    };
    let drag: { x: number; left: number; moved: boolean; id: number } | null = null;
    const onDown = (event: PointerEvent) => {
      take();
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { x: event.clientX, left: scroller.scrollLeft, moved: false, id: event.pointerId };
    };
    const onMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < STRIP_DRAG_SLOP) return;
      drag.moved = true;
      scroller.scrollLeft = drag.left - dx;
    };
    const onUp = () => {
      // A drag is not a press: the click that ends it does not open a thumbnail.
      if (drag?.moved) {
        scroller.addEventListener("click", swallow, { capture: true, once: true });
        window.setTimeout(() => scroller.removeEventListener("click", swallow, true), 0);
      }
      drag = null;
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });
    // A thumbnail's picture would be dragged out as a file and cancel the mouse drag.
    scroller.addEventListener("dragstart", swallow);
    scroller.addEventListener("touchstart", take, { passive: true });
    scroller.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      stopGlide();
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("dragstart", swallow);
      scroller.removeEventListener("touchstart", take);
      scroller.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [stopGlide]);

  // A new width re-centres an attached row.
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new width moves every thumbnail
  React.useLayoutEffect(() => {
    if (!follow.current.detached) write(targetOf(positionRef.current));
    onScroll();
  }, [width, write, targetOf, onScroll]);
  // Thumbnails that just mounted take their emphasis before they paint — never the scroll.
  React.useLayoutEffect(() => {
    emphasize(positionRef.current);
  });

  const thumbs: React.ReactNode[] = [];
  for (let at = range.first; at <= range.last; at++) {
    const entry = items[at] as MediaViewerItem;
    const video = (entry.type ?? "image") === "video";
    const src = entry.thumbnail ?? (video ? entry.poster : entry.src);
    thumbs.push(
      <Thumbnail.Root
        key={at}
        asChild
        size="l"
        className={styles.thumb}
        style={{ insetInlineStart: `${pad + at * metrics.pitch}px` }}
        data-thumb={at}
      >
        <button
          type="button"
          aria-label={formatLabel(labels.show, { name: nameOf(entry, labels) })}
          aria-current={at === index ? "true" : undefined}
          onClick={() => onSelect(at)}
        >
          {src ? <Thumbnail.Image src={src} /> : null}
          <Thumbnail.Fallback>
            <Icon name={video ? "action.video" : "object.image"} />
          </Thumbnail.Fallback>
        </button>
      </Thumbnail.Root>,
    );
  }

  return (
    <nav className={styles.strip} aria-label={labels.thumbnails} data-viewer-chrome="">
      <ScrollContainer
        ref={scrollerRef}
        axis="horizontal"
        scrollbar="hidden"
        className={styles.stripScroll}
        onScroll={onScroll}
      >
        <div
          ref={rowRef}
          className={styles.stripRow}
          style={{ inlineSize: `${2 * pad + (count - 1) * metrics.pitch + metrics.thumb}px` }}
        >
          {thumbs}
        </div>
      </ScrollContainer>
    </nav>
  );
}
