import { api } from "@/components/input/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "input",
  title: "Input",
  kind: "field",
  description:
    "Однострочное поле и эталон системы полей: подпись сверху, поле на заливке, строка поддержки снизу. Select, Datepicker, TagSelect и Textarea повторяют этот контракт.",
  examples: [
    { slot: "overview", description: "Поле с подписью и подсказкой под ним — `label`, `hint`." },
    { slot: "sizes", description: "Все ярусы; подпись и подсказка берут ярус поля — `size`." },
    {
      slot: "states",
      description: "Обычное поле рядом с неактивным и только для чтения — `disabled`, `readOnly`.",
    },
    {
      slot: "validation",
      description:
        "Пометки обязательного и необязательного поля, подсказка, ошибка и строка поддержки без сдвига — `required`, `optional`, `hint`, `error`, `reserveSupportRow`.",
    },
    {
      slot: "with-icon",
      description: "Декоративная иконка у любого края значения — `Input.Icon`, `side`.",
    },
    {
      scenario: "affixes",
      title: "Аффиксы",
      description:
        "Постоянные префикс и суффикс у краёв и единица рядом со значением — `Input.Affix`, `Input.InlineAffix`.",
    },
    {
      scenario: "with-badge",
      title: "Бейдж в поле",
      description:
        "Мягкий бейдж статуса у конца поля; высота не меняется — `Input.Badge`, `color`.",
    },
    {
      scenario: "without-focus-ring",
      title: "Без кольца фокуса",
      description: "Одно поле поиска, где фокус видно по каретке и светлой заливке — `focusRing`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель: кнопка очистки и счётчик символов следуют за ним — `value`, `onValueChange`, `Input.ClearButton`, `Input.Counter`.",
    },
    {
      slot: "in-form",
      description:
        "Реквизиты компании: обязательные поля проверяются при отправке, соседние поля держат низ на одной линии — `required`, `error`, `reserveSupportRow`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Фокус в поле, затем на кнопку очистки, если она показана." },
      {
        keys: "Enter · Space",
        action: "На кнопке очистки: очищает значение и возвращает фокус в поле.",
      },
    ],
    aria: [
      "`label` — настоящий `<label htmlFor>`; без него задайте `aria-label` на `Input.Field`. Плейсхолдер не заменяет подпись.",
      'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`.',
      "`Input.Icon`, `Input.Affix`, `Input.InlineAffix` скрыты (`aria-hidden`): смысл единицы или префикса дублируйте в подписи.",
      "`Input.ClearButton` — кнопка с именем `labels.clear` и `aria-controls` на поле.",
      '`Input.Counter` показывает «14/40», а скринридер читает `labels.counter` через `aria-live="polite"`.',
    ],
  },
};

export default function InputSection() {
  return <ComponentPage page={page} />;
}
