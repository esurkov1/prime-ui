import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  createSelectionStore,
  defineRowKind,
  type MessageListContextValue,
  MessageListProvider,
  rowKindOf,
  useMessageList,
  useMessageSelection,
} from "./messageList";

describe("createSelectionStore", () => {
  it("answers each message's state and tells its listeners about a new selection", () => {
    const store = createSelectionStore(null);
    expect(store.stateOf("m1")).toBe(0);
    const listener = vi.fn();
    const stop = store.subscribe(listener);
    store.set(["m1"]);
    expect(store.get()).toEqual(["m1"]);
    expect(store.stateOf("m1")).toBe(2);
    expect(store.stateOf("m2")).toBe(1);
    expect(listener).toHaveBeenCalledTimes(1);
    // The same selection notifies nobody.
    store.set(store.get());
    expect(listener).toHaveBeenCalledTimes(1);
    stop();
    store.set(null);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("row kinds", () => {
  it("are declared on an element type and read back from its elements", () => {
    function Typing() {
      return null;
    }
    defineRowKind(Typing, { tail: true });
    expect(rowKindOf(<Typing />)).toEqual({ tail: true });
    expect(rowKindOf(<div />)).toBeUndefined();
    expect(rowKindOf("текст")).toBeUndefined();
  });
});

describe("the list context", () => {
  function State({ value }: { value: string }) {
    const { selecting, selected } = useMessageSelection(value);
    return <span data-testid={value}>{`${selecting}:${selected}`}</span>;
  }

  it("outside a list a message is on its own: not grouped, nothing selected", () => {
    function Probe() {
      const list = useMessageList();
      return <span>{`${list.inList}:${list.group}`}</span>;
    }
    render(<Probe />);
    expect(screen.getByText("false:false")).toBeInTheDocument();
  });

  it("re-renders a message when its own selection state changes", () => {
    const store = createSelectionStore(null);
    function List({ children }: { children: React.ReactNode }) {
      const outside = useMessageList();
      const value: MessageListContextValue = { ...outside, inList: true, selection: store };
      return <MessageListProvider value={value}>{children}</MessageListProvider>;
    }
    render(
      <List>
        <State value="m1" />
        <State value="m2" />
      </List>,
    );
    expect(screen.getByTestId("m1")).toHaveTextContent("false:false");
    act(() => store.set(["m2"]));
    expect(screen.getByTestId("m1")).toHaveTextContent("true:false");
    expect(screen.getByTestId("m2")).toHaveTextContent("true:true");
  });
});
