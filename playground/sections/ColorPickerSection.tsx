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
    order: 11,
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
        "Поле цвета: hex-значение и кнопка-образец, открывающая панель — `ColorPicker.HexInput`, `ColorPicker.TriggerSwatch`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы hex-поля с кнопкой-образцом того же яруса — `size`.",
    },
    {
      slot: "states",
      description:
        "Неактивные область и ползунок оттенка показывают цвет, но не принимают ввод — `disabled`.",
    },
    {
      slot: "validation",
      description:
        "Подсказка под hex-полем и ошибка на её месте; неверный текст откатывается по blur — `hint`, `error`.",
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
        "Быстрый цвет из палитры: квадратный триггер рядом с полем и триггер-кнопка; можно «без цвета» — `ColorPresets`, `allowEmpty`, `asChild`.",
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
        "Цветом владеет родитель: образцы бренда и hex-поле меняют его, кнопка сбрасывает — `value`, `onValueChange`.",
    },
    {
      slot: "in-form",
      description:
        "Настройки темы: цвет уходит с формой, слишком светлый не проходит при сохранении — `value`, `error`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "ArrowLeft · ArrowRight · ArrowUp · ArrowDown",
        action: "Двигают ползунок области или канала; в сетке ColorPresets — между образцами.",
      },
      { keys: "PageUp · PageDown", action: "Крупный шаг области и ползунков." },
      {
        keys: "Home · End",
        action: "Края ползунка; первый / последний образец в сетке ColorPresets.",
      },
      {
        keys: "Enter · Space",
        action: "Применяет поле; выбирает образец пресета и закрывает панель.",
      },
      {
        keys: "Tab",
        action: "Ходит по частям; из сетки ColorPresets возвращает на триггер и закрывает.",
      },
      { keys: "Escape", action: "Закрывает панель ColorPresets." },
    ],
    aria: [
      'Область и ползунки — примитивы React Aria со своими именами `role="slider"`.',
      "`TriggerSwatch` и `ColorPresets.Swatch` скрыты (`aria-hidden`) — дайте кнопке-триггеру `aria-label`; `ColorPresets.Trigger` называет себя «`labels.trigger`: <цвет>».",
      '`ColorPicker.Swatches` — `role="radiogroup"` (ColorSwatches): назовите через `label` или `aria-label`.',
      'Сетка ColorPresets — `role="listbox"` с образцами `role="option"`, имя из `label` у Content или `labels.list`.',
    ],
  },
};
