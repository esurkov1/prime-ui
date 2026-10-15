import type { ApiPart, ApiProp, LabelDocs } from "../../scripts/docs/componentApi";
import type { FieldCopyLabels } from "./FieldAction";
import type { FieldCommitLabels } from "./FieldCommit";

/** `hintTone` of every field: the status the hint carries (`Hint` `tone`). */
export const FIELD_HINT_TONE_PROP: ApiProp = {
  name: "hintTone",
  type: '"neutral" | "success" | "warning" | "danger"',
  default: '"neutral"',
  en: "Status color of `hint` («Осталось 12 дней» in `warning`). The words carry the status, the color repeats it; an `error` replaces the hint and its tone. A validation error is `error`, never a `danger` hint.",
  ru: "Цвет статуса у `hint` («Осталось 12 дней» в `warning`). Статус несут слова, цвет его повторяет; `error` заменяет подсказку вместе с тоном. Ошибка проверки — это `error`, а не подсказка `danger`.",
};

/**
 * Field props of a framed group control (SegmentedControl, ButtonGroup): the group element is
 * named by the label and described by the hint or error. `control` names it (`radiogroup`).
 */
export function fieldGroupProps(control: string, labelsType: string): ApiProp[] {
  return [
    {
      name: "label",
      type: "ReactNode",
      en: `Heading above the control; names the \`${control}\` (\`aria-labelledby\`). Without it give the root an \`aria-label\`.`,
      ru: `Подпись над контролом; даёт имя \`${control}\` (\`aria-labelledby\`). Без неё задайте \`aria-label\`.`,
    },
    {
      name: "required",
      type: "boolean",
      default: "false",
      en: `Red \`*\` after the label and \`aria-required\` on the \`${control}\`.`,
      ru: `Красная \`*\` после подписи и \`aria-required\` на \`${control}\`.`,
    },
    {
      name: "optional",
      type: "boolean",
      default: "false",
      en: "Muted marker after the label (`labels.optional`).",
      ru: "Приглушённая пометка после подписи (`labels.optional`).",
    },
    {
      name: "hint",
      type: "ReactNode",
      en: `Help text under the control (\`aria-describedby\`). Hidden while \`error\` is shown.`,
      ru: "Подсказка под контролом (`aria-describedby`); скрывается, пока показан `error`.",
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
      en: `Danger inset ring, \`aria-invalid\` and \`data-invalid\` on the \`${control}\`; the control shakes once when an error arrives.`,
      ru: `Красное кольцо, \`aria-invalid\` и \`data-invalid\` на \`${control}\`; контрол один раз встряхивается при ошибке.`,
    },
    {
      name: "reserveSupportRow",
      type: "boolean",
      default: "false",
      en: "Always render the support row, so an appearing error does not shift the layout.",
      ru: "Строка поддержки есть всегда, поэтому ошибка не сдвигает вёрстку.",
    },
    {
      name: "id",
      type: "string",
      en: `Id of the \`${control}\` element (generated when omitted); hint id is \`<id>-hint\`, error id \`<id>-error\`.`,
      ru: `Id элемента \`${control}\`; иначе генерируется. Id подсказки — \`<id>-hint\`, ошибки — \`<id>-error\`.`,
    },
    {
      name: "labels",
      type: `Partial<${labelsType}>`,
      en: "Built-in strings, see Labels.",
      ru: "Системные строки, см. «Доступность».",
    },
  ];
}

/** The description of the `optional` label of a framed field. */
export const FIELD_OPTIONAL_LABEL_DOCS: LabelDocs<{ optional: string }> = {
  optional: {
    en: "Marker after the label when `optional`.",
    ru: "Пометка после подписи при `optional`.",
  },
};

/**
 * The description of the `required` label of a field whose control is a button (Datepicker,
 * ColorField): a button takes no `aria-required`, so the word describes it (`ids.controlAria`).
 */
export const FIELD_REQUIRED_LABEL_DOCS: LabelDocs<{ required: string }> = {
  required: {
    en: "Read after the field name of a `required` field: its trigger is a button, which takes no `aria-required`.",
    ru: "Читается после имени поля с `required`: его триггер — кнопка, у которой нет `aria-required`.",
  },
};

