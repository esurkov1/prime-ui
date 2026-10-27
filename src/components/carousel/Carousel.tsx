import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/button/Button";
import { Skeleton } from "@/components/skeleton/Skeleton";
import type { ThumbnailRatio } from "@/components/thumbnail/Thumbnail";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { HOVER_QUERY } from "@/hooks/breakpoints";
import { useControllableState } from "@/hooks/useControllableState";
import { useResizeEffect } from "@/hooks/useElementSize";
import { type ImageStatus, useImageStatus } from "@/hooks/useImageStatus";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { ChevronLeft } from "@/icons/glyphs/chevron-left";
import { ChevronRight } from "@/icons/glyphs/chevron-right";
import { Image } from "@/icons/glyphs/image";
import { Volume2 } from "@/icons/glyphs/volume-2";
import { VolumeX } from "@/icons/glyphs/volume-x";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { DRAG_THRESHOLD_PX, HOVER_SETTLE_MS, PRESS_SLOP_PX } from "@/internal/longPress";
import { MediaPlayMark } from "@/internal/mediaDisk";
import { firstFrame } from "@/internal/mediaFrame";
import pill from "@/internal/mediaPill.module.css";
import { useMediaSession } from "@/internal/mediaSession";
import { usePartPresence } from "@/internal/partPresence";
import { flattenChildren, splitParts } from "@/internal/parts";
import { pageWindow } from "@/internal/physics";
import { useSwapIn } from "@/internal/RegionSwap";
import { opensRow } from "@/internal/rowLink";
import { swallowNextClick } from "@/internal/swallowNextClick";
import textRole from "@/internal/textRole.module.css";
import { touchTargetBlockClass } from "@/internal/touchTarget";
import { useNearView } from "@/internal/useNearView";

import styles from "./Carousel.module.css";
import { CarouselTrack, indicatorSpan } from "./carouselTrack";

/** Width ÷ height of the box: the vocabulary of Thumbnail. */
export type CarouselRatio = ThumbnailRatio;

/** One slide: a photo, or a video shown by its first frame (or `poster`). */
export type CarouselItem = {
  type?: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  duration?: number;
  autoPlay?: boolean;
  loop?: boolean;
};

export type CarouselLabels = {
  /** The name of the carousel when no `aria-label` is given. */
  region: string;
  /** `aria-roledescription` of the carousel. */
  carousel: string;
  /** `aria-roledescription` of a slide. */
  slide: string;
  /** The name of a photo slide and its dot; read out when the slide changes. */
  photo: string;
  /** The name of a video slide and its dot. */
  video: string;
  previous: string;
  next: string;
  /** The sound button of a playing video while the sound is on. */
  mute: string;
  /** The sound button of a playing video while the sound is off. */
  unmute: string;
  /** A box without photos. */
  empty: string;
  /** A photo or a video that failed to load. */
  loadError: string;
};

export const CAROUSEL_LABELS: CarouselLabels = {
  region: "Фотографии",
  carousel: "карусель",
  slide: "слайд",
  photo: "Фото {current} из {total}",
  video: "Видео {current} из {total}",
  previous: "Предыдущее фото",
  next: "Следующее фото",
  mute: "Выключить звук",
  unmute: "Включить звук",
  empty: "Нет фото",
  loadError: "Не удалось загрузить",
};

/** The carousel's props; each is described in `api.ts`. */
export type CarouselRootProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "defaultValue" | "onChange"
> & {
  items: readonly CarouselItem[];
  ratio?: CarouselRatio;
  loop?: boolean;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  arrows?: boolean;
  dots?: boolean;
  scrub?: boolean;
  loading?: boolean;
  onItemOpen?: (index: number) => void;
  renderOverlay?: (item: CarouselItem, index: number) => React.ReactNode;
  labels?: Partial<CarouselLabels>;
  ref?: React.Ref<HTMLElement>;
};

/** What moved the slide: it decides the motion, the announcement and the hover's resting slide. */
type Reason = "swipe" | "step" | "dot" | "key" | "scrub";

