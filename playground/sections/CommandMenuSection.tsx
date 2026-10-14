import { api } from "@/components/command-menu/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Command } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "command-menu",
    label: "Command Menu",
    summary: "Палитра команд с поиском (⌘K)",
    keywords: [
      "командное меню",
      "поиск",
      "палитра",
      "cmdk",
      "open",
      "onOpenChange",
      "onSearchChange",
      "сервер",
      "onLoadMore",
    ],
    icon: Command,
    order: 6,
  },
  dir: "command-menu",
  title: "Command Menu",
  kind: "overlay",
  description:
    "Палитра поиска и команд поверх страницы: запрос фильтрует пункты или уходит на сервер, Enter выполняет активный. Глобальный поиск приложения и быстрые действия.",
  examples: [
    {
      slot: "overview",
      description:
        "Кнопка или ⌘K открывают палитру: запрос фильтрует группы по value и keywords, Enter выполняет активную команду — `CommandMenu.Item`, `keywords`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части: видимые заголовок и описание, строка описания и подсказка клавиш в пунктах, подвал с подсказками — `CommandMenu.Title`, `CommandMenu.ItemText`, `CommandMenu.ItemShortcut`, `CommandMenu.Footer`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: строки, текст, иконки и строка поиска следуют им; подбирайте под плотность приложения — `size`.",
    },
    {
      slot: "states",
      description:
        "Палитра, пока грузятся первые результаты, с неактивным пунктом, который приглушён и пропускается стрелками, и с пустым результатом словами задачи — `loading`, `disabled`, `labels`.",
    },
    {
      scenario: "server-search",
      title: "Поиск на сервере",
      description:
        "Заказы ищутся на сервере: родитель грузит результаты по запросу и следующую порцию в конце списка, а один постоянный пункт в конце создаёт заказ из запроса, нашлось что-то или нет — `search`, `onSearchChange`, `filter`, `loading`, `hasMore`, `loadingMore`, `onLoadMore`, `persistent`.",
    },
    {
      scenario: "load-error",
      title: "Ошибка загрузки",
      description:
        "Результаты не загрузились: палитра говорит об этом вместо списка, а повтор запрашивает их снова, кнопка в загрузке до ответа сервера; первый повтор тоже не удаётся, второй приносит результаты — `loadError`, `onRetry`.",
    },
    {
      slot: "dismiss",
      description:
        "Обязательный выбор при импорте: случайный клик по подложке не закрывает палитру, только Escape или выбор — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled",
      description:
        "Запросом владеет родитель: показывает текст снаружи, а команда сбрасывает его; при закрытии палитра очищает запрос — `search`, `onSearchChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель: кнопка открывает палитру, команда закрывает — `open`, `onOpenChange`.",
    },
  ],
  api,
};
