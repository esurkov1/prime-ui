/**
 * The gesture engine of MediaViewer: one imperative object per open viewer that turns pointers,
 * the wheel and commands into transforms, written straight to the DOM once per frame — React
 * renders only when the page, the zoom or the gesture state changes. The page track slides with a
 * spring, a pinch zooms about the fingers, a pan coasts with iOS momentum and bounces off the edges,
 * a vertical drag carries the picture away to close, a double tap zooms to a point, and open / close
 * glide between the picture and the thumbnail it came from.
 */
import {
  clamp,
  clampPan,
  coverScale,
  decayVelocity,
  emphasized,
  PAGE_DISTANCE,
  PAGE_FLICK,
  PAGE_RADIUS,
  type Point,
  pageOffset,
  panLimit,
  releaseVelocity,
  rubberBand,
  rubberClamp,
  type Sample,
  SETTLE_SPRING,
  type Size,
  type SpringState,
  softScale,
  springSettled,
  stepSpring,
  zoomAbout,
} from "@/internal/physics";

/** A page of the viewer as the DOM has it: its slide, the box that zooms and its fitted size. */
export type ViewerSlot = {
  slide: HTMLElement;
  zoom: HTMLElement;
  /** The media fitted into the stage (`object-fit: contain`), px. */
  box: Size;
  /** Images zoom; a video stays at its fit. */
  zoomable: boolean;
};

export type ViewerEngineCallbacks = {
  /** A page change the engine settled on (a swipe, a step). */
  onIndexChange: (index: number) => void;
  /** The current page zoomed in or came back to its fit; `byGesture` — a pinch, a double tap, the wheel. */
  onZoomChange: (zoomed: boolean, byGesture: boolean) => void;
  /** A tap that is not part of a double tap: the target and the pointer type. */
  onTap: (target: Element, pointerType: string) => void;
  /**
   * A far page (a thumbnail, Home / End) is borrowed as the neighbour it slides in from, or the
   * borrowing ended (`null`): React keeps it mounted meanwhile.
   */
  onTransitChange: (target: number | null) => void;
  /** A drag (page, pan, pinch, dismiss) started or ended: the chrome steps aside meanwhile. */
  onGestureChange: (gesture: GestureKind | null) => void;
  /** A vertical swipe let go far or fast enough to close. */
  onDismiss: () => void;
};

export type GestureKind = "page" | "pan" | "pinch" | "dismiss";

/** Four numbers clockwise from the top (insets) or from the top-left corner (radii). */
type Quad = [number, number, number, number];

/** A rect in viewport px. */
export type ViewerRect = { left: number; top: number; right: number; bottom: number };

/**
 * Where a picture opens from or closes into, as it is seen on the page: the box of its media
 * element, the part of it that shows (cut by the scrollers and rounded frames around it), and the
 * radius of each corner of that part (top-left, top-right, bottom-right, bottom-left).
 */
export type ViewerOrigin = { rect: ViewerRect; visible: ViewerRect; radii: Quad };

/** A pose of the current picture during open and close: where its box is and how it is cut. */
type Pose = {
  /** Offset of the box centre from the stage centre, px. */
  x: number;
  y: number;
  scale: number;
  /** The visible part of the box: inset from each side (top, right, bottom, left), box px. */
  inset: Quad;
  /** Corner radii of the visible part, box px. */
  radii: Quad;
  opacity: number;
  backdrop: number;
};

const NONE: Quad = [0, 0, 0, 0];
const REST: Pose = { x: 0, y: 0, scale: 1, inset: NONE, radii: NONE, opacity: 1, backdrop: 1 };

/** `clip-path` of a pose: its cut and its corners; none at rest. */
function clipOf({ inset, radii }: Pose): string {
  if ([...inset, ...radii].every((value) => value < 0.25)) return "";
  const px = (quad: Quad) => quad.map((value) => `${value}px`).join(" ");
  return `inset(${px(inset)} round ${px(radii)})`;
}

type Tween = {
  from: Pose;
  to: Pose;
  start: number;
  duration: number;
  done: () => void;
};

/** Never starts a gesture: the viewer's own controls and anything that takes text or a value. */
const NO_GESTURE =
  "button, a[href], input, textarea, select, [role='slider'], [contenteditable], [data-viewer-chrome]";

/** Distance before a press becomes a drag. */
const SLOP_PX = 8;
/** A second tap within this time and distance of the first is a double tap. */
const DOUBLE_TAP_MS = 280;
const DOUBLE_TAP_PX = 32;
/** A press held longer is not a tap. */
const TAP_MS = 400;
/** Share of the stage height past which a vertical release closes. */
const DISMISS_DISTANCE = 0.12;
const DISMISS_FLICK = 0.45;
/** How small the picture gets as it is dragged a full stage height away. */
const DISMISS_SHRINK = 0.35;
/** Wheel lines and pages to px. */
const WHEEL_LINE_PX = 16;
/** Horizontal wheel travel (a two-finger trackpad swipe) that turns one page. */
const WHEEL_PAGE_PX = 48;
/** The wheel is still for this long: the next swipe may turn another page. */
const WHEEL_IDLE_MS = 220;
/** Scale counted as the fit: below it the picture is not zoomed. */
const ZOOM_EPSILON = 1.01;