/** The carousel's own controls: the keys and the swipe belong to them, not to an overlay's. */
const CONTROL = "data-carousel-control";

/** Data saving asked by the person (`navigator.connection.saveData`): no video plays by itself. */
function savesData(): boolean {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

/** Whether at least half of the element is in the view (`true` without IntersectionObserver). */
function useInView(ref: React.RefObject<Element | null>, enabled: boolean): boolean {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry ? entry.isIntersecting : false),
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled]);
  return inView;
}

/**
 * Photos (and videos) of one record in one box of a fixed ratio: a finger or a mouse drag swipes
 * them with the kit's page physics, the dots and the arrows step, the keys move from the focused
 * carousel; with `scrub` a hovering mouse picks them by zones. A press opens the item
 * (`onItemOpen`), never after a swipe.
 */
function CarouselRoot({
  items,
  ratio = "4:3",
  loop = false,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  arrows = false,
  dots: dotsShown = true,
  scrub = false,
  loading = false,
  onItemOpen,
  renderOverlay,
  labels: labelsProp,
  className,
  children,
  onClick,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  ref,
  ...rest
}: CarouselRootProps) {
  const labels = useLabels(CAROUSEL_LABELS, labelsProp);
  const count = loading ? 0 : items.length;
  const [indexState, setIndex] = useControllableState({
    value: indexProp,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  const current = Math.min(Math.max(0, indexState), Math.max(0, count - 1));
  const looping = loop && count > 2;
  const many = count > 1;
  /** The dots: one per slide, unless the consumer leaves them out; never for one slide. */
  const dotted = many && dotsShown;

  const rootRef = React.useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const dotsRef = React.useRef<HTMLDivElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
  const dotRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [track] = React.useState(() => new CarouselTrack());
  track.configure(count, loop);

  // ─── The dots follow the track, frame by frame ─────────────────────────────
  // The pill is written straight to the DOM from the track's position (the finger, the spring),
  // so it moves in the same frame as the slides and React never renders for it.
  const dotsGeometry = React.useRef<{ first: number; pitch: number } | null>(null);
  const measureDots = React.useCallback(() => {
    const first = dotRefs.current[0];
    const second = dotRefs.current[1];
    dotsGeometry.current = first
      ? {
          first: first.offsetLeft,
          pitch: second ? second.offsetLeft - first.offsetLeft : first.offsetWidth,
        }
      : null;
    if (dotsRef.current && rootRef.current) {
      rootRef.current.style.setProperty("--carousel-dots-size", `${dotsRef.current.offsetWidth}px`);
    }
  }, []);
  const looped = React.useRef(looping);
  looped.current = looping;
  const counted = React.useRef(count);
  counted.current = count;
  track.onPosition = React.useCallback((position: number) => {
    const indicator = indicatorRef.current;
    const geometry = dotsGeometry.current;
    if (!indicator || !geometry) return;
    const span = indicatorSpan(position, counted.current, looped.current);
    indicator.style.transform = `translateX(${geometry.first + span.start * geometry.pitch}px)`;
    indicator.style.width = `${(span.end - span.start) * geometry.pitch}px`;
  }, []);

  // ─── Changes of the slide ──────────────────────────────────────────────────
  const pending = React.useRef<{ index: number; reason: Reason; side?: 1 | -1 } | null>(null);
  const shown = React.useRef(-1);
  /** The slide a hovering mouse found: leaving the box brings it back after a scrub. */
  const resting = React.useRef(current);
  const [announcement, setAnnouncement] = React.useState("");
  /** A slide that came in at once (a scrub): its own overlays fade in. */
  const [swapped, setSwapped] = React.useState<{ at: number; key: number }>({ at: -1, key: 0 });
  const focusDot = React.useRef(false);

  const request = (next: number, reason: Reason, side?: 1 | -1) => {
    if (next === current) return;
    pending.current = { index: next, reason, side };
    setIndex(next);
  };

  const step = (direction: 1 | -1, reason: Reason) => {
    if (count < 2) return;
    const next = current + direction;
    if (!looping && (next < 0 || next >= count)) {
      track.nudge(direction);
      return;
    }
    request((next + count) % count, reason, direction);
  };

  const slideName = (at: number) =>
    formatLabel(items[at]?.type === "video" ? labels.video : labels.photo, {
      current: at + 1,
      total: count,
    });

  React.useLayoutEffect(() => {
    track.reducedMotion = prefersReducedMotion();
    if (!dotsGeometry.current) measureDots();
    if (shown.current === current) return;
    const change = pending.current?.index === current ? pending.current : null;
    pending.current = null;
    const first = shown.current === -1;
    shown.current = current;
    track.width = rootRef.current?.clientWidth ?? 0;
    const instant = change?.reason === "scrub";
    track.moveTo(current, !first && !instant, change?.side);
    if (!instant) resting.current = current;
    if (instant && !track.reducedMotion) setSwapped((last) => ({ at: current, key: last.key + 1 }));
    if (change && !instant) setAnnouncement(slideName(current));
    if (focusDot.current) {
      focusDot.current = false;
      dotRefs.current[current]?.focus();
    }
  });

  // Every commit: the slides that came or went (`items`, `loop`) take their places.
  React.useLayoutEffect(() => {
    track.placeAll();
  });

  React.useEffect(() => () => track.destroy(), [track]);

  useResizeEffect(dotsRef, () => {
    measureDots();
    track.placeAll();
  });

  /** A carousel-level corner tells how much of its row it takes: a slide's overlays continue it. */
  const reportTaken = React.useCallback((placement: CarouselOverlayPlacement, px: number) => {
    rootRef.current?.style.setProperty(`--carousel-taken-${placement}`, `${px}px`);
  }, []);

  // ─── Which media mount ─────────────────────────────────────────────────────
  // The slides around the current one, every slide once a mouse or the focus came in (a scrub or
  // a key may go anywhere), and whatever mounted once stays.
  const [warm, setWarm] = React.useState(false);
  const mounted = React.useRef(new Set<number>());
  for (const at of warm ? items.map((_, i) => i) : pageWindow(current, count, looping)) {
    mounted.current.add(at);
  }
  const [initial] = React.useState(current);
  const near = useNearView(rootRef);
  const autoPlays = items.some((item) => item.type === "video" && item.autoPlay);
  const inView = useInView(rootRef, autoPlays);
  const [still] = React.useState(() => prefersReducedMotion() || savesData());

  // ─── Pointers ──────────────────────────────────────────────────────────────
  const hover = useMediaQuery(HOVER_QUERY);
  const scrubReady = React.useRef(false);
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      scrubReady.current = true;
    }, HOVER_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, []);
  const drag = React.useRef<{
    id: number;
    x: number;
    y: number;
    moved: boolean;
    dragging: boolean;
  } | null>(null);

  const onControl = (target: EventTarget) =>
    target instanceof Element &&
    target.closest(`[${CONTROL}], button, a[href], input, select, textarea`) !== null;

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    onPointerDown?.(event);
    const mouse = event.pointerType === "mouse";
    // A press while the mouse scrubs keeps the slide it found.
    if (mouse) resting.current = current;
    if (mouse && event.button !== 0) return;
    if (!many || !event.isPrimary || onControl(event.target)) return;
    track.width = event.currentTarget.clientWidth;
    track.grab(event.clientX, event.timeStamp);
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
      dragging: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    onPointerMove?.(event);
    const press = drag.current;
    if (press && press.id === event.pointerId) {
      if (!press.dragging) {
        const dx = event.clientX - press.x;
        const dy = event.clientY - press.y;
        // A mouse turns a press into a drag past the tremor of a click; a finger past its slop.
        const slop = event.pointerType === "mouse" ? DRAG_THRESHOLD_PX : PRESS_SLOP_PX;
        if (Math.hypot(dx, dy) <= slop) return;
        press.moved = true;
        if (Math.abs(dy) >= Math.abs(dx)) {
          // An upright drag is the page's: a finger scrolls it (`touch-action: pan-y`).
          drag.current = null;
          return;
        }
        press.dragging = true;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // A pointer the browser no longer tracks: the move events still come.
        }
        // Restart from here, so the slop does not show as a jump.
        track.grab(event.clientX, event.timeStamp);
        return;
      }
      track.drag(event.clientX, event.timeStamp);
      return;
    }
    if (event.pointerType !== "mouse" || !scrub || !hover || !many || !scrubReady.current) return;
    if (onControl(event.target)) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (box.width <= 0) return;
    const zone = Math.floor(((event.clientX - box.left) / box.width) * count);
    request(Math.min(count - 1, Math.max(0, zone)), "scrub");
  };

  const endPress = (event: React.PointerEvent<HTMLElement>, cancelled: boolean) => {
    const press = drag.current;
    if (!press || press.id !== event.pointerId) return;
    drag.current = null;
    // A press that travelled is not a click: the card around the carousel does not open.
    if (press.moved && rootRef.current) swallowNextClick(rootRef.current);
    if (!press.dragging) return;
    const direction = track.release(event.timeStamp, cancelled);
    if (direction !== 0) step(direction, "swipe");
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    onPointerEnter?.(event);
    if (event.pointerType !== "mouse") return;
    resting.current = current;
    setWarm(true);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    onPointerLeave?.(event);
    if (event.pointerType !== "mouse") return;
    // A scrub is a look, not a choice: the card shows its cover again.
    if (scrub && resting.current !== current) request(resting.current, "scrub");
  };

  // ─── Keys and presses ──────────────────────────────────────────────────────
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as Element;
    const own = target === event.currentTarget || target.closest(`[${CONTROL}]`) !== null;
    if (!own) return;
    const onDot = target.closest("[data-carousel-dot]") !== null;
    const go = (next: number, side?: 1 | -1) => {
      event.preventDefault();
      focusDot.current = onDot;
      if (next === current) return;
      request(next, "key", side);
    };
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      if (count < 2) return;
      event.preventDefault();
      focusDot.current = onDot;
      step(event.key === "ArrowRight" ? 1 : -1, "key");
    } else if (event.key === "Home" && count > 1) {
      go(0, -1);
    } else if (event.key === "End" && count > 1) {
      go(count - 1, 1);
    } else if (
      (event.key === "Enter" || event.key === " ") &&
      target === event.currentTarget &&
      onItemOpen &&
      count > 0
    ) {
      event.preventDefault();
      onItemOpen(current);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !onItemOpen || count === 0) return;
    if (opensRow(event)) onItemOpen(current);
  };

  // The slides, the dots and the count follow `loading` together: the viewport swaps at once.
  const swap = useSwapIn(loading ? "loading" : "data", undefined, false);

  // The carousel's overlays stand in their corners, in their order, nearest the corner first.
  const { parts: overlays, rest: others } = splitParts<CarouselOverlayProps>(
    flattenChildren(children),
    CarouselOverlay,
  );
  const slideOverlays = items.map((item, at) => renderOverlay?.(item, at));
  const split = edgeSplit(overlays, slideOverlays, items, dotted);

  const previous = usePartPresence<HTMLButtonElement>({
    present: many && (looping || current > 0),
    axis: "inline",
  });
  const next = usePartPresence<HTMLButtonElement>({
    present: many && (looping || current < count - 1),
    axis: "inline",
  });

  const dots = dotted ? (
    <div ref={dotsRef} className={styles.dots}>
      {items.map((_, at) => (
        <button
          // biome-ignore lint/suspicious/noArrayIndexKey: a dot is its place in the list
          key={at}
          ref={(node) => {
            dotRefs.current[at] = node;
          }}
          type="button"
          tabIndex={at === current ? 0 : -1}
          aria-label={slideName(at)}
          aria-current={at === current ? true : undefined}
          className={cx(styles.dot, touchTargetBlockClass)}
          data-carousel-dot=""
          {...{ [CONTROL]: "" }}
          onClick={() => request(at, "dot")}
        >
          <span className={cx(pill.inkMuted, styles.mark)} />
        </button>
      ))}
      <span ref={indicatorRef} className={cx(pill.ink, styles.indicator)} aria-hidden="true" />
    </div>
  ) : null;

  return (
    <section
      aria-roledescription={labels.carousel}
      aria-label={labels.region}
      aria-busy={loading || undefined}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the carousel is one stop that the arrow keys move through (WAI-ARIA APG carousel)
      tabIndex={0}
      {...rest}
      ref={mergedRef}
      className={cx(styles.root, className)}
      {...toDataAttributes({
        ratio,
        opens: (onItemOpen && count > 0) || undefined,
      })}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        endPress(event, false);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        endPress(event, true);
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={(event) => {
        onFocus?.(event);
        setWarm(true);
      }}
    >
      <div key={swap.key} className={cx(styles.viewport, swap.className)}>
        {loading ? (
          <Skeleton shape="block" className={styles.placeholder} />
        ) : count === 0 ? (
          <span className={styles.fallback} role="img" aria-label={labels.empty}>
            <Image />
          </span>
        ) : (
          items.map((item, at) => (
            <Slide
              // biome-ignore lint/suspicious/noArrayIndexKey: a slide is its place in the list; the same photo may stand twice
              key={at}
              item={item}
              current={at === current}
              name={slideName(at)}
              labels={labels}
              shade={dotted}
              register={(node) => track.setSlide(at, node)}
              mounted={mounted.current.has(at)}
              near={near}
              eager={at === initial}
              playing={at === current && Boolean(item.autoPlay) && inView && !still}
              overlays={slideOverlays[at]}
              split={split}
              entering={swapped.at === at ? swapped.key : 0}
            />
          ))
        )}
      </div>

      {others}

      <Corners
        layer="carousel"
        overlays={overlays}
        split={split}
        middle={dots}
        onTaken={reportTaken}
      />

      {arrows && many ? (
        <>
          {looping || current > 0 ? (
            <Button.Root
              ref={previous.ref}
              size="s"
              shape="circle"
              variant="shade"
              aria-label={labels.previous}
              className={cx(styles.arrow, styles.previous, previous.className)}
              {...{ [CONTROL]: "" }}
              onClick={() => step(-1, "step")}
            >
              <Button.Icon>
                <ChevronLeft />
              </Button.Icon>
            </Button.Root>
          ) : null}
          {looping || current < count - 1 ? (
            <Button.Root
              ref={next.ref}
              size="s"
              shape="circle"
              variant="shade"
              aria-label={labels.next}
              className={cx(styles.arrow, styles.next, next.className)}
              {...{ [CONTROL]: "" }}
              onClick={() => step(1, "step")}
            >
              <Button.Icon>
                <ChevronRight />
              </Button.Icon>
            </Button.Root>
          ) : null}
        </>
      ) : null}

      <VisuallyHidden live="polite">{announcement}</VisuallyHidden>
    </section>
  );
}
CarouselRoot.displayName = "Carousel.Root";

