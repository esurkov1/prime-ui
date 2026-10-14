/**
 * Component page standard: the single source for page kinds, the example slot vocabulary and the
 * slot order of every kind. `ComponentPage` renders from it, every `COMPONENT.md` declares its
 * `**Kind:**`, and `src/test/docs-contract.test.ts` checks pages, examples and docs against it.
 *
 * A page kind is the shape of a component (what a reader needs to see), not its sidebar category:
 * `PLAYGROUND_NAV_CATEGORIES` (`playground/categories.ts`) stays navigation only.
 *
 * The comparison slots (`variants`, `sizes`, `states`, `with-icon`) of every kind are matrices of
 * labelled cells: `matrix` for specimens with an intrinsic width, `matrix-wide` for specimens as
 * wide as their container (navigation, composites). A layout region fills the box it is given,
 * so its comparison slots are whole regions one under another (`stack`).
 */
import type { ExampleFramePreviewLayout } from "@/components/example-frame/ExampleFrame";
import type { ApiPart } from "../scripts/docs/componentApi";
import { triadsOf } from "../scripts/docs/contractLists";

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

/*
 * What each kind shows:
 * - primitive: a visual element defined by its variant / tone / color, size and state matrices;
 * - control: picks a value in place — value, group, states and the controlled pair;
 * - field: label, hint, error, required / optional, states, controlled, in a form;
 * - overlay: trigger and content, structure, size / placement, dismiss, controlled open;
 * - navigation: active item, orientation, overflow, controlled value;
 * - composite: the full typical scenario first, then features, states, narrow width;
 * - layout: the region in a page context and its responsive behaviour.
 *
 * The `screen` slot closes the page of a component that a whole screen is built around (field,
 * overlay, navigation, composite, layout): one working page, full width, in an app-panel stage.
 */

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
  "screen",
] as const;
export type SlotId = (typeof SLOT_IDS)[number];

/** Russian title of each slot on the playground page; the comment is what its example contains. */
export const SLOT_TITLES: Record<SlotId, string> = {
  /** Typical usage with defaults — the code a consumer copies first. No decorative extras. */
  overview: "Обзор",
  /** Every value of `variant` × `tone` (or `color`) as a labelled matrix. */
  variants: "Варианты",
  /** Every `size` value, xs → xl, labelled by its value. */
  sizes: "Размеры",
  /** Every state side by side (disabled, readOnly, loading, invalid, empty…), labelled by the prop. */
  states: "Состояния",
  /** Icon slots: leading / trailing icon and the icon-only form. */
  "with-icon": "С иконкой",
  /** Optional parts switched on and off: icon, description, body, footer, header only. */
  structure: "Структура",
  /** Several items under one group label, with the group's hint and error. */
  group: "Группа",
  /** Every `orientation` value. */
  orientation: "Ориентация",
  /** Every `side` / `align` value relative to the trigger or the screen edge. */
  placement: "Расположение",
  /** More items than fit: scrolling, collapsing or truncation. */
  overflow: "Переполнение",
  /** `required`, `optional`, `hint`, `error` and how the support row behaves. */
  validation: "Валидация",
  /** `closeOnOutsideClick`, `closeOnEscape` and the close parts, incl. a destructive confirm. */
  dismiss: "Закрытие",
  /** `value` / `checked` owned by the parent and changed from outside. */
  controlled: "Управляемое значение",
  /** `open` / `onOpenChange` owned by the parent, opened from code without a trigger. */
  "controlled-open": "Управляемое открытие",
  /** Inside a real `<form>` with a label, validation and a submit button. */
  "in-form": "В форме",
  /** Behaviour in a narrow container (≤ 360px): wrapping, stacking, scrolling. */
  narrow: "Узкая ширина",
  /**
   * A whole working screen built around the component (list page, dashboard, messenger…): the page
   * a consumer starts from. Its own `screen.module.css` lays the page out.
   */
  screen: "Экран",
};

/** Position of component-specific scenarios inside a kind's slot order. */
export const SCENARIOS = "scenarios";