type Pointer = { x: number; y: number; type: string };

type Drag = {
  kind: GestureKind | "pending" | "none";
  id: number;
  start: Point;
  last: Point;
  time: number;
  target: Element;
  samples: Sample[];
  pagerStart: number;
  panStart: Point;
};

type Pinch = {
  distance: number;
  mid: Point;
  scale: number;
  pan: Point;
};

/** Momentum of one axis of a pan: coasting, springing back to an edge, or still. */
type Coast = { mode: "decay" | "spring" | "rest"; velocity: number; target: number };

export class ViewerEngine {
  // ─── Configuration (React writes it every render) ──────────────────────────
  count = 0;
  index = 0;
  loop = false;
  maxZoom = 4;
  canDismiss = true;
  reducedMotion = false;
  /** The page gap, px. */
  gap = 24;
  area: Size = { width: 0, height: 0 };
  rtl = false;
  callbacks: ViewerEngineCallbacks;

  // ─── DOM ───────────────────────────────────────────────────────────────────
  private stage: HTMLElement | null = null;
  private backdrop: HTMLElement | null = null;
  private slots = new Map<number, ViewerSlot>();

  // ─── State ─────────────────────────────────────────────────────────────────
  private pager: SpringState = { value: 0, velocity: 0 };
  /** Where the pager springs to, px, or `null` while it is held or at rest. */
  private pagerTarget: number | null = null;
  /** The page the running pager animation turns to: -1, +1, or 0 for a bounce back. */
  private pendingStep = 0;
  /** A far page standing in as the neighbour on the side of `transitDir` while it slides in. */
  private transit: number | null = null;
  private transitDir = 0;
  /** The fractional page on screen last told to `positionListener`. */
  private position = Number.NaN;
  /**
   * Follows the page on screen as a fractional index on every frame: 2.4 is four tenths of the
   * way from item 2 to the next one (the filmstrip glides along with it).
   */
  positionListener: ((position: number) => void) | null = null;

  private scale: SpringState = { value: 1, velocity: 0 };
  private panX: SpringState = { value: 0, velocity: 0 };
  private panY: SpringState = { value: 0, velocity: 0 };
  private zoomTarget: { scale: number; x: number; y: number } | null = null;
  private coastX: Coast = { mode: "rest", velocity: 0, target: 0 };
  private coastY: Coast = { mode: "rest", velocity: 0, target: 0 };
  private zoomed = false;

  private dismiss: SpringState = { value: 0, velocity: 0 };
  private dismissTarget: number | null = null;

  private tween: Tween | null = null;
  /** The pose a finished open or close leaves (closed: held until the viewer unmounts). */
  private hold: Pose | null = null;

  private pointers = new Map<number, Pointer>();
  private drag: Drag | null = null;
  private pinch: Pinch | null = null;
  private lastTap: { t: number; x: number; y: number } | null = null;
  private tapTimer = 0;
  private wheelAccum = 0;
  private wheelLocked = false;
  private wheelTimer = 0;

  private frame = 0;
  private lastFrame = 0;
  private gesture: GestureKind | null = null;

  constructor(callbacks: ViewerEngineCallbacks) {
    this.callbacks = callbacks;
  }

  // ─── Wiring ────────────────────────────────────────────────────────────────

  attach(stage: HTMLElement, backdrop: HTMLElement): () => void {
    this.stage = stage;
    this.backdrop = backdrop;
    stage.addEventListener("pointerdown", this.onPointerDown);
    stage.addEventListener("wheel", this.onWheel, { passive: false });
    // Safari's own pinch would zoom the page under the viewer.
    stage.addEventListener("gesturestart", prevent);
    return () => {
      stage.removeEventListener("pointerdown", this.onPointerDown);
      stage.removeEventListener("wheel", this.onWheel);
      stage.removeEventListener("gesturestart", prevent);
      this.unlisten();
      cancelAnimationFrame(this.frame);
      window.clearTimeout(this.tapTimer);
      window.clearTimeout(this.wheelTimer);
      this.frame = 0;
      this.stage = null;
      this.backdrop = null;
    };
  }

  /** Registers (or with `null` removes) the page of item `index`. */
  setSlot(index: number, slot: ViewerSlot | null): void {
    if (slot) this.slots.set(index, slot);
    else this.slots.delete(index);
  }

  /** The page React shows changed from outside (a thumbnail, a controlled `index`): jump there. */
  syncIndex(index: number): void {
    if (index === this.index) return;
    this.index = index;
    this.pager = { value: 0, velocity: 0 };
    this.pagerTarget = null;
    this.pendingStep = 0;
    this.endTransit();
    this.resetZoom();
  }

  /** The stage resized: the zoom keeps its scale but stays inside the new limits. */
  setArea(area: Size): void {
    if (area.width === this.area.width && area.height === this.area.height) return;
    this.area = area;
    this.pagerTarget = null;
    this.pager = { value: 0, velocity: 0 };
    if (this.pendingStep !== 0) this.commitStep();
    const slot = this.current();
    if (slot) {
      const pan = clampPan(
        { x: this.panX.value, y: this.panY.value },
        slot.box,
        this.scale.value,
        area,
      );
      this.panX.value = pan.x;
      this.panY.value = pan.y;
    }
  }