/**
 * One slide: its media, the fade under the bottom line, and its own overlays on its layer — they
 * travel with it under the finger and the spring, and fade in when it arrives at once (a scrub).
 */
function Slide({
  item,
  current,
  name,
  labels,
  shade,
  register,
  mounted,
  near,
  eager,
  playing,
  overlays,
  split,
  entering,
}: {
  item: CarouselItem;
  current: boolean;
  name: string;
  labels: CarouselLabels;
  shade: boolean;
  register: (node: HTMLElement | null) => void;
  mounted: boolean;
  near: boolean;
  eager: boolean;
  playing: boolean;
  overlays: React.ReactNode;
  split: EdgeSplit;
  entering: number;
}) {
  const [bar, setBar] = React.useState<HTMLElement | null>(null);
  const video = item.type === "video";
  const own = splitParts<CarouselOverlayProps>(flattenChildren(overlays), CarouselOverlay).parts;
  return (
    // biome-ignore lint/a11y/useSemanticElements: a slide is a group of the APG carousel pattern, not a form fieldset
    <div
      ref={register}
      role="group"
      aria-roledescription={labels.slide}
      aria-label={name}
      aria-hidden={current ? undefined : true}
      inert={!current}
      className={styles.slide}
    >
      {video ? (
        <VideoSlide
          item={item}
          bar={bar}
          mounted={near && mounted}
          playing={playing}
          labels={labels}
        />
      ) : (
        <ImageSlide item={item} mounted={mounted} eager={eager} labels={labels} />
      )}
      {shade ? <span className={cx(pill.fade, styles.shade)} aria-hidden="true" /> : null}
      {own.length > 0 || video ? (
        <Corners
          key={entering}
          layer="slide"
          overlays={own}
          split={split}
          barSlot={video ? setBar : undefined}
          middle={shade ? <span className={styles.dotsRoom} /> : null}
          className={entering > 0 ? enterMotion.enterFade : undefined}
        />
      ) : null}
    </div>
  );
}

