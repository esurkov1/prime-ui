import { api } from "@/components/stepper/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "stepper",
  title: "Stepper",
  kind: "navigation",
  description:
    "Шаги многошагового процесса — оформление заказа, онбординг, мастер настройки: что пройдено, где пользователь и какой шаг требует внимания.",
  examples: [
    {
      slot: "overview",
      description: "Шаги процесса: пройденные с галочкой, текущий выделен — `defaultValue`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы: индикатор от 20 до 36 px, заголовок кеглем контрола яруса — `size`.",
    },
    {
      slot: "states",
      description:
        "Статусы с сервера, шаг с ошибкой и своим индикатором и закрытый шаг — `status`, `disabled`.",
    },
    {
      slot: "with-icon",
      description:
        "Вертикальные строки, открывающие страницу или панель, заканчиваются шевроном — `Stepper.Arrow`.",
    },
    {
      slot: "orientation",
      description:
        "Ряд шагов с шевронами над содержимым и столбец для боковой панели — `orientation`.",
    },
    {
      slot: "controlled",
      description:
        "Текущий шаг хранит родитель: «Назад» и «Далее» двигают его, дальние шаги закрыты, пока до них не дошли — `value`, `onValueChange`.",
    },
    {
      slot: "narrow",
      description:
        "Горизонтальный степпер в контейнере ширины телефона встаёт по шагу в строку и прячет шевроны.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Переводит фокус между шагами; неактивный пропускается." },
      { keys: "Enter · Space", action: "Выбирает шаг." },
    ],
    aria: [
      'Семантический `<ol>`; каждый шаг — `<button>` внутри `<li>`, у активного — `aria-current="step"`.',
      "Шевроны, индикатор и `Stepper.Arrow` скрыты (`aria-hidden`); имя шага — заголовок и описание.",
      "Если степперов на странице несколько, дайте `<ol>` `aria-label`.",
    ],
  },
};

export default function StepperSection() {
  return <ComponentPage page={page} />;
}
