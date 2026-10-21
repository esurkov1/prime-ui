import { readCssLengthPx } from "@/hooks/usePosition";

import styles from "./press.module.css";

/**
 * The press classes (`press.module.css`). Taking them from here installs the measuring: on a press
 * (a pointer, or Space / Enter on the focused element) every pressable in the pressed chain — the
 * element and its ancestors, as `:active` has it — gets `--press-scale` from its own box, so its
 * edges give in by the same distance on a 40px chip and on a 1200px bar. A release, a cancel or a
 * key up clears it.
 */
export const press = styles;

/** The ones that give themselves, and the hosts whose parts give. */
const GIVES = `.${styles.press}, .${styles.pressCompact}`;
const HOSTS = `.${styles.pressHost}`;
const PARTS = `.${styles.pressPart}, .${styles.pressPartCompact}`;

const COMPACT = new Set([styles.pressCompact, styles.pressPartCompact]);
const SCALE = "--press-scale";

/** Elements that carry a measured scale until the press ends. */
const pressed = new Set<HTMLElement>();

/**
 * Uniform, from the longer side: that side's edges give in by `distance`, the shorter side by less,
 * so the shape (and the text in it) keeps its proportions — equal pixels on both axes would squash
 * a long bar's text. Nothing is written where the distance cannot be read (no styles): the CSS
 * fallback scale stands.
 */
function measure(el: HTMLElement): boolean {
  const compact = [...el.classList].some((name) => COMPACT.has(name));
  const distance = readCssLengthPx(
    compact ? "--prime-motion-press-distance-compact" : "--prime-motion-press-distance",
    Number.NaN,
    el,
  );
  const side = Math.max(el.offsetWidth, el.offsetHeight);
  if (!Number.isFinite(distance) || side <= 0) return false;
  const scale = Math.max(0, 1 - (2 * distance) / side);
  el.style.setProperty(SCALE, String(Math.round(scale * 10000) / 10000));
  return true;
}

function give(el: HTMLElement) {
  if (measure(el)) pressed.add(el);
}

function pressChain(target: EventTarget | null) {
  let node = target instanceof Element ? target : null;
  while (node) {
    if (node instanceof HTMLElement) {
      if (node.matches(GIVES)) give(node);
      if (node.matches(HOSTS)) {
        const host = node;
        for (const part of host.querySelectorAll<HTMLElement>(PARTS)) {
          if (part.parentElement?.closest(HOSTS) === host) give(part);
        }
      }
    }
    node = node.parentElement;
  }
}

/** Space in a text field types a space: nothing is pressed. */
const TYPED = new Set(["text", "search", "email", "url", "tel", "password", "number", "date"]);
function typing(target: EventTarget | null): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLInputElement) return TYPED.has(target.type);
  return target instanceof HTMLElement && target.isContentEditable;
}

function release() {
  for (const el of pressed) el.style.removeProperty(SCALE);
  pressed.clear();
}

/**
 * Presses a surface by hand (`.pressHeld`): a part inside it was pressed and the whole surface
 * gives, measured like any press; `false` lets it go.
 */
export function holdPress(el: HTMLElement, held: boolean) {
  if (held) {
    measure(el);
    el.dataset.pressed = "";
  } else {
    delete el.dataset.pressed;
    el.style.removeProperty(SCALE);
  }
}

if (typeof document !== "undefined") {
  document.addEventListener(
    "pointerdown",
    (event) => {
      release();
      if (event.button === 0) pressChain(event.target);
    },
    true,
  );
  document.addEventListener(
    "keydown",
    (event) => {
      const key = event.key === " " || event.key === "Enter";
      if (key && !event.repeat && !typing(event.target)) pressChain(event.target);
    },
    true,
  );
  for (const type of ["pointerup", "pointercancel", "keyup"]) {
    document.addEventListener(type, release, true);
  }
  window.addEventListener("blur", release);
}
