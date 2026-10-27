/**
 * A state moves in place: no state change remounts a component or any of its parts. Every
 * component's overview and states examples are rendered, and every state prop of every part its
 * `api.ts` documents (`disabled`, `loading`, `invalid`, `checked`, `open`, `error`…) is flipped
 * on → off → on on every instance of that part, in four contexts:
 * - directly;
 * - under a tooltip: each instance of each part that renders an element is the child of a real
 *   `Tooltip.Trigger` (which used to re-parent a disabled control into a focusable host);
 * - inside a `Fieldset` whose `disabled` flips (the props stay as the example wrote them);
 * - inside a flipping `Fieldset` and under a tooltip.
 * After every flip, each control (a button, a field, an element with a role or a tab stop) and each
 * part element present before is the same node — one that left while an equal one (tag and role)
 * came, or while another element took its place, is a remount — and a focused control keeps
 * focus. Inside a flipped `Fieldset` every native control is disabled (natively, or reachable and
 * out of the form). A swap through the kit's engines is no remount: an optional part that leaves
 * (`usePartPresence`) has no newcomer, a state `RegionSwap` / `useSwapIn` swaps in or out, a
 * Skeleton (`aria-hidden`), a glyph (`GlyphSwap`), a still copy or a leaving state (`inert`).
 *
 * The props reach the parts without editing an example: the JSX runtime is wrapped, and every
 * element of a part under test takes the flipped prop, a ref that records its node and, under a
 * tooltip, a `Tooltip.Root` around it. A new component is covered by its `api.ts` and examples.
 */
import { act, cleanup, render } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import type { ComponentApi } from "../../scripts/docs/componentApi";
import * as colorPickerEntry from "../color-picker";
import { Fieldset } from "../components/fieldset/Fieldset";
import { NotificationProvider } from "../components/notification/NotificationStore";
import { Tooltip } from "../components/tooltip/Tooltip";
import * as kit from "../index";
import regionSwap from "../internal/RegionSwap.module.css";
import swapMotion from "../internal/swapMotion.module.css";
import { componentDirs } from "./contract-utils";

type Props = Record<string, unknown>;

/** What the wrapped JSX runtime applies; set by the test, read on every element created. */
const harness = vi.hoisted(() => ({
  /** Props merged into every element of a type. */
  overrides: new Map<unknown, Props>(),
  /** Types whose elements record their node. */
  tracked: new Map<unknown, (node: unknown) => void>(),
  /** Types whose elements stand under a tooltip. */
  tooltip: new Set<unknown>(),
  /** Types an element was created of since the last reset. */
  hits: new Set<unknown>(),
  /** Renders a tooltip around an element (set below, once the kit is loaded). */
  wrap: null as null | ((type: unknown, props: Props, key: unknown) => unknown),
}));

vi.mock("react/jsx-dev-runtime", async (importOriginal) => {
  const real = await importOriginal<typeof import("react/jsx-dev-runtime")>();
  const jsxDEV = real.jsxDEV as (...args: unknown[]) => unknown;
  return {
    ...real,
    jsxDEV: (type: unknown, config: Props, key: unknown, ...rest: unknown[]) => {
      harness.hits.add(type);
      let props = config;
      const override = harness.overrides.get(type);
      if (override) props = { ...props, ...override };
      const record = harness.tracked.get(type);
      if (record) {
        const own = props.ref;
        props = {
          ...props,
          ref: (node: unknown) => {
            record(node);
            if (typeof own === "function") return own(node);
            if (own && typeof own === "object") (own as { current: unknown }).current = node;
          },
        };
      }
      if (harness.tooltip.has(type) && harness.wrap) return harness.wrap(type, props, key);
      return jsxDEV(type, props, key, ...rest);
    },
  };
});

const apis = import.meta.glob<{ api: ComponentApi }>("../{components,layout}/*/api.ts", {
  eager: true,
});
const examples = import.meta.glob<{ default: React.ComponentType }>(
  "../{components,layout}/*/examples/{overview,states}.tsx",
);

/** The state props flipped, with their on and off values. */
const STATES: Record<string, [unknown, unknown]> = {
  disabled: [true, false],
  loading: [true, false],
  invalid: [true, false],
  readOnly: [true, false],
  required: [true, false],
  checked: [true, false],
  indeterminate: [true, false],
  pressed: [true, false],
  selected: [true, false],
  current: [true, false],
  valid: [true, false],
  success: [true, false],
  locked: [true, false],
  busy: [true, false],
  dirty: [true, false],
  open: [true, false],
  error: ["Проверьте значение", undefined],
};

