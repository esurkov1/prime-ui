import { afterEach, describe, expect, it, vi } from "vitest";

import { leaveInPlace } from "./leaveInPlace";

type FakeAnimation = { keyframes: Keyframe[]; finish: () => void };

function stubAnimate() {
  const made: FakeAnimation[] = [];
  const animate = vi.fn(function (this: HTMLElement, keyframes: Keyframe[]) {
    const listeners = new Map<string, () => void>();
    const animation = {
      keyframes,
      addEventListener: (type: string, listener: () => void) => listeners.set(type, listener),
      finish: () => listeners.get("finish")?.(),
    };
    made.push(animation);
    return animation as unknown as Animation;
  });
  HTMLElement.prototype.animate = animate as unknown as HTMLElement["animate"];
  // Tests run with reduced motion on; this one covers the motion itself.
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
  return made;
}

afterEach(() => {
  vi.unstubAllGlobals();
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
});

describe("leaveInPlace", () => {
  it("leaves an inert, hidden copy in the node's place that closes up and goes", async () => {
    const made = stubAnimate();
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
    expect(made[0]?.keyframes[1]).toMatchObject({ opacity: 0, width: "0px" });

    made[0]?.finish();
    expect(parent.children).toHaveLength(2);
    parent.remove();
  });

  it("does nothing when the node stays (a replayed unmount)", async () => {
    stubAnimate();
    const parent = document.createElement("ul");
    const row = document.createElement("li");
    parent.append(row);
    document.body.append(parent);
    leaveInPlace(row, "block");
    await Promise.resolve();
    expect(parent.children).toHaveLength(1);
    parent.remove();
  });
});
