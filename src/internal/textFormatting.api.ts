import type { ApiLabel, ApiProp } from "../../scripts/docs/componentApi";

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

/** The names of the formatting toolbar and its tools (`TextFormattingLabels`). */
export const TEXT_FORMATTING_LABEL_ROWS: ApiLabel[] = [
  {
    key: "formatting",
    default: "Форматирование",
    en: "Accessible name of the formatting toolbar.",
    ru: "Имя панели форматирования.",
  },
  { key: "bold", default: "Жирный", en: "Bold tool.", ru: "Жирный." },
  { key: "italic", default: "Курсив", en: "Italic tool.", ru: "Курсив." },
  { key: "strikethrough", default: "Зачёркнутый", en: "Strikethrough tool.", ru: "Зачёркнутый." },
  { key: "code", default: "Моноширинный", en: "Code tool.", ru: "Код." },
  {
    key: "spoiler",
    default: "Скрытый текст",
    en: "Spoiler tool (`||…||`).",
    ru: "Скрытый текст (`||…||`).",
  },
  { key: "link", default: "Ссылка", en: "Link tool.", ru: "Ссылка." },
  { key: "quote", default: "Цитата", en: "Quote tool.", ru: "Цитата." },
];
