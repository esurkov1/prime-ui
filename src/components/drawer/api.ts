import type { ComponentApi } from "../../../scripts/docs/componentApi";

import {
  dialogContentAriaProps,
  dialogLabels,
  dialogParts,
  dialogRootProps,
  dialogSlotsPart,
} from "../modal/dialog.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "Drawer.Root",
      en: "No DOM, no ref. State and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: dialogRootProps("Drawer"),
    },
    {
      name: "Drawer.Content",
      en: '`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel at the edge; renders while open and during its exit animation.',
      ru: "Портал, подложка и панель у края экрана: ловушка фокуса, блокировка прокрутки.",
      props: [
        {
          name: "side",
          type: '"left" | "right" | "bottom"',
          default: '"right"',
          en: "Edge the panel slides from; rounded only on the edge facing the page. `bottom` is a sheet: a grab handle on top, height by content. A swipe toward the edge closes the panel (with `closeOnOutsideClick`): a bottom sheet from its handle or header, a side drawer by touch anywhere (by mouse from the header).",
          ru: "Край, от которого выезжает панель; скругление только со стороны страницы. `bottom` — шторка: ручка сверху, высота по содержимому. Свайп к краю закрывает панель (при `closeOnOutsideClick`): шторку — за ручку или шапку, боковую — касанием где угодно (мышью — за шапку).",
        },
        {
          name: "size",
          type: '"s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Width: 360 · 480 · 640 · 800 (a bottom sheet is centred). Below 640 px of viewport — full width; side drawers lose their corners.",
          ru: "Ширина 360 · 480 · 640 · 800 px (шторка снизу — по центру). Уже 640 px экрана — на всю ширину; у боковых панелей нет скруглений.",
        },
        ...dialogContentAriaProps,
      ],
    },
    ...dialogParts("Drawer", '"end"'),
    dialogSlotsPart("Drawer", "Drawer.Trigger · Drawer.Close"),
  ],
  labels: dialogLabels,
};
