import type { ApiProp, LabelDocs } from "../../scripts/docs/componentApi";
import type { TextFormattingLabels } from "./textFormatting";

/** The `formatting` row of a field with the formatting toolbar (Composer, Textarea). */
export function formattingProp(defaultValue: "true" | "false"): ApiProp {
  const on = defaultValue === "true";
  return {
    name: "formatting",
    type: "boolean",
    default: defaultValue,
    en: `Selecting text shows a floating toolbar of seven Markdown tools and enables their hotkeys; a tool wraps the selection, a second press unwraps it. ${on ? "`false` turns both off." : "Off: plain text."}`,
    ru: `Выделение показывает плавающую панель из семи инструментов Markdown и включает их клавиши; инструмент оборачивает выделение, повторное нажатие снимает. ${on ? "`false` выключает и то, и другое." : "Выключено: простой текст."}`,
  };
}

/** The descriptions of the names of the formatting toolbar and its tools (`TextFormattingLabels`). */
export const TEXT_FORMATTING_LABEL_DOCS: LabelDocs<TextFormattingLabels> = {
  formatting: {
    en: "Accessible name of the formatting toolbar.",
    ru: "Имя панели форматирования.",
  },
  bold: { en: "Bold tool.", ru: "Жирный." },
  italic: { en: "Italic tool.", ru: "Курсив." },
  strikethrough: { en: "Strikethrough tool.", ru: "Зачёркнутый." },
  code: { en: "Code tool.", ru: "Код." },
  spoiler: { en: "Spoiler tool (`||…||`).", ru: "Скрытый текст (`||…||`)." },
  link: { en: "Link tool.", ru: "Ссылка." },
  quote: { en: "Quote tool.", ru: "Цитата." },
};
