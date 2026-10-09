export type MediaViewerItem = {
  /** Default `image`. */
  type?: "image" | "video";
  /** The full picture or the video file. */
  src: string;
  /**
   * A small copy of the picture (the thumbnail it opens from): shown at once while `src` loads,
   * and in the filmstrip.
   */
  thumbnail?: string;
  /** A still of a video before it plays; the filmstrip shows it too. */
  poster?: string;
  /** What the picture shows: the image's `alt`, the name of its page and its thumbnail. */
  alt?: string;
  /** A line or two under the picture. */
  caption?: string;
  /**
   * The natural size: the picture takes its final box before anything loads. Without it the box
   * starts at 4 : 3 and refits when the file reports its own size.
   */
  width?: number;
  height?: number;
};

export type MediaViewerLabels = {
  /** The name of the dialog when no `aria-label` is given. */
  viewer: string;
  close: string;
  previous: string;
  next: string;
  zoomIn: string;
  zoomOut: string;
  /** The counter and the name of a page: `{current}` and `{total}`. */
  counter: string;
  /** What a page is to assistive tech (`aria-roledescription`). */
  slide: string;
  /** The name of a page without `alt`. */
  photo: string;
  video: string;
  /** The filmstrip. */
  thumbnails: string;
  /** A thumbnail of the filmstrip: `{name}` is the item's `alt`, else `photo` / `video`. */
  show: string;
  /** Read when the page changes: `{name}`, `{current}`, `{total}`. */
  announcement: string;
  loadError: string;
  retry: string;
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  /** The sound level slider of a video. */
  volume: string;
  /** The value of the level slider: `{value}` in percent. */
  volumeValue: string;
  /** The seek slider of a video. */
  seek: string;
  /** The value of the seek slider: `{current}` and `{duration}` as m:ss. */
  position: string;
};
