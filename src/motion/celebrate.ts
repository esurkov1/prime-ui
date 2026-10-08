import { prefersReducedMotion } from "@/hooks/usePresence";

export type CelebrateOptions = {
  /**
   * Where the burst starts: an element (from its center) or a point in the viewport. Default: the
   * middle of the screen, a third from the top.
   */
  origin?: Element | { x: number; y: number };
};

/** Palette roles the pieces take, read from the theme at the origin. */
const COLOR_TOKENS = [
  "--prime-color-accent-default",
  "--prime-color-success-default",
  "--prime-color-warning-default",
  "--prime-color-info-default",
];

const PIECES = 90;
/** One burst lasts this long; the pieces fade over its last 40%. */
const DURATION_MS = 1400;
const GRAVITY = 0.0016;
const DRAG = 0.0012;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  color: string;
};

/**
 * A short confetti burst for a rare milestone: a quarter closed, the first invoice paid, an
 * onboarding finished (foundation §7 rule 1 — only rare moments carry delight; never for routine
 * success, that is a Notification). Draws on a canvas above every layer, ignores the pointer and
 * assistive tech, and removes itself after 1.4 s. Under reduced motion it draws nothing. Say the
 * achievement in words too: the burst is decoration. Resolves when the canvas is gone.
 */
export function celebrate(options: CelebrateOptions = {}): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") return Promise.resolve();
  if (prefersReducedMotion()) return Promise.resolve();

  const width = window.innerWidth;
  const height = window.innerHeight;
  const { origin } = options;
  let x = width / 2;
  let y = height / 3;
  let themed: Element = document.body;
  if (origin instanceof Element) {
    const rect = origin.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
    themed = origin;
  } else if (origin) {
    x = origin.x;
    y = origin.y;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "var(--prime-z-toast)",
  });
  ctx.scale(dpr, dpr);
  document.body.append(canvas);

  const css = getComputedStyle(themed);
  const colors = COLOR_TOKENS.map((token) => css.getPropertyValue(token).trim()).filter(Boolean);
  const palette = colors.length > 0 ? colors : ["currentColor"];

  const pieces: Piece[] = Array.from({ length: PIECES }, () => {
    // A fan upward: ±60° around straight up.
    const direction = -Math.PI / 2 + ((Math.random() - 0.5) * (Math.PI * 2)) / 3;
    const speed = 0.45 + Math.random() * 0.75;
    return {
      x,
      y,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.02,
      size: 5 + Math.random() * 5,
      color: palette[Math.floor(Math.random() * palette.length)],
    };
  });

  return new Promise((resolve) => {
    const start = performance.now();
    let prev = start;
    const frame = (now: number) => {
      const t = now - start;
      const dt = Math.min(32, now - prev);
      prev = now;
      ctx.clearRect(0, 0, width, height);
      if (t >= DURATION_MS) {
        canvas.remove();
        resolve();
        return;
      }
      ctx.globalAlpha =
        t < DURATION_MS * 0.6 ? 1 : 1 - (t - DURATION_MS * 0.6) / (DURATION_MS * 0.4);
      for (const piece of pieces) {
        piece.vy += GRAVITY * dt;
        piece.vx *= 1 - DRAG * dt;
        piece.vy *= 1 - DRAG * dt;
        piece.x += piece.vx * dt;
        piece.y += piece.vy * dt;
        piece.angle += piece.spin * dt;
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.angle);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
        ctx.restore();
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}
