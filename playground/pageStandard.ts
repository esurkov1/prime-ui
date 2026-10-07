/**
 * Component page standard: the single source for page kinds, the example slot vocabulary and the
 * slot order of every kind. `ComponentPage` renders from it, every `COMPONENT.md` declares its
 * `**Kind:**`, and `src/test/docs-contract.test.ts` checks pages, examples and docs against it.
 *
 * A page kind is the shape of a component (what a reader needs to see), not its sidebar category:
 * `CATEGORY_PAGES` stays navigation only.
 */
import type { ExampleFramePreviewLayout } from "@/components/example-frame/ExampleFrame";

export const PAGE_KINDS = [
  "primitive",
  "control",
  "field",
  "overlay",
  "navigation",
  "composite",
  "layout",
] as const;
export type PageKind = (typeof PAGE_KINDS)[number];

export const PAGE_KIND_RULES: Record<PageKind, string> = {
  primitive: "A visual element defined by its variant / tone / color, size and state matrices.",
  control: "Picks a value in place: value, group, states and the controlled pair.",
  field: "A form field: label, hint, error, required / optional, states, controlled, in a form.",
  overlay:
    "A floating layer: trigger and content, structure, size / placement, dismiss, controlled open.",
  navigation: "Moves between views or steps: active item, orientation, overflow, controlled value.",
  composite:
    "A ready block of several parts: the full typical scenario first, then features, states, narrow width.",
  layout: "Page structure: the region in a page context and its responsive behaviour.",
};

/** Cross-cutting example slots. A slot has one file name, one Russian title and one content rule. */
export const SLOT_IDS = [
  "overview",
  "variants",
  "sizes",
  "states",
  "with-icon",
  "structure",
  "group",
  "orientation",
  "placement",
  "overflow",
  "validation",
  "dismiss",
  "controlled",
  "controlled-open",
  "in-form",
  "narrow",
] as const;
export type SlotId = (typeof SLOT_IDS)[number];

export type SlotDef = {
  /** Russian title on the playground page. */
  title: string;
  /** What the example must contain. */
  rule: string;
};

export const SLOTS: Record<SlotId, SlotDef> = {
  overview: {
    title: "Обзор",
    rule: "Typical usage with defaults — the code a consumer copies first. No decorative extras.",
  },
  variants: {
    title: "Варианты",
    rule: "Every value of `variant` × `tone` (or `color`) as a labelled matrix.",
  },
  sizes: {
    title: "Размеры",
    rule: "Every `size` value, xs → xl, labelled by its value.",
  },
  states: {
    title: "Состояния",
    rule: "Every state side by side (disabled, readOnly, loading, invalid, empty…), labelled by the prop.",
  },
  "with-icon": {
    title: "С иконкой",
    rule: "Icon slots: leading / trailing icon and the icon-only form.",
  },
  structure: {
    title: "Структура",
    rule: "Optional parts switched on and off: icon, description, body, footer, header only.",
  },
  group: {
    title: "Группа",
    rule: "Several items under one group label, with the group's hint and error.",
  },
  orientation: {
    title: "Ориентация",
    rule: "Every `orientation` value.",
  },
  placement: {
    title: "Расположение",
    rule: "Every `side` / `align` value relative to the trigger or the screen edge.",
  },
  overflow: {
    title: "Переполнение",
    rule: "More items than fit: scrolling, collapsing or truncation.",
  },
  validation: {
    title: "Валидация",
    rule: "`required`, `optional`, `hint`, `error` and how the support row behaves.",
  },
  dismiss: {
    title: "Закрытие",
    rule: "`closeOnOutsideClick`, `closeOnEscape` and the close parts, incl. a destructive confirm.",
  },
  controlled: {
    title: "Управляемое значение",
    rule: "`value` / `checked` owned by the parent and changed from outside.",
  },
  "controlled-open": {
    title: "Управляемое открытие",
    rule: "`open` / `onOpenChange` owned by the parent, opened from code without a trigger.",
  },
  "in-form": {
    title: "В форме",
    rule: "Inside a real `<form>` with a label, validation and a submit button.",
  },
  narrow: {
    title: "Узкая ширина",
    rule: "Behaviour in a narrow container (≤ 360px): wrapping, stacking, scrolling.",
  },
};

/** Position of component-specific scenarios inside a kind's slot order. */
export const SCENARIOS = "scenarios";

export type KindSlot = {
  slot: SlotId | typeof SCENARIOS;
  /** The page must have this slot. Prop-driven requirements are added by `requiredSlots`. */
  required?: boolean;
  /** Preview layout of the slot (component-specific scenarios included). */
  layout: ExampleFramePreviewLayout;
};

/**
 * Allowed slots of every kind, in page order. Component-specific scenarios go to the `SCENARIOS`
 * position. A slot not listed for a kind is not allowed on its pages.
 */
