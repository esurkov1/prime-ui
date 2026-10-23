import { api } from "@/components/card/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LayoutDashboard } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "card",
    label: "Card",
    summary: "Карточка записи: шапка, тело, подвал, обложка",
    keywords: ["карточка", "запись", "шапка", "подвал", "обложка", "выбор", "переключатель"],
    icon: LayoutDashboard,
    order: 5,
  },
  dir: "card",
  title: "Card",
  kind: "composite",
  description:
    "Карточка одной записи на своей заливке: обложка, шапка с меткой, названием и действиями, тело и подвал с итогом и кнопками. Карточка про одно число — Kpi, разделы страницы — Page.Section.",
  examples: [
    {
      slot: "overview",
      description:
        "Типичная карточка записи: метка, название с бейджами, строка состояния и две кнопки-иконки в шапке, строки «подпись — значение» в теле, итог и главная кнопка в подвале — `Card.Icon`, `Card.Badges`, `Card.Description`, `StatusDot`, `Card.Actions`, `Card.Total`.",
    },
    {
      slot: "sizes",
      description:
        "Одна карточка на пяти ступенях: отступы, радиус, метка, текст и кнопки шагают вместе — `size`.",
    },
    {
      slot: "structure",
      description:
        "Какие зоны бывают у карточки: одна шапка, шапка и тело, все три зоны с подвалом и панель без зон, где список стоит от края до края — `Card.Header`, `Card.Body`, `Card.Footer`.",
    },
    {
      scenario: "header",
      title: "Шапка",
      layout: "full",
      description:
        "Что держит шапка: четыре вида метки, бейджи, которые на узкой карточке сворачиваются в «+N», и контролы по числу — две кнопки-иконки, «Ещё» с трёх действий, выбор значения — `Card.Icon`, `Card.Badges`, `StatusDot`, `Card.Actions`, `Select.Root`.",
    },
    {
      scenario: "link",
      title: "Карточка открывается",
      layout: "full",
      description:
        "Карточки, которые открываются: ссылка в названии растянута на карточку, а её кнопка остаётся своей, и целая карточка — одна ссылка, когда внутри нет контролов — `Card.Link`, `asChild`.",
    },
    {
      scenario: "body",
      title: "Тело",
      layout: "full",
      description:
        "Что держит тело: строки «подпись — значение», список записей, которые открываются, форма на полях кита и пустое состояние — `DescriptionList`, `List`, `Input.Root`, `EmptyPage`.",
    },
    {
      scenario: "long-list",
      title: "Длинный список",
      description:
        "Длинный список в карточке: прокручиваемая область показывает шесть строк, подгружает следующую порцию у конца и держит место новых строк заглушками — `ScrollContainer`, `onReachEnd`, `Skeleton`.",
    },
    {
      scenario: "footer",
      title: "Подвал",
      layout: "full",
      description:
        "Что держит подвал: итог и две кнопки с главной последней, выбор ответственного высотой с кнопку рядом, заметка со сроком и полосой прогресса, кнопки во всю ширину без левой части — `Card.Total`, `Select.Root`, `Card.Note`, `progress`, `fullWidth`.",
    },
    {
      scenario: "cover",
      title: "Обложка",
      layout: "full",
      description:
        "Обложка — карусель кита: сверху с аватаром владельца на её краю, колонкой в начале карточки и ещё загружающаяся — `Card.Media`, `placement`, `ratio`, `dots`, `loading`.",
    },
    {
      scenario: "choice",
      title: "Выбор",
      description:
        "Карточки, из которых выбирают: один тариф из трёх и любое число дополнений, каждая карточка — кнопка с меткой выбора в конце шапки — `Card.Indicator`, `selected`, `asChild`.",
    },
    {
      scenario: "switch",
      title: "Переключатель",
      layout: "full",
      description:
        "Переключатель в карточке: одна настройка — карточка в одну строку с переключателем в конце, несколько настроек — групповая карточка с двумя кнопками-иконками в шапке и переключателем в каждой строке — `Switch.Root`, `fullWidth`, `Card.Actions`.",
    },
    {
      slot: "narrow",
      description:
        "На узкой карточке ничего не переносится: название уступает место, бейджи сворачиваются в «+N», кнопки подвала уходят под итог и делят ширину — `Card.Title`, `Card.Badges`, `Card.Footer`, `Card.Actions`.",
    },
    {
      slot: "screen",
      description:
        "Страница заказов карточками: заголовок со строкой данных, фильтр по оплате и кнопка в верхней полосе, одна сетка карточек, которая перетекает при смене фильтра и загружается заглушками той же геометрии — `Page.TopBar`, `Crossfade`, `Skeleton`, `Card.Link`.",
    },
  ],
  api,
};
