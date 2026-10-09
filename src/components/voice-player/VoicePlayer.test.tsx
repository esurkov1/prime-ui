import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { Message } from "@/components/message/Message";
import { claimPlayback, releasePlayback } from "@/internal/mediaSession";
import { MessagePartProvider, messagePartOf } from "@/internal/messagePart";

import { getWaveform, VoicePlayer } from "./VoicePlayer";

/** Inside a message that ends with this part: the meta's spacer to place. */
function InMessage({ children }: { children: React.ReactNode }) {
  return (
    <MessagePartProvider
      value={{ spacer: <span data-testid="spacer" />, overlay: null, neutralDepth: 1 }}
    >
      {children}
    </MessagePartProvider>
  );
}

// jsdom has no media playback: play / pause flip a paused flag and fire the media events.
const pausedState = new WeakMap<HTMLMediaElement, boolean>();
const original = {
  play: HTMLMediaElement.prototype.play,
  pause: HTMLMediaElement.prototype.pause,
  paused: Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "paused"),
};

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, "paused", {
    configurable: true,
    get(this: HTMLMediaElement) {
      return pausedState.get(this) ?? true;
    },
  });
  HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
    pausedState.set(this, false);
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  };
  HTMLMediaElement.prototype.pause = function pause(this: HTMLMediaElement) {
    if (pausedState.get(this) === false) {
      pausedState.set(this, true);
      this.dispatchEvent(new Event("pause"));
    }
  };
});

afterAll(() => {
  HTMLMediaElement.prototype.play = original.play;
  HTMLMediaElement.prototype.pause = original.pause;
  if (original.paused) Object.defineProperty(HTMLMediaElement.prototype, "paused", original.paused);
});

const WAVE = [0.2, 0.6, 0.9, 0.4, 0.7, 0.3];

