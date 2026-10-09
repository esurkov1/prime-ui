import { api } from "@/components/color-field/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Palette } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "color-field",
    label: "Color Field",
    summary: "Поле цвета: образец и hex, палитра в поповере",
    keywords: ["цвет", "поле цвета", "hex", "палитра", "value", "onValueChange"],
    icon: Palette,
    order: 11,
  },
  dir: "color-field",
  title: "ColorField",
  kind: "field",
  description:
    "Поле любого цвета в форме: образец и hex в рамке поля, по нажатию — ColorPicker в поповере. Цвет из короткой палитры прямо в форме — ColorSwatches.",
  examples: [
    {
      slot: "overview",
      description:
        "Поле цвета бренда: образец и hex открывают палитру в поповере, новый цвет применяется на ходу — `label`, `defaultValue`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: поле высотой от 28 до 48 px, образец по иконке яруса — `size`.",
    },
    {
      slot: "states",
      description:
        "Обычное поле рядом с ошибочным и неактивным, которое показывает цвет, но не открывается — `invalid`, `disabled`.",
    },
    {
      slot: "validation",
      description:
        "Цвет кнопок проверяется на лету: слишком светлый встряхивает поле с ошибкой, которая уходит, когда цвет темнее; подсказка и необязательное поле — `required`, `optional`, `hint`, `error`.",
    },
    {
      scenario: "presets",
      title: "Готовые цвета и прозрачность",
      description:
        "Цвета бренда под каналами в панели и полупрозрачный цвет затемнения — `presets`, `alpha`.",
    },
    {
      slot: "controlled",
      description:
        "Цветом владеет родитель: подсказка называет его, кнопка возвращает цвет бренда — `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма этапа воронки: цвет уходит с формой по `name`, спокойная заметка подтверждает сохранение — `name`, `required`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        action: "Открывают панель с поля; в ячейке каналов применяют значение.",
      },
      {
        keys: "ArrowLeft · ArrowRight · ArrowUp · ArrowDown",
        action: "Двигают ползунок области или канала; в готовых цветах — между образцами.",
      },
      { keys: "PageUp · PageDown", action: "Крупный шаг области и ползунков." },
      { keys: "Tab", action: "Ходит по частям панели по кругу." },
      { keys: "Escape", action: "Закрывает панель и возвращает фокус на поле." },
    ],
    aria: [
      'Поле — `<button>` с `aria-haspopup="dialog"` и `aria-expanded`; имя — подпись и текущий hex (`aria-labelledby`), без подписи — `aria-label` и hex.',
      'Панель — `role="dialog"` с именем поля; область и ползунки — `role="slider"` React Aria, ползунки названы `labels.hue` и `labels.alpha`.',
      'Готовые цвета — `role="radiogroup"` с именем `labels.presets`.',
      "Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid`.",
    ],
  },
};