/** The skeleton while a slide's media loads, the image tile once it failed. */
function SlideState({ status, labels }: { status: ImageStatus; labels: CarouselLabels }) {
  if (status === "error") {
    return (
      <span className={styles.fallback} role="img" aria-label={labels.loadError}>
        <Image />
      </span>
    );
  }
  if (status === "loaded") return null;
  return <Skeleton shape="block" className={styles.placeholder} />;
}

function ImageSlide({
  item,
  mounted,
  eager,
  labels,
}: {
  item: CarouselItem;
  mounted: boolean;
  eager: boolean;
  labels: CarouselLabels;
}) {
  const [status, setStatus] = React.useState<ImageStatus>("loading");
  return (
    <>
      <SlideState status={status === "idle" ? "loading" : status} labels={labels} />
      {mounted ? <SlideImage key={item.src} item={item} eager={eager} report={setStatus} /> : null}
    </>
  );
}

function SlideImage({
  item,
  eager,
  report,
}: {
  item: CarouselItem;
  eager: boolean;
  report: (status: ImageStatus) => void;
}) {
  const image = useImageStatus(report);
  return (
    <img
      src={item.src}
      alt={item.alt ?? ""}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={styles.media}
      data-status={image.status}
      onLoad={image.onLoad}
      onError={image.onError}
    />
  );
}

