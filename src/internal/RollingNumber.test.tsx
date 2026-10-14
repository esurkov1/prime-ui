import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { carryRolling, RollingNumber } from "./RollingNumber";

describe("RollingNumber", () => {
  it("keeps the real value as text and gives every digit its column", () => {
    const { container } = render(<RollingNumber>{"4 812 ₽"}</RollingNumber>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveTextContent("4 812 ₽");
    const digits = [...root.children].filter((el) =>
      (el as HTMLElement).style.getPropertyValue("--rolling-n"),
    );
    expect(digits.map((el) => (el as HTMLElement).style.getPropertyValue("--rolling-n"))).toEqual([
      "4",
      "8",
      "1",
      "2",
    ]);
  });

  it("keeps columns by their place from the right, so unchanged digits stay the same nodes", () => {
    const { container, rerender } = render(<RollingNumber>{98}</RollingNumber>);
    const root = container.firstElementChild as HTMLElement;
    const ones = root.lastElementChild;
    rerender(<RollingNumber>{108}</RollingNumber>);
    expect(root.lastElementChild).toBe(ones);
    expect(root).toHaveTextContent("108");
    expect((root.firstElementChild as HTMLElement).style.getPropertyValue("--rolling-n")).toBe("1");
  });

  it("replays a changed digit from its old value, so a moved node still rolls", () => {
    const { container, rerender } = render(<RollingNumber>{3}</RollingNumber>);
    const digit = container.querySelector<HTMLElement>("[data-rolling-digit]");
    const seen: string[] = [];
    const set = digit?.style.setProperty.bind(digit.style);
    if (digit && set) {
      digit.style.setProperty = (name: string, value: string | null) => {
        if (name === "--rolling-n") seen.push(String(value));
        set(name, value);
      };
    }
    rerender(<RollingNumber>{4}</RollingNumber>);
    // React writes 4, the replay puts 3 back for one style read, then 4 again.
    expect(seen.slice(-2)).toEqual(["3", "4"]);
    expect(digit?.style.getPropertyValue("--rolling-n")).toBe("4");
  });

  it("a carried copy takes the destination's digits from the right", () => {
    const copy = render(<RollingNumber>{12}</RollingNumber>).container;
    const destination = render(<RollingNumber>{15}</RollingNumber>).container;
    expect(carryRolling(copy, destination)).toBe(true);
    expect(copy).toHaveTextContent("15");
    const ones = copy.querySelectorAll<HTMLElement>("[data-rolling-digit]")[1];
    expect(ones?.style.getPropertyValue("--rolling-n")).toBe("5");
  });

  it("a number that grew a column rolls the shared columns and asks for a copy", () => {
    const copy = render(<RollingNumber>{9}</RollingNumber>).container;
    const destination = render(<RollingNumber>{10}</RollingNumber>).container;
    expect(carryRolling(copy, destination)).toBe(false);
    expect(copy).toHaveTextContent("0");
    expect(carryRolling(document.createElement("span"), destination)).toBe(false);
  });
});
