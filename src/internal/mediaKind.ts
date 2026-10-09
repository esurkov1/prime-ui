/** What a file shows: a picture, a clip, or neither (a document, an archive). */
export type MediaKind = "image" | "video";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "heic",
  "heif",
  "bmp",
  "svg",
]);
const VIDEO_EXTENSIONS = new Set(["mp4", "m4v", "mov", "webm", "ogv", "mkv", "avi", "3gp"]);

/**
 * The media kind of a file: by its MIME type, and by the extension of its name when the browser
 * gives none (a drop from some file managers, a paste from some apps). `null` for anything else.
 */
export function mediaKind(file: Pick<File, "type" | "name">): MediaKind | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type !== "") return null;
  const dot = file.name.lastIndexOf(".");
  const extension = dot === -1 ? "" : file.name.slice(dot + 1).toLowerCase();
  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  if (VIDEO_EXTENSIONS.has(extension)) return "video";
  return null;
}
