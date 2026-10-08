import { api } from "@/components/datepicker/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Calendar } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "datepicker",
    label: "Datepicker",
    summary: "Выбор даты и диапазона в календаре",
    keywords: ["дата", "календарь", "диапазон", "range", "value", "onValueChange"],
    icon: Calendar,
    order: 10,
  },
  dir: "datepicker",
  title: "Datepicker",
  kind: "field",
  description:
    "Выбор даты или периода: поле с календарём в поповере (`Datepicker.Root`) или встроенная панель (`Datepicker.Panel`).",
  examples: [
    {
      slot: "overview",
      description:
        "Поле даты отгрузки: клик открывает месяц, выбранный день применяется сразу — `mode`, `label`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: поле высотой от 28 до 48 px, клетка дня панели от 24 до 40 px — `size`.",
    },
    {
      slot: "states",
      description:
        "Пустое поле с плейсхолдером по умолчанию, заполненное и отключённое — `disabled`.",
    },
    {
      slot: "validation",
      description:
        "Обязательный период отпуска с подсказкой, то же поле с ошибкой и необязательная дата выхода — `required`, `hint`, `error`, `optional`.",
    },
    {
      scenario: "range-presets",
      title: "Период с пресетами",
      description:
        "Период отчёта: пресеты сбоку, два месяца, подсказка шага, время с «Сбросить» / «Применить», без будущих дней — `presets`, `months`, `prompt`, `footer`, `withTime`, `disableFuture`.",
    },
    {
      scenario: "inline-panel",
      title: "Встроенная панель",
      description:
        "Календарь бронирования прямо на странице: своя карточка, два месяца, если родителю хватает места, период применяется сразу — `Datepicker.Panel`, `months`, `prompt`.",
    },
    {
      scenario: "yearless",
      title: "Ежегодная дата",
      description:
        "Ежегодное изменение цены: день и месяц без года, префикс значения и занятые дни отключены — `yearless`, `valuePrefix`, `isDayDisabled`.",
    },
    {
      slot: "controlled",
      description:
        "Фильтр отчёта владеет периодом: быстрые кнопки задают его снаружи, поле его показывает — `value`, `onValueChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Панелью владеет родитель: кнопка-напоминание открывает календарь из кода, выбранный день его закрывает — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Заявка на отпуск: обязательный период становится ошибкой после отправки, дата выхода необязательна — `required`, `error`, `optional`.",
    },
    {
      slot: "narrow",
      description:
        "Встроенная панель в колонке 320 px: один компактный месяц вместо двух, поля нижней строки переносятся над кнопками — `months`, `footer`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Enter · Space", action: "На поле открывает календарь; на дне выбирает его." },
      { keys: "← · →", action: "Соседний день." },
      { keys: "↑ · ↓", action: "Тот же день соседней недели." },
      { keys: "Home · End", action: "Начало и конец недели." },
      { keys: "PageUp · PageDown", action: "Тот же день соседнего месяца; с Shift — года." },
      { keys: "Escape", action: "Закрывает календарь и возвращает фокус на поле." },
    ],
    aria: [
      "Поле — кнопка с именем из подписи и значения; подсказка и ошибка — в `aria-describedby`, ошибка ставит `aria-invalid`.",
      'Календарь — `role="dialog"` с ловушкой фокуса; при открытии фокус на выбранном или сегодняшнем дне.',
      'Каждый месяц — таблица с именем месяца; дни — кнопки с полной датой в имени, выбранные — `aria-pressed`, сегодня — `aria-current="date"`.',
      "Заголовок месяца и подсказка шага — вежливые live-области; пресеты — группа кнопок с `aria-pressed`.",
    ],
  },
};
