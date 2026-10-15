import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { FIELD_HINT_TONE_PROP } from "../../internal/field.api";
import { TAG_SELECT_LABELS } from "./TagSelect";

export const api: ComponentApi = {
  parts: [
    {
      name: "TagSelect",
      en: '`ref` → `HTMLDivElement` (the field frame). The field frame with a chip row and an `<input role="combobox">`, and a portaled multi-select list; options come as data.',
      ru: 'Рамка поля со строкой чипов и `<input role="combobox">` и выпадающий список с несколькими значениями; опции — данные.',
      props: [
        {
          name: "options",
          type: "TagSelectOption[]",
          required: true,
          en: "Available tags: `{ value, label, color?, disabled? }`.",
          ru: "Доступные теги: `{ value, label, color?, disabled? }`.",
        },
        {
          name: "value",
          type: "string[]",
          en: "Controlled picked values.",
          ru: "Управляемые выбранные значения.",
        },
        {
          name: "defaultValue",
          type: "string[]",
          default: "[]",
          en: "Initial picked values, uncontrolled.",
          ru: "Начальные значения без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string[]) => void",
          en: "Called with the new list after a pick, a removal or a creation.",
          ru: "Вызывается с новым списком после выбора, удаления или создания.",
        },
        {
          name: "open",
          type: "boolean",
          en: "Controlled open state of the list.",
          ru: "Открытие списка, управляемо.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          en: "Initial open state, uncontrolled.",
          ru: "Начальное открытие без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called on every open and close: focus, a field click, typing, arrows, Escape, an outside press; typing closes it when nothing matches.",
          ru: "Вызывается при каждом открытии и закрытии: фокус, клик по полю, ввод, стрелки, Escape, нажатие снаружи; ввод закрывает список, когда ничего не подходит.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the list; focus stays in the input.",
          ru: "Escape закрывает список; фокус остаётся в поле.",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A press outside the field and the list closes the list.",
          ru: "Нажатие вне поля и списка закрывает список.",
        },
        {
          name: "creatable",
          type: "boolean",
          default: "false",
          en: "A typed text that is not an option can be added (the Create row or Enter).",
          ru: "Набранный текст, которого нет в опциях, можно добавить (строка «Создать» или Enter).",
        },
        {
          name: "onCreate",
          type: "(value: string) => void | Promise<void>",
          en: "A new value was created, not picked from `options`; it joins the selection at once. Return the save's promise: the chip waits busy; on reject it leaves again (say why with `error`).",
          ru: "Создано новое значение, а не выбрано из `options`; оно сразу входит в выбор. Верните промис сохранения: чип ждёт занятым; при reject уходит (причину покажите через `error`).",
        },
        {
          name: "fallbackColor",
          type: "PaletteColor",
          default: '"gray"',
          en: "Chip color of values without an option color, created ones included.",
          ru: "Цвет чипа без цвета опции, в том числе у созданных.",
        },
        {
          name: "onOptionUpdate",
          type: "(value: string, updates: { label?: string; color?: PaletteColor }) => void | Promise<void>",
          en: "Enables the row «⋯» menu to rename and recolor a tag; `value` never changes. Return the save's promise and apply the change to `options` before it resolves; on reject the option goes back.",
          ru: "Включает меню «⋯» у строки, чтобы переименовать и перекрасить тег; `value` не меняется. Верните промис сохранения и примените изменение к `options` до resolve; при reject опция возвращается.",
        },
        {
          name: "onOptionDelete",
          type: "(value: string) => void | Promise<void>",
          en: "Enables «Удалить» in the row menu; the value also leaves the selection. A returned Promise defers it: resolve deletes, reject keeps everything (e.g. after a confirmation).",
          ru: "Включает «Удалить» в меню строки; значение уходит и из выбранных. Возвращённый Promise откладывает удаление: resolve удаляет, reject всё оставляет (например, после подтверждения).",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Field label above; names the input.",
          ru: "Подпись над полем; даёт имя полю ввода.",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Support text under the field; linked by `aria-describedby`.",
          ru: "Подсказка под полем; связана через `aria-describedby`.",
        },
        FIELD_HINT_TONE_PROP,
        {
          name: "error",
          type: "ReactNode",
          en: "Error message; replaces the hint and implies `invalid`.",
          ru: "Ошибка; заменяет подсказку и включает `invalid`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label and `aria-required` on the input.",
          ru: "Красная `*` после подписи и `aria-required` на поле.",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Muted `labels.optional` after the label.",
          ru: "Приглушённое `labels.optional` после подписи.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger inset ring and `aria-invalid`.",
          ru: "Красное внутреннее кольцо и `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disabled field and chips; the list never opens.",
          ru: "Неактивное поле и чипы; список не открывается.",
        },
        {
          name: "name",
          type: "string",
          en: "Form field name: one hidden input per selected value (read with `formData.getAll(name)`).",
          ru: "Имя поля формы: по скрытому input на каждое выбранное значение (`formData.getAll(name)`).",
        },
        {
          name: "placeholder",
          type: "string",
          default: '""',
          en: "Text in the input while no tag is picked.",
          ru: "Текст в поле, пока нет тегов.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Field tier; the list uses the same tier, chips one tier down. Without it the tier of its host (a form, a panel with a size), else `m`.",
          ru: "Ярус поля; список того же яруса, чипы на ярус меньше. Без него — ярус контейнера (форма, панель с размером), иначе `m`.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides the visual focus ring (`data-focus-ring="false"`), never focus or the error ring.',
          ru: '`false` скрывает видимое кольцо фокуса (`data-focus-ring="false"`), но не фокус и не кольцо ошибки.',
        },
        {
          name: "id",
          type: "string",
          en: "Id of the input; generated when omitted.",
          ru: "Id поля ввода; без него генерируется.",
        },
        {
          name: "labels",
          type: "Partial<TagSelectLabels>",
          en: "Built-in strings, see Labels (`colorNames` merges by key).",
          ru: "Системные строки, см. «Доступность» (`colorNames` сливаются по ключам).",
        },
        {
          name: "aria-label · aria-labelledby",
          type: "string",
          en: "Name of the input and the list when there is no `label`.",
          ru: "Имя поля и списка, если нет `label`.",
        },
        {
          name: "className",
          type: "string",
          en: "Class on the field frame `<div>`.",
          ru: "Класс на `<div>` рамки поля.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
  ],
  labels: labelRows(TAG_SELECT_LABELS, {
    panelHint: {
      en: 'Line above the list; `""` hides it.',
      ru: 'Строка над списком; `""` скрывает её.',
    },
    create: {
      en: "Action text before the preview of a new tag.",
      ru: "Текст действия перед превью нового тега.",
    },
    remove: {
      en: "Accessible name of a chip's remove button; `{label}` is the tag text.",
      ru: "Имя кнопки удаления чипа; `{label}` — текст тега.",
    },
    more: {
      en: "Accessible name of the «+N» chip; `{count}` is the number of hidden tags.",
      ru: "Имя чипа «+N»; `{count}` — число скрытых тегов.",
    },
    removed: {
      en: "Screen-reader announcement after a tag is removed.",
      ru: "Объявление для скринридера после удаления тега.",
    },
    createFailed: {
      en: "Screen-reader announcement when the `onCreate` promise rejects and the new tag leaves.",
      ru: "Объявление для скринридера, когда промис `onCreate` отклонён и новый тег ушёл.",
    },
    updateFailed: {
      en: "Screen-reader announcement when the `onOptionUpdate` promise rejects and the option goes back.",
      ru: "Объявление для скринридера, когда промис `onOptionUpdate` отклонён и опция вернулась.",
    },
    edit: {
      en: "Accessible name of a row's «⋯» menu button.",
      ru: "Имя кнопки меню «⋯» у строки.",
    },
    name: {
      en: "Accessible name of the tag name field in the menu.",
      ru: "Имя поля названия тега в меню.",
    },
    delete: { en: "Delete button in the menu.", ru: "Кнопка удаления в меню." },
    colors: { en: "Heading of the color list in the menu.", ru: "Заголовок списка цветов в меню." },
    colorNames: {
      en: "Names of the palette colors in the menu, by `PaletteColor` key.",
      ru: "Названия цветов палитры в меню, по ключам `PaletteColor`.",
    },
    optional: {
      en: "Muted marker after the label when `optional`.",
      ru: "Приглушённая пометка после подписи при `optional`.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "ArrowDown · ArrowUp",
        en: "Open the list (when it has something to show) and move the highlight over the options.",
        ru: "Открывают список и двигают подсветку по опциям.",
      },
      {
        keys: "Enter",
        en: "Tick or untick the highlighted option (the first one when nothing is highlighted); on the Create row, create the tag; in the row menu's name field, save the new name and close the menu.",
        ru: "Отмечает или снимает подсвеченную опцию; на строке «Создать» — создаёт тег; в поле имени меню строки — сохраняет имя и закрывает меню.",
      },
      {
        keys: "Space",
        en: "Types a space: a tag may have several words.",
        ru: "Печатает пробел: в теге может быть несколько слов.",
      },
      {
        keys: "Backspace",
        en: "In an empty input removes the last tag; on a tag removes it and focuses the previous tag.",
        ru: "В пустом поле удаляет последний тег; на теге удаляет его, фокус уходит на предыдущий тег, а если тегов не осталось — в поле.",
      },
      {
        keys: "ArrowLeft · ArrowRight",
        en: "From the start of the input move focus over the tags and back to the input.",
        ru: "Из начала поля переводят фокус по тегам и обратно в поле.",
      },
      {
        keys: "Delete",
        en: "On a tag removes it; focus moves to the next tag, or to the input when none is left.",
        ru: "На теге удаляет его; фокус уходит на следующий тег, а если тегов не осталось — в поле.",
      },
      {
        keys: "Shift+F10 · ContextMenu",
        en: "With `onOptionUpdate` or `onOptionDelete`: opens the «⋯» menu of the highlighted row; Escape closes it.",
        ru: "С `onOptionUpdate` или `onOptionDelete`: открывает меню «⋯» подсвеченной строки; Escape закрывает его.",
      },
      {
        keys: "Escape",
        en: "Closes the row «⋯» menu if it is open, otherwise the list.",
        ru: "Закрывает меню «⋯» строки, если оно открыто, иначе список.",
      },
    ],
    aria: [
      {
        en: 'The input is `role="combobox"` with `aria-expanded` and `aria-controls`; the list is `role="listbox"` with `aria-multiselectable`, options are `role="option"` with `aria-selected`.',
        ru: 'Поле ввода — `role="combobox"` с `aria-expanded` и `aria-controls`; список — `role="listbox"` с `aria-multiselectable`, опции — `role="option"` с `aria-selected`.',
      },
      {
        en: "The highlight goes through `aria-activedescendant`; the checkbox in a row is decorative.",
        ru: "Подсветка — через `aria-activedescendant`; чекбокс в строке декоративен.",
      },
      {
        en: "A removal is announced with `labels.removed` in a live region; the remove button is named by `labels.remove`.",
        ru: "Удаление тега объявляется через `labels.removed` в живой области; у кнопки удаления — имя `labels.remove`.",
      },
      {
        en: "A tag being created has `aria-busy` on its chip, a row whose rename or recolor is saved has a busy «⋯»; a refused creation or change is announced with `labels.createFailed` / `labels.updateFailed`.",
        ru: "У создаваемого тега на чипе `aria-busy`, у строки, чьё переименование или цвет сохраняется, — занятая «⋯»; отказ в создании или изменении объявляется через `labels.createFailed` / `labels.updateFailed`.",
      },
      {
        en: "The hint and the error are linked by `aria-describedby`; the error sets `aria-invalid`.",
        ru: "Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid`.",
      },
    ],
  },
};
