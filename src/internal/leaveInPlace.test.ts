import { describe, expect, it } from "vitest";

import { withMotion } from "@/test/motion";

import { leaveInPlace } from "./leaveInPlace";

describe("leaveInPlace", () => {
  it("leaves an inert, hidden copy in the node's place that closes up and goes", async () => {
    const motion = withMotion();
    document.documentElement.style.setProperty("--prime-motion-scale-enter", "0.96");
    document.documentElement.style.setProperty("--prime-motion-easing-exit", "ease-out");
    const parent = document.createElement("div");
    const first = document.createElement("span");
    const leaving = document.createElement("span");
    leaving.id = "chip";
    leaving.textContent = "Москва";
    const last = document.createElement("span");
    parent.append(first, leaving, last);
    document.body.append(parent);

    leaveInPlace(leaving, "inline");
    leaving.remove();
    await Promise.resolve();

    const ghost = parent.children[1] as HTMLElement;
    expect(ghost.textContent).toBe("Москва");
    expect(ghost).toHaveAttribute("aria-hidden", "true");
    expect(ghost).toHaveAttribute("data-leaving");
    expect(ghost.id).toBe("");
    expect(ghost.inert).toBe(true);
    const [animation] = motion.on(ghost);
    // The shared exit: the entering scale from the tokens, `fast` on the exit curve.
    expect((animation.keyframes as Keyframe[])[1]).toMatchObject({
      opacity: 0,
      width: "0px",
      transform: "scale(0.96)",
    });
    expect(animation.options).toMatchObject({ easing: "ease-out", fill: "forwards" });

    animation.finish();
    expect(parent.children).toHaveLength(2);
    parent.remove();
  });

  it("does nothing when the node stays (a replayed unmount)", async () => {
    withMotion();
    const parent = document.createElement("ul");
    const row = document.createElement("li");
    parent.append(row);
    document.body.append(parent);
    leaveInPlace(row, "block");
    await Promise.resolve();
    expect(parent.children).toHaveLength(1);
    parent.remove();
  });

  it("does nothing under reduced motion (the test default)", async () => {
    const parent = document.createElement("ul");
    const row = document.createElement("li");
    parent.append(row);
    document.body.append(parent);
    leaveInPlace(row, "block");
    row.remove();
    await Promise.resolve();
    expect(parent.children).toHaveLength(0);
    parent.remove();
  });
});
