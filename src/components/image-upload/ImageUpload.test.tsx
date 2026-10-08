import { fireEvent, render, screen, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ImageUpload, type ImageUploadItem, type ImageUploadProps } from "./ImageUpload";

const PHOTOS: ImageUploadItem[] = [
  { id: "a", src: "a.jpg", alt: "Спереди" },
  { id: "b", src: "b.jpg", alt: "Сбоку" },
  { id: "c", src: "c.jpg", alt: "Сзади" },
];

function Photos({ onValueChange, ...props }: Partial<ImageUploadProps>) {
  const [value, setValue] = React.useState<readonly ImageUploadItem[]>(PHOTOS);
  return (
    <ImageUpload
      label="Фотографии"
      value={value}
      onFilesAdd={() => {}}
      {...props}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

const tiles = () =>
  within(screen.getByRole("list", { name: "Фотографии" }))
    .getAllByRole("listitem")
    .map((tile) => tile.getAttribute("aria-label"))
    .filter(Boolean);

describe("ImageUpload", () => {
  it("draws a named list of photos in order, each named by its position and alt", () => {
    render(<Photos />);
    expect(tiles()).toEqual(["Фото 1: Спереди", "Фото 2: Сбоку", "Фото 3: Сзади"]);
  });

  it("removes a photo with its delete button and announces it", () => {
    const onValueChange = vi.fn();
    render(<Photos onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Удалить фото 2" }));
    expect(onValueChange).toHaveBeenCalledWith([PHOTOS[0], PHOTOS[2]]);
    expect(tiles()).toEqual(["Фото 1: Спереди", "Фото 2: Сзади"]);
    expect(screen.getByRole("status")).toHaveTextContent("Фото 2 удалено");
  });

  it("removes the focused photo with Delete and moves focus to its neighbour", () => {
    render(<Photos />);
    const tile = screen.getByRole("listitem", { name: "Фото 1: Спереди" });
    tile.focus();
    fireEvent.keyDown(tile, { key: "Delete" });
    expect(tiles()).toEqual(["Фото 1: Сбоку", "Фото 2: Сзади"]);
    expect(document.activeElement).toBe(screen.getByRole("listitem", { name: "Фото 1: Сбоку" }));
  });

  it("moves a photo one place with Alt+→", () => {
    render(<Photos />);
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Фото 1: Спереди" }), {
      key: "ArrowRight",
      altKey: true,
    });
    expect(tiles()).toEqual(["Фото 1: Сбоку", "Фото 2: Спереди", "Фото 3: Сзади"]);
  });

  it("grid numbers every photo and has no cover action", () => {
    render(<Photos />);
    expect(screen.queryByText("Обложка")).toBeNull();
    expect(screen.queryByRole("button", { name: "Сделать обложкой" })).toBeNull();
  });

  it("cover marks the first photo and puts another first with «Сделать обложкой»", () => {
    const onValueChange = vi.fn();
    render(<Photos variant="cover" onValueChange={onValueChange} />);
    expect(screen.getByText("Обложка")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button", { name: "Сделать обложкой" });
    // Per tile a worded plate and an icon form; CSS draws one by the tile's width.
    expect(buttons).toHaveLength(4);
    fireEvent.click(buttons[2] as HTMLElement);
    expect(onValueChange).toHaveBeenCalledWith([PHOTOS[2], PHOTOS[0], PHOTOS[1]]);
    expect(screen.getByRole("status")).toHaveTextContent("Фото 3 стало обложкой");
  });

  it("hands picked images to onFilesAdd, cut to the room under max", () => {
    const onFilesAdd = vi.fn();
    render(<Photos max={4} onFilesAdd={onFilesAdd} />);
    const input = screen.getByLabelText("Добавить фото");
    const files = [
      new File(["1"], "one.jpg", { type: "image/jpeg" }),
      new File(["2"], "notes.pdf", { type: "application/pdf" }),
      new File(["3"], "two.png", { type: "image/png" }),
    ];
    fireEvent.change(input, { target: { files } });
    expect(onFilesAdd).toHaveBeenCalledWith([files[0]]);
    expect(input.closest("label")).toHaveTextContent("3 из 4");
  });

  it("takes files dropped anywhere on the set", () => {
    const onFilesAdd = vi.fn();
    render(<Photos onFilesAdd={onFilesAdd} />);
    const file = new File(["1"], "one.jpg", { type: "image/jpeg" });
    const list = screen.getByRole("list", { name: "Фотографии" });
    fireEvent.drop(list, { dataTransfer: { files: [file], types: ["Files"] } });
    expect(onFilesAdd).toHaveBeenCalledWith([file]);
  });

  it("at max the add tile says so and takes nothing; without onFilesAdd there is none", () => {
    const { rerender } = render(<Photos max={3} />);
    expect(screen.getByLabelText("Добавить фото")).toBeDisabled();
    expect(screen.getByText("Лимит фото")).toBeInTheDocument();
    expect(screen.getByLabelText("Добавить фото").closest("label")).toHaveTextContent("3 из 3");
    rerender(<Photos onFilesAdd={undefined} />);
    expect(screen.queryByLabelText("Добавить фото")).toBeNull();
  });

  it("an empty set is one wide add tile", () => {
    render(<ImageUpload label="Фотографии" onFilesAdd={() => {}} />);
    expect(screen.getByText("Нажмите или перетащите фото")).toBeInTheDocument();
  });

  it("disabled: no add tile, no actions, no shortcuts", () => {
    render(<Photos disabled variant="cover" />);
    expect(screen.queryByLabelText("Добавить фото")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("listitem", { name: "Фото 1: Спереди" })).not.toHaveAttribute(
      "aria-keyshortcuts",
    );
  });

  it("wires the hint and the error to the file input", () => {
    render(<Photos hint="До 10 МБ" error="Нужно не меньше трёх фото" />);
    const input = screen.getByLabelText("Добавить фото");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Нужно не меньше трёх фото");
  });
});
