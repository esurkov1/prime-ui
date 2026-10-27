import * as React from "react";

// ─── Touch guard ─────────────────────────────────────────────────────────────

/*
 * iOS Safari scrolls, bounces and pulls to refresh the document under `overflow: hidden` and
 * `overscroll-behavior: none` (WebKit bugs 259568, 275947). So while the document must stay still,
 * one document-level listener decides each vertical touch gesture at its first move: it goes on
 * when a scroller between the finger and the document can take it — one that can still move that
 * way, or one that holds its own overscroll (`contain` / `none`: it bounces by itself) — and is
 * cancelled when it would reach the document. Sideways gestures are never touched (strips,
 * carousels, sliders own them; the document never pans sideways). Reference-counted.
 */

let guardCount = 0;
let gesture: { x: number; y: number; block: boolean | null } | null = null;

const SCROLLS = new Set(["auto", "scroll", "overlay"]);
const HOLDS = new Set(["contain", "none"]);

/** A scroller between `target` and the document takes a vertical move of `dy` (finger delta). */
function takenInside(target: EventTarget | null, dy: number): boolean {
  const { body, documentElement } = document;
  let el = target instanceof Element ? target : null;
  for (; el && el !== body && el !== documentElement; el = el.parentElement) {
    const style = window.getComputedStyle(el);
    if (!SCROLLS.has(style.overflowY)) continue;
    const room = el.scrollHeight - el.clientHeight;
    if (room <= 0) continue;
    // The finger moving down scrolls towards the start.
    if (dy > 0 ? el.scrollTop > 0 : el.scrollTop < room - 1) return true;
    if (HOLDS.has(style.overscrollBehaviorY)) return true;
  }
  return false;
}

function onTouchStart(event: TouchEvent) {
  const touch = event.touches.length === 1 ? event.touches[0] : undefined;
  gesture = touch ? { x: touch.clientX, y: touch.clientY, block: null } : null;
}

function onTouchMove(event: TouchEvent) {
  const touch = event.touches.length === 1 ? event.touches[0] : undefined;
  if (!gesture || !touch || !event.cancelable) return;
  if (gesture.block === null) {
    const dx = touch.clientX - gesture.x;
    const dy = touch.clientY - gesture.y;
    if (dx === 0 && dy === 0) return;
    gesture.block = Math.abs(dy) > Math.abs(dx) && !takenInside(event.target, dy);
  }
  if (gesture.block) event.preventDefault();
}

function guardTouch() {
  if (guardCount++ > 0) return;
  document.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
  document.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
}

function releaseTouch() {
  guardCount = Math.max(0, guardCount - 1);
  if (guardCount > 0) return;
  document.removeEventListener("touchstart", onTouchStart, { capture: true });
  document.removeEventListener("touchmove", onTouchMove, { capture: true });
  gesture = null;
}

// ─── Scroll lock ─────────────────────────────────────────────────────────────

let lockCount = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

function lockScroll() {
  if (lockCount === 0) {
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    if (scrollbarWidth > 0) {
      // Added to the body's own padding, not written over it.
      const padding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${padding + scrollbarWidth}px`;
    }
    body.style.overflow = "hidden";
  }
  lockCount++;
  guardTouch();
}

function unlockScroll() {
  releaseTouch();
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && saved) {
    document.body.style.overflow = saved.overflow;
    document.body.style.paddingRight = saved.paddingRight;
    saved = null;
  }
}

/**
 * Locks document scroll while enabled. Reference-counted: nested modal layers share one lock and
 * the last one restores it. The scrollbar width is added to the body's right padding, so the page
 * does not shift; on touch the guard above holds the document where iOS ignores `overflow`, with no
 * `position: fixed` body, so nothing jumps. Part of `useModalLayer`.
 */
export function useScrollLock(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;
    lockScroll();
    return unlockScroll;
  }, [enabled]);
}

// ─── Viewport frame ──────────────────────────────────────────────────────────

/** The attribute on `<html>` while an app frame owns the viewport (globals.css reads it). */
const FRAME_ATTRIBUTE = "data-prime-frame";

let frameCount = 0;

const editing = () => {
  const active = document.activeElement;
  return (
    active instanceof HTMLElement &&
    (active.isContentEditable || active.matches("input, textarea, select"))
  );
};

/*
 * iOS pans the document to bring a focused field above the keyboard and may leave it there when
 * the keyboard closes: the frame then stands shifted with an empty band under it. Away from a
 * field the document goes back to its origin.
 */
function settleDocument() {
  if (editing()) return;
  if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
}

function onFocusOut() {
  window.requestAnimationFrame(settleDocument);
}

function claimFrame() {
  guardTouch();
  if (frameCount++ > 0) return;
  document.documentElement.setAttribute(FRAME_ATTRIBUTE, "");
  window.addEventListener("scroll", settleDocument, { passive: true });
  document.addEventListener("focusout", onFocusOut);
  settleDocument();
}

function releaseFrame() {
  releaseTouch();
  frameCount = Math.max(0, frameCount - 1);
  if (frameCount > 0) return;
  document.documentElement.removeAttribute(FRAME_ATTRIBUTE);
  window.removeEventListener("scroll", settleDocument);
  document.removeEventListener("focusout", onFocusOut);
}

/**
 * An app frame owns the viewport while enabled (`AppShell.Root` at the top level):
 * `<html data-prime-frame>` makes the document itself still — no scroll, no rubber band, no
 * pull-to-refresh (globals.css) — the touch guard keeps iOS to it, and a document iOS panned for
 * the keyboard returns to its origin. Only the frame's own scrollers move.
 */
export function useViewportFrame(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled) return;
    claimFrame();
    return releaseFrame;
  }, [enabled]);
}
