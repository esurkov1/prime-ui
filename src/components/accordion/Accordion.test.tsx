import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { withMotion } from "@/test/motion";

import { Accordion, type AccordionRootProps } from "./Accordion";

function renderAccordion(
  items = [
    { value: "item-1", label: "Section 1", content: "Content 1" },
    { value: "item-2", label: "Section 2", content: "Content 2" },
    { value: "item-3", label: "Section 3", content: "Content 3" },
  ],
  rootProps: AccordionRootProps = {},
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
    renderAccordion(undefined, { multiple: false });
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
    renderAccordion(undefined, { multiple: true });
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

  it("closed content stays findable: hidden until found, out of the tab order; open content is not", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    const contentId = trigger.getAttribute("aria-controls");
    const content = contentId ? document.getElementById(contentId) : null;
    const clip = content?.firstElementChild as HTMLElement;
    // Settled closed: `hidden="until-found"` hides it from Tab and assistive tech, not from find.
    expect(clip).toHaveAttribute("hidden", "until-found");
    expect(content).not.toHaveAttribute("inert");
    expect(content).not.toHaveAttribute("aria-hidden");
    expect(content).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(clip).not.toHaveAttribute("hidden");
    expect(content).not.toHaveAttribute("inert");
    expect(content).toHaveAttribute("data-state", "open");
    fireEvent.click(trigger);
    expect(clip).toHaveAttribute("hidden", "until-found");
  });

  it("is inert while it closes, then hidden until found", () => {
    withMotion();
    vi.useFakeTimers();
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    const content = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    const clip = content?.firstElementChild as HTMLElement;
    act(() => {
      vi.advanceTimersByTime(20);
    });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(content).toHaveAttribute("inert");
    expect(clip).not.toHaveAttribute("hidden");
    act(() => {
      content?.dispatchEvent(
        Object.assign(new Event("transitionend"), { propertyName: "visibility" }),
      );
    });
    expect(content).not.toHaveAttribute("inert");
    expect(clip).toHaveAttribute("hidden", "until-found");
    vi.useRealTimers();
  });

  it("find in page opens the item that holds the match, at once", () => {
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    const content = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    const clip = content?.firstElementChild as HTMLElement;
    act(() => {
      clip.dispatchEvent(new Event("beforematch"));
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).not.toHaveAttribute("data-mounted");
    expect(clip).not.toHaveAttribute("hidden");
  });

  it("Enter and Space on a focused trigger open and close the item", async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/ });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("Tab moves between triggers and skips a disabled one", async () => {
    const user = userEvent.setup();
    renderAccordion([
      { value: "item-1", label: "Section 1", content: "Content 1" },
      { value: "disabled", label: "Section 2", content: "Content 2" },
      { value: "item-3", label: "Section 3", content: "Content 3" },
    ]);
    await user.tab();
    expect(screen.getByRole("button", { name: /Section 1/ })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: /Section 3/ })).toHaveFocus();
  });

  it("Header renders the heading level from `as` (h3 by default)", () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header as="h2">
            <Accordion.Trigger>Section A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Header>
            <Accordion.Trigger>Section B</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Section A" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Section B" })).toBeInTheDocument();
  });

  it("Content owns its id, labelling and state over the consumer's attributes", () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Section A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content id="custom" aria-labelledby="other" data-state="open">
            Content A
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Section A" });
    const content = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    expect(content).not.toBeNull();
    expect(content).toHaveAttribute("aria-labelledby", trigger.id);
    expect(content).toHaveAttribute("data-state", "closed");
  });

  it("the root takes the host tier when it has no size", () => {
    const { container } = render(
      <ControlSizeProvider value="s">
        <Accordion.Root>
          <Accordion.Item value="a">
            <Accordion.Header>
              <Accordion.Trigger>Section A</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content A</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </ControlSizeProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-size", "s");
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

  it("multiple: onValueChange receives the list of open items", () => {
    const onValueChange = vi.fn();
    render(
      <Accordion.Root multiple defaultValue={["a"]} onValueChange={onValueChange}>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Section A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Header>
            <Accordion.Trigger>Section B</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Section B/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
    fireEvent.click(screen.getByRole("button", { name: /Section A/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("collapsible={false} keeps the single open item open", () => {
    render(
      <Accordion.Root defaultValue="a" collapsible={false}>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Section A</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole("button", { name: /Section A/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("the trigger draws one hidden chevron after its content and marks the open state", () => {
    renderAccordion(undefined, { defaultValue: "item-1" });
    const trigger = screen.getByRole("button", { name: "Section 1" });
    const chevron = trigger.querySelector("svg");
    expect(chevron).toHaveAttribute("aria-hidden", "true");
    expect(trigger.lastElementChild).toBe(chevron);
    expect(trigger).toHaveAttribute("data-state", "open");
  });

  it("Accordion.Icon is decorative", () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Icon>
                <svg data-testid="lead" />
              </Accordion.Icon>
              Section A
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content A</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(screen.getByTestId("lead").parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Section A" })).toBeInTheDocument();
  });
});
