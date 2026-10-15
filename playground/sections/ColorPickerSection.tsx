import { api } from "@/components/color-picker/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Pipette } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "color-picker",
    label: "Color Picker",
    summary: "Выбор цвета: палитра, HEX, пипетка",
    keywords: ["выбор цвета", "палитра", "hex", "value", "onValueChange"],
    icon: Pipette,
    order: 12,
  },
  dir: "color-picker",
  title: "ColorPicker",
  kind: "field",
  description:
    "Свободный цвет: hex-поле, область, ползунки каналов, пипетка и образцы. Быстрый цвет из палитры — ColorPresets, палитра прямо в форме — ColorSwatches.",
  examples: [
    {
      slot: "overview",
      description:
        "Поле цвета: hex-значение и сегмент-образец в его конце, открывающий панель — `ColorPicker.HexInput`, `ColorPicker.SwatchButton`.",
    },
    {
      slot: "sizes",
      description: "Каждый ярус пикера: hex-поле и его сегмент-образец берут его у корня — `size`.",
    },
    {
      slot: "states",
      description:
        "Неактивные область, ползунок оттенка и триггер пресетов показывают цвет, но не принимают ввод — `disabled`.",
    },
    {
      slot: "validation",
      description:
        "Цвет кнопок проверяется на лету: слишком светлый встряхивает поле с ошибкой, которая уходит, когда цвет темнее; подсказка у другого поля, неверный текст откатывается по blur — `hint`, `error`.",
    },
    {
      scenario: "panel",
      title: "Панель целиком",
      description:
        "Полная приподнятая панель и порядок частей: формат, область, оттенок и непрозрачность, каналы, цвета бренда — `ColorPicker.Panel`, `surface`, `ColorPicker.Swatches`.",
    },
    {
      scenario: "formats",
      title: "Форматы значений",
      description:
        "Строка каналов в каждом формате; три пикера правят один цвет — `defaultFormat`, `ColorPicker.ChannelStrip`.",
    },
    {
      scenario: "presets",
      title: "Пресеты",
      description:
        "Быстрый цвет из палитры: квадратный триггер с «без цвета» и триггер-кнопка, чья сетка в четыре колонки остаётся открытой после выбора — `ColorPresets`, `allowEmpty`, `ColorPresets.Trigger`, `columns`, `closeOnSelect`.",
    },
    {
      scenario: "presets-custom",
      title: "Пресеты и свой цвет",
      description:
        "Цвет характеристики на сайте: палитра бренда в один клик и любой hex, введённый под ней — `ColorPresets`, `allowCustom`.",
    },
    {
      scenario: "presets-sizes",
      title: "Размеры пресетов",
      description:
        "Триггер пресетов во всех ярусах — квадрат высоты контрола рядом с полем того же яруса — `ColorPresets`, `size`.",
    },
    {
      slot: "controlled",
      description:
        "Цветом и форматом владеет родитель: образцы бренда и каналы меняют цвет, формат остаётся выбранным, кнопка сбрасывает оба — `value`, `onValueChange`, `format`, `onFormatChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Родитель открывает палитру пресетов своей кнопкой и хранит выбранный цвет — `open`, `onOpenChange`, `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Настройки темы: цвет уходит с формой, слишком светлый встряхивает поле с ошибкой при сохранении, и она уходит после смены цвета — `value`, `error`.",
    },
  ],
  api,
};
