import { api } from "@/components/dropdown/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
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
      scenario: "match-trigger-width",
      title: "Ширина триггера",
      description: "Под кнопкой на всю ширину меню не уже триггера — `matchTriggerWidth`.",
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
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        action:
          "На триггере открывает меню (фокус на первом пункте); на пункте выполняет его и возвращает фокус на триггер.",
      },
      {
        keys: "ArrowDown · ArrowUp",
        action: "Переводят фокус на следующий / предыдущий доступный пункт по кругу.",
      },
      { keys: "Home · End", action: "Первый / последний доступный пункт." },
      {
        keys: "Escape",
        action: "Закрывает меню (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Tab · Shift+Tab",
        action: "Закрывает меню; фокус возвращается на триггер (Tab затем идёт дальше).",
      },
    ],
    aria: [
      'Меню — `role="menu"` с именем от триггера; пункты — `role="menuitem"`, неактивные — `aria-disabled`.',
      'Триггер получает `aria-haspopup="menu"`, `aria-expanded` и `aria-controls`.',
      '`Dropdown.Group` — `role="group"` с именем из `label`.',
      "`Dropdown.ItemIcon` скрыт от скринридеров; подсказка клавиш — только текст, обработчик пишет приложение.",
      "Клик снаружи закрывает меню без возврата фокуса на триггер: фокус остаётся там, куда нажали.",
    ],
  },
};

export default function DropdownSection() {
  return <ComponentPage page={page} />;
}
