/**
 * The page track of Carousel: one imperative object per carousel that places its slides, follows a
 * finger with the kit's page physics (`internal/physics`) and settles every change with the spring
 * — written straight to the DOM once per frame, so React renders only when the slide changes.
 *
 * Each slide stands at its offset from the current one in pages (`pageOffset`), shifted by the
 * `pager` (px). A change of slide moves the current page at once and shifts the pager by the same
 * distance the other way, so nothing jumps; the spring then takes the pager home to 0. A far slide
 * (a dot, Home / End) is borrowed as the neighbour on its side: it slides in beside the one that
 * leaves, never past the slides between them.
 *
 * Every placement also reports the continuous position of the track (the current slide plus the
 * share of the way to the next, `onPosition`), so the dots follow the finger and the spring in the
 * same frame as the slides.
 */
import {
  clamp,
  PAGE_DISTANCE,
  PAGE_FLICK,
  pageOffset,
  releaseVelocity,
  rubberBand,
  type Sample,
  SETTLE_SPRING,
  type SpringState,
  springSettled,
  stepSpring,
} from "@/internal/physics";

/** The velocity (px/ms) a step past an end gives the track: it gives a little and springs back. */
const EDGE_NUDGE = 0.6;

/**
 * The span of the dots' current pill at track `position`, in dot slots from the first dot: at a
 * slide it covers that slide's dot; on the way to the next one its far edge reaches the next dot
 * over the first half of the way and its near edge follows over the second half (a page control's
 * stretch). Past an end without `loop` it holds at the end dot. With `loop`, between the last slide
 * and the first it stays on the last dot for the first half of the way and stands on the first for
 * the second — it never stretches across the row.
 */
export function indicatorSpan(
  position: number,
  count: number,
  loop: boolean,
): { start: number; end: number } {
  if (count <= 1) return { start: 0, end: 1 };
  let at = loop ? ((position % count) + count) % count : Math.min(count - 1, Math.max(0, position));
  if (at > count - 1) {
    // The seam of a loop: from the last slide on to the first.
    at = at - (count - 1) < 0.5 ? count - 1 : 0;
  }
  const slot = Math.floor(at);
  const share = at - slot;
  return {
    start: slot + Math.max(0, share * 2 - 1),
    end: slot + 1 + Math.min(1, share * 2),
  };
}

export class CarouselTrack {
  private slides: (HTMLElement | null)[] = [];
  private count = 0;
  private looping = false;
  private index = 0;
  private pager: SpringState = { value: 0, velocity: 0 };
  private target: number | null = null;
  /** The slide that leaves while a far one slides in beside it, and the side it leaves to. */
  private leaving: { index: number; side: 1 | -1 } | null = null;
  private frame = 0;
  private lastFrame = 0;
  private dragStart = 0;
  private samples: Sample[] = [];
  reducedMotion = false;
  width = 0;
  /** Told the track's position (in slides) every time it is placed. */
  onPosition: ((position: number) => void) | null = null;

  configure(count: number, loop: boolean): void {
    this.count = count;
    // Two slides cannot loop: the neighbour on either side would be the same slide.
    this.looping = loop && count > 2;
  }

  setSlide(index: number, element: HTMLElement | null): void {
    this.slides[index] = element;
    if (element) this.place(index);
  }

  canStep(direction: 1 | -1): boolean {
    if (this.count < 2) return false;
    if (this.looping) return true;
    const next = this.index + direction;
    return next >= 0 && next < this.count;
  }

  /** The slide `direction` steps away (wrapping with `loop`), or `null` past an end. */
  stepTarget(direction: 1 | -1): number | null {
    if (!this.canStep(direction)) return null;
    return (this.index + direction + this.count) % this.count;
  }

  /**
   * The current slide becomes `next`. `side` — where it comes from (`1` after, `-1` before; by
   * default the shorter way); `animate` — the spring takes it home, else it stands there at once.
   */
  moveTo(next: number, animate: boolean, side?: 1 | -1): void {
    if (next === this.index) return;
    const offset = pageOffset(next, this.index, this.count, this.looping);
    const from = side ?? (offset > 0 ? 1 : -1);
    this.leaving =
      Math.abs(offset) === 1 && offset === from ? null : { index: this.index, side: from };
    this.index = next;
    this.pager.value += from * this.width;
    if (!animate || this.reducedMotion) {
      this.settle();
      return;
    }
    this.target = 0;
    this.schedule();
  }