  /** Paints the current state: after React mounted or moved a slide. */
  paint = (): void => {
    const width = this.area.width + this.gap;
    const tween = this.tween ? this.tweenPose(performance.now()) : this.hold;
    for (const [index, slot] of this.slots) {
      const offset = this.relative(index);
      if (offset === null) {
        slot.slide.style.visibility = "hidden";
        continue;
      }
      slot.slide.style.visibility = "";
      const x = (this.rtl ? -1 : 1) * offset * width + this.pager.value;
      slot.slide.style.transform = `translate3d(${x}px, 0, 0)`;
      const zoom = slot.zoom;
      if (offset !== 0) {
        zoom.style.transform = "";
        zoom.style.clipPath = "";
        zoom.style.opacity = tween ? "0" : "";
        continue;
      }
      if (tween) {
        zoom.style.transform = `translate3d(${tween.x}px, ${tween.y}px, 0) scale(${tween.scale})`;
        zoom.style.clipPath = clipOf(tween);
        zoom.style.opacity = `${tween.opacity}`;
        continue;
      }
      const shrink =
        1 -
        Math.min(1, Math.abs(this.dismiss.value) / Math.max(1, this.area.height)) * DISMISS_SHRINK;
      zoom.style.transform = `translate3d(${this.panX.value}px, ${this.panY.value + this.dismiss.value}px, 0) scale(${this.scale.value * shrink})`;
      zoom.style.clipPath = "";
      zoom.style.opacity = "";
    }
    if (this.backdrop) {
      const away = Math.min(1, Math.abs(this.dismiss.value) / Math.max(1, this.area.height * 0.6));
      this.backdrop.style.opacity = `${tween ? tween.backdrop : 1 - away}`;
    }
    this.emitPosition();
  };

  /** The page on screen as a fractional index: the track's offset read in pages. */
  private emitPosition(): void {
    const width = this.area.width + this.gap;
    // +1 is a whole page toward the next item in reading order.
    const progress = width > 0 ? ((this.rtl ? 1 : -1) * this.pager.value) / width : 0;
    const borrowed = this.transit !== null && progress * this.transitDir > 0;
    const position = borrowed
      ? this.index + ((this.transit as number) - this.index) * Math.abs(progress)
      : this.index + progress;
    if (Math.abs(position - this.position) < 1e-4) return;
    this.position = position;
    this.positionListener?.(position);
  }

  /** Tells a listener that just subscribed where the track stands. */
  replayPosition(): void {
    this.position = Number.NaN;
    this.emitPosition();
  }

  // ─── Commands ──────────────────────────────────────────────────────────────

  /** Turns one page (`1` next, `-1` previous, in reading order); at an end the track bounces. */
  step(direction: 1 | -1): void {
    if (this.tween) return;
    if (this.pendingStep !== 0) {
      // A step while the last one still slides: settle it at once, keep the track where it is.
      this.commitStep();
    }
    this.resetZoomAnimated();
    if (!this.canStep(direction)) {
      // The edge answers with a nudge: the track gives a little and springs back.
      this.pager.velocity = (this.rtl ? 1 : -1) * direction * 1.2;
      this.animatePager(0, 0);
      return;
    }
    this.animatePager(this.pagerFor(direction), direction);
  }

  /**
   * Slides to item `target`. A neighbour is one step; a far item is borrowed as the neighbour on its
   * side and slides in the same way — never a cut or a fade, however far it is.
   */
  go(target: number): void {
    if (this.tween || target < 0 || target >= this.count) return;
    if (this.pendingStep !== 0) this.commitStep();
    if (target === this.index) return;
    const offset = pageOffset(target, this.index, this.count, this.looping);
    if (offset === 1 || offset === -1) {
      this.step(offset);
      return;
    }
    // Far: the direction of the item list, so the filmstrip glides the same way the page does.
    const direction = target > this.index ? 1 : -1;
    this.resetZoomAnimated();
    this.transit = target;
    this.transitDir = direction;
    this.callbacks.onTransitChange(target);
    this.animatePager(this.pagerFor(direction), direction);
  }

  private endTransit(): void {
    if (this.transit === null) return;
    this.transit = null;
    this.transitDir = 0;
    this.callbacks.onTransitChange(null);
  }

  /** Zooms in by a step about `focus` (stage-centre relative), or to fit with `null`. */
  zoomBy(factor: number | null, focus: Point = { x: 0, y: 0 }): void {
    const slot = this.current();
    if (!slot?.zoomable || this.tween) return;
    if (factor === null) {
      this.animateZoom(1, { x: 0, y: 0 });
      return;
    }
    const from = this.zoomTarget?.scale ?? this.scale.value;
    const to = clamp(from * factor, 1, this.maxZoom);
    const pan = zoomAbout(
      { x: this.zoomTarget?.x ?? this.panX.value, y: this.zoomTarget?.y ?? this.panY.value },
      from,
      to,
      focus,
    );
    this.animateZoom(to, clampPan(pan, slot.box, to, this.area));
  }