export type KindSlot = {
  slot: SlotId | typeof SCENARIOS;
  /**
   * The page must have this slot whatever its API. Prop-driven requirements (`controlled` for a
   * field with a value, `variants` for a field with `variant`…) come from `PROP_SLOTS`.
   */
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
    // A primitive that may be selected (a Thumbnail tile of a media library).
    { slot: "controlled", layout: "stack" },
    // A primitive that opens a viewer of its own (Gallery and its MediaViewer).
    { slot: "controlled-open", layout: "stack" },
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
    { slot: "variants", layout: "matrix" },
    { slot: "sizes", required: true, layout: "matrix" },
    { slot: "states", required: true, layout: "matrix" },
    { slot: "validation", required: true, layout: "stack-narrow" },
    { slot: "with-icon", layout: "matrix" },
    { slot: SCENARIOS, layout: "stack-narrow" },
    // A field with a floating panel (Select, TagSelect, Datepicker): its dismiss props.
    { slot: "dismiss", layout: "stack-narrow" },
    { slot: "controlled", layout: "stack-narrow" },
    { slot: "controlled-open", layout: "stack-narrow" },
    { slot: "in-form", required: true, layout: "stack" },
    { slot: "narrow", layout: "stack" },
    { slot: "screen", layout: "full" },
  ],
  overlay: [
    { slot: "overview", required: true, layout: "default" },
    { slot: "structure", layout: "row" },
    { slot: "variants", layout: "matrix" },
    { slot: "sizes", layout: "matrix" },
    { slot: "placement", layout: "row" },
    { slot: "states", layout: "matrix" },
    { slot: SCENARIOS, layout: "row" },
    { slot: "dismiss", layout: "row" },
    { slot: "controlled", layout: "row" },
    { slot: "controlled-open", layout: "row" },
    { slot: "in-form", layout: "default" },
    { slot: "screen", layout: "full" },
  ],
  navigation: [
    { slot: "overview", required: true, layout: "stack" },
    { slot: "variants", layout: "matrix-wide" },
    { slot: "sizes", layout: "matrix-wide" },
    { slot: "states", layout: "matrix-wide" },
    { slot: "with-icon", layout: "matrix-wide" },
    { slot: "orientation", layout: "stack" },
    { slot: "overflow", layout: "stack" },
    { slot: SCENARIOS, layout: "stack" },
    { slot: "controlled", layout: "stack" },
    { slot: "narrow", layout: "stack" },
    { slot: "screen", layout: "full" },
  ],
  composite: [
    { slot: "overview", required: true, layout: "stack" },
    { slot: "variants", layout: "matrix-wide" },
    { slot: "sizes", layout: "matrix-wide" },
    { slot: "structure", layout: "stack" },
    { slot: SCENARIOS, layout: "stack" },
    { slot: "states", layout: "matrix-wide" },
    { slot: "controlled", layout: "stack" },
    { slot: "narrow", required: true, layout: "stack" },
    { slot: "screen", layout: "full" },
  ],
  layout: [
    { slot: "overview", required: true, layout: "full" },
    // A layout region fills the box it is given, so its variants and sizes are whole regions one
    // under another (each in a box the example sizes), not cells of a matrix.
    { slot: "variants", layout: "stack" },
    { slot: "sizes", layout: "stack" },
    { slot: "structure", layout: "full" },
    { slot: SCENARIOS, layout: "full" },
    { slot: "dismiss", layout: "full" },
    { slot: "controlled", layout: "full" },
    { slot: "controlled-open", layout: "full" },
    { slot: "narrow", layout: "full" },
    { slot: "screen", layout: "full" },
  ],
};

/**
 * Slots a page must have because of a prop axis on its root (first API table): `size` → sizes,
 * `variant`/`tone`/`color` → variants, a state flag → states, `closeOnOutsideClick` → dismiss.
 * Controllable state comes from the triads (`requiredSlots`): a bare `value` (ProgressBar) or
 * `open` has nothing to control.
 */
export const PROP_SLOTS: { props: string[]; slot: SlotId }[] = [
  { props: ["size"], slot: "sizes" },
  { props: ["variant", "tone", "color"], slot: "variants" },
  { props: ["disabled", "readOnly", "loading", "invalid"], slot: "states" },
  { props: ["closeOnOutsideClick"], slot: "dismiss" },
];

export type SlotRequirement = {
  slot: SlotId;
  /** `kind` when the kind requires it, else the first root prop that does. */
  by: string;
  /**
   * The root props the slot's example may name to show why it is there: every prop that requires
   * the slot (`disabled` or `loading` for states; `x` or `onXChange` of every triad for
   * controlled). Empty when the kind requires the slot.
   */
  shownBy: string[];
};

/**
 * Every slot a page of `kind` must have, with the reason (the kind or the root props). A triad on
 * the root (`x` / `defaultX` / `onXChange`, scanned like the API vocabulary) requires
 * `controlled-open` for `open` and `controlled` for any other state.
 */
export function requiredSlots(kind: PageKind, root: ApiPart | undefined): SlotRequirement[] {
  const rootProps = (root?.props ?? []).map((prop) => prop.name);
  const required = new Map<SlotId, SlotRequirement>();
  for (const entry of KIND_SLOTS[kind]) {
    if (entry.required && entry.slot !== SCENARIOS) {
      required.set(entry.slot, { slot: entry.slot, by: "kind", shownBy: [] });
    }
  }
  const requireBy = (slot: SlotId, props: string[]) => {
    const current = required.get(slot);
    if (current?.by === "kind") return;
    if (current) current.shownBy.push(...props);
    else required.set(slot, { slot, by: props[0], shownBy: [...props] });
  };
  for (const { props, slot } of PROP_SLOTS) {
    const present = props.filter((name) => rootProps.includes(name));
    if (present.length > 0) requireBy(slot, present);
  }
  for (const state of root ? triadsOf(root) : []) {
    const slot: SlotId = state === "open" ? "controlled-open" : "controlled";
    requireBy(slot, [`on${state.charAt(0).toUpperCase()}${state.slice(1)}Change`, state]);
  }
  return [...required.values()];
}

/** The preview layouts a kind's pages use: what a component-specific scenario may pick. */
export function kindLayouts(kind: PageKind): ExampleFramePreviewLayout[] {
  return [...new Set(KIND_SLOTS[kind].map((entry) => entry.layout))];
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
