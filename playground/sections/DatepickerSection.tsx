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
        "Пустое поле с плейсхолдером по умолчанию, заполненное, отключённое и ошибочное, и поле, где фокус виден без кольца — `disabled`, `invalid`, `focusRing`.",
    },
    {
      slot: "validation",
      description:
        "Период отпуска проверяется на лету: ошибка встряхивает поле, называет нарушенное правило и уходит, когда период подходит; необязательная дата выхода — `required`, `hint`, `error`, `optional`.",
    },
    {
      scenario: "range-presets",
      title: "Период с пресетами",
      description:
        "Период отчёта: пресеты сбоку, два месяца, подсказка шага, время с «Сбросить» / «Применить», без будущих дней; «Сбросить» возвращает текущий месяц, панель выровнена по концу поля — `presets`, `months`, `prompt`, `footer`, `withTime`, `disableFuture`, `resetValue`, `align`.",
    },
    {
      scenario: "inline-panel",
      title: "Встроенная панель",
      description:
        "Календарь бронирования в карточке: карточка — его контейнер, два месяца, если родителю хватает места, период применяется сразу — `Datepicker.Panel`, `months`, `prompt`.",
    },
    {
      scenario: "yearless",
      title: "Ежегодная дата",
      description:
        "Ежегодное изменение цены: день и месяц без года, префикс значения и занятые дни отключены — `yearless`, `valuePrefix`, `isDayDisabled`.",
    },
    {
      scenario: "locale",
      title: "Другой язык",
      description:
        "Окно доставки на портале партнёра на английском: названия месяцев и дней из локали date-fns, неделя с воскресенья, системные тексты переведены — `locale`, `weekStartsOn`, `labels`.",
    },
    {
      scenario: "deadline",
      title: "Срок со статусом",
      description:
        "Срок страховки: подсказка считает оставшиеся дни и берёт тон статуса — `hint`, `hintTone`.",
    },
    {
      slot: "dismiss",
      description:
        "Период смены с подвалом: календарь хранит черновик при нажатии рядом и закрывается по Escape, «Сбросить» или «Применить» — `closeOnOutsideClick`, `closeOnEscape`.",
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
        "Заявка на отпуск: отправка читает период из данных формы и проверяет его, ошибка встряхивает поле и уходит, как только период выбран; дата выхода необязательна — `name`, `required`, `error`, `optional`.",
    },
    {
      slot: "narrow",
      description:
        "Встроенная панель в колонке 320 px: один компактный месяц вместо двух, поля нижней строки переносятся над кнопками — `months`, `footer`.",
    },
  ],
  api,
};
