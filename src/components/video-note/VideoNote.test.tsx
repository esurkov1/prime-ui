import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Fieldset } from "@/components/fieldset/Fieldset";
import { Message } from "@/components/message/Message";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { VoicePlayer } from "@/components/voice-player/VoicePlayer";
import { MessagePartProvider, messagePartOf } from "@/internal/messagePart";
import { cssRule, cssRules, cssValue } from "@/test/css";

import { VideoNote } from "./VideoNote";

const SRC = "https://example.com/rack.mp4";
const PLAY = "Воспроизвести видеосообщение";

let play: { mock: { calls: unknown[] } };

beforeEach(() => {
  // A play reports itself like a browser's: the one-sound session listens to `play`.
  play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    this.dispatchEvent(new Event("pause"));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const badge = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-badge="${name}"]`);

const circleButton = () => screen.getByRole("button", { name: /видеосообщение|Пауза/ });

describe("VideoNote", () => {
  it("is a group with the circle's button named by the play label, described by the duration", () => {
    const { container } = render(<VideoNote src={SRC} duration={75} unplayed />);
    expect(screen.getByRole("group", { name: "Видеосообщение" })).toBeInTheDocument();
    const button = screen.getByRole("button", { name: PLAY });
    expect(button).toHaveAccessibleDescription("Длительность 1:15, Не просмотрено");
    expect(badge(container, "duration")).toHaveTextContent("1:15");
  });

  it("forwards ref, className and native attributes to the root group", () => {
    const ref = vi.fn();
    render(<VideoNote src={SRC} ref={ref} className="note" data-id="7" />);
    const root = screen.getByRole("group");
    expect(ref).toHaveBeenCalledWith(root);
    expect(root).toHaveClass("note");
    expect(root).toHaveAttribute("data-id", "7");
  });

  it("at rest plays nothing: the still first frame with the play disk, metadata only", () => {
    const { container } = render(<VideoNote src={SRC} duration={6} />);
    const video = container.querySelector("video") as HTMLVideoElement;
    fireEvent.loadedData(video);
    expect(play).not.toHaveBeenCalled();
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video.loop).toBe(false);
    expect(video.autoplay).toBe(false);
    expect(badge(container, "play")).toHaveAttribute("data-shown", "true");
    expect(badge(container, "muted")).toBeNull();
    expect(circleButton()).toHaveAttribute("data-state", "idle");
  });

  it("activation plays with sound from the start; again pauses; Enter resumes", async () => {
    const user = userEvent.setup();
    const onPlayingChange = vi.fn();
    const { container } = render(
      <VideoNote src={SRC} duration={20} onPlayingChange={onPlayingChange} />,
    );
    const video = container.querySelector("video") as HTMLVideoElement;
    video.currentTime = 5;

    await user.click(circleButton());
    const button = screen.getByRole("button", { name: "Пауза" });
    expect(button).toHaveAttribute("data-state", "playing");
    expect(video.muted).toBe(false);
    expect(video.currentTime).toBe(0);
    expect(onPlayingChange).toHaveBeenLastCalledWith(true);
    expect(button).toHaveAccessibleDescription("0:00 из 0:20");
    expect(badge(container, "play")).toHaveAttribute("data-shown", "false");

    await user.keyboard(" ");
    expect(button).toHaveAccessibleName(PLAY);
    expect(button).toHaveAttribute("data-state", "paused");
    expect(onPlayingChange).toHaveBeenLastCalledWith(false);
    expect(onPlayingChange).toHaveBeenCalledTimes(2);
    expect(badge(container, "play")).toHaveAttribute("data-shown", "true");

    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("data-state", "playing");
  });

  it("at the end: stops, rewinds, reports false, releases the session, empties the ring, stands still", async () => {
    const onPlayingChange = vi.fn();
    const onEnded = vi.fn();
    const { container } = render(
      <>
        <VideoNote src={SRC} duration={10} onPlayingChange={onPlayingChange} onEnded={onEnded} />
        <Thumbnail.Root>
          <Thumbnail.Video src="/clip.mp4" controls data-testid="clip" />
        </Thumbnail.Root>
      </>,
    );
    const video = container.querySelector("video") as HTMLVideoElement;
    const ring = container.querySelector<SVGSVGElement>("svg[data-live]");
    await userEvent.setup().click(circleButton());
    ring?.style.setProperty("--ring-value", "1");
    Object.defineProperty(video, "currentTime", { value: 10, writable: true, configurable: true });
    act(() => {
      video.pause();
      fireEvent.ended(video);
    });
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(onPlayingChange).toHaveBeenLastCalledWith(false);
    expect(circleButton()).toHaveAttribute("data-state", "idle");
    expect(video.currentTime).toBe(0);
    expect(circleButton()).toHaveAccessibleName(PLAY);
    expect(circleButton()).toHaveAccessibleDescription("Длительность 0:10");
    expect(ring?.style.getPropertyValue("--ring-value")).toBe("0");
    expect(play).toHaveBeenCalledTimes(1);
    // The session is free: another sound starting now pauses nothing.
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    pause.mockClear();
    act(() => {
      void (screen.getByTestId("clip") as HTMLVideoElement).play();
    });
    expect(pause).not.toHaveBeenCalled();
  });

  it("disabled: no play by press, key or triad; its buttons are off; a disabled Fieldset does it too", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <VideoNote src={SRC} duration={6} disabled transcript="Текст" />,
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-disabled", "true");
    expect(circleButton()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Расшифровать" })).toBeDisabled();
    // The disk stays in its place in the round button's disabled look.
    expect(badge(container, "play")).toHaveAttribute("data-shown", "true");
    await user.click(circleButton());
    // The pointer aid over the whole circle is off too.
    await user.click(
      container.querySelector("[data-message-outline] > [data-disabled]") as Element,
    );
    await user.keyboard("{Enter}");
    rerender(<VideoNote src={SRC} duration={6} disabled transcript="Текст" playing />);
    expect(play).not.toHaveBeenCalled();
    rerender(<VideoNote src={SRC} duration={6} disabled transfer="failed" onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: "Повторить отправку" })).toBeDisabled();

    rerender(
      <Fieldset label="Отчёт" disabled>
        <VideoNote src={SRC} duration={6} />
      </Fieldset>,
    );
    expect(circleButton()).toBeDisabled();
    await user.click(circleButton());
    expect(play).not.toHaveBeenCalled();
  });

  it("the playing triad from the owner plays and pauses", () => {
    const { rerender } = render(<VideoNote src={SRC} duration={10} playing={false} />);
    rerender(<VideoNote src={SRC} duration={10} playing />);
    expect(screen.getByRole("button", { name: "Пауза" })).toHaveAttribute("data-state", "playing");
    rerender(<VideoNote src={SRC} duration={10} playing={false} />);
    expect(circleButton()).toHaveAttribute("data-state", "paused");
  });

  it("while playing, a frame writes the ring's progress only — nothing flips per tick", async () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    const { container } = render(<VideoNote src={SRC} duration={10} />);
    const button = circleButton();
    const video = container.querySelector("video") as HTMLVideoElement;
    fireEvent.loadedData(video);
    await userEvent.click(button);
    expect(button).toHaveAttribute("data-state", "playing");
    const ring = container.querySelector<SVGSVGElement>("svg[data-live]");
    const snapshot = () =>
      Array.from(container.querySelectorAll("*"))
        .filter((element) => element !== ring)
        .map((element) =>
          Array.from(element.attributes)
            .map((attribute) => `${attribute.name}=${attribute.value}`)
            .join(" "),
        )
        .join("\n");
    const before = snapshot();
    for (let tick = 1; tick <= 5; tick += 1) {
      Object.defineProperty(video, "currentTime", { value: tick * 0.1, configurable: true });
      act(() => frames.shift()?.(tick * 16));
    }
    expect(snapshot()).toBe(before);
    expect(ring?.style.getPropertyValue("--ring-value")).toBe("0.05");
  });

  it("shows a skeleton until the first frame loads", () => {
    const { container } = render(<VideoNote src={SRC} />);
    const circle = container.querySelector("[data-message-outline]");
    expect(circle).toHaveAttribute("data-frame", "loading");
    fireEvent.loadedData(container.querySelector("video") as HTMLVideoElement);
    expect(circle).toHaveAttribute("data-frame", "loaded");
  });

  it("keeps the skeleton under the first frame while it fades in, then removes it", () => {
    // With motion: the reduced-motion default of the tests drops the placeholder at once.
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    vi.useFakeTimers();
    try {
      const { container } = render(<VideoNote src={SRC} />);
      const skeleton = () =>
        container.querySelector(
          '[data-message-outline] [aria-hidden="true"] > [aria-hidden="true"]',
        );
      expect(skeleton()).not.toBeNull();
      fireEvent.loadedData(container.querySelector("video") as HTMLVideoElement);
      expect(skeleton()).not.toBeNull();
      act(() => vi.advanceTimersByTime(1000));
      expect(skeleton()).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  describe("one sound at a time with voice messages", () => {
    beforeEach(() => {
      const paused = new WeakMap<HTMLMediaElement, boolean>();
      vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(function (
        this: HTMLMediaElement,
      ) {
        return paused.get(this) ?? true;
      });
      vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
        this: HTMLMediaElement,
      ) {
        paused.set(this, false);
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      });
      vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (
        this: HTMLMediaElement,
      ) {
        if (paused.get(this) !== false) return;
        paused.set(this, true);
        this.dispatchEvent(new Event("pause"));
      });
    });

    const voice = () => screen.getByRole("group", { name: "Голосовое сообщение" });

    it("one sound across voice, circle and a chat video: each start pauses the others", () => {
      const { container } = render(
        <>
          <VoicePlayer src="/voice.ogg" duration={30} />
          <VideoNote src={SRC} duration={20} />
          <Thumbnail.Root fullWidth>
            <Thumbnail.Video src="/clip.mp4" controls data-testid="clip" />
          </Thumbnail.Root>
        </>,
      );
      const clip = screen.getByTestId("clip") as HTMLVideoElement;
      const note = container.querySelectorAll("video")[0] as HTMLVideoElement;
      fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
      expect(voice()).toHaveAttribute("data-playing", "true");
      act(() => {
        void clip.play();
      });
      expect(voice()).not.toHaveAttribute("data-playing");
      fireEvent.click(screen.getByRole("button", { name: PLAY }));
      expect(clip.paused).toBe(true);
      expect(note.paused).toBe(false);
      fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
      expect(note.paused).toBe(true);
      expect(voice()).toHaveAttribute("data-playing", "true");
    });

    it("a video message playing pauses when a voice message starts", () => {
      const onPlayingChange = vi.fn();
      render(
        <>
          <VideoNote src={SRC} duration={20} onPlayingChange={onPlayingChange} />
          <VoicePlayer src="/voice.ogg" duration={30} />
        </>,
      );
      fireEvent.click(screen.getByRole("button", { name: PLAY }));
      expect(onPlayingChange).toHaveBeenLastCalledWith(true);
      fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
      expect(onPlayingChange).toHaveBeenLastCalledWith(false);
      expect(screen.getByRole("button", { name: PLAY })).toHaveAttribute("data-state", "paused");
    });
  });
});

describe("VideoNote transcript", () => {
  const TEXT = "Покажу стойку на складе, номер партии на этикетке.";

  it("has the voice message's button — soft xs at the box's top end — only when it can transcribe", () => {
    const { rerender } = render(<VideoNote src={SRC} duration={9} />);
    expect(screen.queryByRole("button", { name: "Расшифровать" })).toBeNull();
    rerender(<VideoNote src={SRC} duration={9} transcript={TEXT} />);
    const button = screen.getByRole("button", { name: "Расшифровать" });
    expect(button).toHaveAttribute("data-variant", "soft");
    expect(button).toHaveAttribute("data-size", "xs");
    // Outside the circle's own button: a button cannot hold another one.
    expect(screen.getByRole("button", { name: PLAY })).not.toContainElement(button);
    render(<VoicePlayer src="/voice.ogg" duration={9} transcript={TEXT} />);
    const [note, voice] = screen.getAllByRole("button", { name: "Расшифровать" });
    expect(note?.className.replace(/\S*transcribe\S*/, "")).toBe(
      voice?.className.replace(/\S*transcribe\S*/, ""),
    );
  });

  it("opens the text under the circle without playing the note", () => {
    render(<VideoNote src={SRC} duration={9} transcript={TEXT} />);
    fireEvent.click(screen.getByRole("button", { name: "Расшифровать" }));
    const hide = screen.getByRole("button", { name: "Скрыть расшифровку" });
    expect(hide).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: PLAY })).toHaveAttribute("data-state", "idle");
    const region = screen.getByText(TEXT).closest("[data-transcript]");
    fireEvent.click(hide);
    expect(region).toHaveAttribute("data-state", "closed");
    expect(screen.queryByText(TEXT)).toBeNull();
  });

  it("spins while onTranscribe is pending, then shows the text", async () => {
    let resolve: (text: string) => void = () => {};
    render(
      <VideoNote
        src={SRC}
        duration={9}
        onTranscribe={() => new Promise<string>((r) => (resolve = r))}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Расшифровать" }));
    expect(screen.getByRole("button", { name: "Расшифровать" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await act(async () => resolve(TEXT));
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });
});

describe("VideoNote geometry", () => {
  const CSS = "src/components/video-note/VideoNote.module.css";
  const props = (selector: string) =>
    cssRules(CSS)
      .filter((rule) => rule.selector === selector && rule.parents.length === 0)
      .flatMap((rule) => rule.decls.map((decl) => decl.prop));

  it("the circle is square at every width: one box, a min() width and `aspect-ratio: 1`", () => {
    const circle = cssRule(CSS, ".circle");
    expect(cssValue(circle, "aspect-ratio")).toBe("1");
    expect(cssValue(circle, "inline-size")).toBe(
      "min(var(--prime-message-video-note-box), 100cqi)",
    );
    for (const sized of [".circle", ".root"]) {
      for (const prop of ["height", "block-size", "min-block-size", "max-block-size"]) {
        expect(props(sized)).not.toContain(prop);
      }
      expect(props(sized)).not.toContain("max-inline-size");
    }
    for (const part of [".media", ".fill", ".hit"]) {
      expect(cssValue(cssRule(CSS, part), "inset")).toBe("0");
    }
  });

  it("clips on a stable layer: the clip never transforms, scales or changes size per state", () => {
    const media = cssRule(CSS, ".media");
    expect(cssValue(media, "overflow")).toBe("hidden");
    expect(cssValue(media, "border-radius")).toBe("var(--prime-radius-full)");
    expect(cssValue(media, "transform")).toBe("translateZ(0)");
    const onMedia = cssRules(CSS).filter((rule) => /\.media\b/.test(rule.selector));
    for (const rule of onMedia) {
      for (const decl of rule.decls) {
        expect(decl.prop).not.toMatch(/^(scale|will-change)$/);
        if (decl.prop === "transition") expect(decl.value).toMatch(/^opacity /);
      }
    }
  });

  it("the duration pill reads like the voice message's time: muted caption, regular weight", () => {
    // The last word of every rule that names `.pill` (alone or in a list).
    const pill = new Map(
      cssRules("src/internal/mediaPill.module.css")
        .filter((rule) => rule.selector.split(/\s*,\s*/).includes(".pill"))
        .flatMap((rule) => rule.decls.map((decl) => [decl.prop, decl.value] as const)),
    );
    expect(pill.get("color")).toBe("var(--prime-color-media-pill-fg)");
    expect(pill.get("font-weight")).toBe("var(--prime-font-weight-regular)");
    expect(pill.get("font-size")).toBe("var(--prime-text-caption-size)");
  });

  it("is a round part: the message's outline hook and meta overlay sit on the circle", () => {
    const overlay = <span data-testid="meta" />;
    render(
      <MessagePartProvider value={{ spacer: null, overlay, neutralDepth: 1 }}>
        <VideoNote src={SRC} duration={4} />
      </MessagePartProvider>,
    );
    const circle = screen.getByTestId("meta").parentElement as HTMLElement;
    expect(circle).toHaveAttribute("data-message-outline");
    expect(circle).toContainElement(screen.getByRole("button", { name: PLAY }));
    expect(messagePartOf(VideoNote)).toMatchObject({ shell: "round", meta: "overlay" });
  });

  it("inside Message.Root it is the message itself: the round shell", () => {
    const { container } = render(
      <Message.Root time="12:00">
        <VideoNote src={SRC} duration={4} />
      </Message.Root>,
    );
    expect(container.querySelector("[data-shell]")).toHaveAttribute("data-shell", "round");
  });
});

describe("VideoNote transfer", () => {
  it("dims under the transfer disk in its middle, cancels and retries from it, and plays once done", () => {
    const onCancel = vi.fn();
    const onRetry = vi.fn();
    const { rerender, container } = render(
      <VideoNote
        src={SRC}
        duration={20}
        transfer="loading"
        transferProgress={0.4}
        onCancel={onCancel}
      />,
    );
    const circle = container.querySelector("[data-message-outline]");
    expect(circle).toHaveAttribute("data-covered");
    // The circle does not play while it is on its way: its disk is the cross, described by the share.
    expect(screen.queryByRole("button", { name: PLAY })).toBeNull();
    const cancel = screen.getByRole("button", { name: "Отменить отправку" });
    expect(cancel).toHaveAccessibleDescription("Отправка 40%");
    expect(cancel).toHaveAttribute("data-variant", "shade");
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);

    rerender(<VideoNote src={SRC} duration={20} transfer="failed" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: "Повторить отправку" }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<VideoNote src={SRC} duration={20} transfer="done" transferProgress={1} />);
    expect(circle).not.toHaveAttribute("data-covered");
    expect(screen.getByRole("button", { name: PLAY })).toBeInTheDocument();
  });

  it("names the transfer by its direction and offers the download of a remote note", () => {
    const onDownload = vi.fn();
    const { rerender } = render(
      <VideoNote
        src={SRC}
        transfer="remote"
        transferDirection="download"
        onDownload={onDownload}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Скачать" }));
    expect(onDownload).toHaveBeenCalledTimes(1);
    rerender(
      <VideoNote
        src={SRC}
        transfer="loading"
        transferProgress={0.2}
        transferDirection="download"
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Отменить загрузку" })).toHaveAccessibleDescription(
      "Загрузка 20%",
    );
  });
});
