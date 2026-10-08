import { ChevronDown } from "lucide-react";
import { api } from "@/components/select/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "select",
    label: "Select",
    summary: "Выпадающий список с выбором значения",
    keywords: ["селект", "список", "выбор", "value", "onValueChange", "open"],
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
        "Пометки обязательного и необязательного поля, подсказка и ошибка вместо неё в той же строке — `required`, `optional`, `hint`, `error`.",
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
      scenario: "clearable",
      title: "Очистка",
      description:
        "Необязательное поле со сбросом: сегмент очистки перед шевроном, Delete или Backspace на триггере — `clearable`.",
    },
    {
      scenario: "rich-options",
      title: "Богатые пункты",
      description:
        "Пункты с картинкой, второй строкой и ценой; триггер рисует выбранный пункт теми же частями — `renderValue`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta`.",
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
        "Форма региональных настроек: обязательная страна проверяется при отправке, ошибка встаёт на место подсказки — `required`, `error`, `hint`.",
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
        action: "В списке двигают подсветку по доступным пунктам по кругу.",
      },
      {
        keys: "Enter · Space",
        action:
          "Выбирают подсвеченный пункт; одиночный выбор закрывает список и возвращает фокус на триггер.",
      },
      {
        keys: "A–Я",
        action: "Набор с клавиатуры: подсветка уходит на пункт с этой буквы или префикса.",
      },
      { keys: "Delete · Backspace", action: "На триггере с `clearable` очищают значение." },
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
      "Клик снаружи закрывает список без возврата фокуса: фокус остаётся там, куда нажали.",
    ],
  },
};
