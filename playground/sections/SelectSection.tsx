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
      slot: "sizes",
      description: "Все ярусы; подпись, строки списка и подсказка берут ярус поля — `size`.",
    },
    {
      slot: "states",
      description:
        "Обычное поле рядом с неактивным, загружающимся, ошибочным и с пустым списком — `disabled`, `loading`, `invalid`, `labels`.",
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
      scenario: "icon-only",
      title: "Только иконка",
      description:
        "Выбор иконки шириной в саму иконку: в триггере только выбранный значок и шеврон, значение по-прежнему читается вслух — `Select.TriggerIcon`.",
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
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space · ArrowDown · ArrowUp",
        action: "На триггере открывают список; фокус уходит в поиск или список.",
      },
      {
        keys: "ArrowDown · ArrowUp · Home · End",
        action:
          "В списке двигают подсветку по доступным пунктам по кругу; `Select.Action` — последняя остановка после пунктов.",
      },
      {
        keys: "Enter · Space",
        action:
          "Выбирают подсвеченный пункт; одиночный выбор закрывает список и возвращает фокус на триггер. На `Select.Action` запускают действие и закрывают список.",
      },
      {
        keys: "A–Я",
        action: "Набор с клавиатуры: подсветка уходит на пункт с этой буквы или префикса.",
      },
      { keys: "Delete · Backspace", action: "На триггере с `clearable` очищают значение." },
      {
        keys: "Enter",
        action: "При ошибке загрузки в открытом списке повторяет загрузку (`onRetry`).",
      },
      { keys: "Escape", action: "Закрывает список; фокус возвращается на триггер." },
      {
        keys: "Tab",
        action: "Возвращает фокус на триггер, закрывает список и переходит дальше от триггера.",
      },
    ],
    aria: [
      'Триггер — `role="combobox"` с `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`; имя — `label`.',
      'Список — `role="listbox"` (`aria-multiselectable` при `multiple`); пункты — `role="option"` с `aria-selected`; подсветка — через `aria-activedescendant`.',
      "Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid`; при загрузке — `aria-busy`.",
      'При загрузке список — `aria-busy`, а `labels.loading` объявляется вежливо; строки-скелеты скрыты от скринридеров; ошибка загрузки — `role="alert"`.',
      "Подсветка, дошедшая до последнего пункта, запрашивает следующую порцию так же, как прокрутка.",
      '`Select.Action` — `role="option"` в группе под прокруткой; список владеет группой через `aria-owns`, подсветка доходит до действия через `aria-activedescendant`.',
      "Пока сохраняется обещание из `onValueChange`, триггер — `aria-busy`, а отказ объявляет `labels.changeFailed` вежливо.",
      "Клик снаружи закрывает список без возврата фокуса: фокус остаётся там, куда нажали.",
    ],
  },
};
