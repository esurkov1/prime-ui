import type { PaletteColor } from "./states";

/** The format badge hue of the common families: documents, sheets, slides, archives, media. */
const FORMAT_COLORS: Record<string, PaletteColor> = {
  pdf: "red",
  doc: "blue",
  docx: "blue",
  txt: "blue",
  xls: "green",
  xlsx: "green",
  csv: "green",
  ppt: "orange",
  pptx: "orange",
  zip: "yellow",
  rar: "yellow",
  "7z": "yellow",
  mp4: "purple",
  mov: "purple",
  webm: "purple",
  mp3: "pink",
  wav: "pink",
};

/** The extension of a file name, lower case; `""` without one. */
export function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

/** The hue of a format badge (FileUpload, `Message.File`); `gray` for anything else. */
export function formatColor(format: string): PaletteColor {
  return FORMAT_COLORS[format] ?? "gray";
}