  /**
   * Opens from `origin` (a thumbnail's rect and corner radius) or, without one, rises from a
   * slight shrink while it fades in; the backdrop fades in meanwhile.
   */
  open(origin: ViewerOrigin | null, duration: number, done: () => void): void {
    const from = this.originPose(origin) ?? { ...REST, scale: 0.92, opacity: 0, backdrop: 0 };
    this.hold = null;
    this.startTween(from, REST, duration, () => {
      this.hold = null;
      done();
    });
  }

  /**
   * Closes from wherever the picture is (zoomed, half swiped away) into `origin`, or with a slight
   * shrink and a fade; the backdrop fades out. The final pose holds until the viewer unmounts.
   */
  close(origin: ViewerOrigin | null, duration: number, done: () => void): void {
    this.cancelDrag();
    this.coastX.mode = "rest";
    this.coastY.mode = "rest";
    this.zoomTarget = null;
    this.dismissTarget = null;
    const now = this.tween ? this.tweenPose(performance.now()) : null;
    const shrink =
      1 -
      Math.min(1, Math.abs(this.dismiss.value) / Math.max(1, this.area.height)) * DISMISS_SHRINK;
    const away = Math.min(1, Math.abs(this.dismiss.value) / Math.max(1, this.area.height * 0.6));
    const from: Pose = now ?? {
      ...REST,
      x: this.panX.value + this.pager.value,
      y: this.panY.value + this.dismiss.value,
      scale: this.scale.value * shrink,
      backdrop: 1 - away,
    };
    // The page track stands still under the closing picture: its offset moves into the pose.
    this.pager = { value: 0, velocity: 0 };
    this.pagerTarget = null;
    this.pendingStep = 0;
    const to = this.originPose(origin) ?? {
      ...from,
      scale: from.scale * 0.92,
      opacity: 0,
      backdrop: 0,
    };
    this.startTween(from, { ...to, backdrop: 0 }, duration, () => {
      this.hold = { ...to, backdrop: 0 };
      done();
    });
  }

  // ─── Pointer gestures ──────────────────────────────────────────────────────

