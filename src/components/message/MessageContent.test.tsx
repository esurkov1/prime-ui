import { readFileSync } from "node:fs";
import path from "node:path";

import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MessagePartProvider, messagePartOf } from "@/internal/messagePart";
import type { SurfaceDepth } from "@/internal/surfaceDepth";

import { MessageContact, MessageLinkPreview, MessageLocation } from "./MessageCards";
import { MessageFile } from "./MessageFile";
import { MessageMedia, type MessageMediaItem } from "./MessageMedia";

/** Inside a message that ends with this part: the spacer and the overlay to place. */
function InMessage({
  children,
  neutralDepth = 2,
}: {
  children: React.ReactNode;
  neutralDepth?: SurfaceDepth;
}) {
  return (
    <MessagePartProvider
      value={{
        spacer: <span data-testid="spacer" />,
        overlay: <span data-testid="overlay" />,
        neutralDepth,
      }}
    >
      {children}
    </MessagePartProvider>
  );
}

const photo = (i: number, width = 800, height = 600): MessageMediaItem => ({
  src: `/photo-${i}.jpg`,
  alt: `Стеллаж ${i + 1}`,
  width,
  height,
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Message.Media", () => {
  it("lays out an album in rows and names the tiles that open the viewer", async () => {
    const onItemOpen = vi.fn();
    const { container } = render(
      <MessageMedia
        items={Array.from({ length: 5 }, (_, i) => photo(i))}
        onItemOpen={onItemOpen}
      />,
    );
    // 5 → a row of 2 over a row of 3.
    const rows = Array.from(container.firstElementChild?.children ?? []);
    expect(rows.map((row) => row.children.length)).toEqual([2, 3]);
    await userEvent.click(screen.getByRole("button", { name: "Открыть: Стеллаж 3" }));
    expect(onItemOpen).toHaveBeenCalledWith(2);
  });

  it("keeps at most 10 items", () => {
    render(
      <MessageMedia items={Array.from({ length: 12 }, (_, i) => photo(i))} onItemOpen={() => {}} />,
    );
    expect(screen.getAllByRole("button", { name: /^Открыть/ })).toHaveLength(10);
  });

  it("reserves its size before load: every box from the data, images lazy and async", () => {
    const { container } = render(
      <MessageMedia items={[photo(0, 600, 900), photo(1, 1600, 900), photo(2)]} />,
    );
    const root = container.firstElementChild as HTMLElement;
    const rows = Array.from(root.children) as HTMLElement[];
    // 3 → one tile over two: each row's height is its aspect ratio, known now (a lone portrait in
    // an album row is cropped: a row is never taller than two thirds of its width).
    expect(rows[0]?.style.getPropertyValue("--row-ratio")).toBe(String(1.5));
    expect(rows[1]?.style.getPropertyValue("--row-ratio")).toBe(String(16 / 9 + 4 / 3));
    // Tiles share the row by their own ratios.
    const shares = Array.from(rows[1]?.children ?? []).map(
      (cell) => (cell as HTMLElement).style.flexGrow,
    );
    expect(shares).toEqual([String((16 / 9) * 100), String((4 / 3) * 100)]);
    for (const image of container.querySelectorAll("img")) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("decoding", "async");
    }
    // A lone portrait is narrower than the cap.
    const single = render(<MessageMedia items={[photo(9, 600, 900)]} />);
    expect(
      (single.container.firstElementChild as HTMLElement).style.getPropertyValue("--media-width"),
    ).toBe(String(600 / 900));
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
      <MessageMedia items={[{ type: "video", src: "/clip.mp4", duration: 75, alt: "Рампа" }]} />,
    );
    expect(container.querySelector("video")).toBeNull();
    // The length is data: shown before anything loads.
    expect(container).toHaveTextContent("1:15");
    act(() =>
      report([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
    );
    expect(container.querySelector("video")).toHaveAttribute("preload", "metadata");
  });

  it("the album's gaps are neutral in an outgoing message: the incoming depth paints behind the tiles", () => {
    const { container } = render(
      <InMessage neutralDepth={2}>
        <MessageMedia items={[photo(0), photo(1)]} />
      </InMessage>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-album", "true");
    expect(root).toHaveAttribute("data-depth", "2");
    const css = readFileSync(
      path.join(process.cwd(), "src/components/message/MessageMedia.module.css"),
      "utf8",
    );
    expect(css).toMatch(
      /\.media\[data-album\] \{\s*background: var\(--prime-color-layer-current\);\s*\}/,
    );
    // A single picture needs no backing.
    const single = render(
      <InMessage>
        <MessageMedia items={[photo(0)]} />
      </InMessage>,
    );
    expect(single.container.firstElementChild).not.toHaveAttribute("data-depth");
  });

  it("puts the meta overlay in its positioned box and bleeds to the bubble's edges", () => {
    const { container } = render(
      <InMessage>
        <MessageMedia items={[photo(0)]} />
      </InMessage>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toContainElement(screen.getByTestId("overlay"));
    expect(root).toHaveAttribute("data-message-bleed");
    expect(screen.queryByTestId("spacer")).toBeNull();
    expect(messagePartOf(MessageMedia)).toMatchObject({
      shell: "media",
      meta: "overlay",
      picture: true,
      bleed: true,
      sized: true,
    });
    // The off-screen estimate: a 4 : 3 photo at the 360 px cap is 270 px tall.
    expect(messagePartOf(MessageMedia)?.estimate?.({ items: [photo(0)] } as never)).toBe(270);
  });

  it("shows an upload with the shared ring disk that cancels; a slow cancel is pending, a refused one announced", async () => {
    let reject: () => void = () => {};
    const onCancel = vi.fn(() => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))));
    render(
      <MessageMedia
        items={[{ ...photo(0), transfer: "loading", transferProgress: 0.42 }]}
        onCancel={onCancel}
      />,
    );
    expect(screen.getByRole("progressbar", { name: "Отправка 42%" })).toHaveAttribute(
      "aria-valuenow",
      "42",
    );
    const cancel = screen.getByRole("button", { name: "Отменить отправку" });
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledWith(0);
    expect(cancel).toHaveAttribute("aria-busy", "true");
    fireEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);
    await act(async () => reject());
    expect(cancel).not.toHaveAttribute("aria-busy");
    expect(screen.getByText("Не удалось отменить")).toBeInTheDocument();
  });

  it("a failed tile turns the disk into a retry described by the reason", async () => {
    const onRetry = vi.fn();
    render(
      <MessageMedia
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
      <MessageMedia
        items={[{ ...photo(0), transfer: "remote", transferDirection: "download" }]}
        onDownload={onDownload}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Скачать Стеллаж 1" }));
    expect(onDownload).toHaveBeenCalledWith(0);
    expect(container.querySelector("[data-covered]")).not.toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });
});

