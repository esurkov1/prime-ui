import { act, fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { swipe } from "@/test/mobile";

import { MediaViewer, type MediaViewerItem, type MediaViewerProps } from "./MediaViewer";

const ITEMS: MediaViewerItem[] = [
  { src: "/dock.jpg", alt: "Разгрузка у ворот 3", width: 1600, height: 1200 },
  { src: "/pallets.jpg", alt: "Паллеты после приёмки", caption: "Приёмка, 12 марта" },
  { src: "/label.jpg", alt: "Маркировка коробки", thumbnail: "/label-s.jpg" },
];

function renderViewer(props: Partial<MediaViewerProps> = {}) {
  return render(<MediaViewer items={ITEMS} defaultOpen {...props} />);
}

const dialog = () => screen.getByRole("dialog");
const stage = () => dialog().querySelector("[data-autofocus]") as HTMLElement;
const key = (name: string) => fireEvent.keyDown(dialog(), { key: name });
const current = () => dialog().querySelector("[data-current]") as HTMLElement;

describe("MediaViewer", () => {
  it("renders nothing while closed", () => {
    render(<MediaViewer items={ITEMS} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a modal dialog on a dark island, named by default or by aria-label", () => {
    const { unmount } = renderViewer();
    expect(dialog()).toHaveAttribute("aria-modal", "true");
    expect(dialog()).toHaveAccessibleName("Просмотр медиа");
    expect(dialog()).toHaveAttribute("data-theme", "dark");
    unmount();
    renderViewer({ "aria-label": "Фото поставки" });
    expect(dialog()).toHaveAccessibleName("Фото поставки");
  });

  it("opens at defaultIndex with the counter, mounting only the page and two on each side", () => {
    render(
      <MediaViewer
        items={[...ITEMS, { src: "/4.jpg" }, { src: "/5.jpg" }]}
        defaultOpen
        defaultIndex={3}
      />,
    );
    expect(screen.getByText("4 из 5")).toBeInTheDocument();
    const slides = dialog().querySelectorAll("[aria-roledescription='слайд']");
    // Items 2…5 of five around item 4: two before, one after (the last).
    expect(slides).toHaveLength(4);
    expect(current()).toHaveAccessibleName("4 из 5");
    // Off-screen pages are hidden from assistive tech and inert.
    for (const slide of slides) {
      if (slide !== current()) {
        expect(slide).toHaveAttribute("aria-hidden", "true");
        expect(slide).toHaveAttribute("inert");
      }
    }
  });

  it("turns pages with the arrows, Home and End, and reads the new page out", () => {
    const onIndexChange = vi.fn();
    renderViewer({ onIndexChange });
    key("ArrowRight");
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByText("2 из 3")).toBeInTheDocument();
    expect(screen.getByText("Паллеты после приёмки, 2 из 3")).toBeInTheDocument();
    key("End");
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    key("ArrowLeft");
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    key("Home");
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it("stops at the ends, or wraps around with loop", () => {
    const onIndexChange = vi.fn();
    const { unmount } = renderViewer({ onIndexChange });
    expect(screen.getByRole("button", { name: "Предыдущее" })).toBeDisabled();
    key("ArrowLeft");
    expect(onIndexChange).not.toHaveBeenCalled();
    unmount();

    renderViewer({ onIndexChange, loop: true });
    expect(screen.getByRole("button", { name: "Предыдущее" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Предыдущее" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(screen.getByRole("button", { name: "Следующее" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it("follows a controlled index", () => {
    function Controlled() {
      const [index, setIndex] = React.useState(0);
      return (
        <>
          <button type="button" onClick={() => setIndex(2)}>
            third
          </button>
          <MediaViewer items={ITEMS} defaultOpen index={index} onIndexChange={setIndex} />
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByText("1 из 3")).toBeInTheDocument();
    act(() => {
      (screen.getByText("third") as HTMLButtonElement).click();
    });
    expect(screen.getByText("3 из 3")).toBeInTheDocument();
  });

  it("turns the page on a sideways swipe and closes on a swipe down", () => {
    const onOpenChange = vi.fn();
    const onIndexChange = vi.fn();
    renderViewer({ onOpenChange, onIndexChange });
    swipe(stage(), { x: 800, y: 400 }, { x: 100, y: 400 });
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    swipe(stage(), { x: 500, y: 200 }, { x: 500, y: 600 });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the swipe down, the press past the media and Escape off on request", () => {
    const onOpenChange = vi.fn();
    renderViewer({ onOpenChange, closeOnOutsideClick: false, closeOnEscape: false });
    swipe(stage(), { x: 500, y: 200 }, { x: 500, y: 600 });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(dialog()).toBeInTheDocument();
  });

  it("closes from the close button and Escape, and focus returns to the opener", () => {
    function Opener() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Открыть фото
          </button>
          <MediaViewer items={ITEMS} open={open} onOpenChange={setOpen} />
        </>
      );
    }
    render(<Opener />);
    const opener = screen.getByRole("button", { name: "Открыть фото" });
    opener.focus();
    fireEvent.click(opener);
    expect(dialog()).toBeInTheDocument();
    expect(dialog()).toContainElement(document.activeElement as HTMLElement);
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();

    fireEvent.click(opener);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("zooms a loaded picture from the button and the keys", () => {
    renderViewer();
    const image = within(current()).getByRole("img", { name: "Разгрузка у ворот 3" });
    fireEvent.load(image);
    fireEvent.click(screen.getByRole("button", { name: "Увеличить" }));
    expect(dialog()).toHaveAttribute("data-zoomed");
    fireEvent.click(screen.getByRole("button", { name: "Уменьшить" }));
    expect(dialog()).not.toHaveAttribute("data-zoomed");
    key("+");
    expect(dialog()).toHaveAttribute("data-zoomed");
    key("0");
    expect(dialog()).not.toHaveAttribute("data-zoomed");
  });

  it("shows the thumbnail while the picture loads and the caption under it", () => {
    renderViewer({ defaultIndex: 1 });
    expect(within(current()).getByText("Приёмка, 12 марта")).toBeInTheDocument();
    key("ArrowRight");
    expect(current().querySelector("img[src='/label-s.jpg']")).toBeInTheDocument();
    fireEvent.load(within(current()).getByRole("img", { name: "Маркировка коробки" }));
    expect(current().querySelector("img[src='/label-s.jpg']")).not.toBeInTheDocument();
  });

  it("offers a retry when a picture fails", () => {
    renderViewer();
    fireEvent.error(within(current()).getByRole("img", { name: "Разгрузка у ворот 3" }));
    expect(within(current()).getByText("Не удалось загрузить")).toBeInTheDocument();
    fireEvent.click(within(current()).getByRole("button", { name: "Повторить" }));
    expect(within(current()).queryByText("Не удалось загрузить")).not.toBeInTheDocument();
  });

  it("lists every item in the filmstrip and jumps to a thumbnail", () => {
    const onIndexChange = vi.fn();
    renderViewer({ thumbnails: true, onIndexChange });
    const strip = screen.getByRole("navigation", { name: "Миниатюры" });
    const thumbs = within(strip).getAllByRole("button");
    expect(thumbs).toHaveLength(3);
    expect(thumbs[0]).toHaveAttribute("aria-current", "true");
    fireEvent.click(within(strip).getByRole("button", { name: "Показать: Маркировка коробки" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    expect(thumbs[2]).toHaveAttribute("aria-current", "true");
  });

  it("renders actions for the item on screen", () => {
    const renderActions = vi.fn((item: MediaViewerItem) => (
      <button type="button">Скачать {item.alt}</button>
    ));
    renderViewer({ renderActions, defaultIndex: 2 });
    expect(screen.getByRole("button", { name: "Скачать Маркировка коробки" })).toBeInTheDocument();
    expect(renderActions).toHaveBeenLastCalledWith(ITEMS[2], 2);
  });

  it("plays a video from its own controls and has no zoom", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    render(
      <MediaViewer
        items={[
          {
            type: "video",
            src: "/walkthrough.mp4",
            poster: "/walkthrough.jpg",
            alt: "Обход склада",
          },
        ]}
        defaultOpen
      />,
    );
    expect(screen.queryByRole("button", { name: "Увеличить" })).not.toBeInTheDocument();
    expect(screen.queryByText(/из 1/)).not.toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Перемотка" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Выключить звук" })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Воспроизвести" })[0] as HTMLElement);
    expect(play).toHaveBeenCalled();
    play.mockRestore();
  });

  it("keeps hundreds of items cheap: five pages and a screenful of thumbnails mounted", () => {
    const many = Array.from({ length: 400 }, (_, at) => ({
      src: `/${at}.jpg`,
      alt: `Фото ${at + 1}`,
    }));
    render(<MediaViewer items={many} defaultOpen defaultIndex={200} thumbnails />);
    expect(screen.getByText("201 из 400")).toBeInTheDocument();
    expect(dialog().querySelectorAll("[aria-roledescription='слайд']")).toHaveLength(5);
    const strip = screen.getByRole("navigation", { name: "Миниатюры" });
    const thumbs = within(strip).getAllByRole("button");
    expect(thumbs.length).toBeLessThan(40);
    expect(within(strip).getByRole("button", { name: "Показать: Фото 201" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("slides to a far item instead of cutting to it: Home, End and a thumbnail", () => {
    const many = Array.from({ length: 30 }, (_, at) => ({
      src: `/${at}.jpg`,
      alt: `Фото ${at + 1}`,
    }));
    const onIndexChange = vi.fn();
    render(<MediaViewer items={many} defaultOpen thumbnails onIndexChange={onIndexChange} />);
    key("End");
    expect(onIndexChange).toHaveBeenLastCalledWith(29);
    expect(screen.getByText("30 из 30")).toBeInTheDocument();
    key("Home");
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
    const strip = screen.getByRole("navigation", { name: "Миниатюры" });
    fireEvent.click(within(strip).getByRole("button", { name: "Показать: Фото 5" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(4);
    expect(current()).toHaveAccessibleName("5 из 30");
  });

  it("starts a video on its page with autoPlay, and waits for a press without it", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const clip = [{ type: "video" as const, src: "/walkthrough.mp4", alt: "Обход склада" }];
    const { unmount } = render(<MediaViewer items={clip} defaultOpen />);
    expect(play).toHaveBeenCalledTimes(1);
    unmount();
    play.mockClear();
    render(<MediaViewer items={clip} defaultOpen autoPlay={false} />);
    expect(play).not.toHaveBeenCalled();
    play.mockRestore();
  });

  it("sets the sound level and the mute of a video", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    render(
      <MediaViewer
        items={[{ type: "video", src: "/walkthrough.mp4", alt: "Обход" }]}
        defaultOpen
      />,
    );
    const video = dialog().querySelector("video") as HTMLVideoElement;
    const level = screen.getByRole("slider", { name: "Громкость" });
    fireEvent.change(level, { target: { value: "0.4" } });
    expect(video.volume).toBeCloseTo(0.4);
    expect(level).toHaveAttribute("aria-valuetext", "40 %");
    fireEvent.click(screen.getByRole("button", { name: "Выключить звук" }));
    expect(video.muted).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Включить звук" }));
    expect(video.muted).toBe(false);
    expect(video.volume).toBeCloseTo(0.4);
    play.mockRestore();
  });

  it("answers the player keys on a video page: Space, M, Shift + arrows, up and down", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    render(
      <MediaViewer
        items={[{ type: "video", src: "/walkthrough.mp4", alt: "Обход" }, { src: "/dock.jpg" }]}
        defaultOpen
        autoPlay={false}
      />,
    );
    const video = dialog().querySelector("video") as HTMLVideoElement;
    Object.defineProperty(video, "duration", { configurable: true, value: 60 });
    stage().focus();
    fireEvent.keyDown(stage(), { key: " ", code: "Space" });
    expect(play).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(stage(), { key: "m", code: "KeyM" });
    expect(video.muted).toBe(true);
    fireEvent.keyDown(stage(), { key: "ArrowUp" });
    expect(video.muted).toBe(false);
    fireEvent.keyDown(stage(), { key: "ArrowRight", shiftKey: true });
    expect(video.currentTime).toBe(5);
    // A plain arrow still turns the page.
    fireEvent.keyDown(stage(), { key: "ArrowRight" });
    expect(screen.getByText("2 из 2")).toBeInTheDocument();
    play.mockRestore();
    pause.mockRestore();
  });
});
