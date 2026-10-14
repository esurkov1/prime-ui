import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  defineMessagePart,
  MessageHighlightContext,
  MessagePartProvider,
  messagePartOf,
  useInMessage,
  useMessageHighlight,
  useMessagePart,
} from "./messagePart";

describe("message parts", () => {
  it("are declared once on the component type; anything else is no part", () => {
    function Note() {
      return null;
    }
    expect(defineMessagePart(Note, { shell: "fill", meta: "inline" })).toBe(Note);
    expect(messagePartOf(Note)).toEqual({ shell: "fill", meta: "inline" });
    expect(messagePartOf("div")).toBeNull();
    expect(messagePartOf(undefined)).toBeNull();
  });

  it("read what the message hands them; outside a message every slot is empty", () => {
    function Part() {
      const part = useMessagePart();
      return (
        <span>
          {`${useInMessage()}:${part.spacer === null}:${useMessageHighlight()}`}
          {part.spacer}
        </span>
      );
    }
    const { unmount } = render(<Part />);
    expect(screen.getByText("false:true:")).toBeInTheDocument();
    unmount();
    render(
      <MessageHighlightContext.Provider value="счёт">
        <MessagePartProvider
          value={{
            spacer: <i>место</i>,
            overlay: null,
            neutralDepth: 1,
            memory: new Map(),
            holdPosition: () => {},
            press: () => {},
          }}
        >
          <Part />
        </MessagePartProvider>
      </MessageHighlightContext.Provider>,
    );
    expect(screen.getByText("true:false:счёт")).toBeInTheDocument();
    expect(screen.getByText("место")).toBeInTheDocument();
  });
});
