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
      name: "Sheet.Root",
      en: "No DOM, no ref. State and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: dialogRootProps("Sheet"),
    },
    {
      name: "Sheet.Content",
      en: '`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"` panel raised from the bottom edge, as tall as its content, with a grab handle while it swipes. Header and footer are optional: without a header name it with `aria-label`.',
      ru: 'Портал, подложка и панель `role="dialog"`, поднятая от нижнего края, высотой по содержимому, с ручкой, пока её можно смахнуть. Шапка и подвал не обязательны: без шапки назовите панель через `aria-label`.',
      props: dialogContentAriaProps,
    },
    ...dialogParts("Sheet", { value: '"end"' }),
    dialogSlotsPart("Sheet", "Sheet.Trigger · Sheet.Close"),
  ],
  labels: dialogLabels,
  accessibility: {
    keyboard: [
      {
        keys: "Escape",
        en: "Closes the sheet (`closeOnEscape`); focus returns to the trigger.",
        ru: "Закрывает шторку (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Tab · Shift+Tab",
        en: "Cycle focus inside the sheet.",
        ru: "Переводит фокус по кругу внутри шторки.",
      },
    ],
    aria: [
      {
        en: '`role="dialog"`, `aria-modal="true"`, named by `Sheet.Title` — without a header by `aria-label` on `Sheet.Content`; described by `Sheet.Description`.',
        ru: '`role="dialog"` и `aria-modal="true"`; имя — `Sheet.Title`, а без шапки — `aria-label` на `Sheet.Content`; описание — `Sheet.Description`.',
      },
      {
        en: "Focus moves into the sheet on open and returns to the opener on close, including after a scrim click.",
        ru: "При открытии фокус уходит в шторку, при закрытии — на элемент, открывший её, в том числе после клика по подложке.",
      },
      {
        en: "The page behind is `inert`, scroll is locked; only the topmost layer reacts.",
        ru: "Страница за шторкой неактивна (`inert`), прокрутка заблокирована; реагирует только верхний слой.",
      },
      {
        en: "A swipe down from the grab handle or the header is an extra way out next to Escape and the scrim, following `closeOnOutsideClick`: with it off there is no swipe and no handle. The handle is `aria-hidden`.",
        ru: "Свайп вниз за ручку или шапку — дополнительный способ закрыть рядом с Escape и подложкой, по `closeOnOutsideClick`: если он выключен, нет ни свайпа, ни ручки. Ручка — `aria-hidden`.",
      },
      {
        en: 'A `Guard` that is `busy` holds every dismiss: the handle stays and takes no drag. A `dirty` one glides a swipe back and opens a `role="alertdialog"` confirm with focus on «Продолжить», as every other dismiss does.',
        ru: '`Guard` `busy` удерживает все способы закрытия: ручка остаётся и не тянется. `dirty` возвращает смахнутую панель и открывает подтверждение `role="alertdialog"` с фокусом на «Продолжить», как и любая другая попытка закрыть.',
      },
    ],
  },
};
