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
          name: "fill",
          type: "boolean",
          default: "false",
          en: "The region takes its parent's height (a flex or grid item, or a sized block) and every state stretches to it; the height never glides.",
          ru: "Область занимает высоту родителя (элемент flex или grid, блок с высотой), каждое состояние растягивается по ней; высота не анимируется.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Content of the current `state`. Nothing (`null`, `false`) leaves no box once the old state has faded: no gap in a grid or a flex column.",
          ru: "Содержимое текущего `state`. Пустое (`null`, `false`) после растворения старого состояния не оставляет блока: в grid или flex-колонке нет лишнего зазора.",
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
  accessibility: {
    keyboard: [],
    aria: [
      {
        en: "Renders a plain `<div>`; pass `aria-busy` while the region loads and `aria-live` or `role` when its changes must be announced.",
        ru: "Обычный `<div>`: передайте `aria-busy` на время загрузки и `aria-live` или `role`, если смену нужно озвучить.",
      },
      {
        en: "The leaving layer is `aria-hidden` and `inert`: screen readers and Tab never reach content that is going away.",
        ru: "Уходящий слой — `aria-hidden` и `inert`: скринридер и Tab не попадают в исчезающее содержимое.",
      },
      {
        en: "Move focus yourself when the focused control was in the old state (e.g. the retry button of an error).",
        ru: "Если фокус был в старом состоянии (кнопка «Повторить» у ошибки), переведите его сами.",
      },
    ],
  },
};
