import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GalleryItem } from "@/components/gallery/Gallery";
import { MessagePartProvider, messagePartOf } from "@/internal/messagePart";
import type { SurfaceDepth } from "@/internal/surfaceDepth";
import { cssRule, cssRules, cssValue } from "@/test/css";
import { MessageContact, MessageLinkPreview, MessageLocation } from "./MessageCards";
import { MessageFile } from "./MessageFile";

import { MessageMedia } from "./MessageMedia";

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

const photo = (i: number, width = 800, height = 600): GalleryItem => ({
  src: `/photo-${i}.jpg`,
  alt: `Стеллаж ${i + 1}`,
  width,
  height,
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Message.Media: a Gallery shaped by its message", () => {
  it("the album's gaps are neutral in an outgoing message: the incoming depth paints behind the tiles", () => {
    const { container } = render(
      <InMessage neutralDepth={2}>
        <MessageMedia items={[photo(0), photo(1)]} />
      </InMessage>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-album", "true");
    expect(root).toHaveAttribute("data-depth", "2");
    expect(
      cssValue(
        cssRule("src/components/message/MessageMedia.module.css", ".media[data-album]"),
        "background",
      ),
    ).toBe("var(--prime-color-layer-current)");
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
    const cancel = screen.getByRole("button", { name: "Отменить загрузку" });
    expect(cancel).toHaveAccessibleDescription("Загрузка 50%");
    expect(screen.getByText("XLSX")).toBeInTheDocument();
    await userEvent.click(cancel);
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
    expect(screen.getByText("Акт")).toHaveAttribute("data-message-selectable");
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
    const card = "min(var(--prime-message-card-width), 75cqi)";
    const cards = (selector: string) =>
      cssRule("src/components/message/MessageCards.module.css", selector);
    expect(
      cssRules("src/components/message/MessageFile.module.css").some((item) =>
        item.decls.some((decl) => decl.prop === "inline-size" && decl.value === card),
      ),
    ).toBe(true);
    expect(cssValue(cards(".contact"), "inline-size")).toBe(card);
    expect(
      cards(".location").decls.some((decl) => decl.value.includes("--prime-message-card-width")),
    ).toBe(true);
    expect(cssValue(cards(".preview"), "min-inline-size")).toBe(card);
    expect(cssValue(cards(".previewCard"), "overflow-wrap")).toBe("anywhere");
  });
});
