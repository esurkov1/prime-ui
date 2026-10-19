import { describe, expect, it } from "vitest";

import { stillCopy } from "./stillCopy";

describe("stillCopy", () => {
  it("copies a node with every motion off, no ids, hidden and inert", () => {
    const node = document.createElement("div");
    node.id = "card";
    node.className = "enter";
    node.innerHTML = '<span id="title" class="enter">Счёт</span><svg><path class="drawn"/></svg>';

    const copy = stillCopy(node, true);

    expect(copy).not.toBe(node);
    expect(copy.textContent).toBe("Счёт");
    expect(copy.className).toBe("enter");
    for (const element of [copy, ...copy.querySelectorAll<HTMLElement | SVGElement>("*")]) {
      expect(element.id).toBe("");
      expect(element.style.getPropertyValue("animation")).toBe("none");
      expect(element.style.getPropertyPriority("animation")).toBe("important");
      expect(element.style.getPropertyValue("transition")).toBe("none");
    }
    expect(copy).toHaveAttribute("aria-hidden", "true");
    expect(copy.inert).toBe(true);
    // The original keeps its own motion and identity.
    expect(node.id).toBe("card");
    expect(node.style.getPropertyValue("animation")).toBe("");
  });

  it("a shallow copy is an empty still shell", () => {
    const node = document.createElement("section");
    node.append(document.createElement("p"));
    const shell = stillCopy(node, false);
    expect(shell.childElementCount).toBe(0);
    expect(shell.style.getPropertyValue("animation")).toBe("none");
  });
});
