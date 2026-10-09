import { motionDurationMs, prefersReducedMotion } from "@/hooks/usePresence";

/**
 * The exit of a part the owner removed (a chip, a queue row): React drops the node at once, so a
 * copy of it stays in the flow at the same spot and closes up — it fades, settles a little smaller
 * and shrinks to nothing along `axis`, taking its gap with it, so the neighbours glide into the
 * place instead of jumping. Call it from a layout-effect cleanup, while the node is still drawn;
 * the copy is placed after the commit, and only if the node really left (Strict Mode replays an
 * unmount on a node that stays). Inert and hidden from assistive tech; gone when the motion ends.
 */
export function leaveInPlace(node: HTMLElement, axis: "inline" | "block") {
  const parent = node.parentElement;
  // `animate` is missing in jsdom.
  if (!parent || prefersReducedMotion() || typeof node.animate !== "function") return;
  const next = node.nextSibling;
  const rect = node.getBoundingClientRect();
  const parentStyle = getComputedStyle(parent);
  const own = getComputedStyle(node);
  // Read now: the style of a detached node is empty.
  const [padStart, padEnd] =
    axis === "inline"
      ? (["paddingInlineStart", "paddingInlineEnd"] as const)
      : (["paddingBlockStart", "paddingBlockEnd"] as const);
  const padding = [own[padStart], own[padEnd]] as const;
  const gap =
    Number.parseFloat(axis === "inline" ? parentStyle.columnGap : parentStyle.rowGap) || 0;
  const ghost = node.cloneNode(true) as HTMLElement;
  ghost.removeAttribute("id");
  for (const element of ghost.querySelectorAll("[id]")) element.removeAttribute("id");
  ghost.setAttribute("aria-hidden", "true");
  ghost.setAttribute("data-leaving", "");
  ghost.inert = true;
  ghost.style.pointerEvents = "none";
  ghost.style.overflow = "hidden";
  ghost.style.boxSizing = "border-box";
  ghost.style.flexShrink = "0";
  ghost.style[axis === "inline" ? "minWidth" : "minHeight"] = "0";

  queueMicrotask(() => {
    if (node.isConnected || !parent.isConnected) return;
    parent.insertBefore(ghost, next?.parentNode === parent ? next : null);
    const size = axis === "inline" ? "width" : "height";
    const margin = axis === "inline" ? "marginInlineEnd" : "marginBlockEnd";
    const easing = getComputedStyle(document.documentElement)
      .getPropertyValue("--prime-motion-easing-exit")
      .trim();
    const animation = ghost.animate(
      [
        {
          opacity: 1,
          transform: "scale(1)",
          [size]: `${axis === "inline" ? rect.width : rect.height}px`,
          [margin]: "0px",
          // The padding goes too: a box cannot shrink past it.
          [padStart]: padding[0],
          [padEnd]: padding[1],
        },
        {
          opacity: 0,
          transform: "scale(0.96)",
          [size]: "0px",
          [margin]: `${-gap}px`,
          [padStart]: "0px",
          [padEnd]: "0px",
        },
      ],
      {
        duration: motionDurationMs("fast"),
        ...(easing ? { easing } : {}),
        fill: "forwards",
      },
    );
    const remove = () => ghost.remove();
    animation.addEventListener("finish", remove, { once: true });
    animation.addEventListener("cancel", remove, { once: true });
  });
}
