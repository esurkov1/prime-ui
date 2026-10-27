import { type ApiProp, type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import {
  FIELD_AUTOCOMPLETE_PROP,
  FIELD_COMMIT_LABEL_DOCS,
  FIELD_COPY_LABEL_DOCS,
  FIELD_HINT_TONE_PROP,
  fieldActionPart,
  fieldCommitProp,
  fieldCopyPart,
} from "../../internal/field.api";
import { INPUT_LABELS } from "./Input";

const side = (en: string, ru: string): ApiProp => ({
  name: "side",
  type: '"start" | "end"',
  required: true,
  en,
  ru,
});

export const api: ComponentApi = {
  parts: [
    {
      name: "Input.Root",
      en: "`ref` → `HTMLDivElement` (the field frame). Size, label, support row and the context for `Wrapper` and `Field`.",
      ru: "Размер, подпись, строка поддержки и контекст для `Wrapper` и `Field`.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус контейнера, иначе `"m"`' },
          en: "Tier for height, padding, radius, text, label and hint. Without it the field takes the tier of its host (LoginForm, Popover, a panel with a size), else `m`. Also provided to nested controls via the control-size context.",
          ru: "Ярус поля: высота, отступы, радиус, кегль поля, подписи и подсказки. Без него поле берёт ярус контейнера (LoginForm, Popover, панель с размером), иначе `m`. Передаётся и вложенным контролам через контекст размера.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Label above the field, rendered as `<label htmlFor>`. Without it, give `Input.Field` an `aria-label`.",
          ru: "Подпись над полем (`<label htmlFor>`). Без неё задайте `aria-label` на `Input.Field`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label (`aria-hidden`) and native `required` on `Input.Field`.",
          ru: "Красная `*` после подписи (`aria-hidden`) и нативный `required` на `Input.Field`.",
        },
        {
          name: "optional",
          type: "boolean",
          default: "false",
          en: "Muted marker right after the label text (`labels.optional`).",
          ru: "Приглушённая пометка после подписи (`labels.optional`).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the field. Hidden while `error` is shown.",
          ru: "Подсказка под полем; скрывается, пока показан `error`.",
        },
        FIELD_HINT_TONE_PROP,
        {
          name: "error",
          type: "ReactNode",
          en: "Error message in the hint slot; implies `invalid`.",
          ru: "Текст ошибки на месте подсказки; включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger inset ring on the field, `aria-invalid` on the input. A non-empty `error` implies it.",
          ru: "Красное внутреннее кольцо на поле, `aria-invalid` на input. Непустой `error` включает его.",
        },
        {
          name: "valid",
          type: "boolean",
          en: "A confirmed value (a matching repeat, a verified code): a success ring and a drawn check at the field's end, `labels.valid` spoken. `invalid` wins. Pass `false` too: the live region exists only with it.",
          ru: "Подтверждённое значение (повтор совпал, код проверен): зелёное кольцо и прорисованная галочка у конца поля, озвучка `labels.valid`. `invalid` главнее. Передавайте и `false`: только тогда есть live-область.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring on `Input.Wrapper` (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay.',
          ru: '`false` скрывает только кольцо фокуса на `Input.Wrapper` (`data-focus-ring="false"`); фокус, клавиатура, ARIA и кольцо ошибки остаются.',
        },
        {
          name: "counter",
          type: "ReactNode",
          en: "Right side of the support row, usually `<Input.Counter current max />`.",
          ru: "Правая часть строки поддержки, обычно `<Input.Counter current max />`.",
        },
        {
          name: "reserveSupportRow",
          type: "boolean",
          default: "false",
          en: "Always render the support row (min height = hint line height), so an appearing error does not shift the layout.",
          ru: "Строка поддержки есть всегда (минимальная высота — строка подсказки), поэтому ошибка не сдвигает вёрстку.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the `<input>` (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id `<input>`; иначе генерируется. Связывает подпись, подсказку и ошибку. Id подсказки — `<id>-hint`, ошибки — `<id>-error`.",
        },
        {
          name: "strength",
          type: "boolean",
          default: "false",
          en: "A password strength meter for new-password fields: a stepped `ProgressBar` under the field and the level word (weak … hard) in the support row. Follows the value of `Input.Field`.",
          ru: "Шкала надёжности для поля нового пароля: ступенчатый `ProgressBar` под полем и слово уровня (слабый … сложный) в строке поддержки. Следит за значением `Input.Field`.",
        },
        {
          name: "getStrength",
          type: "(value: string) => 0 | 1 | 2 | 3 | 4",
          default: "getPasswordStrength",
          en: "Replaces the kit's estimate of `strength`. Return 0 for empty, 1 weak … 4 hard.",
          ru: "Заменяет оценку кита для `strength`. Верните 0 для пустого, 1 — слабый … 4 — сложный.",
        },
        {
          name: "minStrength",
          type: "1 | 2 | 3 | 4",
          en: "The policy of `strength`: below this level the meter turns danger and the form refuses to submit (`setCustomValidity`), then shows `labels.strengthTooWeak` as the error.",
          ru: "Требование к `strength`: ниже этого уровня шкала красная, форма не отправляется (`setCustomValidity`) и показывает ошибку `labels.strengthTooWeak`.",
        },
        fieldCommitProp({ en: "Enter", ru: "Enter" }),
        {
          name: "suggestions",
          type: "readonly string[]",
          en: "Suggestions for free text (a combobox): a list under the box shows those containing the text; a pick goes into the field as typing would. Any text stays allowed; a value from a list only is `Select`.",
          ru: "Подсказки для свободного ввода (комбобокс): список под полем показывает содержащие текст; выбор вставляется, как ввод. Подходит любой текст; значение только из списка — `Select`.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the `suggestions` list; the text and the focus stay in the field.",
          ru: "Escape закрывает список `suggestions`; текст и фокус остаются в поле.",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A press outside the field and the `suggestions` list closes the list.",
          ru: "Нажатие вне поля и списка `suggestions` закрывает список.",
        },
        {
          name: "labels",
          type: "Partial<InputLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Usually `Input.Wrapper`.",
          ru: "Обычно `Input.Wrapper` с полем и слотами.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "id" | "children" | "defaultValue" | "defaultChecked" | "onChange">',
          en: "`className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control).",
          ru: "`className`, `data-*` и остальные атрибуты `<div>` рамки поля (правило корня поля: `className`, `ref` и остальное → рамка, `id` → контрол).",
        },
      ],
    },
    {
      name: "Input.Wrapper",
      en: "`ref` → `HTMLDivElement`. The visible field: fill, hover, focus ring, invalid ring; `data-size` and `data-invalid` come from the root.",
      ru: "Видимое поле: заливка, наведение, кольцо фокуса, кольцо ошибки; `data-size` и `data-invalid` приходят от корня.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "`Field` and the slots: `Icon`, `Affix`, `InlineAffix`; the end segments `ClearButton`, `CopyButton`, `RevealButton`, `Action` in source order.",
          ru: "`Field`, `Icon`, `Affix`, `InlineAffix`; сегменты у конца — `ClearButton`, `CopyButton`, `RevealButton`, `Action` в порядке разметки.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the `<div>`.",
          ru: "`className` и остальные атрибуты `<div>`.",
        },
      ],
    },
    {
      name: "Input.Field",
      en: "`ref` → `HTMLInputElement`. The native `<input>`; `id`, `aria-invalid` and `aria-describedby` come from the root, `disabled` also from a disabled `Fieldset` around it.",
      ru: "Нативный `<input>`; `id`, `aria-invalid` и `aria-describedby` приходят от корня; `disabled` — также от неактивного `Fieldset` вокруг.",
      props: [
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new string; native `onChange` still fires first.",
          ru: "Новое строковое значение; нативный `onChange` тоже вызывается.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged with the affix and hint/error ids from the root.",
          ru: "Добавляется к id префиксов, единиц, подсказки и ошибки из контекста.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Overrides the root's `required` for the native input.",
          ru: "Переопределяет `required` корня для нативного поля.",
        },
        FIELD_AUTOCOMPLETE_PROP,
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id">',
          en: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`, `placeholder`…",
          ru: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`, `placeholder`…",
        },
      ],
    },
    {
      name: "Input.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`), centered between the edge and the text.",
      ru: "Декоративная иконка (`aria-hidden`) по центру между краем и текстом.",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "An icon; kit icons without an explicit `size` take the field tier.",
          ru: "Иконка; иконки кита без явного `size` берут ярус поля.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
    {
      name: "Input.Affix",
      en: "`ref` → `HTMLDivElement`. Tinted section flush with the edge (`aria-hidden`, its text describes the input); the wrapper drops its padding there.",
      ru: "Секция с подложкой вплотную к краю (`aria-hidden`, её текст описывает поле); обёртка убирает там свой отступ.",
      props: [
        side("Edge the section sits on.", "Край, к которому прилегает секция с подложкой."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Static text: protocol, domain, country code.",
          ru: "Постоянный текст: протокол, домен, код страны.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "What a screen reader says instead of the text in the input's description.",
          ru: "Что скринридер произносит вместо текста в описании поля.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other attributes of the `<div>`.",
          ru: "`className` и остальные атрибуты `<div>`.",
        },
      ],
    },
    {
      name: "Input.InlineAffix",
      en: "`ref` → `HTMLSpanElement`. Muted unit next to the value (`aria-hidden`, its text describes the input) — the one place of the unit.",
      ru: "Приглушённая единица рядом со значением (`aria-hidden`, её текст описывает поле) — единственное место единицы.",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Short unit: `₽`, `%`, `кг`.",
          ru: "Короткая единица: `₽`, `%`, `кг`.",
        },
        {
          name: "aria-label",
          type: "string",
          en: "The unit in words for a screen reader («рублей»), said instead of the sign in the input's description.",
          ru: "Единица словами для скринридера («рублей») — звучит вместо знака в описании поля.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
    {
      name: "Input.ClearButton",
      en: "`ref` → `HTMLButtonElement`. A full-height clear segment at the end edge, named by `labels.clear`, with `aria-controls` on the input. Render it only while the field has a value.",
      ru: "Сегмент очистки на всю высоту поля у конца, с именем `labels.clear` и `aria-controls` на input. Рендерите его, только пока есть значение.",
      props: [
        {
          name: "onClick",
          type: "MouseEventHandler<HTMLButtonElement>",
          en: "Clear the value here. Afterwards focus returns to the input unless `event.preventDefault()` was called.",
          ru: "Очистите значение здесь; затем фокус вернётся в поле, если не вызван `event.preventDefault()`.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label">',
          en: "The other button attributes.",
          ru: "Остальные атрибуты кнопки.",
        },
      ],
    },
    fieldCopyPart("Input.CopyButton", {
      en: "as a full-height segment at the end edge",
      ru: "сегментом на всю высоту поля у конца",
    }),
    {
      name: "Input.RevealButton",
      en: '`ref` → `HTMLButtonElement`. A full-height toggle segment that shows a `type="password"` field as text and back (`aria-pressed`, named by `labels.reveal`); the focus, caret and selection stay in the field.',
      ru: 'Сегмент-переключатель, который показывает поле `type="password"` текстом и прячет обратно (`aria-pressed`, имя `labels.reveal`); фокус, курсор и выделение остаются в поле.',
      props: [
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label" | "aria-pressed">',
          en: "The other button attributes.",
          ru: "Остальные атрибуты кнопки.",
        },
      ],
    },
    fieldActionPart("Input.Action", {
      en: "at the end edge («Позвонить», «Открыть профиль»)",
      ru: "у конца поля («Позвонить», «Открыть профиль»)",
    }),
    {
      name: "Input.Counter",
      en: "`ref` → `HTMLSpanElement`. Character counter for the support row; shows `14/40` and announces `labels.counter`.",
      ru: "Счётчик символов для строки поддержки; показывает `14/40` и объявляет `labels.counter`.",
      props: [
        {
          name: "current",
          type: "number",
          required: true,
          en: "Current length.",
          ru: "Текущая длина.",
        },
        {
          name: "max",
          type: "number",
          required: true,
          en: 'Limit; `current > max` turns the counter danger (`data-invalid="true"`).',
          ru: 'Лимит; при `current > max` счётчик красный (`data-invalid="true"`).',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the `<span>`.",
          ru: "`className` и остальные атрибуты `<span>`.",
        },
      ],
    },
  ],
  labels: labelRows(INPUT_LABELS, {
    optional: {
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
    clear: { en: "Accessible name of `Input.ClearButton`.", ru: "Имя `Input.ClearButton`." },
    ...FIELD_COPY_LABEL_DOCS,
    reveal: {
      en: "Accessible name of `Input.RevealButton`;`aria-pressed` says whether the password is shown.",
      ru: "Имя `Input.RevealButton`; `aria-pressed` говорит, показан ли пароль.",
    },
    ...FIELD_COMMIT_LABEL_DOCS,
    counter: {
      en: "Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced.",
      ru: "Озвучка `Input.Counter`; `{current}` и `{max}` подставляются.",
    },
    strength: {
      en: "Accessible name of the `strength` meter and the spoken prefix of the level word.",
      ru: "Имя шкалы `strength` и озвучиваемое начало слова уровня.",
    },
    strengthWeak: { en: "Level word for strength 1.", ru: "Слово уровня 1." },
    strengthEasy: { en: "Level word for strength 2.", ru: "Слово уровня 2." },
    strengthMedium: { en: "Level word for strength 3.", ru: "Слово уровня 3." },
    strengthHard: { en: "Level word for strength 4.", ru: "Слово уровня 4." },
    strengthTooWeak: {
      en: "Validation message of a `strength` field below `minStrength`, and its error once a submit was refused.",
      ru: "Сообщение проверки поля со `strength` ниже `minStrength` и его ошибка после отказа в отправке.",
    },
    valid: {
      en: "Spoken when the field is `valid`; the check mark itself is `aria-hidden`.",
      ru: "Озвучивается, когда поле `valid`; сама галочка скрыта (`aria-hidden`).",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the field, then the segments at its end (clear, copy, reveal, actions).",
        ru: "Фокус в поле, затем на кнопки у его конца (очистка, копирование, показ пароля, действия).",
      },
      {
        keys: "Enter · Space",
        en: "On a segment: runs its action (the clear button returns focus to the field).",
        ru: "На кнопке у конца поля: выполняет её действие (кнопка очистки возвращает фокус в поле).",
      },
      {
        keys: "Enter",
        en: "With `onCommit`: saves a changed value; focus stays in the field.",
        ru: "С `onCommit`: сохраняет изменённое значение, фокус остаётся в поле.",
      },
      {
        keys: "↓ · ↑",
        en: "With `suggestions`: opens the list on the first (last) suggestion; in the open list moves the highlight, wrapping. Focus stays in the field.",
        ru: "С `suggestions`: открывает список на первой (последней) подсказке; в открытом списке двигает подсветку по кругу. Фокус остаётся в поле.",
      },
      {
        keys: "Alt + ↓",
        en: "With `suggestions`: opens the list without highlighting.",
        ru: "С `suggestions`: открывает список без подсветки.",
      },
      {
        keys: "Enter",
        en: "With `suggestions`: puts the highlighted suggestion into the field and closes the list; with no highlight the typed text stays.",
        ru: "С `suggestions`: вставляет подсвеченную подсказку в поле и закрывает список; без подсветки остаётся введённый текст.",
      },
      {
        keys: "Escape",
        en: "With `suggestions`: closes the open list, the text stays; a dialog around the field stays open.",
        ru: "С `suggestions`: закрывает открытый список, текст остаётся; диалог вокруг поля не закрывается.",
      },
      {
        keys: "Escape",
        en: "With `onCommit`: puts the committed value back.",
        ru: "С `onCommit`: возвращает сохранённое значение.",
      },
    ],
    aria: [
      {
        en: "`label` renders a `<label htmlFor>` bound to the input. Without `label`, set `aria-label` on `Input.Field`. A placeholder never replaces the label.",
        ru: "`label` — настоящий `<label htmlFor>`, связанный с input; без `label` задайте `aria-label` на `Input.Field`. Плейсхолдер не заменяет подпись.",
      },
      {
        en: 'Hint and error are linked through `aria-describedby`; the error replaces the hint and sets `aria-invalid="true"`.',
        ru: 'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`.',
      },
      {
        en: "`valid` adds the id of a polite live region holding `labels.valid` to the input's `aria-describedby`: the state is heard when it arrives and on focus, never by colour alone; the check is `aria-hidden`.",
        ru: "`valid` добавляет в `aria-describedby` поля id вежливой live-области с `labels.valid`: состояние слышно, когда наступает и при фокусе, а не только по цвету; галочка скрыта (`aria-hidden`).",
      },
      {
        en: "`minStrength` uses native constraint validation: below the level the input's `validationMessage` is `labels.strengthTooWeak`, the form refuses to submit, and the message becomes the field's error (`aria-invalid`).",
        ru: "`minStrength` работает через нативную проверку формы: ниже уровня `validationMessage` поля — `labels.strengthTooWeak`, форма не отправляется, а сообщение становится ошибкой поля (`aria-invalid`).",
      },
      {
        en: "`Input.Icon` is decorative (`aria-hidden`). `Input.Affix` and `Input.InlineAffix` are `aria-hidden` in the reading order but describe the input (`aria-describedby`, before the hint): the unit is heard with the field, so the label never repeats it. An `aria-label` on the affix is said instead of its text («рублей» for `₽`).",
        ru: "`Input.Icon` декоративна (`aria-hidden`). `Input.Affix` и `Input.InlineAffix` скрыты в порядке чтения (`aria-hidden`), но описывают поле (`aria-describedby`, перед подсказкой): единицу слышно вместе с полем, поэтому подпись её не повторяет. `aria-label` на префиксе или единице произносится вместо текста («рублей» для `₽`).",
      },
      {
        en: '`suggestions` make the input a `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls` on the open `listbox`, which the label names); the highlight is `aria-activedescendant`, so focus never leaves the field.',
        ru: '`suggestions` делают поле `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls` на открытый `listbox`, названный подписью); подсветка — `aria-activedescendant`, фокус не уходит из поля.',
      },
      {
        en: 'Autofill is off unless you pass `autoComplete`: without a token the input carries `autocomplete="off"` and the opt-outs of 1Password, LastPass, Bitwarden and Dashlane (`data-1p-ignore`, `data-lpignore`, `data-bwignore`, `data-form-type="other"`); a token passes through and drops them. With `suggestions` it stays off. Inside `LoginForm.Form` a field without a token is left to the browser.',
        ru: 'Автозаполнение выключено, пока не передан `autoComplete`: без токена у поля `autocomplete="off"` и отказ для 1Password, LastPass, Bitwarden и Dashlane (`data-1p-ignore`, `data-lpignore`, `data-bwignore`, `data-form-type="other"`); токен проходит и снимает их. С `suggestions` оно всегда выключено. Внутри `LoginForm.Form` поле без токена отдано браузеру.',
      },
      {
        en: "A `Select` inside `Input.Wrapper` is the box's start segment, or the end segment when it follows `Input.Field`: its trigger is named by the select root's `aria-label` and the picked value («Иконка: Звезда»).",
        ru: "`Select` внутри `Input.Wrapper` — начальный сегмент поля, а после `Input.Field` — конечный: его триггер назван `aria-label` корня селекта и выбранным значением («Иконка: Звезда»).",
      },
      {
        en: "`Input.ClearButton` is a real button named by `labels.clear`, with `aria-controls` on the input.",
        ru: "`Input.ClearButton` — кнопка с именем `labels.clear` и `aria-controls` на поле.",
      },
      {
        en: "`Input.Action` and `Input.CopyButton` are buttons (or a link with `asChild`) named by their label, with a tooltip; copying announces `labels.copied` through a polite live region.",
        ru: "`Input.Action` и `Input.CopyButton` — кнопки (или ссылка с `asChild`) с именем из подписи и подсказкой; копирование объявляет `labels.copied` через вежливую live-область.",
      },
      {
        en: "`Input.RevealButton` is a toggle: a constant name `labels.reveal`, `aria-pressed` and `aria-controls` on the input; a pointer press keeps the focus in the field.",
        ru: "`Input.RevealButton` — переключатель: постоянное имя `labels.reveal`, `aria-pressed` и `aria-controls` на input; нажатие указателем оставляет фокус в поле.",
      },
      {
        en: 'With `onCommit` the input carries `aria-busy="true"` while saving; a polite live region says `labels.saving`, then `labels.saved`.',
        ru: 'С `onCommit` поле ставит `aria-busy="true"`, пока идёт сохранение, а вежливая live-область говорит `labels.saving`, затем `labels.saved`.',
      },
      {
        en: '`Input.Counter` shows `14/40` visually and announces `labels.counter` through `aria-live="polite"`.',
        ru: '`Input.Counter` показывает `14/40`, а скринридер читает `labels.counter` через `aria-live="polite"`.',
      },
      {
        en: 'Under a `Tooltip.Trigger` a disabled `Input.Field` is `aria-disabled="true"` and `readOnly` with no native `disabled`, `name` or `required`: it keeps its tab stop, its node and its text, the form skips it.',
        ru: 'В `Tooltip.Trigger` выключенный `Input.Field` — `aria-disabled="true"` и `readOnly` без нативного `disabled`, `name` и `required`: остаётся точкой Tab и тем же узлом с текстом, форма его пропускает.',
      },
    ],
  },
};
