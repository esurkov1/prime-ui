import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "StatusDot",
      en: "`ref` → `HTMLSpanElement`. An inline `<span>`: a dot of the tone, then the word that names the state; it takes the type and the color of the text around it.",
      ru: "Строчный `<span>`: точка тона и слово, называющее состояние; берёт шрифт и цвет окружающего текста.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger"',
          default: '"neutral"',
          en: "Tone of the dot. The word carries the meaning, the dot only repeats it.",
          ru: "Тон точки. Смысл несёт слово, точка его лишь повторяет.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The word that names the state («Работает», «Ошибка»).",
          ru: "Слово, называющее состояние («Работает», «Ошибка»).",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLSpanElement>",
          en: "`className`, `title` and the other `<span>` attributes.",
          ru: "`className`, `title` и остальные атрибуты `<span>`.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: 'The dot is `aria-hidden="true"`; the state is read from the word, never from the color.',
        ru: 'Точка — `aria-hidden="true"`; состояние читается по слову, не по цвету.',
      },
    ],
  },
};
