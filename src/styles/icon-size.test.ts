/**
 * An icon takes its size from the host tier through `--prime-icon-size` (the `Icon` reads it,
 * `src/internal/iconBox` sets it), never from an `svg` type selector in a component's CSS: such a
 * rule resizes every glyph inside, the consumer's included. The files below draw their own SVG,
 * or only move an icon (a transform, a transition), and may select it.
 *
 * In ratchet mode (`icon-size`): the selectors found when the guard landed are the baseline.
 */
import { cssRules, moduleCssFiles } from "../test/css";
import { numbered, ratchet } from "../test/ratchet";

/** Stylesheets that may select `svg`, with the reason. */
const ALLOWED: Record<string, string> = {
  "src/internal/iconBox.module.css": "the icon box itself sets the glyph size",
  "src/internal/ring.module.css": "the ring is the kit's own svg drawing",
  "src/internal/CheckMark.module.css": "the check mark is the kit's own svg drawing",
  "src/components/progress-circle/ProgressCircle.module.css": "its own svg drawing",
  "src/components/sparkline/Sparkline.module.css": "its own svg chart",
  "src/components/chart-frame/ChartFrame.module.css": "the plot text of the consumer's svg chart",
  "src/layout/app-header/AppHeader.module.css": "the bare-svg logo slot",
  "src/components/select/Select.module.css": "the chevron only turns (transform)",
  "src/components/tag-select/TagSelect.module.css": "the chevron only turns (transform)",
};

const SVG_SELECTOR = /(^|[\s>+~(,])svg\b/;

describe("icon size", () => {
  it("component CSS never sizes icons through an svg type selector", () => {
    const offenders: string[] = [];
    for (const file of moduleCssFiles()) {
      if (file.startsWith("src/icons/") || file.includes("/examples/") || ALLOWED[file]) continue;
      for (const rule of cssRules(file)) {
        if (SVG_SELECTOR.test(rule.selector)) offenders.push(`${file}: ${rule.selector}`);
      }
    }
    ratchet("icon-size", numbered(offenders));
  });
});
