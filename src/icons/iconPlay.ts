import * as React from "react";

/**
 * Plays icon gestures. One delegated listener set on the document: when a pointer enters an
 * interactive host (or touches it), every animated icon that belongs to that host gets
 * `data-play`; the attribute comes off when the icon's carrier animation ends, so a gesture
 * always runs to completion and never snaps back halfway.
 *
 * - Hosts are what a person points at: buttons, links, tabs, toggles, labels, menu items,
 *   listbox options, tree items and table rows.
 * - An icon belongs to the nearest host around it, so a hovered card never plays the icons of
 *   the buttons inside it, and a hovered row never plays the icons of its row actions.
 * - Keyboard focus never plays (arrowing through a menu stays calm, foundation §7 rule 1);
 *   reduced motion never plays.
 */
const OWNER = [
  "a[href]",
  "button",
  "summary",
  "label",
  "tr",
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="option"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="treeitem"]',
  '[role="row"]',
].join(", ");
const ICON = "svg[data-icon-motion]";
const DISABLED = ':disabled, [aria-disabled="true"], [data-disabled="true"], [data-loading="true"]';

let installed = false;
let currentOwner: Element | null = null;

function reducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function play(icon: Element) {
  if (!icon.hasAttribute("data-play")) icon.setAttribute("data-play", "");
}

/** The element the pointer acts on: the nearest host, or a lone icon. */
function ownerOf(target: Element): Element | null {
  return target.closest(OWNER) ?? target.closest(ICON);
}

/** Plays the icons that belong to `owner` (or `owner` itself when it is a lone icon). */
function playOwner(owner: Element) {
  if (reducedMotion()) return;
  if (owner.matches(ICON)) {
    play(owner);
    return;
  }
  if (owner.matches(DISABLED)) return;
  for (const icon of owner.querySelectorAll(ICON)) {
    if (icon.parentElement?.closest(OWNER) === owner) play(icon);
  }
}

function onPointerOver(event: PointerEvent) {
  if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
  const owner = ownerOf(event.target);
  if (owner === currentOwner) return;
  currentOwner = owner;
  if (owner) playOwner(owner);
}

function onPointerOut(event: PointerEvent) {
  if (!event.relatedTarget) currentOwner = null;
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType !== "touch" || !(event.target instanceof Element)) return;
  const owner = ownerOf(event.target);
  if (owner) playOwner(owner);
}

function onAnimationEnd(event: Event) {
  const target = event.target;
  if (target instanceof Element && target.matches(ICON)) target.removeAttribute("data-play");
}

function install() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("pointerout", onPointerOut, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("animationend", onAnimationEnd);
  document.addEventListener("animationcancel", onAnimationEnd);
}

/** Installs the document listeners once, the first time an animated icon mounts. */
export function useIconPlay(animated: boolean) {
  React.useEffect(() => {
    if (animated) install();
  }, [animated]);
}