/**
 * The open state of a layer: opening takes focus into it, and its panel mounts and unmounts in a
 * portal (the layer's own open / close motion).
 */
const MOVES_FOCUS = new Set(["open"]);

/** The tooltip of the tooltip contexts never wraps its own parts. */
const TOOLTIP_PARTS = new Set<unknown>(Object.values(Tooltip));

/** Parts a tooltip cannot stand around, each with its reason. */
const NO_TOOLTIP: Record<string, string> = {
  // The root numbers its direct `Stepper.Item` children; a tooltip goes inside an item (an `<li>`).
  "Stepper.Item": "the root numbers its direct items",
};

/** A control: what a person or assistive tech reaches, and what must stay the same node. */
const CONTROL =
  'button, input, select, textarea, a[href], [tabindex], [role]:not([role="presentation"]):not([role="none"])';

const entries: Record<string, unknown> = { ...kit, ...colorPickerEntry };

/** `Button.Root` → the exported part; `Kbd` → the leaf. */
function resolvePart(name: string): unknown {
  const [head, tail] = name.split(".");
  const owner = entries[head] as Record<string, unknown> | undefined;
  if (!owner) return undefined;
  return tail ? owner[tail] : owner;
}

/** A flag flips between booleans, `error` between a message and none. */
const fits = (prop: string, type: string) =>
  prop === "error" ? /ReactNode|string/.test(type) : type === "boolean";

type Subject = { name: string; type: unknown; props: string[] };

function subjectsOf(api: ComponentApi): Subject[] {
  return api.parts.flatMap((part) =>
    part.name.split(" · ").flatMap((name) => {
      const type = resolvePart(name.trim());
      if (!type) return [];
      const props = part.props
        .filter((prop) => prop.name in STATES && fits(prop.name, prop.type))
        .map((prop) => prop.name);
      return [{ name: name.trim(), type, props }];
    }),
  );
}

