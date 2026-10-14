import { api } from "@/components/progress-bar/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { StretchHorizontal } from "../icons";

export const page: ComponentPageConfig = {
  category: "status",
  nav: {
    segment: "progress-bar",
    label: "Progress Bar",
    summary: "Линейный прогресс: одно значение или части целого",
    keywords: [
      "прогресс",
      "загрузка",
      "сегменты",
      "распределение",
      "квоты",
      "value",
      "max",
      "segments",
    ],
    icon: StretchHorizontal,
    order: 3,
  },
  dir: "progress-bar",
  title: "ProgressBar",
  kind: "primitive",
  description:
    "Линейный прогресс: одно значение на нативном `<progress>`, сегменты, которые делят целое (место по типам файлов, лиды по источникам), или рейтинг строками. Когда прогресс неизвестен — Spinner.",
  examples: [
    {
      slot: "overview",
      description: "Импорт в процессе с названием и процентом — `value`, `label`, `showValue`.",
    },
    {
      slot: "variants",
      description: "Все цвета заливки; тон говорит об исходе, а не о прогрессе — `tone`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: линия растёт от 4 до 8 px, как дорожка Slider — `size`.",
    },
    {
      slot: "states",
      description:
        "Загрузка занимает геометрию самой полосы, поэтому данные встают без скачка — `loading`.",
    },
    {
      scenario: "custom-max",
      title: "Своя шкала",
      description: "Шкала шагов вместо процентов: 3 из 5 шагов профиля — `max`.",
    },
    {
      scenario: "segments",
      title: "Сегменты",
      description:
        "Части целого в одной полосе: слитно или отдельными капсулами, свободный остаток до `max` и пустой список со своим текстом для скринридеров — `segments`, `segmentGap`, `max`, `labels`.",
    },
    {
      scenario: "legend",
      title: "Легенда и цвета категорий",
      description:
        "Доли категорий в цветах графиков с легендой «цвет · название · число · доля» — `color`, `legend`, `formatValue`.",
    },
    {
      scenario: "ranking",
      title: "Рейтинг",
      description:
        "Рейтинг строками «подпись · число · доля» над полосой: города от лидера и воронка от первого шага — `layout`, `scale`.",
    },
    {
      scenario: "steps",
      title: "Ступени",
      description:
        "Шкала целыми ячейками, которые заполняются друг за другом: 2 из 5 шагов настройки, вперёд и назад — `steps`, `max`.",
    },
    {
      scenario: "milestone",
      title: "Редкое событие",
      description:
        "Последний счёт квартала заполняет полосу, тон становится успехом, короткое конфетти отмечает событие — `value`, `tone`, `celebrate()`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [],
    aria: [
      "Режим значения: нативный `<progress>` — роль `progressbar` со значением и максимумом.",
      'Режим сегментов: `role="group"`; доли читаются текстом «Видео: 38%, Документы: 21%». С `label` полоса названа подписью, а доли — описание; с `legend` описанием становится легенда.',
      'Рейтинг (`layout="rows"`): список `<ol>` с именем из `label`; каждая строка читается текстом «Москва 1 284 52%», полосы скрыты от скринридеров.',
      "Цвет категории всегда стоит рядом с её названием в легенде или строке — смысл не передаётся только цветом.",
      "Во время `loading` корень помечен `aria-busy`, а заглушки скрыты от скринридеров.",
      "Без `label` задайте `aria-label`, иначе у полосы значения нет имени.",
      "Процент `showValue` скрыт от скринридеров (`aria-hidden`).",
    ],
  },
};