describe("Message.File", () => {
  it("shows a transfer with its share, the shared bar and a cancel", async () => {
    const onCancel = vi.fn();
    render(
      <MessageFile
        name="Спецификация.xlsx"
        fileSize={2048}
        transfer="loading"
        transferProgress={0.5}
        transferDirection="download"
        onCancel={onCancel}
      />,
    );
    expect(screen.getByText("1 КБ из 2 КБ")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Загрузка 50%" })).toBeInTheDocument();
    expect(screen.getByText("XLSX")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Отменить загрузку" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("a remote file is fetched from its tile: the download arrow named by the file", async () => {
    const onDownload = vi.fn();
    render(
      <MessageFile
        name="Смета.xlsx"
        fileSize={4096}
        transfer="remote"
        transferDirection="download"
        onDownload={onDownload}
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Скачать Смета.xlsx" }));
    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(screen.getByText("4 КБ")).toBeInTheDocument();
  });

  it("links a finished file for download with its size", () => {
    render(<MessageFile name="Договор.pdf" fileSize={1_258_291} href="/contract.pdf" />);
    expect(screen.getByRole("link", { name: "Скачать Договор.pdf" })).toHaveAttribute(
      "href",
      "/contract.pdf",
    );
    expect(screen.getByText("1,2 МБ")).toBeInTheDocument();
  });

  it("a slow retry is pending; a refused one is announced and stays retryable", async () => {
    let reject: () => void = () => {};
    const onRetry = vi.fn(() => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))));
    render(<MessageFile name="Акт.pdf" transfer="failed" onRetry={onRetry} />);
    expect(screen.getByText("Не отправилось")).toBeInTheDocument();
    const retry = screen.getByRole("button", { name: "Повторить отправку" });
    fireEvent.click(retry);
    expect(retry).toHaveAttribute("aria-busy", "true");
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalledTimes(1);
    await act(async () => reject());
    expect(retry).not.toHaveAttribute("aria-busy");
    expect(screen.getByText("Не удалось повторить")).toBeInTheDocument();
  });

  it("ends its size line with the meta's spacer; the name is selectable text", () => {
    render(
      <InMessage>
        <MessageFile name="Акт.pdf" fileSize={1024} />
      </InMessage>,
    );
    expect(screen.getByText("1 КБ").parentElement?.lastElementChild).toBe(
      screen.getByTestId("spacer"),
    );
    expect(screen.getByText("Акт.pdf")).toHaveAttribute("data-message-selectable");
    expect(messagePartOf(MessageFile)).toEqual({ shell: "fill", meta: "inline", sized: true });
  });
});

