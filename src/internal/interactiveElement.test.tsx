import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { InteractiveElement, type InteractiveElementProps } from "./interactiveElement";

type Case = {
  name: string;
  props: Exclude<InteractiveElementProps, { element: "static" }>;
  role: "link" | "button";
};

const CASES: Case[] = [
  { name: "link", props: { element: "link", href: "#orders", children: "Заказы" }, role: "link" },
  { name: "button", props: { element: "button", children: "Заказы" }, role: "button" },
  {
    name: "slot",
    props: { element: "slot", children: <a href="#orders">Заказы</a> },
    role: "link",
  },
];

describe("InteractiveElement", () => {
  describe.each(CASES)("$name", ({ props, role }) => {
    it("runs onClick and is reachable with Tab", async () => {
      const onClick = vi.fn();
      render(<InteractiveElement {...props} onClick={onClick} />);
      const element = screen.getByRole(role, { name: "Заказы" });
      await userEvent.tab();
      expect(element).toHaveFocus();
      fireEvent.click(element);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(element).not.toHaveAttribute("aria-disabled");
    });

    it("disabled: no onClick, no navigation, no Tab stop, announced as disabled", async () => {
      const onClick = vi.fn();
      render(<InteractiveElement {...props} disabled onClick={onClick} />);
      const element = screen.getByRole(role, { name: "Заказы" });
      const event = new MouseEvent("click", { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
      expect(onClick).not.toHaveBeenCalled();
      // A native disabled button gets no click at all; the others prevent its default.
      if (!element.matches(":disabled")) expect(event.defaultPrevented).toBe(true);
      expect(element).not.toHaveAttribute("href");
      expect(element.matches(":disabled, [aria-disabled='true']")).toBe(true);
      await userEvent.tab();
      expect(element).not.toHaveFocus();
    });
  });

  it("a button defaults to type=button and takes submit", () => {
    const { rerender } = render(
      <InteractiveElement element="button">Сохранить</InteractiveElement>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    rerender(
      <InteractiveElement element="button" type="submit">
        Сохранить
      </InteractiveElement>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("a static element renders a div with no action", () => {
    render(
      <InteractiveElement element="static" data-testid="brand" disabled>
        Prime
      </InteractiveElement>,
    );
    const element = screen.getByTestId("brand");
    expect(element.tagName).toBe("DIV");
    expect(element).toHaveAttribute("aria-disabled", "true");
  });

  it("forwards the ref to whichever element renders", () => {
    const ref = vi.fn();
    render(
      <InteractiveElement element="link" href="#orders" ref={ref}>
        Заказы
      </InteractiveElement>,
    );
    expect(ref).toHaveBeenCalledWith(screen.getByRole("link"));
  });
});
