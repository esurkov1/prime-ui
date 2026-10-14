import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MessagePartProvider } from "@/internal/messagePart";
import press from "@/internal/press.module.css";
import { cssRule, cssValue } from "@/test/css";

import { Gallery, type GalleryItem } from "./Gallery";
import { type GalleryTile, itemRatio, layoutGallery } from "./layout";

const photo = (i: number, width = 800, height = 600): GalleryItem => ({
  src: `/photo-${i}.jpg`,
  alt: `Стеллаж ${i + 1}`,
  width,
  height,
});

const round = (tile: GalleryTile) => [tile.x, tile.y, tile.w, tile.h].map((v) => +v.toFixed(2));

/** Tiles inside the box, covering it exactly, never overlapping. */
function expectTiling(tiles: GalleryTile[]) {
  const eps = 1e-6;
  let area = 0;
  for (const tile of tiles) {
    expect(tile.x).toBeGreaterThanOrEqual(-eps);
    expect(tile.y).toBeGreaterThanOrEqual(-eps);
    expect(tile.x + tile.w).toBeLessThanOrEqual(1 + eps);
    expect(tile.y + tile.h).toBeLessThanOrEqual(1 + eps);
    area += tile.w * tile.h;
  }
  expect(area).toBeCloseTo(1, 4);
  tiles.forEach((a, i) => {
    for (const b of tiles.slice(i + 1)) {
      const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      expect(overlapX > eps && overlapY > eps).toBe(false);
    }
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("layoutGallery", () => {
  it("keeps a lone item's ratio; a portrait is narrower than the cap", () => {
    expect(layoutGallery([4 / 3])).toMatchObject({ ratio: 4 / 3, widthFactor: 1 });
    expect(layoutGallery([0.6])).toMatchObject({ ratio: 0.6, widthFactor: 0.6 });
    // Ratios are kept between a tall portrait and a wide panorama.
    expect(itemRatio(100, 1000, true)).toBe(0.6);
    expect(itemRatio(4000, 1000, false)).toBe(2);
    expect(itemRatio(undefined, undefined, true)).toBe(4 / 3);
  });

  it("two: wide ones of one shape stack, two alike sit as halves, different ones share by ratio", () => {
    expect(layoutGallery([1.6, 1.6]).tiles.map(round)).toEqual([
      [0, 0, 1, 0.5],
      [0, 0.5, 1, 0.5],
    ]);
    expect(layoutGallery([1, 1]).tiles.map(round)).toEqual([
      [0, 0, 0.5, 1],
      [0.5, 0, 0.5, 1],
    ]);
    const [portrait, landscape] = layoutGallery([0.67, 1.5]).tiles;
    expect(portrait?.w).toBeLessThan(landscape?.w ?? 0);
    expect(portrait?.h).toBe(1);
  });

  it("three: a portrait first stands beside a column; a landscape first tops a row", () => {
    expect(layoutGallery([0.67, 1.33, 1.33]).tiles.map(round)).toEqual([
      [0, 0, 0.5, 1],
      [0.5, 0, 0.5, 0.5],
      [0.5, 0.5, 0.5, 0.5],
    ]);
    const [top, left, right] = layoutGallery([1.5, 1, 1]).tiles;
    expect(top).toMatchObject({ x: 0, y: 0, w: 1 });
    expect(left?.y).toBeCloseTo(top?.h ?? 0);
    expect(right?.x).toBeCloseTo(0.5);
  });

  it("four: a wide first tops three in a row; a tall first stands beside three stacked", () => {
    const wide = layoutGallery([1.6, 1, 1, 1]).tiles;
    expect(wide[0]?.w).toBe(1);
    expect(new Set(wide.slice(1).map((tile) => tile.y.toFixed(4))).size).toBe(1);
    const tall = layoutGallery([0.6, 1.33, 1.33, 1.33]).tiles;
    expect(tall[0]).toMatchObject({ x: 0, y: 0, h: 1 });
    expect(new Set(tall.slice(1).map((tile) => tile.x.toFixed(4))).size).toBe(1);
  });

  it("five to ten: rows, fewer items above more", () => {
    const rowsOf = (tiles: GalleryTile[]) => {
      const counts = new Map<string, number>();
      for (const tile of tiles) {
        const key = tile.y.toFixed(4);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      return [...counts.values()];
    };
    expect(rowsOf(layoutGallery([1, 1, 1, 1, 1]).tiles)).toEqual([2, 3]);
    const ten = rowsOf(layoutGallery(Array.from({ length: 10 }, () => 1)).tiles);
    expect(ten.length).toBeLessThanOrEqual(4);
    expect(ten.reduce((sum, count) => sum + count, 0)).toBe(10);
    for (let i = 1; i < ten.length; i++) {
      expect(ten[i - 1]).toBeLessThanOrEqual(ten[i] as number);
    }
  });

  it("lays out every count from 1 to 10: a layout for each, no gaps or overlaps, sane tile shapes", () => {
    const ratios = [0.5, 1.8, 0.75, 1.33, 1, 2, 0.6, 1.5, 1.1, 0.9];
    for (let count = 1; count <= 10; count++) {
      for (let shift = 0; shift < ratios.length; shift++) {
        const list = Array.from({ length: count }, (_, i) => ratios[(i + shift) % ratios.length]);
        const layout = layoutGallery(list as number[]);
        expect(layout.tiles).toHaveLength(count);
        expect(layout.ratio).toBeGreaterThan(0);
        expectTiling(layout.tiles);
        // The aspect math: a tile of a row-based album keeps its item's (cropped) shape — its
        // width over its height, in the gallery's units, is a ratio within the kept range.
        for (const tile of layout.tiles) {
          const shape = (tile.w * layout.ratio) / tile.h;
          expect(shape).toBeGreaterThan(0.2);
          expect(shape).toBeLessThan(6);
        }
      }
    }
  });
});

describe("Gallery", () => {
  it("places every tile from the data before anything loads: images lazy and async", () => {
    const { container } = render(
      <Gallery items={[photo(0, 600, 900), photo(1, 1600, 900), photo(2)]} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--gallery-ratio")).not.toBe("");
    const tiles = root.querySelectorAll<HTMLElement>("[data-gallery-tile]");
    expect(tiles).toHaveLength(3);
    // A portrait first: the tall tile at the start, full height, its inner edge inset by a gap.
    expect(tiles[0]?.style.getPropertyValue("--h")).toBe("1");
    expect(tiles[0]?.style.getPropertyValue("--ge")).toBe("1");
    expect(tiles[0]?.style.getPropertyValue("--gs")).toBe("0");
    for (const image of container.querySelectorAll("img")) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("decoding", "async");
    }
    // A lone portrait is narrower than the cap.
    const single = render(<Gallery items={[photo(9, 600, 900)]} />);
    expect(
      (single.container.firstElementChild as HTMLElement).style.getPropertyValue(
        "--gallery-factor",
      ),
    ).toBe(String(0.66667));
  });

  it("keeps at most 10 items, every tile a button that opens the viewer", () => {
    render(
      <Gallery
        items={Array.from({ length: 12 }, (_, i) => photo(i))}
        viewer={false}
        onIndexChange={() => {}}
      />,
    );
    const tiles = screen.getAllByRole("button", { name: /^Открыть/ });
    expect(tiles).toHaveLength(10);
    expect(tiles[0]).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("opens the album in MediaViewer at the pressed tile, pages through it, and closes back to the tile", async () => {
    const onIndexChange = vi.fn();
    render(<Gallery items={[photo(0), photo(1), photo(2)]} onIndexChange={onIndexChange} />);
    const tile = screen.getByRole("button", { name: "Открыть: Стеллаж 2" });
    tile.focus();
    await userEvent.keyboard("{Enter}");
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("2 из 3");
    await userEvent.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    expect(dialog).toHaveTextContent("3 из 3");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull(), { timeout: 3000 });
    expect(tile).toHaveFocus();
  });

  it("with `viewer={false}` opens nothing of its own: the triads tell the screen", async () => {
    const onOpenChange = vi.fn();
    const onIndexChange = vi.fn();
    render(
      <Gallery
        items={[photo(0), photo(1)]}
        viewer={false}
        onOpenChange={onOpenChange}
        onIndexChange={onIndexChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Открыть: Стеллаж 2" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("presses as one album: the root gives, never a tile", () => {
    const { container } = render(<Gallery items={[photo(0), photo(1)]} />);
    const root = container.firstElementChild as HTMLElement;
    const tile = screen.getByRole("button", { name: "Открыть: Стеллаж 2" });
    expect(root.className).toContain(press.press);
    expect(tile.closest("[data-gallery-tile]")?.className).not.toContain(press.press);
  });

  it("in a message the message takes the press: pointer, Enter or Space on a tile", () => {
    const onPress = vi.fn();
    const { container } = render(
      <MessagePartProvider value={{ spacer: null, overlay: null, neutralDepth: 1, press: onPress }}>
        <Gallery items={[photo(0), photo(1)]} />
      </MessagePartProvider>,
    );
    expect((container.firstElementChild as HTMLElement).className).not.toContain(press.press);
    const tile = screen.getByRole("button", { name: "Открыть: Стеллаж 2" });
    fireEvent.pointerDown(tile);
    expect(onPress).toHaveBeenLastCalledWith(true);
    fireEvent.pointerUp(tile);
    expect(onPress).toHaveBeenLastCalledWith(false);
    fireEvent.keyDown(tile, { key: " " });
    expect(onPress).toHaveBeenLastCalledWith(true);
    fireEvent.keyUp(tile, { key: " " });
    expect(onPress).toHaveBeenLastCalledWith(false);
  });

  it("keyboard: Tab moves through the tiles; Space opens the album at the focused one", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(<Gallery items={[photo(0), photo(1)]} onIndexChange={onIndexChange} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Открыть: Стеллаж 1" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Открыть: Стеллаж 2" })).toHaveFocus();
    await user.keyboard(" ");
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(await screen.findByRole("dialog")).toHaveTextContent("2 из 2");
  });

  it("maxSize: the host's length caps the width and the gallery draws no radius of its own", () => {
    const { container, rerender } = render(<Gallery items={[photo(0)]} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toHaveAttribute("data-max-size");
    rerender(<Gallery items={[photo(0)]} maxSize="85cqi" />);
    expect(root).toHaveAttribute("data-max-size", "true");
    expect(root.style.getPropertyValue("--gallery-limit")).toBe("85cqi");
    const capped = cssRule("src/components/gallery/Gallery.module.css", ".root[data-max-size]");
    expect(cssValue(capped, "border-radius")).toBe("0");
    expect(cssValue(capped, "max-inline-size")).toBe("none");
  });

  it("lays out at most ten items: one cap, in the layout", () => {
    const many = Array.from({ length: 12 }, (_, i) => photo(i));
    render(<Gallery items={many} />);
    expect(screen.getAllByRole("button", { name: /^Открыть/ })).toHaveLength(10);
    expect(layoutGallery(many.map(() => 1)).tiles).toHaveLength(10);
  });

  it("lays its children over every tile", () => {
    render(
      <Gallery items={[photo(0)]}>
        <span data-testid="over" />
      </Gallery>,
    );
    expect(screen.getByTestId("over").parentElement).toHaveAttribute("data-count", "1");
  });

  it("mounts a video only once its tile nears the view, then shows its first frame and length", () => {
    let report: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          report = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container } = render(
      <Gallery items={[{ type: "video", src: "/clip.mp4", duration: 75, alt: "Рампа" }]} />,
    );
    expect(container.querySelector("video")).toBeNull();
    // The length is data: shown before anything loads.
    expect(container).toHaveTextContent("1:15");
    act(() =>
      report([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
    );
    expect(container.querySelector("video")).toHaveAttribute("preload", "metadata");
  });

  it("shows an upload on the shared disk that cancels; a slow cancel is pending, a refused one announced", async () => {
    let reject: () => void = () => {};
    const onCancel = vi.fn(() => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))));
    render(
      <Gallery
        items={[{ ...photo(0), transfer: "loading", transferProgress: 0.42 }]}
        onCancel={onCancel}
      />,
    );
    const cancel = screen.getByRole("button", { name: "Отменить отправку" });
    expect(cancel).toHaveAccessibleDescription("Отправка 42%");
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledWith(0);
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);
    await act(async () => reject());
    expect(screen.getByText("Не удалось отменить")).toBeInTheDocument();
  });

  it("a failed tile turns the disk into a retry described by the reason", async () => {
    const onRetry = vi.fn();
    render(
      <Gallery
        items={[{ ...photo(0), transfer: "failed", transferDirection: "download" }]}
        onRetry={onRetry}
      />,
    );
    const retry = screen.getByRole("button", { name: "Повторить загрузку" });
    expect(retry).toHaveAccessibleDescription("Не загрузилось");
    await userEvent.click(retry);
    expect(onRetry).toHaveBeenCalledWith(0);
  });

  it("a remote tile carries the download arrow; the picture dims under it", async () => {
    const onDownload = vi.fn();
    const { container } = render(
      <Gallery
        items={[{ ...photo(0), transfer: "remote", transferDirection: "download" }]}
        onDownload={onDownload}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Скачать Стеллаж 1" }));
    expect(onDownload).toHaveBeenCalledWith(0);
    expect(container.querySelector("[data-covered]")).not.toBeNull();
  });
});