describe("Message cards", () => {
  it("renders a location, a contact and a link preview", () => {
    render(
      <>
        <MessageLocation
          src="/map.png"
          href="https://maps"
          title="Склад"
          address="ул. Складочная, 1"
          live
        />
        <MessageContact name="Ирина Белова" phone="+7 916 204-18-77">
          <button type="button">Написать</button>
        </MessageContact>
        <MessageLinkPreview href="https://prime.app/blog" site="Блог" title="Кейс" />
      </>,
    );
    expect(screen.getByRole("link", { name: "Открыть на карте: Склад" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByText("Трансляция")).toBeInTheDocument();
    expect(screen.getByText("ИБ")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Блог.*Кейс/ })).toHaveAttribute(
      "href",
      "https://prime.app/blog",
    );
  });

  it("the location bleeds, reserves the map's 16 : 9 box and ends its address with the spacer", () => {
    const { container } = render(
      <InMessage>
        <MessageLocation src="/map.png" title="Склад" address="ул. Складочная, 1" />
      </InMessage>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-message-bleed");
    expect(container.querySelector("[data-ratio='16:9']")).not.toBeNull();
    expect(screen.getByText("ул. Складочная, 1").nextElementSibling).toBe(
      screen.getByTestId("spacer"),
    );
    expect(messagePartOf(MessageLocation)).toMatchObject({ bleed: true, sized: true });
  });

  it("the contact puts the spacer after its actions, or after the phone without them", () => {
    const { rerender } = render(
      <InMessage>
        <MessageContact name="Ирина Белова" phone="+7 916 204-18-77">
          <button type="button">Написать</button>
        </MessageContact>
      </InMessage>,
    );
    expect(screen.getByRole("button", { name: "Написать" }).nextElementSibling).toBe(
      screen.getByTestId("spacer"),
    );
    rerender(
      <InMessage>
        <MessageContact name="Ирина Белова" phone="+7 916 204-18-77" />
      </InMessage>,
    );
    expect(screen.getByText("+7 916 204-18-77").nextElementSibling).toBe(
      screen.getByTestId("spacer"),
    );
  });

  it("one card width for file, contact and location; the link preview spans the bubble", () => {
    const read = (file: string) =>
      readFileSync(path.join(process.cwd(), `src/components/message/${file}`), "utf8");
    const cards = read("MessageCards.module.css");
    expect(read("MessageFile.module.css")).toMatch(
      /inline-size: min\(var\(--prime-message-card-width\), 75cqi\);/,
    );
    expect(cards).toMatch(
      /\.contact \{[^}]*inline-size: min\(var\(--prime-message-card-width\), 75cqi\);/,
    );
    expect(cards).toMatch(/\.location \{[^}]*--prime-message-card-width/);
    expect(cards).toMatch(
      /\.preview \{[^}]*min-inline-size: min\(var\(--prime-message-card-width\), 75cqi\);/,
    );
    expect(cards).toMatch(/\.previewCard \{[^}]*overflow-wrap: anywhere;/);
  });
});