let version = 0;
const listeners = new Set<() => void>();
const bump = () => {
  version += 1;
  for (const listener of listeners) listener();
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** The flipping `Fieldset` of the fieldset contexts. */
const fieldset = { on: false, disabled: false };

function Stage({ Example }: { Example: React.ComponentType }) {
  React.useSyncExternalStore(
    subscribe,
    () => version,
    () => version,
  );
  const content = (
    <MemoryRouter>
      <NotificationProvider>
        <Example />
      </NotificationProvider>
    </MemoryRouter>
  );
  return fieldset.on ? <Fieldset disabled={fieldset.disabled}>{content}</Fieldset> : content;
}

harness.wrap = (type, props, key) => (
  <Tooltip.Root key={key as React.Key}>
    <Tooltip.Trigger>{React.createElement(type as React.ElementType, props)}</Tooltip.Trigger>
    <Tooltip.Content>Подсказка</Tooltip.Content>
  </Tooltip.Root>
);

class Boundary extends React.Component<
  { onError: (error: unknown) => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

/**
 * The controls in `scope`, outside still copies and leaving states (`inert`): those are on their
 * way out.
 */
function controls(scope: Element): Set<Element> {
  return new Set(
    Array.from(scope.querySelectorAll(CONTROL)).filter(
      (element) => element.closest("[inert]") === null,
    ),
  );
}

const signature = (element: Element) =>
  `${element.tagName.toLowerCase()}${element.getAttribute("role") ? `[role=${element.getAttribute("role")}]` : ""}`;

/** A control as a reader finds it: its tag, role and name. */
const nameOf = (element: Element) =>
  `${signature(element)} «${(element.getAttribute("aria-label") ?? element.textContent ?? "").trim().slice(0, 40)}»`;

/** A state the region swap engine swapped in: a `RegionSwap` layer, a `useSwapIn` element. */
const SWAPPED_IN = [regionSwap.layer, swapMotion.swapIn, swapMotion.settleIn]
  .map((name) => `.${name}`)
  .join(", ");

/** The swapped-in states on the page. */
const swapsOnPage = () => new Set(document.body.querySelectorAll(SWAPPED_IN));

type Place = { parent: Element; siblings: Set<Element> };

/** Where each element stands: its parent and the parent's children then. */
function placesOf(nodes: Set<Element>): Map<Element, Place> {
  const places = new Map<Element, Place>();
  for (const node of nodes) {
    const parent = node.parentElement;
    if (parent) places.set(node, { parent, siblings: new Set(parent.children) });
  }
  return places;
}

/** A newcomer that is no remount: decorative, or a state the region swap engine swapped in. */
function sanctioned(element: Element, swapsBefore: Set<Element>): boolean {
  // A decorative newcomer is no equal of a part: a Skeleton that holds the data's place.
  if (!element.matches(CONTROL) && element.closest('[aria-hidden="true"]')) return true;
  // The region swap engine remounts the state it swaps in (`RegionSwap`, `useSwapIn`).
  const swapped = element.closest(SWAPPED_IN);
  return swapped !== null && !swapsBefore.has(swapped);
}

/** Elements of `before` replaced in `after`: by an equal newcomer, or another in their place. */
function replaced(
  before: Set<Element>,
  after: Set<Element>,
  swapsBefore: Set<Element>,
  places: Map<Element, Place>,
): Element[] {
  const fresh = new Map<string, number>();
  for (const element of after) {
    if (before.has(element) || sanctioned(element, swapsBefore)) continue;
    fresh.set(signature(element), (fresh.get(signature(element)) ?? 0) + 1);
  }
  const out: Element[] = [];
  for (const element of before) {
    if (element.isConnected) continue;
    // It left with the swapped state it stood in.
    const state = element.closest(SWAPPED_IN);
    if (state && (!state.isConnected || state.closest("[inert]"))) continue;
    const key = signature(element);
    const left = fresh.get(key) ?? 0;
    if (left > 0) {
      fresh.set(key, left - 1);
      out.push(element);
      continue;
    }
    // Another element in its place: the element type switched with the state.
    const place = places.get(element);
    if (!place?.parent.isConnected) continue;
    const newcomer = Array.from(place.parent.children).some(
      (child) => !place.siblings.has(child) && !sanctioned(child, swapsBefore),
    );
    if (newcomer) out.push(element);
  }
  return out;
}

/**
 * The native controls inside the outer `Fieldset` that its `disabled` did not reach: natively
 * disabled, or reachable (`aria-disabled`) — then a field has no `name` and no `required`, so the
 * form neither submits nor validates it.
 */
function enabledInside(): Element[] {
  const group = document.body.querySelector("fieldset");
  if (!group) return [];
  return Array.from(group.querySelectorAll("button, input, select, textarea")).filter(
    (control) =>
      control.closest("[inert]") === null &&
      !control.matches(":disabled") &&
      !(
        control.getAttribute("aria-disabled") === "true" &&
        (control.tagName === "BUTTON" ||
          (!control.hasAttribute("name") && !control.hasAttribute("required")))
      ),
  );
}

/** The first control a person could focus. */
function focusable(nodes: Set<Element>): HTMLElement | undefined {
  for (const node of nodes) {
    if (!(node instanceof HTMLElement) || !node.isConnected) continue;
    if (node.matches(":disabled") || node.tabIndex < 0) continue;
    return node;
  }
  return undefined;
}

type Context = { name: string; tooltip: boolean; fieldset: boolean };

const CONTEXTS: Context[] = [
  { name: "direct", tooltip: false, fieldset: false },
  { name: "tooltip", tooltip: true, fieldset: false },
  { name: "fieldset", tooltip: false, fieldset: true },
  { name: "fieldset + tooltip", tooltip: true, fieldset: true },
];

async function checkExample(
  file: string,
  Example: React.ComponentType,
  subjects: Subject[],
  context: Context,
  /** Part types that render an element (from the direct run): the ones a tooltip can wrap. */
  elementParts: Set<unknown>,
): Promise<string[]> {
  const offenders = new Set<string>();
  const parts = new Map<Element, string>();
  harness.overrides.clear();
  harness.tracked.clear();
  harness.tooltip.clear();
  harness.hits.clear();
  for (const subject of subjects) {
    harness.tracked.set(subject.type, (node) => {
      if (node instanceof Element) {
        parts.set(node, subject.name);
        elementParts.add(subject.type);
      }
    });
    if (
      context.tooltip &&
      elementParts.has(subject.type) &&
      !TOOLTIP_PARTS.has(subject.type) &&
      !(subject.name in NO_TOOLTIP)
    ) {
      harness.tooltip.add(subject.type);
    }
  }
  fieldset.on = context.fieldset;
  fieldset.disabled = false;
  const errors: unknown[] = [];
  const { container } = render(
    <Boundary onError={(error) => errors.push(error)}>
      <Stage Example={Example} />
    </Boundary>,
  );
  await settle();
  if (errors.length > 0) {
    cleanup();
    return [`${file} [${context.name}]: throws ${String(errors[0])}`];
  }

  // A layer that opens and closes (`open`) mounts and unmounts its panel in a portal: only what
  // stays in the page is held to its node.
  const snapshot = (layers: boolean) => {
    const scope = layers ? container : document.body;
    const nodes = controls(scope);
    for (const [node] of parts) {
      if (node.isConnected && scope.contains(node) && node.closest("[inert]") === null) {
        nodes.add(node);
      }
    }
    return nodes;
  };
  const flip = async (label: string, change: () => void, keepsFocus: boolean) => {
    const layers = !keepsFocus;
    const before = snapshot(layers);
    const places = placesOf(before);
    const swapsBefore = swapsOnPage();
    const focused = keepsFocus ? focusable(before) : undefined;
    focused?.focus();
    const hadFocus = focused !== undefined && document.activeElement === focused;
    change();
    await act(async () => bump());
    await settle();
    const after = snapshot(layers);
    for (const element of replaced(before, after, swapsBefore, places)) {
      // The part the element is (or the innermost part it sits in).
      let owner: string | undefined;
      for (const [node, name] of parts) {
        if (node === element) owner = name;
        else if (!owner && node.contains(element)) owner = name;
      }
      offenders.add(
        `${file} [${context.name}] ${label}: ${signature(element)}${owner ? ` of ${owner}` : ""} remounted`,
      );
    }
    // A control a region swap took out with its leaving state hands focus on (`RegionSwap`).
    const leaving = focused?.closest("[inert]") != null;
    if (hadFocus && focused.isConnected && !leaving && document.activeElement !== focused) {
      offenders.add(`${file} [${context.name}] ${label}: focus lost from ${signature(focused)}`);
    }
  };

  if (context.fieldset) {
    for (const value of [true, false, true]) {
      await flip(`Fieldset disabled=${value}`, () => (fieldset.disabled = value), true);
      if (value) {
        for (const control of enabledInside()) {
          offenders.add(
            `${file} [${context.name}] Fieldset disabled: ${nameOf(control)} stays enabled`,
          );
        }
      }
    }
  } else {
    for (const subject of subjects) {
      if (!harness.hits.has(subject.type)) continue;
      for (const prop of subject.props) {
        const [on, off] = STATES[prop];
        const keepsFocus = !MOVES_FOCUS.has(prop);
        // Set up at «off» first: a triad prop the example leaves out (`checked`, `pressed`) turns
        // its mode on once given at all, which is no state change.
        harness.overrides.set(subject.type, { [prop]: off });
        await act(async () => bump());
        await settle();
        for (const value of [on, off, on]) {
          await flip(
            `${subject.name} ${prop}=${String(value)}`,
            () => harness.overrides.set(subject.type, { [prop]: value }),
            keepsFocus,
          );
        }
        harness.overrides.delete(subject.type);
        await act(async () => bump());
        await settle();
      }
    }
  }
  if (errors.length > 0) offenders.add(`${file} [${context.name}]: throws ${String(errors[0])}`);
  cleanup();
  harness.overrides.clear();
  harness.tracked.clear();
  harness.tooltip.clear();
  return [...offenders];
}

/** jsdom has no IntersectionObserver; a lazily loaded tile never comes into view here. */
class StubIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  if (typeof IntersectionObserver === "undefined") {
    vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);
  }
});

describe("a state change moves in place, it never remounts", () => {
  it.each(componentDirs())("$rel", async ({ base, dir, rel }) => {
    const api = apis[`../${base}/${dir}/api.ts`]?.api;
    expect(api, `${rel}: api.ts`).toBeDefined();
    const subjects = subjectsOf(api as ComponentApi);
    const offenders: string[] = [];
    const prefix = `../${base}/${dir}/examples/`;
    for (const [key, load] of Object.entries(examples)) {
      if (!key.startsWith(prefix)) continue;
      const file = `${rel}/examples/${key.slice(prefix.length)}`;
      const { default: Example } = await load();
      const elementParts = new Set<unknown>();
      for (const context of CONTEXTS) {
        offenders.push(...(await checkExample(file, Example, subjects, context, elementParts)));
      }
    }
    expect(offenders, "state-stability").toEqual([]);
  }, 120_000);

  it("names only parts that exist in NO_TOOLTIP", () => {
    expect(Object.keys(NO_TOOLTIP).filter((part) => resolvePart(part) === undefined)).toEqual([]);
  });
});
