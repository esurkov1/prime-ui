import type { ComponentApi } from "../../../scripts/docs/componentApi";

import {
  dialogContentAriaProps,
  dialogLabels,
  dialogParts,
  dialogRootProps,
  dialogSlotsPart,
} from "./dialog.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "Modal.Root",
      en: "No DOM, no ref. State and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: [
        ...dialogRootProps("Modal"),
        {
          name: "confirmOnEnter",
          type: "boolean",
          default: "true",
          en: "Enter inside the dialog clicks the element wrapped in `Modal.Confirm`; Enter on a button, link, `textarea`, `select`, checkbox or in the header keeps its own meaning.",
          ru: "Enter внутри окна нажимает элемент в `Modal.Confirm`; на кнопке, ссылке, в `textarea`, `select`, на чекбоксе и в шапке Enter работает как обычно.",
        },
        {
          name: "onEnterConfirm",
          type: "(event: KeyboardEvent) => void",
          en: "Replaces the default Enter confirm (the `Modal.Confirm` click).",
          ru: "Свой обработчик Enter вместо нажатия `Modal.Confirm`.",
        },
      ],
    },
    {
      name: "Modal.Content",
      en: '`ref` → `HTMLDivElement` (the dialog panel). Portal + scrim + `role="dialog"`, side by side; renders while open and during its exit animation, showing the children it had open (a record cleared with `open` does not empty the panel mid-motion). Controls inside get size `m`.',
      ru: 'Портал, подложка и `role="dialog"` рядом; виден, пока открыт и пока играет выход, с тем содержимым, что было открыто (запись, очищенная вместе с `open`, не пустеет на ходу). Контролы внутри — размера `m`.',
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Width: 360 · 440 · 560 · 720 · 960.",
          ru: "Ширина 360 · 440 · 560 · 720 · 960 px.",
        },
        {
          name: "placement",
          type: '"center" | "top"',
          default: '"center"',
          en: "`center`: in the middle; on a phone a bottom sheet that swipes down (`closeOnOutsideClick`). `top`: near the top edge at every width, growing downward — a search palette above the on-screen keyboard.",
          ru: "`center` — посередине; на телефоне шторка снизу со свайпом (`closeOnOutsideClick`). `top` — у верхнего края на любой ширине, растёт вниз: палитра поиска над экранной клавиатурой.",
        },
        {
          name: "container",
          type: "HTMLElement | null",
          default: "document.body",
          en: "Portal target.",
          ru: "Узел для портала.",
        },
        ...dialogContentAriaProps,
      ],
    },
    ...dialogParts("Modal", {
      note: {
        en: '`"fill"` for `xs` `s` `m`, `"end"` for `l` `xl`',
        ru: '`"fill"` для `xs` `s` `m`, `"end"` для `l` `xl`',
      },
    }),
    dialogSlotsPart("Modal", "Modal.Trigger · Modal.Close · Modal.Confirm"),
  ],
  labels: dialogLabels,
  accessibility: {
    keyboard: [
      {
        keys: "Escape",
        en: "Closes the dialog (`closeOnEscape`); focus returns to the opener.",
        ru: "Закрывает окно (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Enter",
        en: 'Clicks `Modal.Confirm` from a text field or the dialog itself. Enter on a button, link or `role="button"` (Cancel included) activates that element instead; a `<textarea>`, a `<select>`, an `<input>` of type checkbox / radio / file / button / submit / reset, a contenteditable element and the header keep their own Enter.',
        ru: 'Нажимает `Modal.Confirm` из текстового поля или самого окна; на кнопке, ссылке или `role="button"` (включая «Отмена») срабатывает она сама; `<textarea>`, `<select>`, `<input>` типа checkbox / radio / file / button / submit / reset, contenteditable и шапка оставляют Enter себе.',
      },
      {
        keys: "Tab · Shift+Tab",
        en: "Cycles focus inside the dialog.",
        ru: "Переводит фокус по кругу внутри окна.",
      },
    ],
    aria: [
      {
        en: '`role="dialog"`, `aria-modal="true"`, named by `Modal.Title` (or `aria-label`), described by `Modal.Description`.',
        ru: '`role="dialog"` и `aria-modal="true"`; имя — `Modal.Title` (или `aria-label`), описание — `Modal.Description`.',
      },
      {
        en: "Focus moves into the dialog on open (an `autoFocus` field wins) and returns to the opener on close — also after a scrim click (foundation §8).",
        ru: "При открытии фокус уходит в окно (поле с `autoFocus` побеждает), при закрытии — на элемент, открывший окно, в том числе после клика по подложке (foundation §8).",
      },
      {
        en: "The page behind is `inert` and its scroll is locked.",
        ru: "Страница за окном неактивна (`inert`), прокрутка заблокирована.",
      },
      {
        en: "Only the topmost layer reacts: a Select open inside the dialog closes first.",
        ru: "Реагирует только верхний слой: Select, открытый внутри окна, закрывается первым.",
      },
      {
        en: "As a phone sheet a swipe down is an extra way out; the close button and Escape stay. With `closeOnOutsideClick={false}` there is no swipe and no grab handle; the handle is `aria-hidden`.",
        ru: "На телефоне свайп вниз — дополнительный способ закрыть; крестик и Escape остаются. С `closeOnOutsideClick={false}` свайпа и ручки нет; ручка — `aria-hidden`.",
      },
      {
        en: 'A `Guard` that is `busy` keeps the close button and the `Close` child in place, `disabled`; a `dirty` one opens a `role="alertdialog"` confirm with focus on «Продолжить».',
        ru: '`Guard` `busy` оставляет крестик и кнопку в `Close` на месте выключенными (`disabled`); `dirty` открывает подтверждение `role="alertdialog"` с фокусом на «Продолжить».',
      },
    ],
  },
};
