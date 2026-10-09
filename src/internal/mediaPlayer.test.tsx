import { act, fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { Fieldset } from "@/components/fieldset/Fieldset";
import { VideoNote, type VideoNoteProps } from "@/components/video-note/VideoNote";
import { VoicePlayer, type VoicePlayerProps } from "@/components/voice-player/VoicePlayer";

import type { MediaPlayerProps, MediaPlayerRootProps } from "./mediaPlayer";

type Shared = keyof MediaPlayerProps | keyof MediaPlayerRootProps;

describe("the players share one API", () => {
  it("every shared prop has the same type on VoicePlayer and VideoNote", () => {
    expectTypeOf<Pick<VoicePlayerProps, Shared>>().toEqualTypeOf<Pick<VideoNoteProps, Shared>>();
    expectTypeOf<VoicePlayerProps>().toMatchTypeOf<MediaPlayerProps & MediaPlayerRootProps>();
    expectTypeOf<VideoNoteProps>().toMatchTypeOf<MediaPlayerProps & MediaPlayerRootProps>();
  });

  it("each adds only what its media has: the waveform and rate, or the poster", () => {
    type VoiceOwn = Exclude<keyof VoicePlayerProps, Shared>;
    type NoteOwn = Exclude<keyof VideoNoteProps, Shared>;
    expectTypeOf<VoiceOwn>().toEqualTypeOf<
      "waveform" | "rate" | "defaultRate" | "onRateChange" | "labels"
    >();
    expectTypeOf<NoteOwn>().toEqualTypeOf<"poster" | "labels">();
  });
});

type Player = {
  name: string;
  render: (props: Partial<MediaPlayerProps>) => React.ReactElement;
  play: string;
  unplayed: string;
  /** The element the arrow keys seek on. */
  seeker: () => HTMLElement;
};

const PLAYERS: Player[] = [
  {
    name: "VoicePlayer",
    render: (props) => <VoicePlayer src="/voice.ogg" duration={30} {...props} />,
    play: "Воспроизвести голосовое сообщение",
    unplayed: "Не прослушано",
    seeker: () => screen.getByRole("slider"),
  },
  {
    name: "VideoNote",
    render: (props) => <VideoNote src="/note.mp4" duration={30} {...props} />,
    play: "Воспроизвести видеосообщение",
    unplayed: "Не просмотрено",
    seeker: () => screen.getByRole("button", { name: /Воспроизвести видеосообщение|Пауза/ }),
  },
];

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

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each(PLAYERS)("$name — the shared player behaviour", (player) => {
  const group = () => screen.getByRole("group", { name: /сообщение$/i });
  const disk = () => screen.getByRole("button", { name: player.play });

  it("is a named group whose play disk plays and pauses: data-playing, the playing triad", () => {
    const onPlayingChange = vi.fn();
    render(player.render({ onPlayingChange }));
    expect(group()).not.toHaveAttribute("data-playing");
    fireEvent.click(disk());
    expect(group()).toHaveAttribute("data-playing", "true");
    expect(onPlayingChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByRole("button", { name: "Пауза" }));
    expect(group()).not.toHaveAttribute("data-playing");
    expect(onPlayingChange).toHaveBeenLastCalledWith(false);
  });

  it("plays nothing before a press", () => {
    render(player.render({}));
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("follows `playing` from the owner", () => {
    const { rerender } = render(player.render({ playing: false }));
    rerender(player.render({ playing: true }));
    expect(group()).toHaveAttribute("data-playing", "true");
  });

  it("at the end reports false and `onEnded`", () => {
    const onEnded = vi.fn();
    const onPlayingChange = vi.fn();
    const { container } = render(player.render({ onEnded, onPlayingChange }));
    fireEvent.click(disk());
    const media = container.querySelector("audio, video") as HTMLMediaElement;
    act(() => {
      media.pause();
      fireEvent.ended(media);
    });
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(onPlayingChange).toHaveBeenLastCalledWith(false);
    expect(group()).not.toHaveAttribute("data-playing");
  });

  it("says unplayed to screen readers", () => {
    render(player.render({ unplayed: true }));
    expect(document.body).toHaveTextContent(player.unplayed);
  });

  it("seeks from the keyboard with the same keys", () => {
    const { container } = render(player.render({}));
    const media = container.querySelector("audio, video") as HTMLMediaElement;
    fireEvent.keyDown(player.seeker(), { key: "End" });
    expect(media.currentTime).toBe(30);
    fireEvent.keyDown(player.seeker(), { key: "ArrowLeft" });
    expect(media.currentTime).toBe(25);
  });

  it("disabled — own or from a Fieldset: data-disabled, its buttons off, no play", () => {
    const { rerender } = render(player.render({ disabled: true, transcript: "Текст" }));
    expect(group()).toHaveAttribute("data-disabled", "true");
    expect(disk()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Расшифровать" })).toBeDisabled();
    fireEvent.click(disk());
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    rerender(<Fieldset disabled>{player.render({})}</Fieldset>);
    expect(disk()).toBeDisabled();
    expect(group()).toHaveAttribute("data-disabled", "true");
  });

  it("has the same transcript button: soft xs, opening the text", () => {
    render(player.render({ transcript: "Стойка собрана." }));
    const button = screen.getByRole("button", { name: "Расшифровать" });
    expect(button).toHaveAttribute("data-variant", "soft");
    expect(button).toHaveAttribute("data-size", "xs");
    fireEvent.click(button);
    expect(screen.getByText("Стойка собрана.")).toBeInTheDocument();
  });

  it("draws the transfer on its play disk, named by the direction: data-transfer", () => {
    const onCancel = vi.fn();
    const onRetry = vi.fn();
    const onDownload = vi.fn();
    const { rerender } = render(
      player.render({ transfer: "loading", transferProgress: 0.3, onCancel }),
    );
    expect(group()).toHaveAttribute("data-transfer", "true");
    expect(screen.queryByRole("button", { name: player.play })).toBeNull();
    expect(screen.getByRole("progressbar", { name: "Отправка 30%" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Отменить отправку" }));
    expect(onCancel).toHaveBeenCalledTimes(1);

    rerender(player.render({ transfer: "failed", transferDirection: "download", onRetry }));
    const retry = screen.getByRole("button", { name: "Повторить загрузку" });
    expect(retry).toHaveAccessibleDescription("Не загрузилось");
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(player.render({ transfer: "remote", transferDirection: "download", onDownload }));
    fireEvent.click(screen.getByRole("button", { name: "Скачать" }));
    expect(onDownload).toHaveBeenCalledTimes(1);

    rerender(player.render({ transfer: "done" }));
    expect(group()).not.toHaveAttribute("data-transfer");
    expect(disk()).toBeInTheDocument();
  });
});