/** `onCommit` of a text field (Input, Textarea); `keys` names the commit key. */
export function fieldCommitProp(keys: { en: string; ru: string }): ApiProp {
  return {
    name: "onCommit",
    type: "(value: string) => void | Promise<void>",
    en: `Inline save: fires with a changed value on blur and ${keys.en}; Escape reverts. Return a Promise: the field shows a spinner and stays editable; a rejection restores the value — show why through \`error\`.`,
    ru: `Сохранение на месте: вызывается с изменённым значением при уходе фокуса и ${keys.ru}; Escape отменяет. Верните Promise: поле со спиннером остаётся редактируемым; отказ вернёт значение — причину покажите через \`error\`.`,
  };
}

const BUTTON_REST: ApiProp = {
  name: "…rest",
  type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label">',
  en: "`onClick`, `disabled` and the other button attributes.",
  ru: "`onClick`, `disabled` и остальные атрибуты кнопки.",
};

/** `X.Action`: the consumer's icon action at the field's edge. */
export function fieldActionPart(name: string, where: { en: string; ru: string }): ApiPart {
  return {
    name,
    en: `\`ref\` → \`HTMLButtonElement\` (the child with \`asChild\`). The consumer's icon action ${where.en}: a full-height button segment named by \`label\`, with a tooltip and the touch hit area.`,
    ru: `Своё действие-иконка ${where.ru}: сегмент-кнопка на всю высоту поля с именем \`label\`, подсказкой и зоной касания.`,
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        en: "Accessible name and tooltip («Позвонить», «Открыть профиль»).",
        ru: "Доступное имя и подсказка («Позвонить», «Открыть профиль»).",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        en: "Renders the one child (an `<a href>`, a router link) with the segment's look; `disabled` becomes `aria-disabled`.",
        ru: "Рендерит единственного ребёнка (`<a href>`, ссылку роутера) с видом сегмента; `disabled` становится `aria-disabled`.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        en: "The glyph (`<Icon name>`), or with `asChild` the element that carries it.",
        ru: "Иконка (`<Icon name>`), с `asChild` — элемент с ней.",
      },
      {
        name: "…rest",
        type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children">',
        en: "`onClick`, `disabled` and the other button attributes.",
        ru: "`onClick`, `disabled` и остальные атрибуты кнопки.",
      },
    ],
  };
}

/** `X.CopyButton`: the kit's copy segment. */
export function fieldCopyPart(name: string, where: { en: string; ru: string }): ApiPart {
  return {
    name,
    en: `\`ref\` → \`HTMLButtonElement\`. Copies the field's value ${where.en}: the copy glyph morphs into a check, the name and tooltip switch to \`labels.copied\` (\`labels.copyError\` when the clipboard refuses), a polite live region repeats it.`,
    ru: `Копирует значение поля ${where.ru}: иконка превращается в галочку, имя и подсказка — в \`labels.copied\` (\`labels.copyError\`, если буфер недоступен), живой регион повторяет это.`,
    props: [
      {
        name: "value",
        type: "string",
        defaultNote: { en: "the field's value", ru: "значение поля" },
        en: "Text to copy instead of the field's current value.",
        ru: "Текст для копирования вместо текущего значения поля.",
      },
      BUTTON_REST,
    ],
  };
}

/** The descriptions of the copy button's strings (`FieldCopyLabels`). */
export const FIELD_COPY_LABEL_DOCS: LabelDocs<FieldCopyLabels> = {
  copy: { en: "Name and tooltip of the copy button.", ru: "Имя и подсказка кнопки копирования." },
  copied: {
    en: "Name, tooltip and announcement once the value is copied.",
    ru: "Имя, подсказка и объявление после копирования.",
  },
  copyError: {
    en: "Name, tooltip and announcement when the clipboard refuses.",
    ru: "Имя, подсказка и объявление, если буфер недоступен.",
  },
};

/** The descriptions of the inline save's strings (`FieldCommitLabels`). */
export const FIELD_COMMIT_LABEL_DOCS: LabelDocs<FieldCommitLabels> = {
  saving: {
    en: "Announced while an `onCommit` save is pending.",
    ru: "Объявляется, пока идёт сохранение `onCommit`.",
  },
  saved: {
    en: "Announced once an `onCommit` save succeeds.",
    ru: "Объявляется после успешного сохранения `onCommit`.",
  },
};