  private onPointerDown = (event: PointerEvent): void => {
    if (this.tween || this.hold) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as Element;
    if (target.closest(NO_GESTURE)) return;
    // The picture would otherwise be dragged out as a file, or the text under it selected.
    event.preventDefault();
    this.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      type: event.pointerType,
    });
    try {
      this.stage?.setPointerCapture?.(event.pointerId);
    } catch {
      // A pointer that is no longer active (lifted already): the window listeners still follow it.
    }
    if (this.pointers.size === 1) this.listen();
    // A touch catches what moves: the pan stops coasting, a page in flight is held.
    this.coastX.mode = "rest";
    this.coastY.mode = "rest";

    if (this.pointers.size === 2) {
      window.clearTimeout(this.tapTimer);
      this.lastTap = null;
      this.startPinch();
      return;
    }
    if (this.pointers.size > 2) return;

    this.pagerTarget = null;
    this.dismissTarget = null;
    this.zoomTarget = null;
    this.drag = {
      kind: "pending",
      id: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      last: { x: event.clientX, y: event.clientY },
      time: event.timeStamp,
      target,
      samples: [{ t: event.timeStamp, x: event.clientX, y: event.clientY }],
      pagerStart: this.pager.value,
      panStart: { x: this.panX.value, y: this.panY.value },
    };
  };

  private onPointerMove = (event: PointerEvent): void => {
    const pointer = this.pointers.get(event.pointerId);
    if (!pointer) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    if (this.pinch) {
      this.movePinch();
      return;
    }
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    drag.last = { x: event.clientX, y: event.clientY };
    drag.samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
    if (drag.samples.length > 12) drag.samples.shift();
    const dx = event.clientX - drag.start.x;
    const dy = event.clientY - drag.start.y;

    if (drag.kind === "pending") {
      if (Math.hypot(dx, dy) < SLOP_PX) return;
      drag.kind = this.decide(dx, dy);
      if (drag.kind === "none") return;
      // Restart from here, so the slop does not show as a jump.
      drag.start = { x: event.clientX, y: event.clientY };
      drag.pagerStart = this.pager.value;
      drag.panStart = { x: this.panX.value, y: this.panY.value };
      this.setGesture(drag.kind);
      return;
    }
    event.preventDefault();
    if (drag.kind === "page") this.movePage(dx);
    else if (drag.kind === "pan") this.movePan(dx, dy);
    else if (drag.kind === "dismiss") this.dismiss.value = dy;
    this.schedule();
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.delete(event.pointerId);
    const cancelled = event.type === "pointercancel";

    if (this.pinch) {
      // One finger off ends the pinch; the other is left alone until it lifts too.
      if (this.pointers.size < 2) this.endPinch();
      if (this.pointers.size === 0) this.unlisten();
      return;
    }
    if (this.pointers.size === 0) this.unlisten();
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    this.drag = null;

    if (drag.kind === "pending") {
      if (!cancelled && event.timeStamp - drag.time < TAP_MS) this.tap(drag.target, event);
      return;
    }
    const velocity = cancelled ? { x: 0, y: 0 } : releaseVelocity(drag.samples, event.timeStamp);
    this.setGesture(null);
    if (drag.kind === "page") this.releasePage(velocity.x);
    else if (drag.kind === "pan") this.releasePan(velocity);
    else if (drag.kind === "dismiss") this.releaseDismiss(velocity.y);
  };

  /** What a drag that left the slop is, from its direction and the zoom. */
  private decide(dx: number, dy: number): GestureKind | "none" {
    const horizontal = Math.abs(dx) > Math.abs(dy);
    if (this.pager.value !== 0) return "page";
    if (this.zoomed) {
      // At the edge of a zoomed picture a sideways drag turns the page, as in Photos.
      const limit = this.limit();
      const atEdge = dx > 0 ? this.panX.value >= limit.x - 1 : this.panX.value <= -limit.x + 1;
      return horizontal && atEdge && this.count > 1 ? "page" : "pan";
    }
    if (horizontal) return "page";
    return this.canDismiss ? "dismiss" : "none";
  }

  private movePage(dx: number): void {
    const width = this.area.width + this.gap;
    let value = this.slotsOffsetStart() + dx;
    // `value` > 0 shows the page before in reading order (after, in RTL).
    const towardPrevious = this.rtl ? value < 0 : value > 0;
    const blocked = towardPrevious ? !this.canStep(-1) : !this.canStep(1);
    if (blocked) value = rubberBand(value, this.area.width);
    this.pager.value = clamp(value, -width, width);
  }

  private slotsOffsetStart(): number {
    return this.drag?.pagerStart ?? 0;
  }

  private movePan(dx: number, dy: number): void {
    const drag = this.drag;
    if (!drag) return;
    const limit = this.limit();
    this.panX.value = rubberClamp(drag.panStart.x + dx, -limit.x, limit.x, this.area.width);
    this.panY.value = rubberClamp(drag.panStart.y + dy, -limit.y, limit.y, this.area.height);
  }

  private releasePage(velocity: number): void {
    const width = this.area.width + this.gap;
    const value = this.pager.value;
    // Reading order: a drag to the left (`value` < 0) reveals the next page, mirrored in RTL.
    const sign = this.rtl ? 1 : -1;
    let direction: 1 | -1 | 0 = 0;
    if (value * sign > width * PAGE_DISTANCE || (value * sign > 0 && velocity * sign > PAGE_FLICK))
      direction = 1;
    else if (
      value * sign < -width * PAGE_DISTANCE ||
      (value * sign < 0 && velocity * sign < -PAGE_FLICK)
    )
      direction = -1;
    if (direction !== 0 && !this.canStep(direction)) direction = 0;
    this.pager.velocity = velocity;
    this.animatePager(direction === 0 ? 0 : this.pagerFor(direction), direction);
  }

  private releasePan(velocity: Point): void {
    const limit = this.limit();
    this.coastX = this.coastFrom(this.panX.value, velocity.x, limit.x);
    this.coastY = this.coastFrom(this.panY.value, velocity.y, limit.y);
    this.panX.velocity = velocity.x;
    this.panY.velocity = velocity.y;
    if (this.reducedMotion) {
      const pan = clampPan(
        { x: this.panX.value, y: this.panY.value },
        this.slotBox(),
        this.scale.value,
        this.area,
      );
      this.panX = { value: pan.x, velocity: 0 };
      this.panY = { value: pan.y, velocity: 0 };
      this.coastX.mode = "rest";
      this.coastY.mode = "rest";
      this.schedule();
      return;
    }
    this.schedule();
  }

  private coastFrom(value: number, velocity: number, limit: number): Coast {
    if (value < -limit || value > limit) {
      return { mode: "spring", velocity, target: clamp(value, -limit, limit) };
    }
    return { mode: Math.abs(velocity) > 0.02 ? "decay" : "rest", velocity, target: 0 };
  }

  private releaseDismiss(velocity: number): void {
    const value = this.dismiss.value;
    const far = Math.abs(value) > this.area.height * DISMISS_DISTANCE;
    const flick = Math.abs(velocity) > DISMISS_FLICK && Math.sign(velocity) === Math.sign(value);
    if (far || flick) {
      this.dismiss.velocity = velocity;
      this.callbacks.onDismiss();
      return;
    }
    this.dismiss.velocity = velocity;
    this.dismissTarget = 0;
    if (this.reducedMotion) this.dismiss = { value: 0, velocity: 0 };
    this.schedule();
  }

  private tap(target: Element, event: PointerEvent): void {
    const slot = this.current();
    const now = event.timeStamp;
    const last = this.lastTap;
    if (
      slot?.zoomable &&
      last &&
      now - last.t < DOUBLE_TAP_MS &&
      Math.hypot(event.clientX - last.x, event.clientY - last.y) < DOUBLE_TAP_PX
    ) {
      window.clearTimeout(this.tapTimer);
      this.lastTap = null;
      this.doubleTap({ x: event.clientX, y: event.clientY });
      return;
    }
    this.lastTap = { t: now, x: event.clientX, y: event.clientY };
    const type = event.pointerType;
    // A page that cannot zoom has no double tap to wait for.
    if (!slot?.zoomable) {
      this.callbacks.onTap(target, type);
      return;
    }
    window.clearTimeout(this.tapTimer);
    this.tapTimer = window.setTimeout(() => {
      this.lastTap = null;
      this.callbacks.onTap(target, type);
    }, DOUBLE_TAP_MS);
  }

  /** Zoomed: back to the fit. At the fit: in to fill the stage (at least 2×) about the point. */
  private doubleTap(client: Point): void {
    const slot = this.current();
    if (!slot) return;
    if (this.zoomed) {
      this.animateZoom(1, { x: 0, y: 0 }, true);
      return;
    }
    const to = clamp(Math.max(2, coverScale(slot.box, this.area)), 1, this.maxZoom);
    const focus = this.toStage(client);
    const pan = zoomAbout({ x: 0, y: 0 }, 1, to, focus);
    this.animateZoom(to, clampPan(pan, slot.box, to, this.area), true);
  }

  private startPinch(): void {
    const slot = this.current();
    const drag = this.drag;
    this.drag = null;
    if (!slot?.zoomable || this.pager.value !== 0 || this.dismiss.value !== 0) {
      // A second finger on a page in motion or a video: no pinch, the first finger's drag ends.
      if (drag && drag.kind === "page") this.releasePage(0);
      if (drag && drag.kind === "dismiss") this.releaseDismiss(0);
      this.setGesture(null);
      return;
    }
    const [a, b] = [...this.pointers.values()];
    if (!a || !b) return;
    this.zoomTarget = null;
    this.pinch = {
      distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
      mid: this.toStage({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }),
      scale: this.scale.value,
      pan: { x: this.panX.value, y: this.panY.value },
    };
    this.setGesture("pinch");
  }

  private movePinch(): void {
    const pinch = this.pinch;
    const [a, b] = [...this.pointers.values()];
    if (!pinch || !a || !b) return;
    const distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
    const mid = this.toStage({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    const raw = (pinch.scale * distance) / pinch.distance;
    const scale = softScale(raw, 1, this.maxZoom);
    // The content point under the fingers' first midpoint follows the midpoint as it moves.
    const k = scale / pinch.scale;
    this.scale.value = scale;
    this.panX.value = mid.x - (pinch.mid.x - pinch.pan.x) * k;
    this.panY.value = mid.y - (pinch.mid.y - pinch.pan.y) * k;
    this.schedule();
  }

  private endPinch(): void {
    const slot = this.current();
    this.pinch = null;
    this.setGesture(null);
    if (!slot) return;
    const from = this.scale.value;
    const to = clamp(from, 1, this.maxZoom);
    const [rest] = [...this.pointers.values()];
    const focus = rest ? this.toStage(rest) : { x: this.panX.value, y: this.panY.value };
    const pan =
      from === to
        ? { x: this.panX.value, y: this.panY.value }
        : zoomAbout({ x: this.panX.value, y: this.panY.value }, from, to, focus);
    this.animateZoom(to, clampPan(to <= 1 ? { x: 0, y: 0 } : pan, slot.box, to, this.area), true);
  }

  private onWheel = (event: WheelEvent): void => {
    if (this.tween || this.hold) return;
    const unit =
      event.deltaMode === 1 ? WHEEL_LINE_PX : event.deltaMode === 2 ? this.area.height : 1;
    const dx = event.deltaX * unit;
    const dy = event.deltaY * unit;
    const slot = this.current();
    // A trackpad pinch arrives as a wheel with `ctrlKey`; ⌘ / Ctrl + wheel zooms with a mouse.
    if ((event.ctrlKey || event.metaKey) && slot?.zoomable) {
      event.preventDefault();
      this.coastX.mode = "rest";
      this.coastY.mode = "rest";
      this.zoomTarget = null;
      const from = this.scale.value;
      const to = clamp(from * Math.exp(-dy * 0.01), 1, this.maxZoom);
      const pan = zoomAbout(
        { x: this.panX.value, y: this.panY.value },
        from,
        to,
        this.toStage({ x: event.clientX, y: event.clientY }),
      );
      const clamped = clampPan(to <= 1 ? { x: 0, y: 0 } : pan, slot.box, to, this.area);
      this.scale = { value: to, velocity: 0 };
      this.panX = { value: clamped.x, velocity: 0 };
      this.panY = { value: clamped.y, velocity: 0 };
      this.setZoomed(to > ZOOM_EPSILON, true);
      this.schedule();
      return;
    }
    if (this.zoomed && slot) {
      event.preventDefault();
      this.coastX.mode = "rest";
      this.coastY.mode = "rest";
      this.zoomTarget = null;
      const pan = clampPan(
        { x: this.panX.value - dx, y: this.panY.value - dy },
        slot.box,
        this.scale.value,
        this.area,
      );
      this.panX.value = pan.x;
      this.panY.value = pan.y;
      this.schedule();
      return;
    }
    // A two-finger swipe sideways turns one page per swipe.
    if (Math.abs(dx) <= Math.abs(dy)) return;
    event.preventDefault();
    window.clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => {
      this.wheelLocked = false;
      this.wheelAccum = 0;
    }, WHEEL_IDLE_MS);
    if (this.wheelLocked) return;
    this.wheelAccum += dx;
    if (Math.abs(this.wheelAccum) < WHEEL_PAGE_PX) return;
    const forward = this.wheelAccum > 0 !== this.rtl;
    this.wheelLocked = true;
    this.wheelAccum = 0;
    this.step(forward ? 1 : -1);
  };

  // ─── Animation ─────────────────────────────────────────────────────────────

  private animatePager(target: number, step: number): void {
    this.pagerTarget = target;
    this.pendingStep = step;
    if (this.reducedMotion) {
      this.pager = { value: target, velocity: 0 };
      this.finishPager();
    }
    this.schedule();
  }

  private finishPager(): void {
    this.pagerTarget = null;
    if (this.pendingStep !== 0) this.commitStep();
    else this.endTransit();
    this.pager = { value: 0, velocity: 0 };
  }

  /** The page turned: the next one is now current, at rest where the track left it. */
  private commitStep(): void {
    const step = this.pendingStep;
    this.pendingStep = 0;
    const width = this.area.width + this.gap;
    // A borrowed far page lands as itself; a turn the other way is an ordinary step.
    const borrowed = this.transit !== null && step === this.transitDir;
    this.index = borrowed ? (this.transit as number) : this.wrap(this.index + step);
    this.endTransit();
    this.pager.value += (this.rtl ? -1 : 1) * step * width;
    if (this.pagerTarget !== null) this.pagerTarget += (this.rtl ? -1 : 1) * step * width;
    this.resetZoom();
    this.callbacks.onIndexChange(this.index);
  }

  private animateZoom(scale: number, pan: Point, byGesture = false): void {
    this.coastX.mode = "rest";
    this.coastY.mode = "rest";
    this.zoomTarget = { scale, x: pan.x, y: pan.y };
    this.setZoomed(scale > ZOOM_EPSILON, byGesture);
    if (this.reducedMotion) {
      this.scale = { value: scale, velocity: 0 };
      this.panX = { value: pan.x, velocity: 0 };
      this.panY = { value: pan.y, velocity: 0 };
      this.zoomTarget = null;
    }
    this.schedule();
  }

  private resetZoom(): void {
    this.scale = { value: 1, velocity: 0 };
    this.panX = { value: 0, velocity: 0 };
    this.panY = { value: 0, velocity: 0 };
    this.zoomTarget = null;
    this.coastX.mode = "rest";
    this.coastY.mode = "rest";
    this.setZoomed(false);
  }

  private resetZoomAnimated(): void {
    if (this.zoomed) this.animateZoom(1, { x: 0, y: 0 });
  }

  private startTween(from: Pose, to: Pose, duration: number, done: () => void): void {
    this.tween = {
      from,
      to,
      start: performance.now(),
      duration: this.reducedMotion ? 0 : duration,
      done,
    };
    this.setGesture(null);
    if (this.tween.duration === 0) {
      this.tween = null;
      done();
      this.paint();
      return;
    }
    this.paint();
    this.schedule();
  }

  private tweenPose(now: number): Pose {
    const tween = this.tween;
    if (!tween) return REST;
    const t = emphasized(clamp((now - tween.start) / tween.duration, 0, 1));
    const mix = (a: number, b: number) => a + (b - a) * t;
    const { from, to } = tween;
    return {
      x: mix(from.x, to.x),
      y: mix(from.y, to.y),
      scale: mix(from.scale, to.scale),
      inset: from.inset.map((value, i) => mix(value, to.inset[i] as number)) as Quad,
      radii: from.radii.map((value, i) => mix(value, to.radii[i] as number)) as Quad,
      opacity: mix(from.opacity, to.opacity),
      backdrop: mix(from.backdrop, to.backdrop),
    };
  }

  /**
   * The pose that lays the current picture over `origin`: its box covers the origin's media box
   * (`object-fit: cover`), cut to the part of it that shows, with that part's corners.
   */
  private originPose(origin: ViewerOrigin | null): Pose | null {
    const slot = this.current();
    const stage = this.stage;
    if (!origin || !slot || !stage || slot.box.width <= 0 || slot.box.height <= 0) return null;
    const area = stage.getBoundingClientRect();
    const { rect, visible } = origin;
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    if (width <= 0 || height <= 0) return null;
    const scale = Math.max(width / slot.box.width, height / slot.box.height);
    const centerX = (rect.left + rect.right) / 2;
    const centerY = (rect.top + rect.bottom) / 2;
    const half = { x: (slot.box.width * scale) / 2, y: (slot.box.height * scale) / 2 };
    const cut = (value: number) => Math.max(0, value / scale);
    return {
      x: centerX - (area.left + area.width / 2),
      y: centerY - (area.top + area.height / 2),
      scale,
      inset: [
        cut(visible.top - (centerY - half.y)),
        cut(centerX + half.x - visible.right),
        cut(centerY + half.y - visible.bottom),
        cut(visible.left - (centerX - half.x)),
      ],
      radii: origin.radii.map((radius) => radius / scale) as Quad,
      opacity: 1,
      backdrop: 0,
    };
  }

  private schedule(): void {
    if (this.frame !== 0) return;
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number): void => {
    this.frame = 0;
    const dt = this.lastFrame === 0 ? 16 : Math.min(64, now - this.lastFrame);
    this.lastFrame = now;
    let active = false;

    if (this.pagerTarget !== null) {
      this.pager = stepSpring(this.pager, this.pagerTarget, dt, SETTLE_SPRING);
      if (springSettled(this.pager, this.pagerTarget, 0.5)) this.finishPager();
      else active = true;
    }

    if (this.zoomTarget) {
      const target = this.zoomTarget;
      this.scale = stepSpring(this.scale, target.scale, dt);
      this.panX = stepSpring(this.panX, target.x, dt);
      this.panY = stepSpring(this.panY, target.y, dt);
      if (
        springSettled(this.scale, target.scale, 0.001) &&
        springSettled(this.panX, target.x, 0.5) &&
        springSettled(this.panY, target.y, 0.5)
      ) {
        this.scale = { value: target.scale, velocity: 0 };
        this.panX = { value: target.x, velocity: 0 };
        this.panY = { value: target.y, velocity: 0 };
        this.zoomTarget = null;
      } else active = true;
    }

    const limit = this.limit();
    if (this.coastAxis(this.coastX, this.panX, limit.x, dt)) active = true;
    if (this.coastAxis(this.coastY, this.panY, limit.y, dt)) active = true;

    if (this.dismissTarget !== null) {
      this.dismiss = stepSpring(this.dismiss, this.dismissTarget, dt);
      if (springSettled(this.dismiss, this.dismissTarget, 0.5)) {
        this.dismiss = { value: this.dismissTarget, velocity: 0 };
        this.dismissTarget = null;
      } else active = true;
    }

    if (this.tween) {
      if (now - this.tween.start >= this.tween.duration) {
        const { done } = this.tween;
        this.tween = null;
        done();
      } else active = true;
    }

    this.paint();
    if (active) this.schedule();
    else this.lastFrame = 0;
  };

  /** One axis of a released pan: coasts on its momentum, then springs back inside the limits. */
  private coastAxis(coast: Coast, axis: SpringState, limit: number, dt: number): boolean {
    if (coast.mode === "rest") return false;
    if (coast.mode === "decay") {
      coast.velocity = decayVelocity(coast.velocity, dt);
      axis.value += coast.velocity * dt;
      axis.velocity = coast.velocity;
      if (axis.value < -limit || axis.value > limit) {
        // Past an edge the momentum turns into a spring that brings it back.
        coast.mode = "spring";
        coast.target = clamp(axis.value, -limit, limit);
      } else if (Math.abs(coast.velocity) < 0.005) {
        coast.mode = "rest";
        return false;
      }
      return true;
    }
    const next = stepSpring(axis, coast.target, dt);
    axis.value = next.value;
    axis.velocity = next.velocity;
    if (springSettled(axis, coast.target, 0.5)) {
      axis.value = coast.target;
      axis.velocity = 0;
      coast.mode = "rest";
      return false;
    }
    return true;
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private current(): ViewerSlot | undefined {
    return this.slots.get(this.index);
  }

  private slotBox(): Size {
    return this.current()?.box ?? { width: 0, height: 0 };
  }

  private limit(): Point {
    return panLimit(this.slotBox(), this.scale.value, this.area);
  }

  private wrap(index: number): number {
    return ((index % this.count) + this.count) % this.count;
  }

  /** Loop only with three items or more: two would be each other's both neighbours. */
  private get looping(): boolean {
    return this.loop && this.count > 2;
  }

  private canStep(direction: number): boolean {
    if (this.count < 2) return false;
    if (this.looping) return true;
    const next = this.index + direction;
    return next >= 0 && next < this.count;
  }

  /** The pager offset that shows the page `direction` away. */
  private pagerFor(direction: number): number {
    return (this.rtl ? 1 : -1) * direction * (this.area.width + this.gap);
  }

  /**
   * Item `index` relative to the current page in pages, or `null` when it is not painted. A
   * borrowed far page takes the place of the neighbour on its side.
   */
  relative(index: number): number | null {
    if (this.transit !== null && index === this.transit) return this.transitDir;
    const diff = pageOffset(index, this.index, this.count, this.looping);
    if (Math.abs(diff) > PAGE_RADIUS) return null;
    if (this.transit !== null && diff === this.transitDir) return null;
    return diff;
  }

  private toStage(client: Point): Point {
    const rect = this.stage?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: client.x - (rect.left + rect.width / 2),
      y: client.y - (rect.top + rect.height / 2),
    };
  }

  private setZoomed(zoomed: boolean, byGesture = false): void {
    if (zoomed === this.zoomed) return;
    this.zoomed = zoomed;
    this.callbacks.onZoomChange(zoomed, byGesture);
  }

  private setGesture(gesture: GestureKind | null): void {
    if (gesture === this.gesture) return;
    this.gesture = gesture;
    this.callbacks.onGestureChange(gesture);
  }

  private cancelDrag(): void {
    this.drag = null;
    this.pinch = null;
    this.pointers.clear();
    this.unlisten();
    this.setGesture(null);
    window.clearTimeout(this.tapTimer);
  }

  private listen(): void {
    window.addEventListener("pointermove", this.onPointerMove, { passive: false });
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
  }

  private unlisten(): void {
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
  }
}

function prevent(event: Event) {
  event.preventDefault();
}
