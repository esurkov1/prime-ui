import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mediaDiskClass } from "@/internal/mediaDisk";

import { Thumbnail } from "./Thumbnail";

const css = readFileSync(path.resolve(process.cwd(), "src/internal/mediaDisk.module.css"), "utf8");

describe("Thumbnail", () => {
  it("exposes size, ratio and color as data attributes with defaults m · 1:1 · gray", () => {
    const { container, rerender } = render(<Thumbnail.Root />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-size", "m");
    expect(root).toHaveAttribute("data-ratio", "1:1");
    expect(root).toHaveAttribute("data-color", "gray");
    expect(root).toHaveAttribute("data-variant", "soft");
    rerender(<Thumbnail.Root size="l" ratio="16:9" color="red" variant="solid" fullWidth />);
    expect(root).toHaveAttribute("data-variant", "solid");
    expect(root).toHaveAttribute("data-ratio", "16:9");
    expect(root).toHaveAttribute("data-color", "red");
    expect(root).toHaveAttribute("data-full-width", "true");
  });

  it("shows the image once loaded and hides the fallback from assistive tech", () => {
    render(
      <Thumbnail.Root>
        <Thumbnail.Image src="/bike.jpg" alt="Honda ADV 350" />
        <Thumbnail.Fallback data-testid="fallback">B</Thumbnail.Fallback>
      </Thumbnail.Root>,
    );
    const image = screen.getByRole("img", { name: "Honda ADV 350" });
    expect(image).toHaveAttribute("data-status", "loading");
    fireEvent.load(image);
    expect(image).toHaveAttribute("data-status", "loaded");
    expect(screen.getByTestId("fallback")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the fallback visible when the image fails", () => {
    render(
      <Thumbnail.Root>
        <Thumbnail.Image src="/missing.jpg" alt="" />
        <Thumbnail.Fallback data-testid="fallback">B</Thumbnail.Fallback>
      </Thumbnail.Root>,
    );
    const image = document.querySelector("img") as HTMLImageElement;
    fireEvent.error(image);
    expect(image).toHaveAttribute("data-status", "error");
    expect(screen.getByTestId("fallback")).not.toHaveAttribute("aria-hidden");
  });

  it("passes fit to the image", () => {
    render(
      <Thumbnail.Root>
        <Thumbnail.Image src="/logo.png" alt="Логотип" fit="contain" />
      </Thumbnail.Root>,
    );
    expect(screen.getByRole("img", { name: "Логотип" })).toHaveAttribute("data-fit", "contain");
  });

  describe("Thumbnail.Video", () => {
    it("draws the first frame without a poster, reports its load and shows play and duration", () => {
      render(
        <Thumbnail.Root size="xl">
          <Thumbnail.Video src="/clip.mp4" aria-label="Обзор склада" />
          <Thumbnail.Fallback data-testid="fallback">V</Thumbnail.Fallback>
        </Thumbnail.Root>,
      );
      const video = screen.getByLabelText("Обзор склада") as HTMLVideoElement;
      expect(video.getAttribute("src")).toBe("/clip.mp4#t=0.001");
      expect(video).toHaveAttribute("preload", "metadata");
      expect(video).not.toHaveAttribute("controls");
      expect(video).toHaveAttribute("data-status", "loading");
      fireEvent.loadedData(video);
      expect(video).toHaveAttribute("data-status", "loaded");
      expect(screen.getByTestId("fallback")).toHaveAttribute("aria-hidden", "true");
      Object.defineProperty(video, "duration", { configurable: true, value: 83.4 });
      fireEvent.loadedMetadata(video);
      expect(screen.getByText("1:23")).toBeInTheDocument();
      expect(video.parentElement?.querySelector('[aria-hidden="true"] svg')).not.toBeNull();
    });

    it("marks a still video with the media disk — the look of the play and transfer disks", () => {
      const { container } = render(
        <Thumbnail.Root fullWidth ratio="16:9">
          <Thumbnail.Video src="/clip.mp4" />
        </Thumbnail.Root>,
      );
      const mark = container.querySelector(`.${mediaDiskClass}`);
      expect(mark).toHaveAttribute("aria-hidden", "true");
      expect(mark?.querySelector("svg")).not.toBeNull();
      expect(css).toMatch(/\.disk \{[^}]*background: var\(--prime-color-media-disk\);/);
      expect(css).toMatch(/\.disk \{[^}]*inline-size: var\(--prime-control-l-height\);/);
      expect(css).toMatch(/backdrop-filter: blur\(var\(--prime-media-disk-blur\)\);/);
    });

    it("keeps a poster's source as it is and leaves controls to the browser", () => {
      render(
        <Thumbnail.Root fullWidth>
          <Thumbnail.Video src="/a.mp4" poster="/a.jpg" controls data-testid="video" />
        </Thumbnail.Root>,
      );
      const video = screen.getByTestId("video");
      expect(video.getAttribute("src")).toBe("/a.mp4");
      expect(video).toHaveAttribute("poster", "/a.jpg");
      expect(video).toHaveAttribute("controls");
    });

    it("autoPlay loops muted inline, and stays still under reduced motion", () => {
      // Tests run under reduced motion; this one lets motion through first.
      vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
      try {
        const { unmount } = render(
          <Thumbnail.Root>
            <Thumbnail.Video src="/loop.mp4" autoPlay data-testid="video" />
          </Thumbnail.Root>,
        );
        const video = screen.getByTestId("video") as HTMLVideoElement;
        expect(video.autoplay).toBe(true);
        expect(video.muted).toBe(true);
        expect(video.loop).toBe(true);
        unmount();
      } finally {
        vi.unstubAllGlobals();
      }
      try {
        render(
          <Thumbnail.Root>
            <Thumbnail.Video src="/loop.mp4" autoPlay data-testid="still" />
          </Thumbnail.Root>,
        );
        expect((screen.getByTestId("still") as HTMLVideoElement).autoplay).toBe(false);
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });

  it("asChild puts the frame on a button that opens the object", () => {
    const onClick = vi.fn();
    render(
      <Thumbnail.Root asChild size="l" ratio="4:3">
        <button type="button" aria-label="Открыть фото" onClick={onClick}>
          <Thumbnail.Image src="/a.jpg" />
        </button>
      </Thumbnail.Root>,
    );
    const button = screen.getByRole("button", { name: "Открыть фото" });
    expect(button).toHaveAttribute("data-ratio", "4:3");
    expect(button).toHaveAttribute("data-interactive", "true");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("the checked triad makes a selectable tile: a checkbox with a check in the corner", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Thumbnail.Root aria-label="Фасад" defaultChecked={false} onCheckedChange={onCheckedChange}>
        <Thumbnail.Image src="/a.jpg" />
      </Thumbnail.Root>,
    );
    const tile = screen.getByRole("checkbox", { name: "Фасад" });
    expect(tile).toHaveAttribute("aria-checked", "false");
    fireEvent.click(tile);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(tile).toHaveAttribute("aria-checked", "true");
    expect(tile).toHaveAttribute("data-checked", "true");
    // Controlled: only the owner changes it.
    rerender(
      <Thumbnail.Root aria-label="Фасад" checked={false} onCheckedChange={onCheckedChange}>
        <Thumbnail.Image src="/a.jpg" />
      </Thumbnail.Root>,
    );
    fireEvent.click(tile);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(tile).toHaveAttribute("aria-checked", "false");
    // Space and Enter are the button's own.
    expect(tile.tagName).toBe("BUTTON");
  });

  it("has no outline by default; ring adds one", () => {
    const { rerender, container } = render(<Thumbnail.Root aria-label="t" />);
    expect(container.firstElementChild).not.toHaveAttribute("data-ring");
    rerender(<Thumbnail.Root aria-label="t" ring />);
    expect(container.firstElementChild).toHaveAttribute("data-ring", "true");
  });
});
