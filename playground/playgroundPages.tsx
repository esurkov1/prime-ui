import type { ComponentType } from "react";

import IntroPage from "./pages/IntroPage";
import AccordionSection from "./sections/AccordionSection";
import AppShellSection from "./sections/AppShellSection";
import AvatarSection from "./sections/AvatarSection";
import BadgeSection from "./sections/BadgeSection";
import BannerSection from "./sections/BannerSection";
import BreadcrumbSection from "./sections/BreadcrumbSection";
import ButtonGroupSection from "./sections/ButtonGroupSection";
import ButtonSection from "./sections/ButtonSection";
import CheckboxSection from "./sections/CheckboxSection";
import CodeBlockSection from "./sections/CodeBlockSection";
import ColorPickerSection from "./sections/ColorPickerSection";
import ColorSection from "./sections/ColorSection";
import CommandMenuSection from "./sections/CommandMenuSection";
import ControlSizeSection from "./sections/ControlSizeSection";
import DataTableSection from "./sections/DataTableSection";
import DatepickerSection from "./sections/DatepickerSection";
import DigitInputSection from "./sections/DigitInputSection";
import DividerSection from "./sections/DividerSection";
import DrawerSection from "./sections/DrawerSection";
import DropdownSection from "./sections/DropdownSection";
import ExampleFrameSection from "./sections/ExampleFrameSection";
import FileUploadSection from "./sections/FileUploadSection";
import HintSection from "./sections/HintSection";
import InputSection from "./sections/InputSection";
import KbdSection from "./sections/KbdSection";
import LabelSection from "./sections/LabelSection";
import LinkButtonSection from "./sections/LinkButtonSection";
import ModalSection from "./sections/ModalSection";
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
import StepperSection from "./sections/StepperSection";
import SwitchSection from "./sections/SwitchSection";
import TabsSection from "./sections/TabsSection";
import TagSection from "./sections/TagSection";
import TextareaSection from "./sections/TextareaSection";
import TooltipSection from "./sections/TooltipSection";
import TypographySection from "./sections/TypographySection";

/**
 * Категории сайдбара playground: одна ось на категорию, без пересечений.
 *
 * - **foundations** — токены, типографика и базовые визуальные примитивы (не сценарий экрана).
 * - **actions** — явное действие по клику/активации (кнопки и ссылка-кнопка).
 * - **form** — ввод и выбор значения в форме (включая контролы с оверлеем-панелью, например Color Picker).
 * - **data-display** — статичное представление данных и меток (таблица, бейдж, тег, код; без индикаторов процесса).
 * - **feedback** — сообщения системы и ход процесса (уведомления, баннеры, прогресс).
 * - **layout** — каркас страницы, области, прокрутка, вертикальная секционность (accordion).
 * - **navigation** — перемещение по местам, шагам и представлениям контента (вкладки, сегменты, крошки, пагинация).
 * - **overlays** — плавающие слои и порталы поверх страницы (включая Tooltip).
 * - **infrastructure** — контекст размеров и демо-обвязка, не пользовательский UI продукта.
 */
export type PlaygroundCategoryId =
  | "foundations"
  | "actions"
  | "form"
  | "data-display"
  | "feedback"
  | "layout"
  | "navigation"
  | "overlays"
  | "infrastructure";

export type PlaygroundCategoryMeta = { id: PlaygroundCategoryId; label: string };

export const PLAYGROUND_NAV_CATEGORIES: PlaygroundCategoryMeta[] = [
  { id: "foundations", label: "Foundations" },
  { id: "actions", label: "Actions" },
  { id: "form", label: "Form" },
  { id: "data-display", label: "Data display" },
  { id: "feedback", label: "Feedback" },
  { id: "layout", label: "Layout" },
  { id: "navigation", label: "Navigation" },
  { id: "overlays", label: "Overlays" },
  { id: "infrastructure", label: "Infrastructure" },
];

type PageDef = { segment: string; label: string; Page: ComponentType };

