/**
 * A copy of a node that carries none of its original's motion (foundation §7: copies never
 * animate on their own). A copy is a new element: every CSS animation it inherits from its classes
 * — the enter of a part, the slide-in of a Drawer it stands in, a drawn glyph, an `@starting-style`
 * entry — would play again from its start the moment the copy is inserted. Here every element of
 * the copy holds `animation` and `transition` off inline, so the copy only shows; the motion it
 * makes is the one its maker gives it (WAAPI on the copy, or a transition the maker turns back on
 * for its own class). Ids leave with the motion — a copy never answers to its original's identity
 * — and the copy is hidden from assistive tech and inert.
 *
 * Every copy of a rendered node in the kit is made here (`src/test/motion-ownership.test.ts`): the
 * exit copy of `leaveInPlace`, the drag copy and its host shells, a fading drop gap, a morph's
 * meta copy.
 */
export function stillCopy<E extends Element>(node: E, deep: boolean): E {
  const copy = node.cloneNode(deep) as E;
  for (const element of [copy, ...copy.querySelectorAll("*")]) {
    element.removeAttribute("id");
    if (element instanceof HTMLElement || element instanceof SVGElement) {
      element.style.setProperty("animation", "none", "important");
      element.style.setProperty("transition", "none", "important");
    }
  }
  copy.setAttribute("aria-hidden", "true");
  if (copy instanceof HTMLElement) copy.inert = true;
  return copy;
}
