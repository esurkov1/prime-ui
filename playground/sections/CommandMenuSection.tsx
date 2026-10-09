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
        "Неактивный пункт виден приглушённым и стрелки его пропускают, а пустой результат говорит словами задачи — `disabled`, `labels`.",
    },
    {
      scenario: "server-search",
      title: "Поиск на сервере",
      description:
        "Заказы ищутся на сервере: родитель грузит результаты по запросу и следующую порцию в конце списка, а если ничего не нашлось, палитра предлагает создать заказ — `search`, `onSearchChange`, `filter`, `loading`, `hasMore`, `loadingMore`, `onLoadMore`, `CommandMenu.Empty`.",
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
  accessibility: {
    keyboard: [
      {
        keys: "ArrowDown · ArrowUp",
        action: "Переводят активный пункт по кругу; фокус остаётся в поле поиска.",
      },
      { keys: "Home · End", action: "Первый / последний найденный пункт." },
      {
        keys: "Enter",
        action: "Выполняет активный пункт; при ошибке загрузки повторяет её (`onRetry`).",
      },
      {
        keys: "Tab",
        action: "При ошибке загрузки переводит фокус на кнопку «Повторить».",
      },
      {
        keys: "Escape",
        action: "Закрывает палитру (`closeOnEscape`); фокус возвращается на открывший элемент.",
      },
    ],
    aria: [
      'Палитра — `role="dialog"` с `aria-modal`; имя — `CommandMenu.Title` или `aria-label`.',
      'Поле — `role="combobox"` с `aria-controls` на список и `aria-activedescendant` на активный пункт; пункты — `role="option"`, активный — `aria-selected`.',
      '`CommandMenu.Group` — `role="group"` с именем из `label`; пустой результат — `role="status"`.',
      'При загрузке список и поле — `aria-busy`, а `labels.loading` объявляется вежливо; строки-скелеты скрыты от скринридеров; ошибка загрузки — `role="alert"`.',
      "Стрелки, дошедшие до последнего пункта, запрашивают следующую порцию так же, как прокрутка.",
      "Страница за палитрой неактивна; после закрытия фокус возвращается на открывший элемент.",
    ],
  },
};
