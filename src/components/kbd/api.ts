import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Kbd",
      en: "`ref` → `HTMLElement`. A native `<kbd>`: one key per `Kbd`; passes its tier to a nested `Icon`.",
      ru: "Нативный `<kbd>`: одна клавиша на `Kbd`; передаёт свой ярус вложенной `Icon`.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          en: "Badge tier, 16 · 20 · 24 · 28 · 32 px high. Without it the key follows the surrounding control one tier down (m → s); outside a control it is `m`.",
          ru: "Ярус бейджа, высота 16 · 20 · 24 · 28 · 32 px. Без него внутри контрола — на ступень ниже его размера (m → s), вне контрола — `m`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Key label, an `Icon`, or an icon and text.",
          ru: "Подпись клавиши, `Icon` или иконка с текстом.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "size">',
          en: "`className`, `title`, `aria-label` and the other `<kbd>` attributes.",
          ru: "`className`, `title`, `aria-label` и остальные атрибуты `<kbd>`.",
        },
      ],
    },
  ],
  labels: [],
};
