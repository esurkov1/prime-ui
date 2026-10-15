import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Dnd } from "@/components/dnd/Dnd";
import type { UploadItem } from "@/hooks/useUploadQueue";
import { cssRule, cssRules, cssValue } from "@/test/css";

import { AttachmentTile } from "./attachmentTile";
import pill from "./mediaPill.module.css";

function Tile(props: Omit<React.ComponentProps<typeof AttachmentTile>, "id">) {
  return (
    <Dnd.Root>
      <Dnd.Sortable
        as="ul"
        aria-label="Вложения"
        items={["a"]}
        getId={(id) => id}
        onReorder={() => {}}
        renderItem={(id) => <AttachmentTile id={id} aria-label="Плитка" {...props} />}
      />
    </Dnd.Root>
  );
}

const upload = (patch: Partial<UploadItem>): UploadItem => ({
  id: "a",
  file: new File(["x"], "Акт.pdf"),
  status: "loading",
  progress: 0.25,
  ...patch,
});

describe("AttachmentTile", () => {
  it("every kind has the same slots: the pill at the top start, the band with the name and size", () => {
    for (const kind of ["file", "image", "video"] as const) {
      const { unmount } = render(
        <Tile kind={kind} src="blob:x" badge="PDF" name="Акт сверки.pdf" meta="2 КБ" />,
      );
      const tile = screen.getByRole("listitem", { name: "Плитка" });
      expect(tile).toHaveAttribute("data-kind", kind);
      const pill = tile.querySelector("[aria-hidden][data-dnd-mirror]") as HTMLElement;
      expect(pill).toHaveTextContent("PDF");
      expect(tile).toHaveTextContent("Акт сверки.pdf2 КБ");
      unmount();
    }
  });

  it("over a picture the pill and the band stand on the media shade; a file's do not", () => {
    for (const kind of ["file", "image"] as const) {
      const { unmount } = render(
        <Tile kind={kind} src="blob:x" badge="JPG" name="Фасад.jpg" onRemove={() => {}} />,
      );
      const tile = screen.getByRole("listitem", { name: "Плитка" });
      const tag = tile.querySelector("[aria-hidden][data-dnd-mirror]") as HTMLElement;
      const band = screen.getByText("Фасад.jpg").parentElement as HTMLElement;
      expect(tag.className.includes(pill.tag)).toBe(kind === "image");
      expect(band.className.includes(pill.fade)).toBe(kind === "image");
      // The remove button stands on the shade on every kind.
      const remove = screen.getByRole("button").parentElement as HTMLElement;
      expect(remove.className).toContain(pill.shade);
      expect(remove).toHaveAttribute("data-size", "xs");
      unmount();
    }
  });

  it("a video without a size shows its duration in the band once its metadata is read", () => {
    render(<Tile kind="video" src="blob:clip" name="Обход.mov" />);
    const video = document.querySelector("video") as HTMLVideoElement;
    Object.defineProperty(video, "duration", { value: 39 });
    fireEvent.loadedMetadata(video);
    expect(screen.getByRole("listitem", { name: "Плитка" })).toHaveTextContent("Обход.mov0:39");
  });

  it("a picture decodes asynchronously", () => {
    render(<Tile kind="image" src="blob:photo" />);
    expect(document.querySelector("img")).toHaveAttribute("decoding", "async");
  });

  it("without a cancel the disk is still: its ring carries the share, a named progressbar", () => {
    const { rerender } = render(
      <Tile kind="image" src="blob:photo" upload={upload({})} uploadState="Загрузка 25%" />,
    );
    const bar = screen.getByRole("progressbar", { name: "Загрузка 25%" });
    expect(bar).toHaveAttribute("aria-valuenow", "25");
    const ring = () => bar.querySelector<SVGSVGElement>("svg[data-weight]");
    expect(ring()?.style.getPropertyValue("--ring-value")).toBe("0.25");
    rerender(
      <Tile
        kind="image"
        src="blob:photo"
        upload={upload({ progress: 0.6 })}
        uploadState="Загрузка 60%"
      />,
    );
    expect(bar).toHaveAttribute("aria-valuenow", "60");
    expect(ring()?.style.getPropertyValue("--ring-value")).toBe("0.6");
  });

  it("the disk cancels the upload by click and from the keyboard; the corner button waits", () => {
    const onRemove = vi.fn();
    render(
      <Tile
        kind="file"
        name="Акт.pdf"
        upload={upload({})}
        uploadState="Загрузка 25%"
        cancelLabel="Отменить загрузку: Акт.pdf"
        onRemove={onRemove}
        removeLabel="Убрать Акт.pdf"
      />,
    );
    expect(screen.queryByRole("button", { name: "Убрать Акт.pdf" })).toBeNull();
    const disk = screen.getByRole("button", { name: "Отменить загрузку: Акт.pdf" });
    expect(disk.tagName).toBe("BUTTON");
    fireEvent.click(disk);
    expect(onRemove).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Плитка" }), { key: "Delete" });
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it("Tab reaches the disk after the tile; Enter and Space press it", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <Tile
        kind="image"
        src="blob:photo"
        upload={upload({})}
        cancelLabel="Отменить"
        onRemove={onRemove}
      />,
    );
    await user.tab();
    expect(screen.getByRole("listitem", { name: "Плитка" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Отменить" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it("a pending cancel spins and does not fire again", () => {
    const onRemove = vi.fn();
    render(
      <Tile
        kind="file"
        name="Акт.pdf"
        upload={upload({})}
        cancelLabel="Отменить"
        onRemove={onRemove}
        pending
      />,
    );
    const disk = screen.getByRole("button", { name: "Отменить" });
    expect(disk).toHaveAttribute("aria-busy", "true");
    fireEvent.click(disk);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("a failed upload turns the disk into a retry described by the reason", () => {
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    render(
      <Tile
        kind="file"
        name="Акт.pdf"
        upload={upload({ status: "failed" })}
        uploadState="Нет связи"
        retryLabel="Повторить"
        onRetry={onRetry}
        onRemove={onRemove}
        removeLabel="Убрать Акт.pdf"
      />,
    );
    expect(screen.getByRole("listitem", { name: "Плитка" })).toHaveAttribute(
      "data-upload",
      "failed",
    );
    expect(screen.queryByRole("progressbar")).toBeNull();
    const retry = screen.getByRole("button", { name: "Повторить" });
    expect(retry).toHaveAttribute("data-tone", "danger");
    expect(retry).toHaveAccessibleDescription("Нет связи");
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
    // A failed file can still be taken out by the corner button.
    expect(screen.getByRole("button", { name: "Убрать Акт.pdf" })).toBeInTheDocument();
  });

  it("done hides the disk and gives the corner remove back", () => {
    const { rerender } = render(
      <Tile
        kind="image"
        src="blob:photo"
        upload={upload({})}
        cancelLabel="Отменить"
        onRemove={() => {}}
        removeLabel="Убрать"
      />,
    );
    expect(screen.getByRole("button", { name: "Отменить" })).toBeInTheDocument();
    rerender(
      <Tile
        kind="image"
        src="blob:photo"
        upload={upload({ status: "done", progress: 1 })}
        cancelLabel="Отменить"
        onRemove={() => {}}
        removeLabel="Убрать"
      />,
    );
    const disk = document.querySelector<HTMLElement>("[data-state][data-size]");
    expect(disk).toHaveAttribute("data-state", "done");
    expect(disk).toHaveAttribute("inert");
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByRole("button", { name: "Отменить" })).toBeNull();
    expect(screen.getByRole("button", { name: "Убрать" })).toBeInTheDocument();
  });

  it("removes by its button and by Delete; without onRemove there is no button", () => {
    const onRemove = vi.fn();
    const { rerender } = render(
      <Tile kind="file" name="Акт.pdf" onRemove={onRemove} removeLabel="Убрать Акт.pdf" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Убрать Акт.pdf" }));
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Плитка" }), { key: "Delete" });
    expect(onRemove).toHaveBeenCalledTimes(2);
    rerender(<Tile kind="file" name="Акт.pdf" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("a strip is one row of fixed tiles: a tile never shrinks however many there are", () => {
    expect(cssValue(cssRule("src/internal/attachmentTile.module.css", ".strip > *"), "flex")).toBe(
      "none",
    );
  });

  it("a strip-sized tile gives the band's line to the name, not to the size", () => {
    const strip = cssValue(
      cssRule("src/internal/attachmentTile.module.css", ".strip > *"),
      "inline-size",
    );
    expect(strip).toBe("var(--prime-space-24)");
    const rule = cssRules("src/internal/attachmentTile.module.css").find(
      (item) => item.selector === ".meta" && item.parents.some((parent) => parent.includes("7rem")),
    );
    expect(rule && cssValue(rule, "display")).toBe("none");
  });
});
