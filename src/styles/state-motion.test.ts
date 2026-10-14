/**
 * State changes are continuous (foundation §1 rule 7): a property a state rule changes on an
 * element (`[data-state]`, `[aria-*]`, `:hover`, `:active`, `:checked`…) is in the transition of
 * that element's base rule, so the element glides into the state instead of flipping. A state
 * never swaps a `background-image` (it cannot interpolate).
 *
 * In ratchet mode (`state-motion`): the flips found when the guard landed are the baseline.
 */
import { cssRules, moduleCssFiles } from "../test/css";
import { numbered, ratchet } from "../test/ratchet";

/** Properties that read as a visible state change and can interpolate. */
const STATE_PROPS =
  /^(color|background-color|background|border-color|box-shadow|opacity|transform|translate|scale|rotate|fill|stroke|outline-color|filter)$/;

/** Selectors of a state a person or the data moves the element into (not a variant like `data-tone`). */
const STATE_SELECTOR =
  /\[(data-(state|selected|checked|pressed|current|open|active|highlighted|invalid|dragging|loading|expanded)|aria-(selected|checked|pressed|current|expanded|invalid))\b[^\]]*\]|:(hover|active|checked)\b/;

describe("state motion", () => {
  it("a state's changed properties are in its element's transition", () => {
    const offenders: string[] = [];
    for (const file of moduleCssFiles().filter((item) => !item.includes("/examples/"))) {
      const rules = cssRules(file);
      /** The transitioned properties of each base class (`.thumb`), from its plain rules. */
      const transitions = new Map<string, Set<string>>();
      for (const rule of rules) {
        if (!/^\.[\w-]+$/.test(rule.selector)) continue;
        for (const decl of rule.decls) {
          if (decl.prop !== "transition" && decl.prop !== "transition-property") continue;
          const names = decl.value
            .split(",")
            .map((item) => item.trim().split(/\s+/)[0] ?? "")
            .filter(Boolean);
          transitions.set(
            rule.selector,
            new Set([...(transitions.get(rule.selector) ?? []), ...names]),
          );
        }
      }
      for (const rule of rules) {
        if (rule.parents.some((parent) => parent.startsWith("@keyframes"))) continue;
        for (const selector of rule.selector.split(",").map((item) => item.trim())) {
          if (!STATE_SELECTOR.test(selector)) continue;
          // The element the state styles: the last compound's first class.
          const last =
            selector
              .split(/\s+|>|\+|~/)
              .filter(Boolean)
              .at(-1) ?? "";
          const base = last.match(/^\.([\w-]+)/)?.[0];
          if (!base || !STATE_SELECTOR.test(last)) continue;
          const moving = transitions.get(base);
          for (const decl of rule.decls) {
            if (
              decl.prop === "background-image" ||
              (/^background$/.test(decl.prop) && /gradient|url\(/.test(decl.value))
            ) {
              offenders.push(`${file}: ${base} swaps background-image in a state`);
              continue;
            }
            if (!STATE_PROPS.test(decl.prop)) continue;
            const listed =
              moving &&
              (moving.has(decl.prop) ||
                moving.has("all") ||
                (decl.prop === "background" && moving.has("background-color")));
            if (!listed) offenders.push(`${file}: ${base} flips ${decl.prop}`);
          }
        }
      }
    }
    ratchet("state-motion", numbered(offenders));
  });
});
