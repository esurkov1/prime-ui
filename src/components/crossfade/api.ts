import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Crossfade",
      en: "`ref` → `HTMLDivElement`. A region that cross-fades its content when `state` changes, opacity only: it takes the new state's height at once, nothing glides or unfolds; still on the first render. A state that turns back within the swap hold never shows.",
      ru: "Область, плавно сменяющая содержимое при смене `state` только прозрачностью: высота нового состояния сразу, ничего не раскрывается; на первом рендере неподвижна. Вернувшееся за окно удержания состояние не видно.",
      props: [
        {
          name: "state",
          type: "string | number",
          required: true,
          en: 'Key of what the region shows: `"loading"`, `"ready"`, `"empty"`, `"error"` or a record id. A new value cross-fades; the same one updates in place. A swap into or out of `"loading"` takes the short fade.',
          ru: 'Ключ того, что показывает область: `"loading"`, `"ready"`, `"empty"`, `"error"` или id записи. Новое значение — смена с переходом, то же — обновление на месте. Смена в `"loading"` и из него — короткое растворение.',
        },
        {
          name: "fill",
          type: "boolean",
          default: "false",
          en: "The region takes its parent's height (a flex or grid item, or a sized block) and every state stretches to it. A `Crossfade` that is the child of a `Page.Cell` fills it unless `fill` is set.",
          ru: "Область занимает высоту родителя (элемент flex или grid, блок с высотой), каждое состояние растягивается по ней. `Crossfade` — ребёнок `Page.Cell` — заполняет ячейку, если `fill` не задан.",
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
        en: "Focus in the old state (the retry button of an error) moves into the new one: its first tab stop, or the new content itself; focus elsewhere on the page stays where it is.",
        ru: "Фокус из старого состояния (кнопка «Повторить» у ошибки) переходит в новое: на первый элемент с табуляцией или на само новое содержимое; фокус в другом месте страницы не трогается.",
      },
    ],
  },
};
