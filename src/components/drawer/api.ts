import type { ComponentApi } from "../../../scripts/docs/componentApi";

import {
  dialogContentAriaProps,
  dialogLabels,
  dialogParts,
  dialogRootProps,
  dialogSlotsPart,
} from "../../internal/overlay/dialog.api";

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
      en: '`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel at the edge, side by side; renders while open and during its exit animation, showing the children it had open (a record cleared with `open` does not empty the panel mid-motion).',
      ru: 'Портал, подложка и панель `role="dialog"` у края экрана рядом; видна, пока открыта и пока играет выход, с тем содержимым, что было открыто (запись, очищенная вместе с `open`, не пустеет на ходу).',
      props: [
        {
          name: "side",
          type: '"left" | "right"',
          default: '"right"',
          en: "Edge the panel slides from; rounded only on the edge facing the page. No swipe: the drawer closes by its buttons, Escape and the scrim. A panel from the bottom edge is a Sheet.",
          ru: "Край, от которого выезжает панель; скругление только со стороны страницы. Свайпа нет: панель закрывают кнопки, Escape и подложка. Панель снизу — это Sheet.",
        },
        {
          name: "size",
          type: '"s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Width: 360 · 480 · 640 · 800. Below 640 px of viewport — full width, without corners.",
          ru: "Ширина 360 · 480 · 640 · 800 px. Уже 640 px экрана — на всю ширину, без скруглений.",
        },
        ...dialogContentAriaProps,
      ],
    },
    ...dialogParts("Drawer", { value: '"end"' }, { section: true }),
    dialogSlotsPart("Drawer", "Drawer.Trigger · Drawer.Close"),
  ],
  labels: dialogLabels,
  accessibility: {
    keyboard: [
      {
        keys: "Escape",
        en: "Closes the drawer (`closeOnEscape`); focus returns to the trigger.",
        ru: "Закрывает панель (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Tab · Shift+Tab",
        en: "Cycle focus inside the drawer.",
        ru: "Переводит фокус по кругу внутри панели.",
      },
    ],
    aria: [
      {
        en: '`role="dialog"`, `aria-modal="true"`, named by `Drawer.Title` (or `aria-label`), described by `Drawer.Description`.',
        ru: '`role="dialog"` и `aria-modal="true"`; имя — `Drawer.Title` (или `aria-label`), описание — `Drawer.Description`.',
      },
      {
        en: "Focus moves into the panel on open and returns to the opener on close, including after a scrim click.",
        ru: "При открытии фокус уходит в панель, при закрытии — на элемент, открывший её, в том числе после клика по подложке.",
      },
      {
        en: "The page behind is `inert`, scroll is locked; only the topmost layer reacts.",
        ru: "Страница за панелью неактивна (`inert`), прокрутка заблокирована; реагирует только верхний слой.",
      },
      {
        en: "A drawer opened from a Modal stacks above it.",
        ru: "Панель, открытая из Modal, встаёт над ним.",
      },
      {
        en: "No swipe: the close button, `Drawer.Close`, Escape and the scrim are the ways out.",
        ru: "Свайпа нет: панель закрывают крестик, `Drawer.Close`, Escape и подложка.",
      },
      {
        en: 'A `Guard` that is `busy` keeps the close button and the `Close` child in place, `disabled`; a `dirty` one opens a `role="alertdialog"` confirm with focus on «Продолжить».',
        ru: '`Guard` `busy` оставляет крестик и кнопку в `Close` на месте выключенными (`disabled`); `dirty` открывает подтверждение `role="alertdialog"` с фокусом на «Продолжить».',
      },
    ],
  },
};
