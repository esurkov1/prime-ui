import { api } from "@/layout/sidebar/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { PanelLeft } from "../icons";

export const page: ComponentPageConfig = {
  category: "navigation",
  nav: {
    segment: "sidebar",
    label: "Sidebar",
    summary: "Боковая навигация: развёрнут, компактный, скрыт",
    keywords: [
      "сайдбар",
      "боковая панель",
      "навигация",
      "меню",
      "mode",
      "compact",
      "open",
      "persistKey",
      "сохранение",
    ],
    icon: PanelLeft,
    order: 5,
  },
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
        "Всё, что держит навигация приложения: бренд и кнопка сворачивания, сворачиваемые группы, вложенный список, счётчики, футер и аккаунт — `Sidebar.Brand`, `Sidebar.Group`, `Sidebar.Sub`, `Sidebar.ItemCount`, `Sidebar.Account`, `Sidebar.Toggle`.",
    },
    {
      slot: "sizes",
      description:
        "Все ярусы: высота пункта, кегль, иконка и счётчик следуют ярусу, ширина рельса не меняется — `size`.",
    },
    {
      slot: "structure",
      description:
        "Группы с подписью и необязательные части пункта: простое число, цветные и залитый бейджи, подсказка клавиш, иконка в конце, действия в строке со знаком по умолчанию и своим и недоступный раздел — `Sidebar.Group`, `Sidebar.ItemCount`, `color`, `variant`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`, `disabled`.",
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
        "Заголовки групп сворачивают свои пункты, открыта одна группа за раз, шеврон — в конце заголовка; в компактном рельсе свёрнутая группа становится одной строкой, пункты которой открываются во всплывающей панели — `collapsible`, `open`, `onOpenChange`.",
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
        "Пункты подвала и строка сворачивания над блоком пользователя: аватар, имя и почта открывают меню аккаунта; сверните рельс этой строкой — останется только аватар, на оси иконок — `Sidebar.Footer`, `Sidebar.Account`, `description`, `Sidebar.Toggle`.",
    },
    {
      scenario: "account-profile",
      title: "Аккаунт без меню",
      description:
        "Пользователь открывает панель профиля, а не меню, поэтому строка рисуется без шеврона — `Sidebar.Account`, `description`.",
    },
    {
      scenario: "router",
      title: "Ссылки роутера",
      description:
        "Ссылки роутера как бренд и пункты: роутер отмечает текущую ссылку, и пункт выглядит текущим; рендерите внутри роутера — `asChild`.",
    },
    {
      scenario: "persist",
      title: "Запоминает состояние",
      description:
        "Первый визит открывается рельсом из иконок; режим и свёрнутые группы запоминаются и возвращаются после перезагрузки — `persistKey`, `defaultMode`.",
    },
    {
      scenario: "custom-part",
      title: "Своя часть",
      description:
        "Своя часть в подвале читает состояние рельса: шкала хранилища видна в полном рельсе и в выезжающей панели и уходит в рельсе из иконок — `useSidebar`.",
    },
    {
      slot: "dismiss",
      description:
        "Выезжающую панель закрывает только её кнопка: нажатие на подложку и Escape оставляют её открытой, выбранный пункт всё равно закрывает — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled",
      description:
        "Режим рельса хранит родитель: развёрнут, рельс из иконок с подсказками или скрыт; каждое переключение — одно синхронное движение — `mode`, `onModeChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Навигация за кнопкой меню на любой ширине: родитель открывает выезжающую панель, закрывают её подложка, Escape, кнопка в верхней полосе страницы или переход — `offCanvas`, `open`, `onOpenChange`.",
    },
    {
      slot: "narrow",
      description:
        "Уже 768px рельс уходит из раскладки и выезжает поверх страницы по кнопке меню, которую верхняя полоса страницы рисует сама; от 768px это снова рельс, а кнопка уходит — `AppShell`, `labels`.",
    },
  ],
  api,
};
