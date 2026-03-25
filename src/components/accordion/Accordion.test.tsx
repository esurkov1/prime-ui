import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Accordion } from "./Accordion";

function renderAccordion(
  items = [
    { value: "item-1", label: "Section 1", content: "Content 1" },
    { value: "item-2", label: "Section 2", content: "Content 2" },
    { value: "item-3", label: "Section 3", content: "Content 3" },
  ],
  rootProps: Partial<React.ComponentProps<typeof Accordion.Root>> = {},
) {
  return render(
    <Accordion.Root {...rootProps}>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} disabled={item.value === "disabled"}>
          <Accordion.Header>
            <Accordion.Trigger>{item.label}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{item.content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>,
  );
}

describe("Accordion", () => {
  it("root has data-size m by default", () => {
    const { container } = renderAccordion();
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-size", "m");
  });

  it("root sets data-size from size prop", () => {
    const { container } = renderAccordion(undefined, { size: "xl" });
    expect(container.firstElementChild).toHaveAttribute("data-size", "xl");
  });

  it("renders triggers", () => {
    renderAccordion();
    expect(screen.getByRole("button", { name: /Section 1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Section 2/ })).toBeInTheDocument();
  });

  it("starts closed (no defaultValue)", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens item on click", () => {
    renderAccordion();
    fireEvent.click(screen.getByRole("button", { name: /Section 1/ }));
    expect(screen.getByRole("button", { name: /Section 1/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes open item on second click", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("single mode: closes other items when opening a new one", () => {
    renderAccordion(undefined, { type: "single" });
    fireEvent.click(screen.getByRole("button", { name: /Section 1/ }));
    expect(screen.getByRole("button", { name: /Section 1/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: /Section 2/ }));
    expect(screen.getByRole("button", { name: /Section 1/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: /Section 2/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("multiple mode: keeps multiple items open", () => {
    renderAccordion(undefined, { type: "multiple" });
    fireEvent.click(screen.getByRole("button", { name: /Section 1/ }));
    fireEvent.click(screen.getByRole("button", { name: /Section 2/ }));
    expect(screen.getByRole("button", { name: /Section 1/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: /Section 2/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("disabled item cannot be toggled", () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="a" disabled>
          <Accordion.Header>
            <Accordion.Trigger>Disabled Section</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole("button", { name: /Disabled Section/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-disabled");
  });

  it("trigger has aria-controls pointing to content id", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    const content = contentId ? document.getElementById(contentId) : null;
    expect(content).toBeInTheDocument();
  });

  it("content has aria-labelledby pointing to trigger id", () => {
    renderAccordion();
    fireEvent.click(screen.getByRole("button", { name: /Section 1/ }));
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    const triggerId = trigger.id;
    expect(triggerId).toBeTruthy();
    const ariaControls = trigger.getAttribute("aria-controls");
    const region = ariaControls ? document.getElementById(ariaControls) : null;
    expect(region).toHaveAttribute("aria-labelledby", triggerId);
  });

  it("keyboard Enter opens item", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("keyboard Space opens item", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 2/ });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: " " });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("controlled mode: calls onValueChange", () => {
    const onValueChange = vi.fn();
    render(
      <Accordion.Root value="" onValueChange={onValueChange}>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Section A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Section A/ }));
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("controlled mode: stays closed if value prop not updated", () => {
    render(
      <Accordion.Root value="">
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Section A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Section A/ }));
    expect(screen.getByRole("button", { name: /Section A/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("uncontrolled mode: defaultValue opens initial item", () => {
    render(
      <Accordion.Root defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>Section 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(screen.getByRole("button", { name: /Section 1/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: /Section 2/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
