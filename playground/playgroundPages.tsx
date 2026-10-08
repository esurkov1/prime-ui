import {
  Blocks,
  BookOpen,
  CircleDashed,
  FileText,
  Focus,
  Gauge,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  type LucideIcon,
  Palette,
  PanelRightOpen,
  Ruler,
  Settings,
  Space,
  SquareRoundCorner,
  Table,
  Type,
} from "lucide-react";
import type { ComponentType } from "react";

import {
  PLAYGROUND_NAV_CATEGORIES,
  type PlaygroundCategoryId,
  type PlaygroundCategoryMeta,
} from "./categories";
import type { ComponentPageConfig } from "./components/ComponentPage";
import CompositionPage from "./composition/CompositionPage";
import { PatternPage } from "./composition/PatternPage";
import { COMPOSITION_PATTERNS, type CompositionPattern } from "./composition/patterns";
import ColorsPage from "./foundation/ColorsPage";
import ElevationPage from "./foundation/ElevationPage";
import FocusPage from "./foundation/FocusPage";
import MotionPage from "./foundation/MotionPage";
import RadiusPage from "./foundation/RadiusPage";
import SizeTiersPage from "./foundation/SizeTiersPage";
import SpacingPage from "./foundation/SpacingPage";
import TypographyPage from "./foundation/TypographyPage";
import IntroPage from "./pages/IntroPage";

/**
 * Playground pages: the single source for routes, sidebar navigation and the ⌘K search index.
 * Component pages come from `sections/*Section.tsx` (each a `ComponentPageConfig` with its category
 * and nav entry); foundation and composition pages are listed here.
 */
type PageBase = {
  segment: string;
  /** Sidebar and search title (component name in English). */
  label: string;
  /** One line for search results. */
  description: string;
  /** Extra search terms: Russian name, synonyms, main props. */
  keywords: string[];
  icon: LucideIcon;
};

/** A page with its own component, or a component page rendered by `ComponentPage`. */
export type PageDef = PageBase & ({ Page: ComponentType } | { component: ComponentPageConfig });

const FOUNDATION_PAGES: PageDef[] = [
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
    label: "Size Tiers",
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
];

const PATTERN_ICONS: Record<string, LucideIcon> = {
  "list-page": Table,
  "detail-page": FileText,
  "settings-page": Settings,
  "form-drawer": PanelRightOpen,
  dashboard: LayoutDashboard,
  "screen-states": CircleDashed,
};

/** A composition page: the pattern file is the source, `patterns.ts` adds the page text. */
function patternPage(pattern: CompositionPattern): PageDef {
  function Page() {
    return <PatternPage pattern={pattern} />;
  }
  return {
    segment: pattern.segment,
    label: pattern.label,
    description: pattern.title,
    keywords: pattern.keywords,
    icon: PATTERN_ICONS[pattern.file] ?? LayoutTemplate,
    Page,
  };
}

const COMPOSITION_PAGES: PageDef[] = [
  {
    segment: "composition",
    label: "Principles",
    description: "Как собрать экран из кита: каркас, ритм, иерархия, действия, состояния",
    keywords: ["композиция", "экран", "страница", "правила", "ритм", "сетка", "layout", "screen"],
    icon: Blocks,
    Page: CompositionPage,
  },
  ...COMPOSITION_PATTERNS.map(patternPage),
];

const SECTIONS = Object.values(
  import.meta.glob<{ page: ComponentPageConfig }>("./sections/*Section.tsx", { eager: true }),
).map((module) => module.page);

/** Component pages of a category, in their `nav.order`. */
function componentPages(category: PlaygroundCategoryId): PageDef[] {
  return SECTIONS.flatMap((page) =>
    page.category === category && page.nav ? [{ page, nav: page.nav }] : [],
  )
    .sort((a, b) => a.nav.order - b.nav.order)
    .map(({ page, nav }) => ({
      segment: nav.segment,
      label: nav.label,
      description: nav.summary,
      keywords: nav.keywords,
      icon: nav.icon,
      component: page,
    }));
}

const LISTED_PAGES: Partial<Record<PlaygroundCategoryId, PageDef[]>> = {
  foundations: FOUNDATION_PAGES,
  composition: COMPOSITION_PAGES,
};

export type PlaygroundPageEntry = PageDef & {
  category: "overview" | PlaygroundCategoryId;
};

export const PLAYGROUND_INTRO: PlaygroundPageEntry = {
  segment: "",
  label: "Введение",
  description: "Что такое Prime UI и как устроена система",
  keywords: ["intro", "главная", "обзор", "установка", "start"],
  icon: BookOpen,
  Page: IntroPage,
  category: "overview",
};

export type PlaygroundNavCategoryBlock = PlaygroundCategoryMeta & {
  pages: PlaygroundPageEntry[];
};

export const PLAYGROUND_NAV: PlaygroundNavCategoryBlock[] = PLAYGROUND_NAV_CATEGORIES.map(
  (meta) => ({
    ...meta,
    pages: [...(LISTED_PAGES[meta.id] ?? []), ...componentPages(meta.id)].map((page) => ({
      ...page,
      category: meta.id,
    })),
  }),
);

export const PLAYGROUND_PAGES: PlaygroundPageEntry[] = [
  PLAYGROUND_INTRO,
  ...PLAYGROUND_NAV.flatMap((category) => category.pages),
];

export function pageRoute(segment: string): string {
  return segment === "" ? "/" : `/${segment}`;
}
