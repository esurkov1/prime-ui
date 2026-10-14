import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMediaSession } from "./mediaSession";

function Media({ name, muted = false }: { name: string; muted?: boolean }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  useMediaSession(ref);
  return <video ref={ref} data-testid={name} muted={muted} />;
}

const media = (name: string) => screen.getByTestId(name) as HTMLVideoElement;

beforeEach(() => {
  // jsdom has no playback: play / pause flip a paused flag and fire the media events.
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useMediaSession", () => {
  it("a sound that starts pauses the one that played", () => {
    render(
      <>
        <Media name="a" />
        <Media name="b" />
      </>,
    );
    act(() => void media("a").play());
    act(() => void media("b").play());
    expect(media("a").paused).toBe(true);
    expect(media("b").paused).toBe(false);
  });

  it("a muted element neither takes the session nor pauses the sound", () => {
    render(
      <>
        <Media name="sound" />
        <Media name="preview" muted />
      </>,
    );
    act(() => void media("sound").play());
    act(() => void media("preview").play());
    expect(media("sound").paused).toBe(false);
  });

  it("a paused or ended sound frees the session: the next start pauses nothing", () => {
    render(
      <>
        <Media name="a" />
        <Media name="b" />
      </>,
    );
    act(() => void media("a").play());
    act(() => {
      media("a").pause();
      fireEvent.ended(media("a"));
    });
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    pause.mockClear();
    act(() => void media("b").play());
    expect(pause).not.toHaveBeenCalled();
  });

  it("an element that gets its sound back while playing takes the session", () => {
    render(
      <>
        <Media name="sound" />
        <Media name="preview" muted />
      </>,
    );
    act(() => void media("sound").play());
    act(() => void media("preview").play());
    act(() => {
      media("preview").muted = false;
      fireEvent(media("preview"), new Event("volumechange"));
    });
    expect(media("sound").paused).toBe(true);
  });

  it("an element that goes away frees the session", () => {
    const { rerender } = render(
      <>
        <Media name="a" />
        <Media name="b" />
      </>,
    );
    act(() => void media("a").play());
    rerender(<Media name="b" />);
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    pause.mockClear();
    act(() => void media("b").play());
    expect(pause).not.toHaveBeenCalled();
  });
});
