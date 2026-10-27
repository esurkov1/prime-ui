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
 * - `fold` — the secondary buttons fold into «⋯» (only when that is narrower than their icons).
 *
 * Past the last step a heading with a path stacks (`stackHeading`): the path over the title, the
 * title and the description wrapping, so no line of it is cut to a fragment. Without a path the
 * heading truncates.
 *
 * The plan holds against small changes (`margin`): a bar short of room by less than the margin
 * keeps its step while the heading truncates by that much, and a looser step comes back only once
 * it fits with the margin to spare. A label that changes by a word, or a resize across a step, so
 * never flips the row back and forth.
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
  /**
   * Natural width of the heading's title line (path, title, badges); 0 — none. The description
   * under it truncates in whatever room the line leaves, so it claims no width of its own.
   */
  heading: number;
  /** Whether the heading starts with a path (a Breadcrumb before the title): it can stack. */
  path: boolean;
  /** Natural width of the tools on one line; 0 — none. */
  tools: number;
  actions: BarAction[];
  /** Width of the «⋯» button. */
  more: number;
  /** Gap between the heading, the tools and the actions. */
  gap: number;
  /** Gap between two actions. */
  actionGap: number;
  /** How far the bar may run short or long of a step before the plan leaves it. */
  margin: number;
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

const RANK: Record<BarPlan, number> = {
  one: 0,
  below: 1,
  "icons-secondary": 2,
  icons: 3,
  fold: 4,
};

/** The first plan whose first line fits `available`; the narrowest of `icons` and `fold` when none does. */
function firstFit(widths: BarWidths, available: number): BarPlan {
  const { heading, tools, gap } = widths;
  const fits = (actions: number, withTools = false) =>
    sum(withTools ? [heading, tools, actions] : [heading, actions], gap) <= available;
  if (fits(actionsWidth(widths, "full"), true)) return "one";
  if (fits(actionsWidth(widths, "full"))) return "below";
  if (fits(actionsWidth(widths, "icons-secondary"))) return "icons-secondary";
  const icons = actionsWidth(widths, "icons");
  if (fits(icons)) return "icons";
  // «⋯» in place of a single icon button saves nothing: the button keeps its icon.
  return actionsWidth(widths, "fold") < icons ? "fold" : "icons";
}

/**
 * The plan at `available`, given the plan the bar has now (`current`; none on the first layout).
 * Short of room, the bar keeps `current` while the heading can give the shortfall — up to the
 * margin, at most half its own width (it truncates); with room to spare, a looser plan comes back
 * only once it fits with the margin left over.
 */
export function planBar(widths: BarWidths, available: number, current?: BarPlan): BarPlan {
  const fresh = firstFit(widths, available);
  if (current === undefined || fresh === current) return fresh;
  if (RANK[fresh] > RANK[current]) {
    const give = Math.min(widths.margin, widths.heading / 2);
    const loose = firstFit(widths, available + give);
    return RANK[loose] > RANK[current] ? loose : current;
  }
  const tight = firstFit(widths, available - widths.margin);
  return RANK[tight] < RANK[current] ? tight : current;
}

const PLAN_STEP: Record<BarPlan, ActionStep> = {
  one: "full",
  below: "full",
  "icons-secondary": "icons-secondary",
  icons: "icons",
  fold: "fold",
};

/**
 * Whether the heading stacks at `plan`: it has a path, `plan` is the last step, and the heading's
 * line still does not fit beside the actions.
 */
export function stackHeading(widths: BarWidths, available: number, plan: BarPlan): boolean {
  if (!widths.path || plan !== firstFit(widths, 0)) return false;
  const tools = plan === "one" ? widths.tools : 0;
  return (
    sum([widths.heading, tools, actionsWidth(widths, PLAN_STEP[plan])], widths.gap) > available
  );
}
