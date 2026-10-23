import { api } from "@/components/kpi/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Gauge } from "../icons";

export const page: ComponentPageConfig = {
  category: "data-display",
  nav: {
    segment: "kpi",
    label: "Kpi",
    summary: "KPI-карточка: число, изменение, период",
    keywords: ["kpi", "метрика", "показатель", "число", "дельта", "плитка", "карточка"],
    icon: Gauge,
    order: 5.5,
  },
  dir: "kpi",
  title: "Kpi",
  kind: "composite",
  description:
    "KPI-карточка: одно число и его смысл. Шапка отвечает «что это», число и строка под ним — «сколько и за когда»; размер решает, какие части карточка держит.",
  examples: [
    {
      slot: "overview",
      description:
        "Две стандартные карточки ряда: название, число с единицей и изменением, под ним период и пояснение, внизу график — `Kpi.Title`, `Kpi.Value`, `Kpi.Unit`, `Kpi.Delta`, `Kpi.Period`, `Kpi.Meta`, `Kpi.Media`.",
    },
    {
      slot: "sizes",
      description:
        "Одна цифра на четырёх размерах, у каждого всё, что он держит: S — название, период, число и изменение; M добавляет бейдж, пояснение и график; L — иконку, описание, кнопку и итоги; XL — четыре итога и меню — `size`.",
    },
    {
      scenario: "strip",
      title: "Полоса цифр",
      layout: "full",
      description:
        "Полоса маленьких карточек над таблицей: название и период в одной строке, под ними число с изменением; больше на S ничего — `size`.",
    },
    {
      scenario: "actions",
      title: "Правый слот",
      layout: "full",
      description:
        "В правом слоте шапки одна вещь: бейдж или меню на M, кнопка на L; слот стоит у верхнего края и не сжимается — `Kpi.Actions`.",
    },
    {
      scenario: "line",
      title: "Строка под числом",
      layout: "full",
      description:
        "Строка под числом: период, потом через точку пояснение; каждая часть необязательна — страница с общим периодом его не пишет — `Kpi.Period`, `Kpi.Meta`.",
    },
    {
      scenario: "units",
      title: "Единицы",
      layout: "full",
      description:
        "Единица после числа, мельче и бледнее: рубли, проценты, часы, число без единицы; S и M пишут большую сумму коротко — `Kpi.Unit`.",
    },
    {
      scenario: "tone",
      title: "Тон изменения",
      layout: "full",
      description:
        "Изменение по смыслу, а не по знаку: рост оттока — danger со стрелкой вверх, падение расходов — success со стрелкой вниз, ноль — neutral без стрелки, сравнивать не с чем — бейджа нет — `Kpi.Delta`, `tone`.",
    },
    {
      scenario: "chart",
      title: "С графиком",
      layout: "full",
      description:
        "График под числом, прочитанный из ряда: число, период и изменение берутся из показания в покое и идут за точкой при ведении; выручка по дням линией, заказы по неделям столбиками — `Kpi.Media`, `Kpi.Delta`, `reading`, `useSparkline`.",
    },
    {
      scenario: "plan",
      title: "План",
      layout: "full",
      description:
        "Число против цели: полоса прогресса до плана под числом, план и остаток времени в строке — `Kpi.Media`, `ProgressBar`.",
    },
    {
      scenario: "parts",
      title: "Доли",
      layout: "full",
      description:
        "Число из частей: штрихи частей под числом, их легенда — цвет, название, значение, доля — в подвале; на M до трёх частей — `Kpi.Legend`, `Kpi.Footer`, `ProgressBar`.",
    },
    {
      scenario: "ring",
      title: "Кольцо",
      layout: "full",
      description:
        "Главная цифра из частей: на XL кольцо стоит в подвале слева от своей легенды, медиа над ним нет — `Kpi.Legend`, `ring`.",
    },
    {
      scenario: "footer",
      title: "Подвал",
      layout: "full",
      description:
        "Подвал держит один вид новых данных: примечание на L, итоги колонками на L и XL, разбивку строками на XL — `Kpi.Footer`, `Kpi.Note`, `Kpi.Total`, `DescriptionList`.",
    },
    {
      scenario: "link",
      title: "Карточка-ссылка",
      layout: "full",
      description:
        "Карточка открывает свой отчёт: вся карточка одной ссылкой, когда внутри нет контролов, или ссылка в названии, растянутая на карточку, когда в ней график — `asChild`, `Kpi.Link`.",
    },
    {
      slot: "states",
      description:
        "Загрузка: число, изменение и строка под ним — заглушки в своей геометрии, шапка остаётся; данные проявляются — `loading`.",
    },
    {
      slot: "narrow",
      description:
        "На узкой карточке ничего не переносится и ничего не выходит за край: название, строка под числом и итоги обрезаются многоточием, число — последним; слот держит свой угол — `size`.",
    },
  ],
  api,
};
