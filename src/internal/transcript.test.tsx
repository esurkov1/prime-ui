import { readFileSync } from "node:fs";
import path from "node:path";

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { VoicePlayer } from "@/components/voice-player/VoicePlayer";
import { MessageHighlightContext, MessagePartProvider } from "./messagePart";

const TEXT = "Отгрузка по счёту 2210 перенесена на пятницу.";

const css = (file: string) => readFileSync(path.join(process.cwd(), file), "utf8");

/** The declarations of one rule `selector { … }`. */
const rule = (source: string, selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(new RegExp(`(?:^|\\n)${escaped} \\{([^}]*)\\}`))?.[1] ?? "";
};

describe("transcript", () => {
  it("is a region that always exists; its text is rendered while it is open", () => {
    const { container } = render(<VoicePlayer src="/v.ogg" transcript={TEXT} />);
    const region = container.querySelector("[data-transcript]");
    // Collapsed from the start: the button's region is there, empty.
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region?.textContent).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "Расшифровать" }));
    expect(region).toHaveAttribute("data-state", "open");
    // The block is a part of the message's morph: it fades in where it stands.
    expect(region?.querySelector("[data-morph-item]")).toHaveTextContent(TEXT);
    fireEvent.click(screen.getByRole("button", { name: "Скрыть расшифровку" }));
    // The same region closes in place; in a chat the morph fades the text out where it stood.
    expect(container.querySelector("[data-transcript]")).toBe(region);
    expect(region).toHaveAttribute("data-state", "closed");
    expect(region?.textContent).toBe("");
  });

  it("close is simultaneous: the height and the text's fade run on one clock, both ways", () => {
    const disclosure = css("src/internal/disclosure.module.css");
    const transcript = css("src/internal/transcript.module.css");
    // A message changes size in one layout for now: the transcript's clock is zero.
    expect(rule(transcript, ".disclosure")).toMatch(/--disclosure-duration: 0s;/);
    const flat = (block: string) => block.replace(/\s+/g, " ");
    const clock =
      "var(--disclosure-duration, var(--prime-motion-duration-base)) var(--disclosure-ease, var(--prime-motion-easing-standard))";
    // Closed and open state carry the same row transition; the content's fade has the same clock
    // and no delay — the text never waits for the height, or the height for the text.
    expect(flat(rule(disclosure, ".root"))).toContain(`grid-template-rows ${clock}`);
    expect(flat(rule(disclosure, '.root[data-state="open"]'))).toContain(
      `grid-template-rows ${clock}`,
    );
    expect(flat(rule(disclosure, ".clip > *"))).toContain(`opacity ${clock}`);
    expect(rule(disclosure, ".clip > *")).not.toMatch(/delay/);
  });

  it("opens and closes without reading layout or computed style", () => {
    const rect = vi.spyOn(Element.prototype, "getBoundingClientRect");
    const computed = vi.spyOn(window, "getComputedStyle");
    render(<VoicePlayer src="/v.ogg" transcript={TEXT} />);
    // The same button opens and closes (queried once: a role query reads styles itself).
    const button = screen.getByRole("button", { name: "Расшифровать" });
    rect.mockClear();
    computed.mockClear();
    fireEvent.click(button);
    fireEvent.click(button);
    expect(rect).not.toHaveBeenCalled();
    expect(computed).not.toHaveBeenCalled();
    rect.mockRestore();
    computed.mockRestore();
  });

  it("keeps the open state and the resolved text across a remount (a windowed row)", async () => {
    const memory = new Map<string, unknown>();
    const onTranscribe = vi.fn(async () => TEXT);
    const view = () => (
      <MessagePartProvider value={{ spacer: null, overlay: null, neutralDepth: 1, memory }}>
        <VoicePlayer src="/v.ogg" onTranscribe={onTranscribe} />
      </MessagePartProvider>
    );
    const first = render(view());
    fireEvent.click(screen.getByRole("button", { name: "Расшифровать" }));
    await act(async () => {});
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    first.unmount();

    render(view());
    expect(screen.getByRole("button", { name: "Скрыть расшифровку" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    expect(onTranscribe).toHaveBeenCalledTimes(1);
  });

  it("asks the chat to hold the view still before it opens or closes", () => {
    const holdPosition = vi.fn();
    render(
      <MessagePartProvider
        value={{ spacer: null, overlay: null, neutralDepth: 1, memory: null, holdPosition }}
      >
        <VoicePlayer src="/v.ogg" transcript={TEXT} />
      </MessagePartProvider>,
    );
    const button = screen.getByRole("button", { name: "Расшифровать" });
    fireEvent.click(button);
    expect(holdPosition).toHaveBeenCalledTimes(1);
    fireEvent.click(button);
    expect(holdPosition).toHaveBeenCalledTimes(2);
  });

  it("marks the matches of the chat search", () => {
    const { container } = render(
      <MessageHighlightContext.Provider value="пятницу">
        <VoicePlayer src="/v.ogg" transcript={TEXT} defaultTranscriptExpanded />
      </MessageHighlightContext.Provider>,
    );
    expect(container.querySelector("mark")).toHaveTextContent("пятницу");
  });

  it("keeps the area closed and spins the button while the text is asked for", () => {
    const { container } = render(
      <VoicePlayer src="/v.ogg" duration={8} onTranscribe={() => {}} defaultTranscriptExpanded />,
    );
    expect(container.querySelector("[data-transcript] [data-shape]")).toBeNull();
    expect(container.querySelector("[data-transcript] p")).toBeNull();
    const button = screen.getByRole("button", { name: "Расшифровать" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