/**
 * A video slide: its first frame (or `poster`) with the play mark and the length, the look of
 * `Thumbnail.Video`. With `autoPlay` it plays in place, muted, while it is the current slide and
 * the carousel is in view (never under reduced motion or data saving); its sound button gives it
 * sound, one sound at a time. A clip without `loop` stops on its last frame under the play mark.
 */
function VideoSlide({
  item,
  bar,
  mounted,
  playing: shouldPlay,
  labels,
}: {
  item: CarouselItem;
  /** The slide's bottom-end corner: its length and sound button lead it. */
  bar: HTMLElement | null;
  mounted: boolean;
  playing: boolean;
  labels: CarouselLabels;
}) {
  const [status, setStatus] = React.useState<ImageStatus>("loading");
  const [metaDuration, setMetaDuration] = React.useState<number | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const duration = item.duration ?? metaDuration;
  const sound = usePartPresence<HTMLButtonElement>({ present: playing, axis: "inline" });
  const SoundGlyph = muted ? VolumeX : Volume2;

  return (
    <>
      <SlideState status={status === "idle" ? "loading" : status} labels={labels} />
      {mounted ? (
        <SlideVideo
          key={item.src}
          item={item}
          play={shouldPlay}
          muted={muted}
          report={setStatus}
          onDuration={setMetaDuration}
          onPlayingChange={setPlaying}
        />
      ) : null}
      {status === "error" ? null : (
        <>
          <MediaPlayMark shown={!playing} className={styles.play} />
          {bar
            ? createPortal(
                <>
                  {duration !== null ? (
                    <span className={cx(textRole.caption, pill.pill)}>{formatClock(duration)}</span>
                  ) : null}
                  {playing ? (
                    <Button.Root
                      ref={sound.ref}
                      size="xs"
                      shape="circle"
                      variant="shade"
                      aria-label={muted ? labels.unmute : labels.mute}
                      className={sound.className}
                      {...{ [CONTROL]: "" }}
                      onClick={() => setMuted(!muted)}
                    >
                      <Button.Icon>
                        <SoundGlyph />
                      </Button.Icon>
                    </Button.Root>
                  ) : null}
                </>,
                bar,
              )
            : null}
        </>
      )}
    </>
  );
}

