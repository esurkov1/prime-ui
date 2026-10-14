import { api } from "@/components/button/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { MousePointerClick } from "../icons";

export const page: ComponentPageConfig = {
  category: "actions",
  nav: {
    segment: "buttons",
    label: "Button",
    summary: "Кнопка: варианты, тоны, размеры, загрузка",
    keywords: ["кнопка", "variant", "tone", "size", "loading", "asChild"],
    icon: MousePointerClick,
    order: 1,
  },
  dir: "button",
  title: "Button",
  kind: "primitive",
  description:
    "Кнопка для явных действий: сохранить, отправить, удалить. `tone` задаёт смысл действия, `variant` — подачу, `size` — ярус контрола.",
  examples: [
    {
      slot: "overview",
      description: "Главное действие и второстепенное рядом — `variant`, `tone`.",
    },
    { slot: "variants", description: "Все подачи во всех тонах — `variant`, `tone`." },
    { slot: "sizes", description: "Все ярусы, от 28 до 48 px в высоту — `size`." },
    {
      slot: "states",
      description:
        "Неактивная и загрузка рядом с обычной; спиннер не меняет ширину — `disabled`, `loading`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка до или после подписи и квадратная кнопка только с иконкой — `Button.Icon`, `aria-label`.",
    },
    {
      scenario: "download",
      title: "Скачивание",
      description:
        "Долгое скачивание внутри кнопки: заливка показывает прогресс, подпись считает проценты и предлагает открыть файл — `progress`.",
    },
    {
      scenario: "circle",
      title: "Круглая",
      description:
        "Круглые кнопки-иконки во всех подачах и диск, кольцо которого показывает выгрузку и который её отменяет — `shape`, `variant`, `tone`, `progress`.",
    },
    {
      scenario: "over-media",
      title: "Поверх медиа",
      description:
        "Кнопки поверх обложки стоят на тени медиа; сорвавшаяся загрузка окрашивает диск в danger — `variant`, `shape`, `tone`.",
    },
    {
      scenario: "toggle",
      title: "Переключатель",
      description:
        "Переключатель в панели: отметка избранного включает кнопку заливкой выбора и выключает обратно — `pressed`.",
    },
    {
      scenario: "hold-to-confirm",
      title: "Удержание",
      description:
        "Разрушительное действие требует удержания; если отпустить раньше, заливка откатится и ничего не случится, а запрос на удаление держит кнопку в загрузке до ответа сервера — `holdToConfirm`, `onConfirm`.",
    },
    {
      scenario: "label-morph",
      title: "Смена подписи",
      description:
        "Новая подпись перетекает в кнопку по буквам, ширина плывёт: «Сохранить» → «Сохранено» и шаги оплаты, на «Оплачено» кнопка зеленеет — `children`, `loading`, `tone`.",
    },
    {
      scenario: "on-colored-host",
      title: "На цветной подложке",
      description:
        'Действия на цветной полосе берут её цвет текста: ghost-крестик и soft-действие — `tone="inherit"`.',
    },
    {
      scenario: "as-child",
      title: "Как ссылка",
      description:
        "Вид кнопки на настоящей ссылке; неактивная ссылка не переходит — `asChild`, `disabled`.",
    },
    {
      slot: "in-form",
      description:
        "Кнопка отправки на всю ширину показывает идущий запрос после проверки почты — `type`, `loading`, `fullWidth`.",
    },
  ],
  api,
};
