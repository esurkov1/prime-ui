import {
  AlignLeft,
  Award,
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronsDownUp,
  ChevronsLeftRight,
  ChevronsRight,
  CircleDot,
  CircleGauge,
  CircleHelp,
  Code2,
  Command,
  Focus,
  Frame,
  Gauge,
  GripVertical,
  Hash,
  History,
  Image as ImageIcon,
  Inbox,
  Info,
  Keyboard,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  LayoutTemplate,
  Link2,
  ListChecks,
  ListFilter,
  ListOrdered,
  Loader,
  LogIn,
  type LucideIcon,
  Maximize2,
  Megaphone,
  MessageSquare,
  Minus,
  MousePointerClick,
  Palette,
  PanelLeft,
  PanelRight,
  PanelTop,
  Pipette,
  Rows3,
  Ruler,
  ScrollText,
  SlidersHorizontal,
  Space,
  SquareRoundCorner,
  StretchHorizontal,
  SwatchBook,
  Table,
  Tags,
  TextCursorInput,
  ToggleLeft,
  Type,
  Upload,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";

import ColorsPage from "./foundation/ColorsPage";
import ElevationPage from "./foundation/ElevationPage";
import FocusPage from "./foundation/FocusPage";
import MotionPage from "./foundation/MotionPage";
import RadiusPage from "./foundation/RadiusPage";
import SizeTiersPage from "./foundation/SizeTiersPage";
import SpacingPage from "./foundation/SpacingPage";
import TypographyPage from "./foundation/TypographyPage";
import IntroPage from "./pages/IntroPage";
import AccordionSection from "./sections/AccordionSection";
import AppShellSection from "./sections/AppShellSection";
import AvatarSection from "./sections/AvatarSection";
import BadgeSection from "./sections/BadgeSection";
import BannerSection from "./sections/BannerSection";
import BreadcrumbSection from "./sections/BreadcrumbSection";
import ButtonGroupSection from "./sections/ButtonGroupSection";
import ButtonSection from "./sections/ButtonSection";
import CardSection from "./sections/CardSection";
import CheckboxSection from "./sections/CheckboxSection";
import CodeBlockSection from "./sections/CodeBlockSection";
import ColorPickerSection from "./sections/ColorPickerSection";
import ColorSwatchesSection from "./sections/ColorSwatchesSection";
import CommandMenuSection from "./sections/CommandMenuSection";
import DataTableSection from "./sections/DataTableSection";
import DatepickerSection from "./sections/DatepickerSection";
import DigitInputSection from "./sections/DigitInputSection";
import DividerSection from "./sections/DividerSection";
import DndSection from "./sections/DndSection";
import DrawerSection from "./sections/DrawerSection";
import DropdownSection from "./sections/DropdownSection";
import EmptyPageSection from "./sections/EmptyPageSection";
import ExampleFrameSection from "./sections/ExampleFrameSection";
import FileUploadSection from "./sections/FileUploadSection";
import HintSection from "./sections/HintSection";
import InputSection from "./sections/InputSection";
import KbdSection from "./sections/KbdSection";
import LabelSection from "./sections/LabelSection";
import LinkButtonSection from "./sections/LinkButtonSection";
import LoginFormSection from "./sections/LoginFormSection";
import ModalSection from "./sections/ModalSection";
import NativeSelectSection from "./sections/NativeSelectSection";
import NotificationSection from "./sections/NotificationSection";
import PageContentSection from "./sections/PageContentSection";
import PaginationSection from "./sections/PaginationSection";
import PopoverSection from "./sections/PopoverSection";
import ProgressBarSection from "./sections/ProgressBarSection";
import ProgressCircleSection from "./sections/ProgressCircleSection";
import RadioSection from "./sections/RadioSection";
import ScrollContainerSection from "./sections/ScrollContainerSection";
import SegmentedControlSection from "./sections/SegmentedControlSection";
import SelectSection from "./sections/SelectSection";
import SidebarSection from "./sections/SidebarSection";
import SliderSection from "./sections/SliderSection";
import SmartFilterSection from "./sections/SmartFilterSection";
import SpinnerSection from "./sections/SpinnerSection";
import StepperSection from "./sections/StepperSection";
import SwitchSection from "./sections/SwitchSection";
import TabsSection from "./sections/TabsSection";
import TagSelectSection from "./sections/TagSelectSection";
import TextareaSection from "./sections/TextareaSection";
import ThumbnailSection from "./sections/ThumbnailSection";
import TimelineSection from "./sections/TimelineSection";
import TooltipSection from "./sections/TooltipSection";

/**
 * Playground pages: the single source for routes, sidebar navigation and the ⌘K search index.
 *
 * Categories (one axis each, no overlaps), ordered from primitives to page structure:
 * - **foundations** — tokens: color, typography, spacing, size tiers, radius, elevation, motion, focus.
 * - **actions** — explicit actions on click (buttons, link button).
 * - **inputs** — typing values and field anatomy (input, textarea, upload, label, hint).
 * - **selection** — choosing from options (toggles, lists, slider, date and color pickers).
 * - **data-display** — labels and data (badge, tag, avatar, card, table, timeline, code).
 * - **feedback** — system messages, progress and empty states.
 * - **navigation** — moving between views, places and steps.
 * - **overlays** — floating layers, from tooltip to modal surfaces.
 * - **layout** — app frame, page regions, disclosure, dividers, scrolling.
 * - **infrastructure** — demo tooling, not product UI.
 */
export type PlaygroundCategoryId =
  | "foundations"
  | "actions"
  | "inputs"
  | "selection"
  | "data-display"
  | "feedback"
  | "navigation"
  | "overlays"
  | "layout"
  | "infrastructure";

export type PlaygroundCategoryMeta = { id: PlaygroundCategoryId; label: string };

export const PLAYGROUND_NAV_CATEGORIES: PlaygroundCategoryMeta[] = [
  { id: "foundations", label: "Основа" },
  { id: "actions", label: "Действия" },
  { id: "inputs", label: "Поля ввода" },
  { id: "selection", label: "Выбор" },
  { id: "data-display", label: "Данные" },
  { id: "feedback", label: "Обратная связь" },
  { id: "navigation", label: "Навигация" },
  { id: "overlays", label: "Оверлеи" },
  { id: "layout", label: "Раскладка" },
  { id: "infrastructure", label: "Инфраструктура" },
];

type PageDef = {
  segment: string;
  /** Sidebar and search title (component name in English). */
  label: string;
  /** One line for search results. */
  description: string;
  /** Extra search terms: Russian name, synonyms, main props. */
  keywords: string[];
  icon: LucideIcon;
  Page: ComponentType;
};

/** Order inside a category is by meaning: related components side by side, common ones first. */
const CATEGORY_PAGES: Record<PlaygroundCategoryId, PageDef[]> = {
  foundations: [
    {
      segment: "color",
      label: "Color",
      description: "Цветовые роли, светлая и тёмная темы, контраст",
      keywords: ["цвет", "палитра", "тема", "контраст", "accent", "palette", "tokens"],
      icon: Palette,
      Page: ColorsPage,
    },
    {
      segment: "typography",
      label: "Typography",
      description: "Текстовые роли, шрифт Golos Text, ширина строки",
      keywords: ["типографика", "шрифт", "текст", "variant", "tone", "heading", "body"],
      icon: Type,
      Page: TypographyPage,
    },
    {
      segment: "spacing",
      label: "Spacing",
      description: "Шкала отступов 4 px и правила близости",
      keywords: ["отступы", "интервалы", "gap", "space", "сетка"],
      icon: Space,
      Page: SpacingPage,
    },
    {
      segment: "size-tiers",
      label: "Size tiers",
      description: "Размеры xs–xl: высота, текст, иконка, радиус",
      keywords: ["размеры", "size", "xs", "xl", "высота", "control"],
      icon: Ruler,
      Page: SizeTiersPage,
    },
    {
      segment: "radius",
      label: "Radius",
      description: "Радиусы скругления и правило вложенного радиуса",
      keywords: ["радиус", "скругление", "border-radius"],
      icon: SquareRoundCorner,
      Page: RadiusPage,
    },
    {
      segment: "elevation",
      label: "Elevation",
      description: "Слои, тени и порядок z-index",
      keywords: ["тени", "слои", "shadow", "z-index", "поверхность"],
      icon: Layers,
      Page: ElevationPage,
    },
    {
      segment: "motion",
      label: "Motion",
      description: "Длительности, кривые и reduced motion",
      keywords: ["анимация", "движение", "duration", "easing"],
      icon: Gauge,
      Page: MotionPage,
    },
    {
      segment: "focus",
      label: "Focus",
      description: "Кольцо фокуса: толщина, отступ, контраст",
      keywords: ["фокус", "focus-visible", "клавиатура", "a11y"],
      icon: Focus,
      Page: FocusPage,
    },
  ],
  actions: [
    {
      segment: "buttons",
      label: "Button",
      description: "Кнопка: варианты, тоны, размеры, загрузка",
      keywords: ["кнопка", "variant", "tone", "size", "loading", "asChild"],
      icon: MousePointerClick,
      Page: ButtonSection,
    },
    {
      segment: "button-group",
      label: "Button Group",
      description: "Сгруппированные кнопки и переключатели",
      keywords: ["группа кнопок", "toolbar", "pressed", "orientation"],
      icon: LayoutGrid,
      Page: ButtonGroupSection,
    },
    {
      segment: "link-button",
      label: "Link Button",
      description: "Ссылка, оформленная как текстовое действие",
      keywords: ["ссылка", "link", "href", "underline"],
      icon: Link2,
      Page: LinkButtonSection,
    },
  ],
  inputs: [
    {
      segment: "input",
      label: "Input",
      description: "Текстовое поле: подпись, подсказка, ошибка, иконки",
      keywords: ["поле", "ввод", "инпут", "label", "hint", "error", "invalid", "onValueChange"],
      icon: TextCursorInput,
      Page: InputSection,
    },
    {
      segment: "textarea",
      label: "Textarea",
      description: "Многострочное поле со счётчиком символов",
      keywords: ["текстовая область", "многострочное", "maxLength", "onValueChange"],
      icon: AlignLeft,
      Page: TextareaSection,
    },
    {
      segment: "digit-input",
      label: "Digit Input",
      description: "Поле для кода из отдельных цифр (OTP)",
      keywords: ["код", "otp", "пин", "цифры", "value", "onValueChange"],
      icon: Hash,
      Page: DigitInputSection,
    },
    {
      segment: "login-form",
      label: "Login Form",
      description: "Карточка входа: логотип, провайдеры, поля, ссылки",
      keywords: [
        "вход",
        "логин",
        "авторизация",
        "регистрация",
        "пароль",
        "sign in",
        "login",
        "auth",
      ],
      icon: LogIn,
      Page: LoginFormSection,
    },
    {
      segment: "file-upload",
      label: "File Upload",
      description: "Загрузка файлов: зона перетаскивания и список",
      keywords: ["загрузка", "файлы", "dropzone", "drag and drop"],
      icon: Upload,
      Page: FileUploadSection,
    },
    {
      segment: "label",
      label: "Label",
      description: "Подпись поля: обязательное и необязательное",
      keywords: ["подпись", "лейбл", "required", "optional"],
      icon: Bookmark,
      Page: LabelSection,
    },
    {
      segment: "hint",
      label: "Hint",
      description: "Подсказка и сообщение об ошибке под полем",
      keywords: ["подсказка", "ошибка", "hint", "error", "invalid"],
      icon: Info,
      Page: HintSection,
    },
  ],
  selection: [
    {
      segment: "checkbox",
      label: "Checkbox",
      description: "Флажок: checked, indeterminate, группы",
      keywords: ["чекбокс", "флажок", "checked", "onCheckedChange", "indeterminate"],
      icon: CheckSquare,
      Page: CheckboxSection,
    },
    {
      segment: "radio",
      label: "Radio",
      description: "Радиокнопки: выбор одного варианта",
      keywords: ["радио", "переключатель", "RadioGroup", "value", "onValueChange"],
      icon: CircleDot,
      Page: RadioSection,
    },
    {
      segment: "switch",
      label: "Switch",
      description: "Переключатель включено/выключено",
      keywords: ["переключатель", "тумблер", "toggle", "checked", "onCheckedChange"],
      icon: ToggleLeft,
      Page: SwitchSection,
    },
    {
      segment: "segmented-control",
      label: "Segmented Control",
      description: "Переключатель между взаимоисключающими вариантами",
      keywords: ["сегменты", "переключатель", "value", "onValueChange"],
      icon: Rows3,
      Page: SegmentedControlSection,
    },
    {
      segment: "slider",
      label: "Slider",
      description: "Ползунок числового значения в диапазоне",
      keywords: ["ползунок", "слайдер", "range", "value", "min", "max", "step"],
      icon: SlidersHorizontal,
      Page: SliderSection,
    },
    {
      segment: "select",
      label: "Select",
      description: "Выпадающий список с выбором значения",
      keywords: ["селект", "список", "выбор", "value", "onValueChange", "open"],
      icon: ChevronDown,
      Page: SelectSection,
    },
    {
      segment: "native-select",
      label: "NativeSelect",
      description: "Системный список выбора в виде поля",
      keywords: ["native", "select", "option", "системный", "мобильный", "селект"],
      icon: ChevronDown,
      Page: NativeSelectSection,
    },
    {
      segment: "tag-select",
      label: "Tag select",
      description: "Множественный выбор с тегами",
      keywords: ["теги", "мультиселект", "multiselect", "value", "onValueChange"],
      icon: Tags,
      Page: TagSelectSection,
    },
    {
      segment: "smart-filter",
      label: "SmartFilter",
      description: "Умные фильтры: панель значений, поиск и теги применённых фильтров",
      keywords: [
        "фильтры",
        "фильтр",
        "поиск",
        "filter",
        "include",
        "exclude",
        "скрыть",
        "показать",
        "chips",
      ],
      icon: ListFilter,
      Page: SmartFilterSection,
    },
    {
      segment: "datepicker",
      label: "Datepicker",
      description: "Выбор даты и диапазона в календаре",
      keywords: ["дата", "календарь", "диапазон", "range", "value", "onValueChange"],
      icon: Calendar,
      Page: DatepickerSection,
    },
    {
      segment: "color-picker",
      label: "Color Picker",
      description: "Выбор цвета: палитра, HEX, пипетка",
      keywords: ["выбор цвета", "палитра", "hex", "value", "onValueChange"],
      icon: Pipette,
      Page: ColorPickerSection,
    },
    {
      segment: "color-swatches",
      label: "Color Swatches",
      description: "Выбор цвета из образцов прямо в форме",
      keywords: ["цвет", "образцы", "палитра", "swatches", "inline", "value", "onValueChange"],
      icon: SwatchBook,
      Page: ColorSwatchesSection,
    },
  ],
  "data-display": [
    {
      segment: "badge",
      label: "Badge",
      description: "Бейдж и тег: статус, счётчик, удаляемое значение, переключатель",
      keywords: [
        "бейдж",
        "метка",
        "счётчик",
        "тег",
        "чип",
        "chip",
        "tag",
        "фильтр",
        "onRemove",
        "onPress",
        "color",
        "variant",
      ],
      icon: Award,
      Page: BadgeSection,
    },
    {
      segment: "avatar",
      label: "Avatar",
      description: "Аватар: фото, инициалы, группа",
      keywords: ["аватар", "фото", "инициалы", "color", "size"],
      icon: UserRound,
      Page: AvatarSection,
    },
    {
      segment: "thumbnail",
      label: "Thumbnail",
      description: "Превью объекта с соотношением сторон",
      keywords: ["миниатюра", "превью", "картинка", "фото", "обложка", "ratio", "image"],
      icon: ImageIcon,
      Page: ThumbnailSection,
    },
    {
      segment: "kbd",
      label: "Kbd",
      description: "Клавиша и сочетание клавиш",
      keywords: ["клавиша", "клавиатура", "shortcut", "горячие клавиши"],
      icon: Keyboard,
      Page: KbdSection,
    },
    {
      segment: "card",
      label: "Card",
      description: "Карточка: шаблоны, метрика, действия",
      keywords: ["карточка", "панель", "metric", "variant"],
      icon: LayoutDashboard,
      Page: CardSection,
    },
    {
      segment: "data-table",
      label: "Data Table",
      description: "Таблица данных: сортировка, выбор строк",
      keywords: ["таблица", "данные", "сортировка", "columns", "rows", "selection"],
      icon: Table,
      Page: DataTableSection,
    },
    {
      segment: "timeline",
      label: "Timeline",
      description: "Лента событий: точки на линии, дата, сумма",
      keywords: [
        "таймлайн",
        "лента",
        "история",
        "события",
        "активность",
        "activity",
        "feed",
        "операции",
        "active",
      ],
      icon: History,
      Page: TimelineSection,
    },
    {
      segment: "code-block",
      label: "Code Block",
      description: "Блок кода с подсветкой синтаксиса",
      keywords: ["код", "подсветка", "language"],
      icon: Code2,
      Page: CodeBlockSection,
    },
  ],
  feedback: [
    {
      segment: "banner",
      label: "Banner",
      description: "Баннер: сообщение на всю ширину",
      keywords: ["баннер", "сообщение", "alert", "tone"],
      icon: Megaphone,
      Page: BannerSection,
    },
    {
      segment: "notification",
      label: "Notification",
      description: "Всплывающие уведомления (тосты)",
      keywords: ["уведомление", "тост", "toast", "tone"],
      icon: Bell,
      Page: NotificationSection,
    },
    {
      segment: "progress-bar",
      label: "Progress Bar",
      description: "Линейный прогресс: одно значение или части целого",
      keywords: [
        "прогресс",
        "загрузка",
        "сегменты",
        "распределение",
        "квоты",
        "value",
        "max",
        "segments",
      ],
      icon: StretchHorizontal,
      Page: ProgressBarSection,
    },
    {
      segment: "progress-circle",
      label: "Progress Circle",
      description: "Круговой индикатор прогресса",
      keywords: ["прогресс", "круг", "кольцо", "value"],
      icon: CircleGauge,
      Page: ProgressCircleSection,
    },
    {
      segment: "spinner",
      label: "Spinner",
      description: "Индикатор загрузки без известного прогресса",
      keywords: ["спиннер", "загрузка", "лоадер", "loader", "loading", "индикатор"],
      icon: Loader,
      Page: SpinnerSection,
    },
    {
      segment: "empty-page",
      label: "EmptyPage",
      description: "Пустое состояние страницы или блока",
      keywords: ["пусто", "пустое состояние", "empty state"],
      icon: Inbox,
      Page: EmptyPageSection,
    },
  ],
  navigation: [
    {
      segment: "tabs",
      label: "Tabs",
      description: "Вкладки: навигация между панелями",
      keywords: ["вкладки", "табы", "tab menu", "value", "onValueChange", "orientation"],
      icon: LayoutList,
      Page: TabsSection,
    },
    {
      segment: "breadcrumb",
      label: "Breadcrumb",
      description: "Хлебные крошки: путь к странице",
      keywords: ["крошки", "путь", "breadcrumbs"],
      icon: ChevronsRight,
      Page: BreadcrumbSection,
    },
    {
      segment: "pagination",
      label: "Pagination",
      description: "Постраничная навигация",
      keywords: ["пагинация", "страницы", "value", "onValueChange"],
      icon: ChevronsLeftRight,
      Page: PaginationSection,
    },
    {
      segment: "stepper",
      label: "Stepper",
      description: "Шаги процесса",
      keywords: ["шаги", "мастер", "wizard", "steps", "value"],
      icon: ListOrdered,
      Page: StepperSection,
    },
  ],
  overlays: [
    {
      segment: "tooltip",
      label: "Tooltip",
      description: "Короткая подсказка при наведении",
      keywords: ["подсказка", "тултип", "hover", "side"],
      icon: CircleHelp,
      Page: TooltipSection,
    },
    {
      segment: "popover",
      label: "Popover",
      description: "Всплывающая панель у элемента",
      keywords: ["поповер", "всплывающее окно", "open", "onOpenChange"],
      icon: MessageSquare,
      Page: PopoverSection,
    },
    {
      segment: "dropdown",
      label: "Dropdown",
      description: "Выпадающее меню действий",
      keywords: ["выпадающее меню", "меню", "dropdown", "open", "onOpenChange"],
      icon: ListChecks,
      Page: DropdownSection,
    },
    {
      segment: "modal",
      label: "Modal",
      description: "Модальное окно и подтверждение",
      keywords: ["модалка", "диалог", "окно", "dialog", "open", "onOpenChange"],
      icon: Maximize2,
      Page: ModalSection,
    },
    {
      segment: "drawer",
      label: "Drawer",
      description: "Выезжающая панель сбоку",
      keywords: ["шторка", "панель", "drawer", "open", "onOpenChange", "side"],
      icon: PanelRight,
      Page: DrawerSection,
    },
    {
      segment: "command-menu",
      label: "Command Menu",
      description: "Палитра команд с поиском (⌘K)",
      keywords: ["командное меню", "поиск", "палитра", "cmdk", "open", "onOpenChange"],
      icon: Command,
      Page: CommandMenuSection,
    },
  ],
  layout: [
    {
      segment: "app-shell",
      label: "AppShell",
      description: "Каркас приложения: рельс навигации и панель контента",
      keywords: ["каркас", "оболочка", "layout", "nav", "header", "main", "fillViewport"],
      icon: LayoutTemplate,
      Page: AppShellSection,
    },
    {
      segment: "sidebar",
      label: "Sidebar",
      description: "Боковая навигация: развёрнут, компактный, скрыт",
      keywords: ["сайдбар", "боковая панель", "навигация", "меню", "mode", "compact", "open"],
      icon: PanelLeft,
      Page: SidebarSection,
    },
    {
      segment: "page-content",
      label: "PageContent",
      description: "Страница: заголовок, описание, действия, секции",
      keywords: ["страница", "заголовок", "секция", "title", "description", "actions"],
      icon: PanelTop,
      Page: PageContentSection,
    },
    {
      segment: "accordion",
      label: "Accordion",
      description: "Раскрывающиеся секции",
      keywords: ["аккордеон", "раскрытие", "collapse", "value", "onValueChange"],
      icon: ChevronsDownUp,
      Page: AccordionSection,
    },
    {
      segment: "divider",
      label: "Divider",
      description: "Разделитель с подписью и без",
      keywords: ["разделитель", "линия", "separator"],
      icon: Minus,
      Page: DividerSection,
    },
    {
      segment: "scroll-container",
      label: "ScrollContainer",
      description: "Прокручиваемая область с тонким скроллбаром",
      keywords: ["прокрутка", "скролл", "scroll", "axis"],
      icon: ScrollText,
      Page: ScrollContainerSection,
    },
    {
      segment: "dnd",
      label: "Dnd",
      description: "Перетаскивание: сортируемые списки, Draggable и DropZone",
      keywords: ["drag", "drop", "перетаскивание", "сортировка", "порядок", "sortable", "доска"],
      icon: GripVertical,
      Page: DndSection,
    },
  ],
  infrastructure: [
    {
      segment: "example-frame",
      label: "ExampleFrame",
      description: "Рамка примера: превью, код, вьюпорт",
      keywords: ["пример", "превью", "рамка", "viewport", "code"],
      icon: Frame,
      Page: ExampleFrameSection,
    },
  ],
};

export type PlaygroundPageEntry = PageDef & {
  category: "overview" | PlaygroundCategoryId;
};

const INTRO: PlaygroundPageEntry = {
  segment: "",
  label: "Введение",
  description: "Что такое Prime UI и как устроена система",
  keywords: ["intro", "главная", "обзор", "установка", "start"],
  icon: BookOpen,
  Page: IntroPage,
  category: "overview",
};

export const PLAYGROUND_PAGES: PlaygroundPageEntry[] = [
  INTRO,
  ...PLAYGROUND_NAV_CATEGORIES.flatMap((meta) =>
    CATEGORY_PAGES[meta.id].map((page) => ({ ...page, category: meta.id })),
  ),
];

export type PlaygroundNavCategoryBlock = PlaygroundCategoryMeta & {
  pages: PlaygroundPageEntry[];
};

export const PLAYGROUND_NAV: PlaygroundNavCategoryBlock[] = PLAYGROUND_NAV_CATEGORIES.map(
  (meta) => ({ ...meta, pages: PLAYGROUND_PAGES.filter((p) => p.category === meta.id) }),
);

export const PLAYGROUND_INTRO = INTRO;

export function pageRoute(segment: string): string {
  return segment === "" ? "/" : `/${segment}`;
}