function SlideVideo({
  item,
  play,
  muted,
  report,
  onDuration,
  onPlayingChange,
}: {
  item: CarouselItem;
  play: boolean;
  muted: boolean;
  report: (status: ImageStatus) => void;
  onDuration: (seconds: number) => void;
  onPlayingChange: (playing: boolean) => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  // Played with sound, it is the one sound of the page (`internal/mediaSession`).
  useMediaSession(videoRef);
  const media = useImageStatus<HTMLVideoElement>(report);

  React.useEffect(() => {
    // React writes no `muted` attribute: the property is set on the node, before it can play.
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (play) {
      // A clip that ran to its end starts again when it comes back.
      if (video.ended) video.currentTime = 0;
      const started = video.play();
      if (started && typeof started.catch === "function") started.catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  }, [play]);

  return (
    // biome-ignore lint/a11y/useMediaCaption: an item brings no captions track; a preview plays muted
    <video
      ref={videoRef}
      src={item.poster ? item.src : firstFrame(item.src)}
      poster={item.poster}
      preload="metadata"
      playsInline
      loop={item.loop ?? true}
      aria-label={item.alt}
      className={styles.media}
      data-status={media.status}
      // Without a poster the first frame is the picture: loaded once it is drawn. With a poster
      // the poster is the picture: loaded once the metadata is in.
      onLoadedData={(event) => {
        if (!item.poster) media.onLoad(event);
      }}
      onLoadedMetadata={(event) => {
        const seconds = event.currentTarget.duration;
        if (Number.isFinite(seconds)) onDuration(seconds);
        if (item.poster) media.onLoad(event);
      }}
      onError={media.onError}
      onPlay={() => onPlayingChange(true)}
      onPause={() => onPlayingChange(false)}
      onEnded={() => onPlayingChange(false)}
    />
  );
}

export type CarouselOverlayPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end";

/**
 * Keeps a corner to one row: an overlay that does not fit beside the ones before it (a narrow
 * card, a long badge in the other corner) steps aside — hidden and inert — until there is room.
 * The order of the overlays is their priority. Returns the inline size the row takes, with the
 * gap that would follow it (`0` when empty).
 */
function fitCorner(corner: HTMLElement): number {
  const items = Array.from(corner.children) as HTMLElement[];
  for (const item of items) {
    item.removeAttribute("data-hidden");
    item.inert = false;
  }
  const shown = items.filter((item) => item.offsetParent !== null);
  const first = shown[0];
  if (!first) return 0;
  let start = Number.POSITIVE_INFINITY;
  let end = Number.NEGATIVE_INFINITY;
  for (const item of shown) {
    if (Math.abs(item.offsetTop - first.offsetTop) > 1) {
      item.setAttribute("data-hidden", "true");
      item.inert = true;
      continue;
    }
    start = Math.min(start, item.offsetLeft);
    end = Math.max(end, item.offsetLeft + item.offsetWidth);
  }
  const gap = Number.parseFloat(getComputedStyle(corner).columnGap) || 0;
  return end > start ? end - start + gap : 0;
}

function OverlayCorner({
  placement,
  children,
  slot,
  onTaken,
}: {
  placement: CarouselOverlayPlacement;
  children: React.ReactNode;
  slot?: (node: HTMLElement | null) => void;
  onTaken?: (placement: CarouselOverlayPlacement, px: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const fit = () => {
    if (!ref.current) return;
    const taken = fitCorner(ref.current);
    onTaken?.(placement, taken);
  };
  React.useLayoutEffect(fit);
  useResizeEffect(ref, fit, { children: true });
  return (
    <div ref={ref} className={styles.corner} data-placement={placement}>
      {slot ? <span ref={slot} className={styles.bar} /> : null}
      {children}
    </div>
  );
}

/**
 * How an edge's two corners split its width. `share`: each takes what its row needs, a corner
 * whose opposite is empty takes the whole edge, and when both do not fit they give way evenly.
 * `half`: each its half — the bottom edge with the dots between (they stay centred), and an edge
 * where both the carousel's and a slide's overlays stand (two layers cannot measure each other).
 */
type EdgeSplit = { top: "share" | "half"; bottom: "share" | "half" };

const edgeOf = (overlay: React.ReactElement<CarouselOverlayProps>) =>
  (overlay.props.placement ?? "top-start").startsWith("top") ? "top" : "bottom";

function edgeSplit(
  overlays: React.ReactElement<CarouselOverlayProps>[],
  slideOverlays: React.ReactNode[],
  items: readonly CarouselItem[],
  dotted: boolean,
): EdgeSplit {
  const own = new Set(overlays.map(edgeOf));
  const slides = new Set<"top" | "bottom">();
  slideOverlays.forEach((node, at) => {
    for (const part of splitParts<CarouselOverlayProps>(flattenChildren(node), CarouselOverlay)
      .parts) {
      slides.add(edgeOf(part));
    }
    // A video slide stands its length and sound button in its bottom-end corner.
    if (items[at]?.type === "video") slides.add("bottom");
  });
  const both = (edge: "top" | "bottom") => own.has(edge) && slides.has(edge);
  return {
    top: both("top") ? "half" : "share",
    bottom: dotted || both("bottom") ? "half" : "share",
  };
}

/**
 * The four corners on the media: a top and a bottom edge, each its start and its end corner; on
 * the bottom edge the dots stand centred between them. The carousel's layer stands still; a
 * slide's layer is the same grid on the slide, its corners continuing the carousel's rows.
 */
function Corners({
  layer,
  overlays,
  split,
  middle,
  barSlot,
  onTaken,
  className,
}: {
  layer: "carousel" | "slide";
  overlays: React.ReactElement<CarouselOverlayProps>[];
  split: EdgeSplit;
  middle?: React.ReactNode;
  barSlot?: (node: HTMLElement | null) => void;
  onTaken?: (placement: CarouselOverlayPlacement, px: number) => void;
  className?: string;
}) {
  const at = (placement: CarouselOverlayPlacement) =>
    overlays.filter((overlay) => (overlay.props.placement ?? "top-start") === placement);
  return (
    <div className={cx(styles.layer, className)} data-layer={layer}>
      <div className={styles.edge} data-edge="top" data-split={split.top}>
        <OverlayCorner placement="top-start" onTaken={onTaken}>
          {at("top-start")}
        </OverlayCorner>
        <OverlayCorner placement="top-end" onTaken={onTaken}>
          {at("top-end")}
        </OverlayCorner>
      </div>
      <div className={styles.edge} data-edge="bottom" data-split={split.bottom}>
        <OverlayCorner placement="bottom-start" onTaken={onTaken}>
          {at("bottom-start")}
        </OverlayCorner>
        {middle}
        <OverlayCorner placement="bottom-end" slot={barSlot} onTaken={onTaken}>
          {at("bottom-end")}
        </OverlayCorner>
      </div>
    </div>
  );
}

export type CarouselOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  placement?: CarouselOverlayPlacement;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Content on the media in a corner (a status pill, a plate badge): clear of the dots and the
 * arrows. A child of the root belongs to the carousel and stands still; one returned by
 * `renderOverlay` belongs to its slide and travels with it, after the carousel's in the same row.
 * Overlays of one corner stand in a row in their order, nearest the corner first; one that does not
 * fit steps aside. It lets the swipe and the scrub through; its own controls take presses.
 */
function CarouselOverlay({ placement = "top-start", className, ...rest }: CarouselOverlayProps) {
  return <div className={cx(styles.overlay, className)} data-placement={placement} {...rest} />;
}
CarouselOverlay.displayName = "Carousel.Overlay";

export const Carousel = {
  Root: CarouselRoot,
  Overlay: CarouselOverlay,
};
