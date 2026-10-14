import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import {
  createStore,
  handleListboxKeyDown,
  type ListboxRegistry,
  optionDomId,
  revealHighlighted,
  useListboxItem,
  useListboxRegistry,
  useListboxView,
  useStoreSlice,
  useTypeahead,
} from "./listbox";

type Option = { id: string; label: string; disabled?: boolean; persistent?: boolean };

const OPTIONS: Option[] = [
  { id: "draft", label: "Черновик" },
  { id: "sent", label: "Отправлен" },
  { id: "archived", label: "В архиве", disabled: true },
  { id: "paid", label: "Оплачен" },
];

function Option({
  registry,
  option,
  highlight,
  onActivate,
}: {
  registry: ListboxRegistry;
  option: Option;
  highlight: ReturnType<typeof createStore<string | undefined>>;
  onActivate: (id: string) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  useListboxItem(
    registry,
    option.id,
    {
      label: option.label,
      haystack: option.label.toLocaleLowerCase(),
      disabled: option.disabled,
      persistent: option.persistent,
      onActivate: () => onActivate(option.id),
    },
    ref,
  );
  const highlighted = useStoreSlice(highlight, (value) => value === option.id);
  return (
    <div
      ref={ref}
      role="option"
      tabIndex={-1}
      id={optionDomId("list", option.id)}
      aria-selected={highlighted}
      aria-disabled={option.disabled || undefined}
      data-highlighted={highlighted || undefined}
      onPointerMove={() => highlight.set(option.id)}
    >
      {option.label}
    </div>
  );
}

function Listbox({
  options = OPTIONS,
  query = "",
  onActivate = () => {},
  highlight,
}: {
  options?: Option[];
  query?: string;
  onActivate?: (id: string) => void;
  highlight: ReturnType<typeof createStore<string | undefined>>;
}) {
  const registry = useListboxRegistry();
  const view = useListboxView(registry, query);
  const typeahead = useTypeahead();
  const active = useStoreSlice(highlight, (value) => value);
  return (
    <div
      role="listbox"
      tabIndex={0}
      aria-label="Статус счёта"
      aria-activedescendant={active ? optionDomId("list", active) : undefined}
      data-matches={view.matchCount}
      onKeyDown={(event) => {
        if (event.key.length === 1 && event.key !== " ") {
          const match = typeahead.find(
            event.key,
            view.navigable,
            highlight.get(),
            registry.labelOf,
          );
          if (match) highlight.set(match);
          return;
        }
        const moved = handleListboxKeyDown(event, {
          ids: view.navigable,
          highlight,
          activate: registry.activate,
        });
        if (moved) revealHighlighted(registry.nodeOf(moved));
      }}
    >
      {options
        .filter((option) => view.visible.has(option.id) || !query)
        .map((option) => (
          <Option
            key={option.id}
            registry={registry}
            option={option}
            highlight={highlight}
            onActivate={onActivate}
          />
        ))}
    </div>
  );
}

describe("listbox", () => {
  it("arrows walk the enabled items in order and wrap; Enter activates through the registry", () => {
    const highlight = createStore<string | undefined>(undefined);
    const onActivate = vi.fn();
    render(<Listbox highlight={highlight} onActivate={onActivate} />);
    const listbox = screen.getByRole("listbox");
    const click = vi.spyOn(HTMLElement.prototype, "click");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    expect(highlight.get()).toBe("draft");
    fireEvent.keyDown(listbox, { key: "End" });
    expect(highlight.get()).toBe("paid");
    fireEvent.keyDown(listbox, { key: "ArrowUp" });
    // The disabled item is skipped.
    expect(highlight.get()).toBe("sent");
    fireEvent.keyDown(listbox, { key: "Enter" });
    expect(onActivate).toHaveBeenCalledWith("sent");
    // No synthetic DOM click stands in for the activation.
    expect(click).not.toHaveBeenCalled();
    click.mockRestore();
  });

  it("leaves the keys of a composing input method alone", () => {
    const highlight = createStore<string | undefined>("draft");
    const onActivate = vi.fn();
    render(<Listbox highlight={highlight} onActivate={onActivate} />);
    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "Enter", isComposing: true });
    fireEvent.keyDown(listbox, { key: "ArrowDown", keyCode: 229 });
    expect(onActivate).not.toHaveBeenCalled();
    expect(highlight.get()).toBe("draft");
  });

  it("a keyboard move reveals the highlighted option; a pointer move never scrolls", () => {
    const highlight = createStore<string | undefined>(undefined);
    render(<Listbox highlight={highlight} />);
    const scroll = vi.spyOn(Element.prototype, "scrollIntoView");
    fireEvent.pointerMove(screen.getByRole("option", { name: "Оплачен" }));
    expect(highlight.get()).toBe("paid");
    expect(scroll).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Home" });
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll.mock.contexts[0]).toBe(screen.getByRole("option", { name: "Черновик" }));
    expect(scroll).toHaveBeenCalledWith({ block: "nearest" });
    scroll.mockRestore();
  });

  it("filters by the query, keeps persistent items last and counts the matches", () => {
    const highlight = createStore<string | undefined>(undefined);
    const options: Option[] = [
      { id: "create", label: "Создать статус", persistent: true },
      ...OPTIONS,
    ];
    const { rerender } = render(<Listbox highlight={highlight} options={options} />);
    rerender(<Listbox highlight={highlight} options={options} query="оп" />);
    expect(screen.getByRole("listbox")).toHaveAttribute("data-matches", "1");
    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    expect(highlight.get()).toBe("paid");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    expect(highlight.get()).toBe("create");
  });

  it("typeahead finds by label and cycles a repeated letter", () => {
    vi.useFakeTimers();
    const highlight = createStore<string | undefined>(undefined);
    render(<Listbox highlight={highlight} />);
    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "о" });
    expect(highlight.get()).toBe("sent");
    fireEvent.keyDown(listbox, { key: "о" });
    expect(highlight.get()).toBe("paid");
    act(() => vi.advanceTimersByTime(600));
    fireEvent.keyDown(listbox, { key: "ч" });
    expect(highlight.get()).toBe("draft");
    vi.useRealTimers();
  });

  it("readers of different queries each keep a stable view until an item changes", () => {
    const highlight = createStore<string | undefined>(undefined);
    let registry: ListboxRegistry | null = null;
    function Probe({ count }: { count: number }) {
      registry = useListboxRegistry();
      // The trigger's labels read every item, the open panel the query: both at once.
      const all = useListboxView(registry);
      const found = useListboxView(registry, "о");
      return (
        <div data-testid="views">
          {`${all.navigable.length}/${found.matchCount}`}
          {OPTIONS.slice(0, count).map((option) => (
            <Option
              key={option.id}
              registry={registry as ListboxRegistry}
              option={option}
              highlight={highlight}
              onActivate={() => {}}
            />
          ))}
        </div>
      );
    }
    const { rerender } = render(<Probe count={2} />);
    const reader = registry as unknown as ListboxRegistry;
    expect(reader.view("", true)).toBe(reader.view("", true));
    expect(reader.view("о", true)).toBe(reader.view("о", true));
    expect(screen.getByTestId("views")).toHaveTextContent("2/2");
    rerender(<Probe count={4} />);
    expect(screen.getByTestId("views")).toHaveTextContent("3/3");
  });

  it("keeps an item's label and place after it unmounts", () => {
    const highlight = createStore<string | undefined>(undefined);
    let registry: ListboxRegistry | null = null;
    function Probe({ shown }: { shown: boolean }) {
      registry = useListboxRegistry();
      const view = useListboxView(registry);
      return (
        <div data-testid="order">
          {view.navigable.join(" ")}
          {OPTIONS.filter((option) => shown || option.id !== "draft").map((option) => (
            <Option
              key={option.id}
              registry={registry as ListboxRegistry}
              option={option}
              highlight={highlight}
              onActivate={() => {}}
            />
          ))}
        </div>
      );
    }
    const { rerender } = render(<Probe shown />);
    rerender(<Probe shown={false} />);
    expect((registry as ListboxRegistry | null)?.labelOf("draft")).toBe("Черновик");
    expect((registry as ListboxRegistry | null)?.activate("draft")).toBe(false);
    rerender(<Probe shown />);
    expect(screen.getByTestId("order")).toHaveTextContent(/^draft sent paid/);
  });
});
