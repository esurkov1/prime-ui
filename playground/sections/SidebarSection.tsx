import { api } from "@/layout/sidebar/api";

import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "sidebar",
  base: "layout",
  title: "Sidebar",
  kind: "layout",
  description:
    "Боковая навигация приложения в трёх режимах — развёрнутом, компактном и скрытом — и выезжающая панель на узких экранах.",
  examples: [
    {
      slot: "overview",
      description:
        "Навигация приложения на холсте: шапка с брендом и кнопкой сворачивания, пункты с иконками и текущая страница — `Sidebar.Brand`, `Sidebar.Toggle`, `Sidebar.ItemIcon`, `current`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: высота пункта, кегль, иконка и счётчик следуют ярусу, ширина рельса не меняется — `size`.",
    },
    {
      slot: "structure",
      description:
        "Группы с подписью и необязательные части пункта: простое число, цветной бейдж, подсказка клавиш, иконка в конце, действие в строке и недоступный раздел — `Sidebar.Group`, `Sidebar.ItemCount`, `color`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`, `disabled`.",
    },
    {
      scenario: "brand-header",
      title: "Бренд в шапке",
      description:
        "Блок бренда и кнопка сворачивания в конце шапки; в компактном режиме остаётся логотип, а кнопка переезжает на кромку рельса — `Sidebar.Brand`, `Sidebar.BrandLogo`, `description`, `variant`.",
    },
    {
      scenario: "collapsible-groups",
      title: "Сворачиваемые группы",
      description:
        "Заголовки групп сворачивают свои пункты, шеврон — в конце заголовка; в компактном режиме пункты видны всегда — `collapsible`, `defaultOpen`.",
    },
    {
      scenario: "nested-items",
      title: "Вложенные пункты",
      description:
        "Родительский пункт с дочерними на направляющей линии: текущий дочерний раскрывает его и отмечает родителя; в компактном рельсе дочерние открываются во всплывающей панели — `Sidebar.Sub`, `Sidebar.SubTrigger`, `Sidebar.SubContent`.",
    },
    {
      scenario: "account",
      title: "Аккаунт",
      description:
        "Пункты подвала над блоком пользователя: аватар, имя и почта открывают меню аккаунта; в компактном режиме остаётся только аватар — `Sidebar.Footer`, `Sidebar.Account`, `description`.",
    },
    {
      scenario: "router",
      title: "Ссылки роутера",
      description:
        "Ссылка роутера как пункт: роутер ставит `aria-current`, и пункт выглядит текущим; рендерите внутри роутера — `asChild`.",
    },
    {
      slot: "controlled",
      description:
        "Режим рельса хранит родитель: развёрнут, рельс из иконок с подсказками или скрыт; анимируется только ширина — `mode`, `onModeChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Навигация за кнопкой меню на любой ширине: родитель открывает выезжающую панель, закрывают её подложка, Escape, кнопка в шапке или переход — `offCanvas`, `open`, `onOpenChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Переводит фокус по пунктам; недоступный и свёрнутый пропускаются." },
      {
        keys: "Enter · Space",
        action:
          "Открывает раздел, нажимает кнопку пункта, сворачивает или разворачивает группу и вложенный список; в компактном рельсе открывает всплывающую панель и ставит фокус на первый дочерний пункт.",
      },
      {
        keys: "ArrowRight · ArrowLeft",
        action:
          "На родительском пункте раскрывает и сворачивает вложенный список; в компактном рельсе → открывает панель, ← в панели возвращает фокус на родителя.",
      },
      {
        keys: "ArrowDown · ArrowUp · Home · End",
        action: "Переводят фокус по пунктам во всплывающей панели компактного рельса.",
      },
      {
        keys: "Escape",
        action:
          "Закрывает всплывающую панель (фокус возвращается на родителя) и выезжающую панель на узком экране.",
      },
    ],
    aria: [
      'Панель — `<nav>` с именем из `labels.navigation`; группы — `role="group"` с подписью.',
      'Текущий пункт — `aria-current="page"`; в компактном режиме подпись видна как подсказка.',
      "Сворачиваемая группа и родительский пункт — кнопки с `aria-expanded` и `aria-controls`; свёрнутое содержимое `inert`.",
      'В компактном рельсе родительский пункт — `aria-haspopup="dialog"`; панель с дочерними пунктами названа им.',
      "Действие в строке — отдельная кнопка рядом с пунктом, с именем и подсказкой из `label`.",
      "Выезжающая панель: подложка, ловушка фокуса и Escape; подложка — кнопка с `labels.close`.",
      "Toggle: `aria-expanded`, `aria-controls` на `<nav>`, подпись из `labels`.",
    ],
  },
};

export default function SidebarSection() {
  return <ComponentPage page={page} />;
}
