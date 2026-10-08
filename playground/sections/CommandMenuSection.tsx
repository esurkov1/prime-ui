import { Command } from "lucide-react";
import { api } from "@/components/command-menu/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "command-menu",
    label: "Command Menu",
    summary: "Палитра команд с поиском (⌘K)",
    keywords: ["командное меню", "поиск", "палитра", "cmdk", "open", "onOpenChange"],
    icon: Command,
    order: 6,
  },
  dir: "command-menu",
  title: "Command Menu",
  kind: "overlay",
  description:
    "Палитра поиска и команд поверх страницы: запрос фильтрует пункты, Enter выполняет активный. Глобальный поиск приложения и быстрые действия.",
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
        "Неактивный пункт не попадает в результаты, а пустой результат говорит словами задачи — `disabled`, `labels`.",
    },
    {
      slot: "dismiss",
      description:
        "Обязательный выбор при импорте: случайный клик по подложке не закрывает палитру, только Escape или выбор — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием и запросом владеет родитель: читает текст, а команда сбрасывает его или закрывает палитру — `open`, `onOpenChange`, `value`, `onValueChange`.",
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
      { keys: "Enter", action: "Выполняет активный пункт." },
      {
        keys: "Escape",
        action: "Закрывает палитру (`closeOnEscape`); фокус возвращается на открывший элемент.",
      },
    ],
    aria: [
      'Палитра — `role="dialog"` с `aria-modal`; имя — `CommandMenu.Title` или `aria-label`.',
      'Поле — `role="combobox"` с `aria-controls` на список и `aria-activedescendant` на активный пункт; пункты — `role="option"`, активный — `aria-selected`.',
      '`CommandMenu.Group` — `role="group"` с именем из `label`; пустой результат — `role="status"`.',
      "Страница за палитрой неактивна; после закрытия фокус возвращается на открывший элемент.",
    ],
  },
};
