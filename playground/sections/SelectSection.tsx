import { api } from "@/components/select/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ChevronDown } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "select",
    label: "Select",
    summary: "Выпадающий список с выбором значения",
    keywords: [
      "селект",
      "список",
      "выбор",
      "value",
      "onValueChange",
      "open",
      "onSearchChange",
      "сервер",
      "аватар",
    ],
    icon: ChevronDown,
    order: 6,
  },
  dir: "select",
  title: "Select",
  kind: "field",
  description:
    "Поле выбора одного значения (или нескольких с `multiple`) из закрытого списка: роль, страна, часовой пояс. Повторяет контракт полей Input.",
  examples: [
    {
      slot: "overview",
      description:
        "Поле с подписью и плейсхолдером; выбор пункта закрывает список и показывает подпись — `label`, `placeholder`.",
    },
    {
      slot: "variants",
      description: "Поле и чип статуса рядом — `variant`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы; подпись, строки списка и подсказка берут ярус поля — `size`.",
    },
    {
      slot: "states",
      description:
        "Обычное поле рядом с неактивным, загружающимся, ошибочным, с пустым списком и полем, где фокус виден без кольца — `disabled`, `loading`, `invalid`, `labels`, `focusRing`.",
    },
    {
      slot: "validation",
      description:
        "Живая проверка: снимите ответственного — поле вздрогнет и ошибка встанет на место подсказки, выберите человека — ошибка уйдёт; пометки обязательного и необязательного поля и подсказка — `required`, `optional`, `hint`, `error`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка в начале триггера и перед подписью каждого пункта — `Select.TriggerIcon`, `Select.ItemIcon`.",
    },
    {
      scenario: "multiple",
      title: "Несколько значений",
      description:
        "Несколько значений: чекбоксы в списке, список не закрывается при выборе, подписи через запятую — `multiple`.",
    },
    {
      scenario: "searchable",
      title: "Поиск",
      description:
        "Длинный список с поиском: пункты ищутся по подписи и ключевым словам, группы и разделитель прячутся при поиске — `searchable`, `keywords`, `Select.Group`.",
    },
    {
      scenario: "server-search",
      title: "Поиск на сервере",
      description:
        "Клиент из тысяч: родитель ищет на сервере по мере ввода и догружает следующую страницу в конце списка — `search`, `onSearchChange`, `filter`, `loading`, `hasMore`, `loadingMore`, `onLoadMore`.",
    },
    {
      scenario: "create-action",
      title: "Действие в списке",
      description:
        "Поиск клиента с закреплённым действием «Новый клиент»: оно стоит под списком при любом запросе, стрелки доходят до него после последнего клиента, а форма добавляет и выбирает нового клиента — `Select.Action`, `searchable`.",
    },
    {
      scenario: "load-error",
      title: "Ошибка загрузки",
      description:
        "Пункты не загрузились: список говорит об этом на месте, а повтор загружает их снова — `loadError`, `onRetry`, `loading`.",
    },
    {
      scenario: "clearable",
      title: "Очистка",
      description:
        "Необязательное поле со сбросом: сегмент очистки перед шевроном, Delete или Backspace на триггере — `clearable`.",
    },
    {
      scenario: "saving",
      title: "Сохранение на сервере",
      description:
        "Выбор сразу сохраняется на сервере: значение встаёт со спиннером на триггере, а отказ сервера возвращает прежнее и объясняет почему — `onValueChange`, `error`.",
    },
    {
      scenario: "rich-options",
      title: "Богатые пункты",
      description:
        "Пункты с картинкой, второй строкой и ценой; триггер рисует выбранный пункт теми же частями — `renderValue`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta`.",
    },
    {
      scenario: "people",
      title: "Люди",
      description:
        "Люди в строках и триггере: аватар по ярусу перед именем, бейдж роли после него — `Avatar.Root`, `Badge.Root`, `renderValue`.",
    },
    {
      scenario: "status",
      title: "Статус",
      description:
        "Шаг депозита в его строке: пункты цветами статусов, поле — чип цвета выбранного, а сохранение оставляет новый цвет или откатывает его — `variant`, `color`.",
    },
    {
      scenario: "currency",
      title: "Валюта",
      description:
        "Валюта депозита: знак валюты перед каждым вариантом и в триггере, а сумма в остальном тексте остаётся с кодом — `Select.ItemIcon`, `Select.TriggerIcon`.",
    },
    {
      scenario: "icon-only",
      title: "Только иконка",
      description:
        "Выбор иконки шириной в саму иконку: в триггере только выбранный значок и шеврон, значение по-прежнему читается вслух — `Select.TriggerIcon`.",
    },
    {
      slot: "dismiss",
      description:
        "Список фильтра остаётся открытым, пока человек смотрит рядом: закрывают его только Escape, триггер или Tab — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель: тариф меняет цену под полем, кнопка сбрасывает его — `value`, `onValueChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Списком владеет родитель: кнопка открывает его из кода, выбор или Escape закрывают — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма региональных настроек: обязательная страна проверяется при отправке, ошибка встряхивает поле и уходит, когда страна выбрана, спокойная заметка подтверждает сохранение — `required`, `error`, `hint`.",
    },
  ],
  api,
};
