import type { MediaViewerItem } from "./types";
import type { ViewerOrigin, ViewerRect } from "./viewerEngine";

/** Two edges this close (px) are one edge: a corner of the frame is a corner of the picture. */
const EDGE_PX = 1.5;
/** Less of the picture than this shows (scrolled away under a header): fade instead of flying. */
const MIN_VISIBLE_SHARE = 0.2;

type Corner = "TopLeft" | "TopRight" | "BottomRight" | "BottomLeft";
const CORNERS: Corner[] = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"];

const rectOf = (box: DOMRect): ViewerRect => ({
  left: box.left,
  top: box.top,
  right: box.right,
  bottom: box.bottom,
});

const area = (rect: ViewerRect) =>
  Math.max(0, rect.right - rect.left) * Math.max(0, rect.bottom - rect.top);

/** An element cuts what overflows it: its border radius then rounds what it shows. */
function clips(style: CSSStyleDeclaration): boolean {
  return style.overflowX !== "visible" || style.overflowY !== "visible";
}

/** A corner radius in px (the horizontal one of a `<h> <v>` pair; a percentage of the width). */
function cornerRadius(style: CSSStyleDeclaration, corner: Corner, width: number): number {
  const raw = style
    .getPropertyValue(`border-${toKebab(corner)}-radius`)
    .trim()
    .split(/\s+/)[0];
  if (!raw) return 0;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return 0;
  return raw.endsWith("%") ? (value / 100) * width : value;
}

const toKebab = (corner: Corner) => corner.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

/** The point of `rect` at `corner`. */
function cornerOf(rect: ViewerRect, corner: Corner): [number, number] {
  const x = corner.endsWith("Left") ? rect.left : rect.right;
  const y = corner.startsWith("Top") ? rect.top : rect.bottom;
  return [x, y];
}

/**
 * The shape a picture has on the page, so the viewer flies out of it and back into it exactly: the
 * box of the media element, the part that shows once every clipping ancestor (a scroller, a
 * rounded album, a bubble) and the viewport have cut it, and the radius of each corner of that
 * part — taken from the element itself (an `<img>` rounds its own picture) or from the clipping
 * ancestor whose corner it is. An album rounds only its outer corners, so its inner tiles fly
 * square and its corner tiles round on the outer side only. `null` when little of it shows.
 */
export function originShape(media: HTMLElement): ViewerOrigin | null {
  const box = media.getBoundingClientRect();
  if (box.width <= 0 || box.height <= 0) return null;
  const rect = rectOf(box);

  // The frames that cut the picture: the element itself, then every clipping ancestor.
  const frames: { rect: ViewerRect; style: CSSStyleDeclaration }[] = [
    { rect, style: getComputedStyle(media) },
  ];
  for (let node = media.parentElement; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (clips(style)) frames.push({ rect: rectOf(node.getBoundingClientRect()), style });
  }

  const visible: ViewerRect = { ...rect };
  for (const frame of [...frames, { rect: viewportRect(), style: null }]) {
    visible.left = Math.max(visible.left, frame.rect.left);
    visible.top = Math.max(visible.top, frame.rect.top);
    visible.right = Math.min(visible.right, frame.rect.right);
    visible.bottom = Math.min(visible.bottom, frame.rect.bottom);
  }
  if (area(visible) < area(rect) * MIN_VISIBLE_SHARE) return null;

  const radii = CORNERS.map((corner) => {
    const [x, y] = cornerOf(visible, corner);
    let radius = 0;
    for (const frame of frames) {
      const [fx, fy] = cornerOf(frame.rect, corner);
      if (Math.abs(fx - x) <= EDGE_PX && Math.abs(fy - y) <= EDGE_PX) {
        radius = Math.max(
          radius,
          cornerRadius(frame.style, corner, frame.rect.right - frame.rect.left),
        );
      }
    }
    return radius;
  }) as ViewerOrigin["radii"];

  return { rect, visible, radii };
}

function viewportRect(): ViewerRect {
  return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}

/** A media source as written, without a fragment (`#t=0.001` asks a video for its first frame). */
const bareSrc = (src: string | null | undefined) => (src ?? "").split("#")[0] ?? "";

/**
 * The thumbnail of `item` on the page: an `<img>` or `<video>` showing its `thumbnail`, `src` or
 * `poster`. Of several, the one nearest the thumbnail the viewer opened from (inside the smallest
 * ancestor they share), so a grid closes into its own tile. Read once, when the viewer closes.
 */
export function findItemMedia(
  item: MediaViewerItem | undefined,
  near: Element | null,
  viewer: Element | null,
): HTMLElement | null {
  if (!item) return null;
  const sources = new Set(
    [item.thumbnail, item.src, item.poster].filter(Boolean).map((src) => bareSrc(src)),
  );
  const matches = [...document.querySelectorAll<HTMLElement>("img, video")].filter(
    (media) =>
      !viewer?.contains(media) &&
      (sources.has(bareSrc(media.getAttribute("src"))) ||
        sources.has(bareSrc(media.getAttribute("poster")))),
  );
  if (matches.length <= 1) return matches[0] ?? null;
  for (let scope = near?.parentElement ?? null; scope; scope = scope.parentElement) {
    const inside = matches.find((media) => scope.contains(media));
    if (inside) return inside;
  }
  return matches[0] ?? null;
}
