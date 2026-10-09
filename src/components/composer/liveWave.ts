/**
 * The live waveform of a recording, drawn straight to a canvas every animation frame (no React
 * state). Same look as VoicePlayer's waveform: rounded bars of `--prime-space-1 × 0.75` with a
 * `--prime-space-1 / 2` gap, centred on the line, never thinner than a dot. The newest sample
 * enters at the end and the row scrolls toward the start between samples.
 */
export type LiveWaveStyle = {
  /** Bar width, CSS px. */
  bar: number;
  /** Gap between bars, CSS px. */
  gap: number;
  /** Bars that carry a sample. */
  color: string;
  /** Slots without a sample yet: the calm line before (and behind) the voice. */
  idleColor: string;
};

export type LiveWaveFrame = {
  /** Levels 0…1, oldest first. */
  samples: readonly number[];
  /** 0…1: how far the time is from the last sample to the next one (the scroll phase). */
  phase: number;
  /** Right-to-left writing: the newest bar enters at the left. */
  rtl: boolean;
};

/** The canvas box in CSS px, as the caller last measured it (a `ResizeObserver`, not per frame). */
export type LiveWaveSize = { width: number; height: number };

/**
 * Resizes the backing store to the box × devicePixelRatio. Only a changed size or ratio touches
 * `width` / `height` (which clears the store), and nothing here reads layout: a frame of the meter
 * never forces a style or layout pass.
 */
function fitCanvas(canvas: HTMLCanvasElement, { width, height }: LiveWaveSize) {
  const ratio = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  const w = Math.round(width * ratio);
  const h = Math.round(height * ratio);
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
}

function roundBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(w, h) / 2;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.fill();
}

export function drawLiveWave(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  size: LiveWaveSize,
  style: LiveWaveStyle,
  frame: LiveWaveFrame,
): void {
  fitCanvas(canvas, size);
  const { width, height } = size;
  const ratio = width > 0 ? canvas.width / width : 1;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  if (width <= 0 || height <= 0) return;

  const step = style.bar + style.gap;
  const slots = Math.ceil(width / step) + 1;
  const { samples, rtl } = frame;
  const phase = samples.length === 0 ? 1 : Math.min(1, Math.max(0, frame.phase));
  // The newest bar slides in from one step beyond the end and settles at the end.
  const shift = (1 - phase) * step;
  const minH = style.bar;

  for (let i = 0; i < slots; i += 1) {
    const offset = width - style.bar - i * step + shift;
    if (offset + style.bar < 0) break;
    if (offset > width) continue;
    const x = rtl ? width - style.bar - offset : offset;
    const level = samples[samples.length - 1 - i];
    const live = level !== undefined;
    const h = live ? Math.max(minH, level * height) : minH;
    ctx.fillStyle = live ? style.color : style.idleColor;
    roundBar(ctx, x, (height - h) / 2, style.bar, h);
  }
}
