import { api } from "@/components/dropdown/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { ListChecks } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "dropdown",
    label: "Dropdown",
    summary: "Выпадающее меню действий",
    keywords: ["выпадающее меню", "меню", "dropdown", "open", "onOpenChange"],
    icon: ListChecks,
    order: 3,
  },
  dir: "dropdown",
  title: "Dropdown",
  kind: "overlay",
  description:
    "Меню действий у кнопки: пункт выполняет действие и закрывает меню. Для выбора значения — Select.",
  examples: [
    {
      slot: "overview",
      description:
        "Кнопка-иконка открывает действия строки; выбор пункта выполняет действие и закрывает меню — `Dropdown.Item`, `onSelect`.",
    },
    {
      slot: "structure",
      description:
        "Необязательные части меню аккаунта: шапка с аватаром, группа с подписью, иконки, подсказки клавиш и разделители — `Dropdown.Header`, `Dropdown.Group`, `Dropdown.ItemIcon`, `Dropdown.ItemShortcut`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы с иконками, подсказками клавиш и опасным пунктом; меню берёт ярус своего триггера — `size`.",
    },
    {
      slot: "placement",
      description:
        "Все стороны и выравнивания относительно триггера; у края экрана меню переворачивается и сдвигается — `side`, `align`.",
    },
    {
      slot: "states",
      description:
        "Обычный, неактивный и опасный пункт; стрелки пропускают неактивный — `disabled`, `tone`.",
    },
    {
      scenario: "item-description",
      title: "Описание пункта",
      description:
        "Вторая строка под пунктом: что делает действие и почему недоступное недоступно — видно всем и зачитывается вместе с пунктом — `Dropdown.ItemDescription`.",
    },
    {
      scenario: "link-items",
      title: "Пункты-ссылки",
      description:
        "Пункты, которые ведут на страницу, — настоящие ссылки: Cmd-клик и контекстное меню открывают их в новой вкладке, обычный выбор закрывает меню — `asChild`.",
    },
    {
      scenario: "match-trigger-width",
      title: "Ширина триггера",
      description: "Под кнопкой на всю ширину меню не уже триггера — `matchTriggerWidth`.",
    },
    {
      scenario: "checkbox-items",
      title: "Флажки",
      description:
        "Выбор колонок: пункты-переключатели с галочкой в конце не закрывают меню, ключевую колонку не скрыть — `Dropdown.CheckboxItem`, `checked`, `onCheckedChange`.",
    },
    {
      scenario: "long-list",
      title: "Длинный список",
      description:
        "Проектов больше, чем помещается: список с группами прокручивается внутри панели, высота ограничена местом у триггера — `Dropdown.Group`.",
    },
    {
      slot: "dismiss",
      description:
        "Шаг онбординга держит меню открытым при клике снаружи и по Escape, пока не выбран пункт — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled-open",
      description:
        "Открытием владеет родитель и открывает меню другой кнопкой; выбранный шаг меняет подпись триггера — `open`, `onOpenChange`.",
    },
  ],
  api,
};
