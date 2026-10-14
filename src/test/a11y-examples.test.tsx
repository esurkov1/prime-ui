/**
 * a11y at runtime: every example and screen of every component is rendered, and its DOM must
 * name what assistive tech needs named.
 * - Every element of a role that requires a name (a button, a field, a dialog…) has one.
 * - Every ID reference (`aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-owns`,
 *   `aria-activedescendant`, `for`) points at an element in the document.
 * - No `aria-label` sits on a generic element (a `div` / `span` with no role), where it names
 *   nothing.
 */
import { cleanup, render } from "@testing-library/react";
import { computeAccessibleName, getRole } from "dom-accessibility-api";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import { NotificationProvider } from "../components/notification/NotificationStore";
import { componentDirs } from "./contract-utils";

const examples = import.meta.glob<{ default: React.ComponentType }>(
  "../{components,layout}/*/examples/*.tsx",
);

/** Roles that must have an accessible name (WAI-ARIA "name required"). */
const NAMED_ROLES = new Set([
  "button",
  "checkbox",
  "combobox",
  "dialog",
  "alertdialog",
  "img",
  "link",
  "listbox",
  "menu",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "option",
  "progressbar",
  "radio",
  "radiogroup",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "tabpanel",
  "textbox",
  "toolbar",
  "tree",
  "treeitem",
]);

const IDREF_ATTRIBUTES = [
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-owns",
  "aria-activedescendant",
  "aria-errormessage",
  "for",
];

/** Elements hidden from assistive tech are not checked. */
const hidden = (element: Element) =>
  element.closest('[aria-hidden="true"], [hidden], [inert]') !== null;

function issuesOf(file: string, root: HTMLElement): string[] {
  const issues = new Set<string>();
  for (const element of Array.from(root.ownerDocument.body.querySelectorAll("*"))) {
    if (hidden(element)) continue;
    const role = getRole(element);
    if (role && NAMED_ROLES.has(role) && computeAccessibleName(element).trim() === "") {
      issues.add(`${file}: unnamed ${role}`);
    }
    for (const attribute of IDREF_ATTRIBUTES) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      for (const id of value.split(/\s+/).filter(Boolean)) {
        if (!root.ownerDocument.getElementById(id)) issues.add(`${file}: dangling ${attribute}`);
      }
    }
    if (
      element.hasAttribute("aria-label") &&
      !element.hasAttribute("role") &&
      (element.tagName === "DIV" || element.tagName === "SPAN")
    ) {
      issues.add(`${file}: aria-label on a generic ${element.tagName.toLowerCase()}`);
    }
  }
  return [...issues];
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

describe("examples name what assistive tech needs", () => {
  it.each(componentDirs())("$rel", async ({ base, dir, rel }) => {
    const offenders: string[] = [];
    const prefix = `../${base}/${dir}/examples/`;
    for (const [key, load] of Object.entries(examples)) {
      if (!key.startsWith(prefix)) continue;
      const file = `${rel}/examples/${key.slice(prefix.length)}`;
      const { default: Example } = await load();
      const { container } = render(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(NotificationProvider, null, React.createElement(Example)),
        ),
      );
      offenders.push(...issuesOf(file, container));
      cleanup();
    }
    expect(offenders, "a11y-examples").toEqual([]);
  }, 60_000);
});
