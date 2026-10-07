import { api } from "@/components/badge/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "badge",
  title: "Badge",
  kind: "primitive",
  description:
    "Единственный чип кита: статус, категория или счётчик, снимаемое значение и нажимаемый переключатель с действием при наведении — в цвете палитры.",
  examples: [
    {
      slot: "overview",
      description: "Статусы публикации: смысл несёт текст, оттенок его повторяет — `color`.",
    },
    {
      slot: "variants",
      description:
        "Все оттенки палитры во всех подачах; текст читается без цвета — `variant`, `color`.",
    },
    { slot: "sizes", description: "Все ярусы бейджа, высота от 16 до 32 px — `size`." },
    {
      slot: "states",
      description:
        "Неактивный бейдж, переключатель выключен и включён, снимаемый — `disabled`, `onPress`, `pressed`, `onRemove`.",
    },
    {
      slot: "with-icon",
      description:
        "Точка в начале, иконка в начале или в конце и квадрат-иконка с именем — `Badge.Dot`, `Badge.Icon`, `aria-label`.",
    },
    {
      scenario: "in-controls",
      title: "Внутри контрола",
      description: "В кнопке и поле бейдж без `size` берёт ярус на ступень ниже.",
    },
    {
      scenario: "applied-filters",
      title: "Применённые фильтры",
      description:
        "Каждый бейдж снимает свой фильтр и называет его для скринридеров — `onRemove`, `labels`.",
    },
    {
      scenario: "filter-values",
      title: "Значения фильтра",
      description:
        "Значения как переключатели с действием «скрыть», которое выезжает без изменения ширины — `onPress`, `pressed`, `Badge.Action`, `persistent`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Фокус на теле нажимаемого бейджа, затем на действии или удалении." },
      { keys: "Enter · Space", action: "Нажимает тело, удаление или действие в фокусе." },
    ],
    aria: [
      "Бейдж без действий — обычный текст в `<span>`, без роли.",
      "`onPress` делает тело `<button>` с `aria-pressed` при заданном `pressed`; удаление и `Badge.Action` — отдельные кнопки со своими именами.",
      "Дайте каждому удалению уникальное имя через `labels.remove`, иначе скринридер услышит несколько одинаковых «Удалить».",
      "`Badge.Dot` скрыт (`aria-hidden`); бейджу-иконке нужен `aria-label`. Цвет никогда не несёт смысл один — оставляйте слово.",
    ],
  },
};

export default function BadgeSection() {
  return <ComponentPage page={page} />;
}