export const KIND_SLOTS: Record<PageKind, KindSlot[]> = {
  primitive: [
    { slot: "overview", required: true, layout: "row" },
    { slot: "variants", layout: "matrix" },
    { slot: "sizes", layout: "matrix" },
    { slot: "states", layout: "matrix" },
    { slot: "with-icon", layout: "matrix" },
    { slot: "structure", layout: "stack" },
    { slot: SCENARIOS, layout: "stack" },
    { slot: "in-form", layout: "stack-narrow" },
    { slot: "narrow", layout: "stack" },
  ],
  control: [
    { slot: "overview", required: true, layout: "default" },
    { slot: "variants", layout: "matrix" },
    { slot: "sizes", layout: "matrix" },
    { slot: "states", required: true, layout: "matrix" },
    { slot: "with-icon", layout: "matrix" },
    { slot: "group", layout: "stack-narrow" },
    { slot: "orientation", layout: "stack" },
    { slot: SCENARIOS, layout: "stack-narrow" },
    { slot: "controlled", layout: "stack-narrow" },
    { slot: "in-form", layout: "stack-narrow" },
  ],
  field: [
    { slot: "overview", required: true, layout: "stack-narrow" },
    { slot: "sizes", required: true, layout: "stack-narrow" },
    { slot: "states", required: true, layout: "stack-narrow" },
    { slot: "validation", required: true, layout: "stack-narrow" },
    { slot: "with-icon", layout: "stack-narrow" },
    { slot: SCENARIOS, layout: "stack-narrow" },
    { slot: "controlled", required: true, layout: "stack-narrow" },
    { slot: "in-form", required: true, layout: "stack" },
  ],
  overlay: [
    { slot: "overview", required: true, layout: "default" },
    { slot: "structure", layout: "row" },
    { slot: "sizes", layout: "row" },
    { slot: "placement", layout: "row" },
    { slot: "states", layout: "row" },
    { slot: SCENARIOS, layout: "row" },
    { slot: "dismiss", layout: "row" },
    { slot: "controlled-open", layout: "row" },
    { slot: "in-form", layout: "default" },
  ],
  navigation: [
    { slot: "overview", required: true, layout: "stack" },
    { slot: "variants", layout: "stack" },
    { slot: "sizes", layout: "stack" },
    { slot: "states", layout: "stack" },
    { slot: "with-icon", layout: "stack" },
    { slot: "orientation", layout: "stack" },
    { slot: "overflow", layout: "stack" },
    { slot: SCENARIOS, layout: "stack" },
    { slot: "controlled", layout: "stack" },
    { slot: "narrow", layout: "stack" },
  ],
  composite: [
    { slot: "overview", required: true, layout: "stack" },
    { slot: "variants", layout: "stack" },
    { slot: "sizes", layout: "stack" },
    { slot: "structure", layout: "stack" },
    { slot: SCENARIOS, layout: "stack" },
    { slot: "states", layout: "stack" },
    { slot: "controlled", layout: "stack" },
    { slot: "narrow", required: true, layout: "stack" },
  ],
  layout: [
    { slot: "overview", required: true, layout: "stack" },
    { slot: "variants", layout: "stack" },
    { slot: "sizes", layout: "stack" },
    { slot: "structure", layout: "stack" },
    { slot: SCENARIOS, layout: "stack" },
    { slot: "controlled", layout: "stack" },
    { slot: "controlled-open", layout: "stack" },
    { slot: "narrow", layout: "stack" },
  ],
};

/**
 * Slots a page must have because of its API: a prop axis on the root (first API table) must be
 * shown. `size` → sizes, `variant`/`tone`/`color` → variants, a state flag → states,
 * `value`/`checked` → controlled, `open` → controlled-open, `closeOnOutsideClick` → dismiss.
 */
export const PROP_SLOTS: { props: string[]; slot: SlotId }[] = [
  { props: ["size"], slot: "sizes" },
  { props: ["variant", "tone", "color"], slot: "variants" },
  { props: ["disabled", "readOnly", "loading", "invalid"], slot: "states" },
  { props: ["value", "checked"], slot: "controlled" },
  { props: ["open"], slot: "controlled-open" },
  { props: ["closeOnOutsideClick"], slot: "dismiss" },
];

export function requiredSlots(kind: PageKind, rootProps: readonly string[]): SlotId[] {
  const required = new Set<SlotId>();
  for (const entry of KIND_SLOTS[kind]) {
    if (entry.required && entry.slot !== SCENARIOS) required.add(entry.slot);
  }
  for (const { props, slot } of PROP_SLOTS) {
    if (props.some((prop) => rootProps.includes(prop))) required.add(slot);
  }
  return [...required];
}

export function slotLayout(kind: PageKind, slot: SlotId | null): ExampleFramePreviewLayout {
  const key = slot ?? SCENARIOS;
  const entry = KIND_SLOTS[kind].find((item) => item.slot === key);
  if (!entry) throw new Error(`Slot "${key}" is not allowed on a ${kind} page`);
  return entry.layout;
}

/** Index of the slot in the kind's order; component-specific scenarios share one index. */
export function slotOrder(kind: PageKind, slot: SlotId | null): number {
  const key = slot ?? SCENARIOS;
  return KIND_SLOTS[kind].findIndex((item) => item.slot === key);
}
