/**
 * The layout plan of a page's top bar: which of its steps the row takes at a given width. One
 * pure function of widths measured at their natural size, so a plan never feeds back into the
 * widths it was chosen from (no re-measure loop).
 *
 * The steps, in the order the row gives way:
 * - `one` — heading · tools · actions on one line;
 * - `below` — the tools move to a line of their own under the heading and the actions;
 * - `icons-secondary` — the secondary buttons show only their icons;
 * - `icons` — the primary button too;
 * - `fold` — the secondary buttons fold into «⋯». Past it the heading truncates.
 */
export type BarPlan = "one" | "below" | "icons-secondary" | "icons" | "fold";

/** One item of the actions: a primary or secondary Button, or anything else (never folds). */
export type BarAction = {
  role: "primary" | "secondary" | "other";
  /** Natural width with its label. */
  full: number;
  /** Width as its icon alone; `null` — it has no icon and keeps its label. */
  icon: number | null;
};

export type BarWidths = {
  /** Natural width of the heading (its widest line); 0 — none. */
  heading: number;
  /** Natural width of the tools on one line; 0 — none. */
  tools: number;
  actions: BarAction[];
  /** Width of the «⋯» button. */
  more: number;
  /** Gap between the heading, the tools and the actions. */
  gap: number;
  /** Gap between two actions. */
  actionGap: number;
};

type ActionStep = "full" | "icons-secondary" | "icons" | "fold";

function sum(parts: number[], gap: number): number {
  const present = parts.filter((part) => part > 0);
  return present.reduce((total, part) => total + part, 0) + gap * Math.max(present.length - 1, 0);
}

/** Width of the actions at a step. */
function actionsWidth(widths: BarWidths, step: ActionStep): number {
  const { actions, actionGap, more } = widths;
  const iconed = (action: BarAction, collapse: boolean) =>
    collapse && action.icon !== null ? action.icon : action.full;
  const parts = actions.flatMap((action) => {
    if (action.role === "other") return [action.full];
    if (step === "full") return [action.full];
    if (step === "icons-secondary") return [iconed(action, action.role === "secondary")];
    if (step === "icons") return [iconed(action, true)];
    return action.role === "secondary" ? [] : [iconed(action, true)];
  });
  const folds = step === "fold" && actions.some((action) => action.role === "secondary");
  return sum(folds ? [...parts, more] : parts, actionGap);
}

/** The first plan whose first line fits `available`; `fold` when none does. */
export function planBar(widths: BarWidths, available: number): BarPlan {
  const { heading, tools, gap } = widths;
  const fits = (actions: number, withTools = false) =>
    sum(withTools ? [heading, tools, actions] : [heading, actions], gap) <= available;
  if (fits(actionsWidth(widths, "full"), true)) return "one";
  if (fits(actionsWidth(widths, "full"))) return "below";
  if (fits(actionsWidth(widths, "icons-secondary"))) return "icons-secondary";
  if (fits(actionsWidth(widths, "icons"))) return "icons";
  return "fold";
}
