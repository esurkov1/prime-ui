import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";

const rest = (element: string): ApiProp => ({
  name: "…rest",
  type: `HTMLAttributes<${element}>`,
  en: "`className`, `id`, `data-*` and the other attributes of the element.",
  ru: "`className`, `id`, `data-*` и остальные атрибуты элемента.",
});

export const api: ComponentApi = {
  parts: [
    {
      name: "DescriptionList.Root",
      en: "`ref` → `HTMLDListElement`. A `<dl>` of «label — value» pairs and a size container: horizontal pairs stack once the list is narrower than 24rem. Gives its tier to the controls inside.",
      ru: "`<dl>` из пар «подпись — значение» и контейнер размера: горизонтальные пары встают столбиком, когда список уже 24rem. Передаёт свой ярус контролам внутри.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else `"m"`',
          en: "Label and value type and the gap between pairs; without it the list takes the tier of its host (a Card, a Drawer, a form).",
          ru: "Шрифт подписи и значения и зазор между парами; без него список берёт ярус хоста (Card, Drawer, форма).",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          en: "`horizontal` — the label in a column beside its value (one third of the width), stacking below 24rem of the list's own width; `vertical` — the label above its value at any width.",
          ru: "`horizontal` — подпись колонкой рядом со значением (треть ширины), столбиком, когда сам список уже 24rem; `vertical` — подпись над значением при любой ширине.",
        },
        {
          name: "labels",
          type: "Partial<DescriptionListLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Встроенные строки, см. «Доступность».",
        },
        rest("HTMLDListElement"),
      ],
    },
    {
      name: "DescriptionList.Item",
      en: '`ref` → `HTMLDivElement`. One pair: a `<div>` holding the `<dt>` and the `<dd>`. The value wraps anywhere; no value (`null`, `""`, `false`) shows a muted `labels.empty` and speaks `labels.emptyText`.',
      ru: 'Одна пара: `<div>` с `<dt>` и `<dd>`. Значение переносится где угодно; без значения (`null`, `""`, `false`) — приглушённый `labels.empty`, озвучивается `labels.emptyText`.',
      props: [
        {
          name: "label",
          type: "ReactNode",
          required: true,
          en: "The visible name of the value (`<dt>`).",
          ru: "Видимое название значения (`<dt>`).",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "The value (`<dd>`): text, a Badge, a link; plus an optional `DescriptionList.ItemAction`, which goes to the end of the value.",
          ru: "Значение (`<dd>`): текст, Badge, ссылка; и необязательный `DescriptionList.ItemAction`, который встаёт в конец значения.",
        },
        rest("HTMLDivElement"),
      ],
    },
    {
      name: "DescriptionList.ItemAction",
      en: "`ref` → `HTMLButtonElement`. A row action at the end of the value («Копировать», «Позвонить»): a ghost icon Button one tier below the list, with `label` as its name and tooltip.",
      ru: "Действие строки в конце значения («Копировать», «Позвонить»): иконочная Button ghost на ярус меньше списка, `label` — её имя и подсказка.",
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          en: "Accessible name and tooltip of the action.",
          ru: "Доступное имя и подсказка действия.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon (`<Icon name="…" />`).',
          ru: 'Иконка (`<Icon name="…" />`).',
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">',
          en: "`onClick`, `disabled`, `className` and the other button attributes.",
          ru: "`onClick`, `disabled`, `className` и остальные атрибуты кнопки.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "empty",
      default: "—",
      en: "Visible mark of an empty value (muted, hidden from assistive tech).",
      ru: "Видимая метка пустого значения (приглушённая, скрыта от скринридеров).",
    },
    {
      key: "emptyText",
      default: "Не указано",
      en: "What assistive tech reads for an empty value.",
      ru: "Что читают скринридеры у пустого значения.",
    },
  ],
};