describe("VoicePlayer", () => {
  it("renders a named group with the play button, the slider and the total time", () => {
    render(<VoicePlayer src="/voice.ogg" waveform={WAVE} duration={42} />);
    expect(screen.getByRole("group", { name: "Голосовое сообщение" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }),
    ).toBeInTheDocument();
    const slider = screen.getByRole("slider", { name: "Перемотка" });
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "42");
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    expect(slider).toHaveAttribute("aria-valuetext", "0:00 из 0:42");
    expect(screen.getByText("0:42")).toBeInTheDocument();
  });

  it("toggles play and pause from the button and reports onPlayingChange", () => {
    const onPlayingChange = vi.fn();
    render(<VoicePlayer src="/voice.ogg" duration={42} onPlayingChange={onPlayingChange} />);
    const button = screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" });
    button.focus();
    fireEvent.click(button);
    expect(onPlayingChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("button", { name: "Пауза" })).toBe(button);
    expect(screen.getByRole("group")).toHaveAttribute("data-playing", "true");
    fireEvent.click(button);
    expect(onPlayingChange).toHaveBeenLastCalledWith(false);
    expect(onPlayingChange).toHaveBeenCalledTimes(2);
    expect(button).toHaveAccessibleName("Воспроизвести голосовое сообщение");
  });

  it("plays and pauses from a controlled `playing`", () => {
    const { rerender } = render(<VoicePlayer src="/voice.ogg" duration={42} playing={false} />);
    expect(screen.getByRole("group")).not.toHaveAttribute("data-playing");
    rerender(<VoicePlayer src="/voice.ogg" duration={42} playing />);
    expect(screen.getByRole("group")).toHaveAttribute("data-playing", "true");
    rerender(<VoicePlayer src="/voice.ogg" duration={42} playing={false} />);
    expect(screen.getByRole("group")).not.toHaveAttribute("data-playing");
  });

  it("another sound with volume pauses it; a muted preview does not", () => {
    const onPlayingChange = vi.fn();
    render(<VoicePlayer src="/a.ogg" duration={10} onPlayingChange={onPlayingChange} />);
    // Stand-ins for chat videos: a muted looping preview and a video with sound.
    const muted = document.createElement("video");
    muted.muted = true;
    const video = document.createElement("video");
    const session = (media: HTMLMediaElement) => {
      media.addEventListener("play", () => claimPlayback(media));
      media.addEventListener("pause", () => releasePlayback(media));
    };
    session(muted);
    session(video);
    fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
    act(() => {
      void muted.play();
    });
    expect(screen.getByRole("group")).toHaveAttribute("data-playing", "true");
    act(() => {
      void video.play();
    });
    expect(screen.getByRole("group")).not.toHaveAttribute("data-playing");
    expect(onPlayingChange).toHaveBeenLastCalledWith(false);
    // The voice again: the video pauses.
    fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
    expect(video.paused).toBe(true);
  });

  it("plays one at a time: starting another pauses the first", () => {
    render(
      <>
        <VoicePlayer src="/a.ogg" duration={10} aria-label="Первое" />
        <VoicePlayer src="/b.ogg" duration={10} aria-label="Второе" />
      </>,
    );
    const [first, second] = screen.getAllByRole("button", {
      name: "Воспроизвести голосовое сообщение",
    });
    fireEvent.click(first as HTMLElement);
    expect(screen.getByRole("group", { name: "Первое" })).toHaveAttribute("data-playing", "true");
    fireEvent.click(second as HTMLElement);
    expect(screen.getByRole("group", { name: "Первое" })).not.toHaveAttribute("data-playing");
    expect(screen.getByRole("group", { name: "Второе" })).toHaveAttribute("data-playing", "true");
  });

  it("seeks from the keyboard: arrows ±5 s, PageUp/PageDown ±10 %, Home / End", () => {
    render(<VoicePlayer src="/voice.ogg" duration={100} />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "5");
    fireEvent.keyDown(slider, { key: "ArrowUp" });
    expect(slider).toHaveAttribute("aria-valuenow", "10");
    fireEvent.keyDown(slider, { key: "PageUp" });
    expect(slider).toHaveAttribute("aria-valuenow", "20");
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(slider).toHaveAttribute("aria-valuenow", "15");
    fireEvent.keyDown(slider, { key: "PageDown" });
    expect(slider).toHaveAttribute("aria-valuenow", "5");
    fireEvent.keyDown(slider, { key: "ArrowDown" });
    fireEvent.keyDown(slider, { key: "ArrowDown" });
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    fireEvent.keyDown(slider, { key: "End" });
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    expect(slider).toHaveAttribute("aria-valuetext", "1:40 из 1:40");
    fireEvent.keyDown(slider, { key: "Home" });
    expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows the elapsed time after a seek", () => {
    render(<VoicePlayer src="/voice.ogg" duration={42} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(screen.getByText("0:05")).toBeInTheDocument();
  });

  it("goes back to the start, paused, when playback ends", () => {
    const onEnded = vi.fn();
    const { container } = render(<VoicePlayer src="/voice.ogg" duration={42} onEnded={onEnded} />);
    fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    const audio = container.querySelector("audio") as HTMLAudioElement;
    act(() => {
      audio.pause();
      audio.dispatchEvent(new Event("ended"));
    });
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("group")).not.toHaveAttribute("data-playing");
    expect(screen.getByText("0:42")).toBeInTheDocument();
  });

  it("ends as a full reset: play button, position 0, progress var empty, playing false", () => {
    const onPlayingChange = vi.fn();
    const { container } = render(
      <VoicePlayer src="/voice.ogg" duration={42} onPlayingChange={onPlayingChange} />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
    fireEvent.keyDown(screen.getByRole("slider"), { key: "End" });
    const played = container.querySelector<HTMLElement>("[style*='--vp-progress']");
    expect(played?.style.getPropertyValue("--vp-progress")).toBe("1");
    act(() => {
      audio.pause();
      audio.dispatchEvent(new Event("ended"));
    });
    expect(onPlayingChange).toHaveBeenLastCalledWith(false);
    expect(
      screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
    expect(played?.style.getPropertyValue("--vp-progress")).toBe("0");
    expect(screen.getByText("0:42")).toBeInTheDocument();
  });

  it("controlled: the end reports false and the owner's state returns to not playing", () => {
    function Owner() {
      const [playing, setPlaying] = React.useState(true);
      return (
        <>
          <VoicePlayer
            src="/voice.ogg"
            duration={42}
            playing={playing}
            onPlayingChange={setPlaying}
          />
          <output>{playing ? "on" : "off"}</output>
        </>
      );
    }
    const { container } = render(<Owner />);
    const audio = container.querySelector("audio") as HTMLAudioElement;
    expect(screen.getByRole("status")).toHaveTextContent("on");
    act(() => {
      audio.pause();
      audio.dispatchEvent(new Event("ended"));
    });
    expect(screen.getByRole("status")).toHaveTextContent("off");
    expect(screen.getByRole("group")).not.toHaveAttribute("data-playing");
  });

  it("cycles the rate 1× → 1,5× → 2× → 1× and reports it", () => {
    const onRateChange = vi.fn();
    const { container } = render(
      <VoicePlayer src="/voice.ogg" duration={42} onRateChange={onRateChange} />,
    );
    const chip = screen.getByRole("button", { name: "Скорость воспроизведения: 1×" });
    const audio = container.querySelector("audio") as HTMLAudioElement;
    fireEvent.click(chip);
    expect(onRateChange).toHaveBeenLastCalledWith(1.5);
    expect(chip).toHaveAccessibleName("Скорость воспроизведения: 1,5×");
    expect(audio.playbackRate).toBe(1.5);
    fireEvent.click(chip);
    expect(onRateChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(chip);
    expect(onRateChange).toHaveBeenLastCalledWith(1);
  });

  it("keeps a controlled rate", () => {
    const onRateChange = vi.fn();
    render(<VoicePlayer src="/voice.ogg" rate={2} onRateChange={onRateChange} />);
    const chip = screen.getByRole("button", { name: "Скорость воспроизведения: 2×" });
    fireEvent.click(chip);
    expect(onRateChange).toHaveBeenCalledWith(1);
    expect(chip).toHaveAccessibleName("Скорость воспроизведения: 2×");
  });

  it("says unplayed to screen readers", () => {
    render(<VoicePlayer src="/voice.ogg" duration={42} unplayed />);
    expect(screen.getByText("Не прослушано")).toBeInTheDocument();
  });

  it("turns everything off when disabled or while the recording transfers", () => {
    const { rerender } = render(<VoicePlayer src="/voice.ogg" duration={42} disabled />);
    expect(
      screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }),
    ).toBeDisabled();
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-disabled", "true");
    expect(slider).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(slider, { key: "End" });
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    // Received without a known share: the transfer disk with the indeterminate arc, and its cross.
    const onCancel = vi.fn();
    rerender(
      <VoicePlayer
        src="/voice.ogg"
        duration={42}
        transfer="loading"
        transferDirection="download"
        onCancel={onCancel}
      />,
    );
    const cancel = screen.getByRole("button", { name: "Отменить загрузку" });
    // No share known: the ring turns a quarter arc.
    const ring = cancel.querySelector<SVGSVGElement>("svg[data-weight]");
    expect(ring?.style.getPropertyValue("--ring-value")).toBe("0.25");
    expect(ring).toHaveAttribute("data-spin", "true");
    expect(screen.queryByRole("button", { name: "Воспроизвести голосовое сообщение" })).toBeNull();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("is focusable from the keyboard: button, slider, rate chip", () => {
    render(<VoicePlayer src="/voice.ogg" duration={42} />);
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "0");
  });

  it("puts the message meta's spacer at the end of the time row", () => {
    render(
      <InMessage>
        <VoicePlayer src="/voice.ogg" duration={42} />
      </InMessage>,
    );
    const spacer = screen.getByTestId("spacer");
    const row = spacer.parentElement as HTMLElement;
    expect(row.lastElementChild).toBe(spacer);
    expect(row).toHaveTextContent("0:42");
    expect(screen.getAllByTestId("spacer")).toHaveLength(1);
  });

  it("renders no spacer outside a message", () => {
    render(<VoicePlayer src="/voice.ogg" duration={42} />);
    expect(screen.queryByTestId("spacer")).toBeNull();
  });

  it("is declared a fill part with an inline meta, its transcript searchable", () => {
    const spec = messagePartOf(VoicePlayer);
    expect(spec).toMatchObject({ shell: "fill", meta: "inline" });
    expect(spec?.text?.({ src: "/v.ogg", transcript: "Склад B" } as never)).toBe("Склад B");
  });

  it("draws as many bars as fit the observed width, the same geometry as the Composer's wave", () => {
    let report: ResizeObserverCallback = () => {};
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          report = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    try {
      const { container } = render(<VoicePlayer src="/voice.ogg" waveform={WAVE} duration={4} />);
      const slider = screen.getByRole("slider");
      // A bar 3 px + a gap 2 px (`--prime-space-1` = 4 px): 100 px hold 20 bars.
      act(() =>
        report(
          [{ target: slider, contentRect: { width: 100 } } as unknown as ResizeObserverEntry],
          {} as ResizeObserver,
        ),
      );
      const layers = container.querySelectorAll("[role='slider'] > span");
      expect(layers).toHaveLength(2);
      expect(layers[0]?.children).toHaveLength(20);
      expect(layers[1]?.children).toHaveLength(20);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("while playing, a frame writes the played share on one layer only — no render per frame", () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    try {
      const { container } = render(<VoicePlayer src="/voice.ogg" waveform={WAVE} duration={10} />);
      const audio = container.querySelector("audio") as HTMLAudioElement;
      fireEvent.click(screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" }));
      const played = container.querySelector<HTMLElement>("[style*='--vp-progress']");
      const snapshot = () =>
        Array.from(container.querySelectorAll("*"))
          .filter((element) => element !== played)
          .map((element) =>
            Array.from(element.attributes)
              .map((attribute) => `${attribute.name}=${attribute.value}`)
              .join(" "),
          )
          .join("\n");
      const before = snapshot();
      for (let tick = 1; tick <= 5; tick += 1) {
        Object.defineProperty(audio, "currentTime", { value: tick * 0.1, configurable: true });
        act(() => frames.shift()?.(tick * 16));
      }
      expect(snapshot()).toBe(before);
      expect(played?.style.getPropertyValue("--vp-progress")).toBe("0.05");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("getWaveform", () => {
  class FakeAudioContext {
    static closed = 0;
    decodeAudioData = vi.fn(async (_data: ArrayBuffer) => {
      // Two channels of 8 samples: the loudest slice peaks at 0.8 (left) and 0.4 (right).
      const left = new Float32Array([0.1, -0.2, 0.4, 0.2, -0.8, 0.1, 0, 0]);
      const right = new Float32Array([0.2, 0.1, -0.1, 0.3, 0.4, 0, 0, 0]);
      return {
        length: 8,
        numberOfChannels: 2,
        getChannelData: (index: number) => (index === 0 ? left : right),
      };
    });
    close = vi.fn(async () => {
      FakeAudioContext.closed += 1;
    });
  }

  beforeAll(() => {
    vi.stubGlobal("AudioContext", FakeAudioContext);
  });
  afterAll(() => vi.unstubAllGlobals());

  it("decodes a blob into peak levels 0…1, the loudest at 1, and closes its context", async () => {
    const blob = new Blob([new Uint8Array(16)], { type: "audio/ogg" });
    const levels = await getWaveform(blob, 4);
    // Slice peaks across both channels: 0.2, 0.4, 0.8, 0 — scaled to the loudest.
    expect(levels).toEqual([0.25, 0.5, 1, 0]);
    expect(FakeAudioContext.closed).toBe(1);
  });

  it("fetches a URL; a failed request rejects", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url === "/ok.ogg" ? new Response(new Uint8Array(8)) : new Response(null, { status: 404 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    expect(await getWaveform("/ok.ogg", 2)).toEqual([0.5, 1]);
    await expect(getWaveform("/missing.ogg")).rejects.toThrow();
  });
});

describe("VoicePlayer — transcript", () => {
  const TEXT = "Счёт по заказу 1042 оплачен, отгрузка в четверг.";
  const toggle = (name: string) => screen.getByRole("button", { name });

  it("has no transcript button when nothing can be transcribed", () => {
    render(<VoicePlayer src="/voice.ogg" duration={12} />);
    expect(screen.queryByRole("button", { name: "Расшифровать" })).toBeNull();
  });

  it("opens and closes the known text with aria-expanded and aria-controls", () => {
    const onChange = vi.fn();
    render(
      <VoicePlayer
        src="/voice.ogg"
        duration={12}
        transcript={TEXT}
        onTranscriptExpandedChange={onChange}
      />,
    );
    const button = toggle("Расшифровать");
    const region = document.getElementById(button.getAttribute("aria-controls") ?? "");
    expect(button).toHaveAttribute("aria-expanded", "false");
    // The collapsed disclosure is always there; closed it is hidden from assistive tech by CSS.
    expect(region).toHaveAttribute("data-state", "closed");

    fireEvent.click(button);
    expect(onChange).toHaveBeenLastCalledWith(true);
    const open = toggle("Скрыть расшифровку");
    expect(open).toHaveAttribute("aria-expanded", "true");
    expect(region).toHaveAttribute("data-state", "open");
    const text = screen.getByText(TEXT);
    expect(text).toHaveAttribute("data-message-selectable");
    expect(region).toContainElement(text);

    fireEvent.click(open);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(toggle("Расшифровать")).toHaveAttribute("aria-expanded", "false");
    expect(region).toHaveAttribute("data-state", "closed");
  });

  it("toggles from the keyboard: the button is a native button", () => {
    render(<VoicePlayer src="/voice.ogg" duration={12} transcript={TEXT} />);
    const button = toggle("Расшифровать");
    button.focus();
    expect(button).toHaveFocus();
    expect(button.tagName).toBe("BUTTON");
    fireEvent.click(button); // Enter / Space on a native button
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });

  it("asks once with onTranscribe: only the button spins while pending, then the text opens", async () => {
    let resolve: (text: string) => void = () => {};
    const onTranscribe = vi.fn(() => new Promise<string>((r) => (resolve = r)));
    const { container } = render(
      <VoicePlayer src="/voice.ogg" duration={12} onTranscribe={onTranscribe} />,
    );
    fireEvent.click(toggle("Расшифровать"));
    expect(onTranscribe).toHaveBeenCalledTimes(1);
    // The area stays closed: no placeholder, the button spins.
    expect(container.querySelector("[data-transcript] p")).toBeNull();
    expect(toggle("Расшифровать")).toHaveAttribute("aria-busy", "true");
    expect(toggle("Расшифровать")).toHaveAttribute("aria-expanded", "false");

    await act(async () => resolve(TEXT));
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    expect(toggle("Скрыть расшифровку")).not.toHaveAttribute("aria-busy");

    // Closed and opened again: the text is known, no second request.
    fireEvent.click(toggle("Скрыть расшифровку"));
    fireEvent.click(toggle("Расшифровать"));
    expect(onTranscribe).toHaveBeenCalledTimes(1);
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });

  it("rolls back on a rejection: closes and announces the failure", async () => {
    let reject: () => void = () => {};
    const onChange = vi.fn();
    render(
      <VoicePlayer
        src="/voice.ogg"
        duration={12}
        onTranscribe={() => new Promise<string>((_, r) => (reject = () => r(new Error("no"))))}
        onTranscriptExpandedChange={onChange}
      />,
    );
    fireEvent.click(toggle("Расшифровать"));
    await act(async () => reject());
    expect(toggle("Расшифровать")).toHaveAttribute("aria-expanded", "false");
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("status")).toHaveTextContent("Не удалось расшифровать сообщение");
  });

  it("spins until the owner passes transcript when onTranscribe returns nothing", () => {
    const { container, rerender } = render(
      <VoicePlayer src="/voice.ogg" duration={12} onTranscribe={() => {}} />,
    );
    fireEvent.click(toggle("Расшифровать"));
    expect(container.querySelector("[data-transcript] p")).toBeNull();
    expect(toggle("Расшифровать")).toHaveAttribute("aria-busy", "true");
    rerender(
      <VoicePlayer src="/voice.ogg" duration={12} onTranscribe={() => {}} transcript={TEXT} />,
    );
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });

  it("is controlled by transcriptExpanded", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <VoicePlayer
        src="/voice.ogg"
        transcript={TEXT}
        transcriptExpanded={false}
        onTranscriptExpandedChange={onChange}
      />,
    );
    fireEvent.click(toggle("Расшифровать"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(toggle("Расшифровать")).toHaveAttribute("aria-expanded", "false");
    rerender(
      <VoicePlayer
        src="/voice.ogg"
        transcript={TEXT}
        transcriptExpanded
        onTranscriptExpandedChange={onChange}
      />,
    );
    expect(toggle("Скрыть расшифровку")).toHaveAttribute("aria-expanded", "true");
  });

  it("moves the meta's spacer to the end of the open text, and back to the time row", () => {
    render(
      <InMessage>
        <VoicePlayer src="/voice.ogg" duration={12} transcript={TEXT} defaultTranscriptExpanded />
      </InMessage>,
    );
    expect(screen.getAllByTestId("spacer")).toHaveLength(1);
    expect(screen.getByText(TEXT).parentElement).toContainElement(screen.getByTestId("spacer"));
    fireEvent.click(toggle("Скрыть расшифровку"));
    expect(screen.getAllByTestId("spacer")).toHaveLength(1);
    expect(screen.queryByText(TEXT)).toBeNull();
    expect(screen.getByRole("group").contains(screen.getByTestId("spacer"))).toBe(true);
  });
});

describe("VoicePlayer transfer", () => {
  it("the play disk carries the transfer while the recording goes up, and plays again when done", () => {
    const onCancel = vi.fn();
    const onRetry = vi.fn();
    const { rerender } = render(
      <VoicePlayer
        src="blob:voice"
        duration={12}
        transfer="loading"
        transferProgress={0.4}
        onCancel={onCancel}
      />,
    );
    // One disk: the play disk itself turns into the cross, its ring the share.
    expect(screen.queryByRole("button", { name: "Воспроизвести голосовое сообщение" })).toBeNull();
    const cancel = screen.getByRole("button", { name: "Отменить отправку" });
    expect(cancel).toHaveAccessibleDescription("Отправка 40%");
    expect(cancel).toHaveAttribute("aria-busy", "true");
    // The play disk's own look: the solid accent disk, not the media shade.
    expect(cancel).toHaveAttribute("data-variant", "solid");
    expect(cancel).toHaveAttribute("data-shape", "circle");
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);

    rerender(<VoicePlayer src="blob:voice" duration={12} transfer="failed" onRetry={onRetry} />);
    const retry = screen.getByRole("button", { name: "Повторить отправку" });
    expect(retry).toBe(cancel);
    expect(retry).toHaveAttribute("data-tone", "danger");
    expect(retry).toHaveAccessibleDescription("Не отправилось");
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<VoicePlayer src="blob:voice" duration={12} transfer="done" transferProgress={1} />);
    const play = screen.getByRole("button", { name: "Воспроизвести голосовое сообщение" });
    expect(play).toBe(cancel);
    expect(play).not.toHaveAttribute("aria-busy");
    expect(play).toHaveAttribute("data-tone", "accent");
  });

  it("a remote recording offers the download on the play disk; a refused one is announced", async () => {
    let reject: () => void = () => {};
    const onDownload = vi.fn(
      () => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))),
    );
    render(
      <VoicePlayer
        src="blob:voice"
        duration={12}
        transfer="remote"
        transferDirection="download"
        onDownload={onDownload}
      />,
    );
    const download = screen.getByRole("button", { name: "Скачать" });
    expect(download).toHaveAttribute("data-variant", "solid");
    expect(download.querySelector("svg[data-weight]")).toBeNull();
    fireEvent.click(download);
    expect(download).toHaveAttribute("aria-busy", "true");
    await act(async () => reject());
    expect(screen.getByText("Не удалось скачать")).toBeInTheDocument();
  });

  it("the transfer disk is the same in a message and outside it, in both directions", () => {
    const shape = (root: Element | null) => {
      const disk = root?.querySelector("[data-shape='circle']")?.parentElement;
      // Structure and classes only: ids from useId differ between renders.
      return disk?.outerHTML.replace(/ (id|aria-describedby)="[^"]*"/g, "");
    };
    const player = (
      <VoicePlayer
        src="blob:voice"
        duration={12}
        transfer="loading"
        transferProgress={0.4}
        onCancel={() => {}}
      />
    );
    const outside = render(player);
    const alone = shape(outside.container);
    outside.unmount();
    for (const direction of ["incoming", "outgoing"] as const) {
      const inside = render(
        <Message.Root direction={direction} time="10:00">
          {player}
        </Message.Root>,
      );
      expect(alone).toBeTruthy();
      expect(shape(inside.container)).toBe(alone);
      inside.unmount();
    }
  });
});
