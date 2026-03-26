import type { ComponentType } from "react";

import IntroPage from "./pages/IntroPage";
import AccordionSection from "./sections/AccordionSection";
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
import PageShellSection from "./sections/PageShellSection";
import PaginationSection from "./sections/PaginationSection";
import PopoverSection from "./sections/PopoverSection";
import ProgressBarSection from "./sections/ProgressBarSection";
import ProgressCircleSection from "./sections/ProgressCircleSection";
import RadioSection from "./sections/RadioSection";
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

/** Категории сайдбара — как в каталоге дизайн-системы (Foundations → Overlays). */
export type PlaygroundCategoryId =
  | "foundations"
  | "actions"
  | "form"
  | "displaying-data"
  | "feedback"
  | "layout"
  | "navigation"
  | "overlays"
  | "auxiliary";

export type PlaygroundCategoryMeta = { id: PlaygroundCategoryId; label: string };

export const PLAYGROUND_NAV_CATEGORIES: PlaygroundCategoryMeta[] = [
  { id: "foundations", label: "Foundations" },
  { id: "actions", label: "Actions" },
  { id: "form", label: "Form" },
  { id: "displaying-data", label: "Displaying Data" },
  { id: "feedback", label: "Feedback" },
  { id: "layout", label: "Layout" },
  { id: "navigation", label: "Navigation" },
  { id: "overlays", label: "Overlays" },
  { id: "auxiliary", label: "Вспомогательные компоненты" },
];

type PageDef = { segment: string; label: string; Page: ComponentType };

/** Порядок внутри секции совпадает с вашим списком; отсутствующие компоненты не добавляем в меню. */
const CATEGORY_PAGES: Record<PlaygroundCategoryId, PageDef[]> = {
  foundations: [
    { segment: "color", label: "Color", Page: ColorSection },
    { segment: "typography", label: "Typography", Page: TypographySection },
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
  "displaying-data": [
    /* Avatar Group / Compact — примеры на странице Avatar */
    { segment: "avatar", label: "Avatar", Page: AvatarSection },
    { segment: "badge", label: "Badge", Page: BadgeSection },
    { segment: "banner", label: "Banner", Page: BannerSection },
    { segment: "code-block", label: "Code Block", Page: CodeBlockSection },
    { segment: "data-table", label: "Data Table", Page: DataTableSection },
    { segment: "divider", label: "Divider", Page: DividerSection },
    { segment: "kbd", label: "Kbd", Page: KbdSection },
    { segment: "progress-bar", label: "Progress Bar", Page: ProgressBarSection },
    { segment: "progress-circle", label: "Progress Circle", Page: ProgressCircleSection },
    /* Rating — компонента нет; Status Badge — варианты Badge */
    { segment: "tag", label: "Tag", Page: TagSection },
  ],
  feedback: [
    { segment: "notification", label: "Notification", Page: NotificationSection },
    { segment: "tooltip", label: "Tooltip", Page: TooltipSection },
  ],
  layout: [
    { segment: "accordion", label: "Accordion", Page: AccordionSection },
    { segment: "breadcrumb", label: "Breadcrumb", Page: BreadcrumbSection },
    { segment: "segmented-control", label: "Segmented Control", Page: SegmentedControlSection },
    { segment: "tabs", label: "Tab Menu", Page: TabsSection },
    /* Sidebar — не в вашем списке, но есть в ките */
    { segment: "sidebar", label: "Sidebar", Page: SidebarSection },
  ],
  navigation: [
    /* Dot Stepper — отдельного компонента нет */
    { segment: "stepper", label: "Stepper", Page: StepperSection },
    { segment: "pagination", label: "Pagination", Page: PaginationSection },
  ],
  overlays: [
    { segment: "command-menu", label: "Command Menu", Page: CommandMenuSection },
    { segment: "drawer", label: "Drawer", Page: DrawerSection },
    { segment: "dropdown", label: "Dropdown", Page: DropdownSection },
    { segment: "modal", label: "Modal", Page: ModalSection },
    { segment: "popover", label: "Popover", Page: PopoverSection },
  ],
  auxiliary: [
    { segment: "page-shell", label: "PageShell", Page: PageShellSection },
    { segment: "page-content", label: "PageContent", Page: PageContentSection },
    { segment: "example-frame", label: "ExampleFrame", Page: ExampleFrameSection },
    { segment: "control-size", label: "ControlSizeProvider", Page: ControlSizeSection },
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