/** Порядок внутри категории — по смыслу (группы полей, затем алфавит где уместно). */
const CATEGORY_PAGES: Record<PlaygroundCategoryId, PageDef[]> = {
  foundations: [
    { segment: "color", label: "Color", Page: ColorSection },
    { segment: "typography", label: "Typography", Page: TypographySection },
    { segment: "kbd", label: "Kbd", Page: KbdSection },
    { segment: "divider", label: "Divider", Page: DividerSection },
  ],
  actions: [
    { segment: "buttons", label: "Button", Page: ButtonSection },
    { segment: "button-group", label: "Button Group", Page: ButtonGroupSection },
    { segment: "link-button", label: "Link Button", Page: LinkButtonSection },
  ],
  form: [
    { segment: "checkbox", label: "Checkbox", Page: CheckboxSection },
    { segment: "color-picker", label: "Color Picker", Page: ColorPickerSection },
    { segment: "datepicker", label: "Datepicker", Page: DatepickerSection },
    { segment: "digit-input", label: "Digit Input", Page: DigitInputSection },
    { segment: "file-upload", label: "File Upload", Page: FileUploadSection },
    { segment: "hint", label: "Hint", Page: HintSection },
    { segment: "input", label: "Input", Page: InputSection },
    { segment: "label", label: "Label", Page: LabelSection },
    { segment: "radio", label: "Radio", Page: RadioSection },
    { segment: "select", label: "Select", Page: SelectSection },
    { segment: "slider", label: "Slider", Page: SliderSection },
    { segment: "switch", label: "Switch", Page: SwitchSection },
    { segment: "textarea", label: "Textarea", Page: TextareaSection },
  ],
  "data-display": [
    { segment: "avatar", label: "Avatar", Page: AvatarSection },
    { segment: "badge", label: "Badge", Page: BadgeSection },
    { segment: "code-block", label: "Code Block", Page: CodeBlockSection },
    { segment: "data-table", label: "Data Table", Page: DataTableSection },
    { segment: "tag", label: "Tag", Page: TagSection },
  ],
  feedback: [
    { segment: "banner", label: "Banner", Page: BannerSection },
    { segment: "notification", label: "Notification", Page: NotificationSection },
    { segment: "progress-bar", label: "Progress Bar", Page: ProgressBarSection },
    { segment: "progress-circle", label: "Progress Circle", Page: ProgressCircleSection },
  ],
  layout: [
    { segment: "accordion", label: "Accordion", Page: AccordionSection },
    { segment: "app-shell", label: "AppShell", Page: AppShellSection },
    { segment: "page-content", label: "PageContent", Page: PageContentSection },
    { segment: "scroll-container", label: "ScrollContainer", Page: ScrollContainerSection },
    { segment: "sidebar", label: "Sidebar", Page: SidebarSection },
  ],
  navigation: [
    { segment: "breadcrumb", label: "Breadcrumb", Page: BreadcrumbSection },
    { segment: "pagination", label: "Pagination", Page: PaginationSection },
    { segment: "segmented-control", label: "Segmented Control", Page: SegmentedControlSection },
    { segment: "stepper", label: "Stepper", Page: StepperSection },
    { segment: "tabs", label: "Tab Menu", Page: TabsSection },
  ],
  overlays: [
    { segment: "command-menu", label: "Command Menu", Page: CommandMenuSection },
    { segment: "drawer", label: "Drawer", Page: DrawerSection },
    { segment: "dropdown", label: "Dropdown", Page: DropdownSection },
    { segment: "modal", label: "Modal", Page: ModalSection },
    { segment: "popover", label: "Popover", Page: PopoverSection },
    { segment: "tooltip", label: "Tooltip", Page: TooltipSection },
  ],
  infrastructure: [
    { segment: "control-size", label: "ControlSizeProvider", Page: ControlSizeSection },
    { segment: "example-frame", label: "ExampleFrame", Page: ExampleFrameSection },
  ],
};

export type PlaygroundPageEntry = {
  segment: string;
  label: string;
  Page: ComponentType;
  category: "overview" | PlaygroundCategoryId;
};

export const PLAYGROUND_PAGES: PlaygroundPageEntry[] = [
  { segment: "", label: "Введение", Page: IntroPage, category: "overview" },
  ...PLAYGROUND_NAV_CATEGORIES.flatMap((meta) =>
    CATEGORY_PAGES[meta.id].map((p) => ({ ...p, category: meta.id })),
  ),
];

export type PlaygroundNavCategoryBlock = PlaygroundCategoryMeta & {
  pages: PlaygroundPageEntry[];
};

export type PlaygroundNavModel = {
  intro: PlaygroundPageEntry;
  categories: PlaygroundNavCategoryBlock[];
};

export function getPlaygroundNavModel(): PlaygroundNavModel {
  const intro = PLAYGROUND_PAGES.find((p) => p.segment === "");
  if (!intro) {
    throw new Error("[playground] missing intro page");
  }
  const categories = PLAYGROUND_NAV_CATEGORIES.map((meta) => ({
    ...meta,
    pages: PLAYGROUND_PAGES.filter((p) => p.category === meta.id),
  }));
  return { intro, categories };
}
