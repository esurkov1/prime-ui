import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { FileUpload } from "./FileUpload";

function makeDataTransferWithFiles(files: File[]): DataTransfer {
  // jsdom не предоставляет DataTransfer; достаточно итерируемого `files` для Array.from
  return { files: files as unknown as FileList } as DataTransfer;
}

describe("FileUpload", () => {
  it("renders default drop zone", () => {
    render(<FileUpload.Root />);

    expect(screen.getByText(/Choose a file or drag/i)).toBeInTheDocument();
    expect(screen.getByText("Browse file")).toBeInTheDocument();
  });

  it("sets data-size on root", () => {
    const { container } = render(<FileUpload.Root size="l" />);
    const label = container.querySelector("label");
    expect(label).toHaveAttribute("data-size", "l");
  });

  it("sets data-appearance on root", () => {
    const { container } = render(<FileUpload.Root appearance="solid" />);
    const label = container.querySelector("label");
    expect(label).toHaveAttribute("data-appearance", "solid");
  });

  it("sets data-dragover on dragover and clears on dragleave", () => {
    render(<FileUpload.Root />);

    const label = screen.getByText(/Choose a file or drag/i).closest("label");
    expect(label).toBeTruthy();

    fireEvent.dragOver(label as HTMLElement);
    expect(label).toHaveAttribute("data-dragover", "true");

    fireEvent.dragLeave(label as HTMLElement, { relatedTarget: document.body });
    expect(label).not.toHaveAttribute("data-dragover");
  });

  it("calls onFilesChange on drop", () => {
    const onFilesChange = vi.fn();
    render(<FileUpload.Root onFilesChange={onFilesChange} />);

    const label = screen.getByText(/Choose a file or drag/i).closest("label") as HTMLElement;
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

    const label = screen.getByText(/Choose a file or drag/i).closest("label");
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
    expect(screen.queryByText(/Choose a file or drag/i)).not.toBeInTheDocument();
  });

  it("renders file item row with format badge", () => {
    render(
      <FileUpload.Item>
        <FileUpload.ItemRow>
          <FileUpload.FormatBadge format="pdf" color="red" />
          <FileUpload.ItemMain>
            <FileUpload.ItemName>report.pdf</FileUpload.ItemName>
          </FileUpload.ItemMain>
        </FileUpload.ItemRow>
      </FileUpload.Item>,
    );

    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
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
});
