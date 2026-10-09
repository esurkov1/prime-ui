/** Browsers draw a frame for `preload="metadata"` only past the start: ask for the first one. */
export function firstFrame(src: string): string {
  return src.includes("#") ? src : `${src}#t=0.001`;
}