  /** A step past an end without `loop`: the track nudges and springs back. */
  nudge(direction: 1 | -1): void {
    if (this.reducedMotion) return;
    this.pager.velocity = -direction * EDGE_NUDGE;
    this.target = 0;
    this.schedule();
  }

  /** A finger took the track: whatever moves stops under it. */
  grab(clientX: number, time: number): void {
    if (this.leaving) this.settle();
    this.target = null;
    this.pager.velocity = 0;
    this.dragStart = this.pager.value - clientX;
    this.samples = [{ t: time, x: clientX, y: 0 }];
  }

  /** The finger moved: the track follows it, resisting past an end without a neighbour. */
  drag(clientX: number, time: number): void {
    this.samples.push({ t: time, x: clientX, y: 0 });
    if (this.samples.length > 12) this.samples.shift();
    let value = this.dragStart + clientX;
    // `value` > 0 shows the slide before.
    const blocked = value > 0 ? !this.canStep(-1) : !this.canStep(1);
    if (blocked) value = rubberBand(value, this.width);
    this.pager.value = clamp(value, -this.width, this.width);
    this.schedule();
  }

  /**
   * The finger let go: the direction the page turns (`1` next, `-1` previous, `0` back) from the
   * distance and the flick; the spring then takes the track home from where the finger left it.
   */
  release(time: number, cancelled: boolean): 1 | -1 | 0 {
    const velocity = cancelled ? 0 : releaseVelocity(this.samples, time).x;
    this.samples = [];
    const value = this.pager.value;
    let direction: 1 | -1 | 0 = 0;
    if (value < -this.width * PAGE_DISTANCE || (value < 0 && velocity < -PAGE_FLICK)) direction = 1;
    else if (value > this.width * PAGE_DISTANCE || (value > 0 && velocity > PAGE_FLICK)) {
      direction = -1;
    }
    if (direction !== 0 && !this.canStep(direction)) direction = 0;
    this.pager.velocity = velocity;
    this.target = 0;
    if (this.reducedMotion && direction === 0) this.settle();
    else this.schedule();
    return direction;
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  /** Writes every slide's place and reports the position. */
  placeAll(): void {
    for (let index = 0; index < this.slides.length; index++) this.place(index);
    this.onPosition?.(this.reducedMotion ? this.index : this.position());
  }

  /**
   * Where the track stands, in slides: the current one minus the share of a page the pager shows
   * of its side. While a far slide is borrowed the way between the two runs over the whole gap.
   */
  private position(): number {
    if (this.width <= 0 || this.count < 2) return this.index;
    const pages = this.pager.value / this.width;
    if (!this.leaving) return this.index - pages;
    const { index: origin, side } = this.leaving;
    const gap =
      side > 0
        ? (this.index - origin + this.count) % this.count
        : -((origin - this.index + this.count) % this.count);
    return this.index - pages * side * gap;
  }

  /** Where slide `index` stands from the current one, in pages, or `null` when it is not shown. */
  private offsetOf(index: number): number | null {
    if (index === this.index) return 0;
    if (this.leaving && index === this.leaving.index) return -this.leaving.side;
    const offset = pageOffset(index, this.index, this.count, this.looping);
    if (Math.abs(offset) > 1) return null;
    if (this.leaving && offset === -this.leaving.side) return null;
    return offset;
  }

  private place(index: number): void {
    const slide = this.slides[index];
    if (!slide) return;
    const offset = this.offsetOf(index);
    if (offset === null) {
      slide.style.visibility = "hidden";
      slide.style.transform = "";
      return;
    }
    slide.style.visibility = "";
    slide.style.transform = `translate3d(calc(${offset * 100}% + ${this.pager.value}px), 0, 0)`;
  }

  private settle(): void {
    this.pager = { value: 0, velocity: 0 };
    this.target = null;
    this.leaving = null;
    this.placeAll();
  }

  private schedule(): void {
    if (this.frame !== 0) return;
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number): void => {
    this.frame = 0;
    const dt = this.lastFrame === 0 ? 16 : Math.min(64, now - this.lastFrame);
    this.lastFrame = now;
    if (this.target !== null) {
      this.pager = stepSpring(this.pager, this.target, dt, SETTLE_SPRING);
      if (springSettled(this.pager, this.target, 0.5)) {
        this.settle();
        this.lastFrame = 0;
        return;
      }
      this.placeAll();
      this.schedule();
      return;
    }
    this.lastFrame = 0;
    this.placeAll();
  };
}
