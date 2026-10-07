import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Crossfade",
      en: "`ref` → `HTMLDivElement`. A region that cross-fades its content when `state` changes and glides to the new height; still on the first render, instant under reduced motion.",
      ru: "Область, которая плавно сменяет содержимое при смене `state` и мягко подстраивает высоту; на первом рендере неподвижна, при reduced motion меняется сразу.",
      props: [
        {
          name: "state",
          type: "string | number",
          required: true,
          en: 'Key of what the region shows: `"loading"`, `"ready"`, `"empty"`, `"error"` or a record id. A new value cross-fades the old content into the new one; the same value updates in place.',
          ru: 'Ключ того, что показывает область: `"loading"`, `"ready"`, `"empty"`, `"error"` или id записи. Новое значение — смена с переходом; то же значение — обновление на месте.',
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Content of the current `state`.",
          ru: "Содержимое текущего `state`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `aria-busy`, `aria-live`, `role` and the other div attributes.",
          ru: "`className`, `aria-busy`, `aria-live`, `role` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: [],
};
