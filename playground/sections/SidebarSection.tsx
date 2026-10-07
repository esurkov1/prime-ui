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
        "Навигация приложения на холсте: пункты с иконками, текущая страница и кнопка сворачивания — `Sidebar.ItemIcon`, `current`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: высота пункта, кегль, иконка и счётчик следуют ярусу, ширина рельса не меняется — `size`.",
    },
    {
      slot: "structure",
      description:
        "Группы с подписью и необязательные части пункта: счётчик, подсказка клавиш и недоступный раздел — `Sidebar.Group`, `Sidebar.ItemCount`, `Sidebar.ItemShortcut`, `disabled`.",
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
        "Уже 768px рельс становится выезжающей панелью с подложкой, которую открывает кнопка меню; сузьте окно, чтобы проверить — `open`, `onOpenChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Переводит фокус по пунктам; недоступный пропускается." },
      { keys: "Enter · Space", action: "Открывает раздел или нажимает кнопку пункта." },
      { keys: "Escape", action: "Закрывает выезжающую панель на узком экране." },
    ],
    aria: [
      'Панель — `<nav>` с именем из `labels.navigation`; группы — `role="group"` с подписью.',
      'Текущий пункт — `aria-current="page"`; в компактном режиме подпись видна как подсказка.',
      "Выезжающая панель: подложка, ловушка фокуса и Escape; подложка — кнопка с `labels.close`.",
      "Toggle: `aria-expanded`, `aria-controls` на `<nav>`, подпись из `labels`.",
    ],
  },
};

export default function SidebarSection() {
  return <ComponentPage page={page} />;
}
