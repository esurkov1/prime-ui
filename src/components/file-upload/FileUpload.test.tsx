import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { FileUpload } from "./FileUpload";

function makeDataTransferWithFiles(files: File[]): DataTransfer {
  // jsdom has no DataTransfer; an iterable `files` is enough for Array.from
  return { files: files as unknown as FileList } as DataTransfer;
}

describe("FileUpload", () => {
  it("renders default drop zone", () => {
    render(<FileUpload.Root />);

    expect(screen.getByText(/Выберите файл или перетащите/i)).toBeInTheDocument();
    expect(screen.getByText("Выбрать файл")).toBeInTheDocument();
  });

  it("sets data-size on root", () => {
    const { container } = render(<FileUpload.Root size="l" />);
    const label = container.querySelector("label");
    expect(label).toHaveAttribute("data-size", "l");
  });

  it("sets data-variant on root (dashed by default)", () => {
    const { container, rerender } = render(<FileUpload.Root />);
    const label = container.querySelector("label");
    expect(label).toHaveAttribute("data-variant", "dashed");
    rerender(<FileUpload.Root variant="solid" />);
    expect(label).toHaveAttribute("data-variant", "solid");
  });

  it("renders built-in texts from labels; an empty description is hidden", () => {
    render(
      <FileUpload.Root labels={{ title: "Drop a file", description: "", browse: "Browse" }} />,
    );

    expect(screen.getByText("Drop a file")).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
    expect(screen.queryByText(/JPEG/)).not.toBeInTheDocument();
  });

  it("sets invalid state on root and input", () => {
    const { container } = render(<FileUpload.Root invalid />);

    expect(container.querySelector("label")).toHaveAttribute("data-invalid", "true");
    expect(container.querySelector("input")).toHaveAttribute("aria-invalid", "true");
  });

  it("ignores drag-over and drop while disabled", () => {
    const onFilesChange = vi.fn();
    const { container } = render(<FileUpload.Root disabled onFilesChange={onFilesChange} />);
    const label = container.querySelector("label") as HTMLElement;

    fireEvent.dragOver(label);
    expect(label).not.toHaveAttribute("data-state");
    fireEvent.drop(label, { dataTransfer: makeDataTransferWithFiles([new File(["x"], "a.txt")]) });
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it("sets data-state=active on dragenter and keeps it while crossing children", () => {
    render(<FileUpload.Root />);

    const label = screen.getByText(/Выберите файл или перетащите/i).closest("label") as HTMLElement;
    const title = screen.getByText(/Выберите файл или перетащите/i);

    fireEvent.dragEnter(label);
    expect(label).toHaveAttribute("data-state", "active");

    // Into a child: enter on the child, then leave on the zone — still over the zone.
    fireEvent.dragEnter(title);
    fireEvent.dragLeave(label);
    expect(label).toHaveAttribute("data-state", "active");

    // Out of the child and the zone.
    fireEvent.dragLeave(title);
    expect(label).not.toHaveAttribute("data-state");
  });

  it("puts className, ref and native props on the frame, id and aria-label on the input", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <FileUpload.Root
        ref={ref}
        id="scan"
        className="custom"
        data-testid="frame"
        aria-label="Загрузить скан"
      />,
    );
    const frame = screen.getByTestId("frame");
    expect(frame).toBe(container.firstChild);
    expect(ref.current).toBe(frame);
    expect(frame).toHaveClass("custom");
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute("id", "scan");
    expect(input).toHaveAccessibleName("Загрузить скан");
  });

  it("label={false} leaves no dangling aria-labelledby", () => {
    const { container } = render(<FileUpload.Root label={false} />);
    expect(container.querySelector('input[type="file"]')).not.toHaveAttribute("aria-labelledby");
  });

  it("calls onFilesChange on drop", () => {
    const onFilesChange = vi.fn();
    render(<FileUpload.Root onFilesChange={onFilesChange} />);

    const label = screen.getByText(/Выберите файл или перетащите/i).closest("label") as HTMLElement;
    const file = new File(["x"], "doc.txt", { type: "text/plain" });
    const dt = makeDataTransferWithFiles([file]);

    fireEvent.drop(label, { dataTransfer: dt });

    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(onFilesChange.mock.calls[0][0]).toHaveLength(1);
    expect(onFilesChange.mock.calls[0][0][0].name).toBe("doc.txt");
  });

  it("calls onFilesChange on input change", () => {
    const onFilesChange = vi.fn();
    const { container } = render(<FileUpload.Root onFilesChange={onFilesChange} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["y"], "pic.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(onFilesChange.mock.calls[0][0][0].name).toBe("pic.png");
  });

  it("sets disabled state on root and input", () => {
    render(<FileUpload.Root disabled />);

    const label = screen.getByText(/Выберите файл или перетащите/i).closest("label");
    expect(label).toHaveAttribute("data-disabled", "true");

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("passes accept and multiple to input", () => {
    const { container } = render(<FileUpload.Root accept="image/*" multiple />);

    const input = container.querySelector("input");
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("multiple");
  });

  it("forwards inputRef to the file input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<FileUpload.Root inputRef={ref} />);
    expect(ref.current?.type).toBe("file");
  });

  it("renders custom children instead of default", () => {
    render(
      <FileUpload.Root>
        <span data-testid="custom">Upload zone</span>
      </FileUpload.Root>,
    );

    expect(screen.getByTestId("custom")).toHaveTextContent("Upload zone");
    expect(screen.queryByText(/Выберите файл или перетащите/i)).not.toBeInTheDocument();
  });

  it("renders file item row with a decorative kit Badge and a progress bar", () => {
    render(
      <FileUpload.Item>
        <FileUpload.FormatBadge format="pdf" color="red" />
        <FileUpload.ItemName>report.pdf</FileUpload.ItemName>
        <FileUpload.ItemDescription>1,2 МБ</FileUpload.ItemDescription>
        <FileUpload.ItemProgress value={40} />
      </FileUpload.Item>,
    );

    const badge = screen.getByText("PDF");
    expect(badge).toHaveAttribute("data-color", "red");
    expect(badge).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("names the input by the field label and describes it by the error", () => {
    const { container } = render(
      <FileUpload.Root
        label="Скан договора"
        required
        hint="PDF до 20 МБ"
        error="Файл больше 20 МБ"
      />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAccessibleName("Скан договора");
    expect(input).toHaveAccessibleDescription("Файл больше 20 МБ");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("sets data-size on file item", () => {
    const { container } = render(
      <FileUpload.Item size="l">
        <FileUpload.ItemName>x</FileUpload.ItemName>
      </FileUpload.Item>,
    );
    const item = container.firstChild as HTMLElement;
    expect(item).toHaveAttribute("data-size", "l");
  });

  it("sets data-invalid on a failed file item", () => {
    const { container } = render(
      <FileUpload.Item invalid>
        <FileUpload.ItemName>x</FileUpload.ItemName>
      </FileUpload.Item>,
    );
    expect(container.firstChild).toHaveAttribute("data-invalid", "true");
  });
});
