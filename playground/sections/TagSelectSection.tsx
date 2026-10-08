import { api } from "@/components/tag-select/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Tags } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "tag-select",
    label: "Tag Select",
    summary: "Множественный выбор с тегами",
    keywords: ["теги", "мультиселект", "multiselect", "value", "onValueChange"],
    icon: Tags,
    order: 8,
  },
  dir: "tag-select",
  title: "TagSelect",
  kind: "field",
  description:
    "Поле нескольких значений в виде цветных тегов: выбор из списка, фильтр набором, создание новых. В покое одна строка, в фокусе — все теги.",
  examples: [
    {
      slot: "overview",
      description:
        "Поле тегов с подписью: фокус открывает список, набор фильтрует его, выбранные теги становятся чипами — `label`, `options`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы с двумя выбранными тегами; чипы на ярус меньше поля — `size`.",
    },
    {
      slot: "states",
      description:
        "Обычное поле рядом с неактивным и ошибочным, неактивная опция в списке — `disabled`, `invalid`.",
    },
    {
      slot: "validation",
      description:
        "Живая проверка: удалите последний регион — поле вздрогнет и ошибка встанет на место подсказки, добавьте регион — ошибка уйдёт; пометки обязательного и необязательного поля и подсказка — `required`, `optional`, `hint`, `error`.",
    },
    {
      scenario: "creatable",
      title: "Создание тегов",
      description:
        "Набранный текст, которого нет в списке, становится новым тегом через строку «Создать» или Enter — `creatable`, `onCreate`, `defaultColor`.",
    },
    {
      scenario: "many-tags",
      title: "Много тегов",
      description:
        "Тегов больше, чем помещается: в покое одна строка с «+N», в фокусе все теги до трёх строк с прокруткой — `defaultValue`.",
    },
    {
      scenario: "manage-tags",
      title: "Управление тегами",
      description:
        "Пользователи ведут свой словарь: меню «⋯» у строки переименовывает, перекрашивает или удаляет опцию — `onOptionUpdate`, `onOptionDelete`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель: кнопка подставляет набор тегов, счётчик следует за ними — `value`, `onValueChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Списком владеет родитель: кнопка открывает его из кода, Escape или нажатие снаружи закрывают — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма новой задачи: обязательные метки проверяются при отправке, ошибка встряхивает поле и уходит, когда метка добавлена, спокойная заметка подтверждает задачу — `required`, `error`, `creatable`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "ArrowDown · ArrowUp", action: "Открывают список и двигают подсветку по опциям." },
      {
        keys: "Enter",
        action: "Отмечает или снимает подсвеченную опцию; на строке «Создать» — создаёт тег.",
      },
      { keys: "Space", action: "Печатает пробел: в теге может быть несколько слов." },
      { keys: "Backspace", action: "В пустом поле удаляет последний тег." },
      {
        keys: "ArrowLeft · ArrowRight",
        action: "Из начала поля переводят фокус по тегам и обратно в поле.",
      },
      { keys: "Delete", action: "На теге удаляет его; фокус уходит на соседний тег." },
      { keys: "Escape", action: "Закрывает список." },
    ],
    aria: [
      'Поле ввода — `role="combobox"` с `aria-expanded` и `aria-controls`; список — `role="listbox"` с `aria-multiselectable`, опции — `role="option"` с `aria-selected`.',
      "Подсветка — через `aria-activedescendant`; чекбокс в строке декоративен.",
      "Удаление тега объявляется через `labels.removed` в живой области; у кнопки удаления — имя `labels.remove`.",
      "Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid`.",
    ],
  },
};
