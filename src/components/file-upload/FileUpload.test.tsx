import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import { type UploadItem, useUploadQueue } from "@/hooks/useUploadQueue";
import { Icon } from "@/icons";

import {
  FileUpload,
  type FileUploadFile,
  type FileUploadPicker,
  type FileUploadRootProps,
} from "./FileUpload";

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

  it("focusRing={false} marks the field so the zone draws no ring; focus stays", () => {
    const { container } = render(<FileUpload.Root focusRing={false} aria-label="Договор" />);
    const zone = container.querySelector("label");
    expect(zone?.closest('[data-focus-ring="false"]')).not.toBeNull();
    const input = screen.getByLabelText("Договор");
    act(() => input.focus());
    expect(input).toHaveFocus();
  });

  it("ItemProgress is named by labels.upload without an aria-label of its own", () => {
    render(<FileUpload.ItemProgress value={40} />);
    expect(screen.getByRole("progressbar", { name: "Загрузка файла" })).toBeInTheDocument();
  });

  it("sets data-variant on root (dashed by default)", () => {
    const { container, rerender } = render(<FileUpload.Root />);
    const label = container.querySelector("label");
    expect(label).toHaveAttribute("data-variant", "dashed");
    rerender(<FileUpload.Root variant="solid" />);
    expect(label).toHaveAttribute("data-variant", "solid");
  });

  it("renders built-in texts from labels and states no formats or limits of its own", () => {
    const { container } = render(
      <FileUpload.Root labels={{ title: "Drop a file", browse: "Browse" }} />,
    );

    expect(screen.getByText("Drop a file")).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
    expect(container.querySelector("label")).toHaveTextContent(/^Drop a fileBrowse$/);
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

  it("picker.open() opens the input; open({ accept }) narrows that one pick and its files", () => {
    const picker = React.createRef<FileUploadPicker>();
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileUpload.Root picker={picker} accept=".pdf" onFilesChange={onFilesChange} />,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, "click");
    act(() => picker.current?.open({ accept: "image/*" }));
    expect(click).toHaveBeenCalledTimes(1);
    expect(input.accept).toBe("image/*");
    const photo = new File(["x"], "склад.jpg", { type: "image/jpeg" });
    const scan = new File(["x"], "договор.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [photo, scan] } });
    expect(onFilesChange).toHaveBeenLastCalledWith([photo]);
    act(() => picker.current?.open());
    expect(input.accept).toBe(".pdf");
    fireEvent.change(input, { target: { files: [photo, scan] } });
    expect(onFilesChange).toHaveBeenLastCalledWith([scan]);
  });

  it('trigger="none" draws nothing of its own: the hidden input is the picker of `picker.open`', () => {
    const picker = React.createRef<FileUploadPicker>();
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileUpload.Root trigger="none" picker={picker} multiple onFilesChange={onFilesChange} />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute("tabindex", "-1");
    expect(input).toHaveAttribute("aria-hidden", "true");
    const click = vi.spyOn(input, "click");
    act(() => picker.current?.open({ accept: "image/*" }));
    expect(click).toHaveBeenCalledTimes(1);
    const photo = new File(["x"], "склад.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [photo] } });
    expect(onFilesChange).toHaveBeenLastCalledWith([photo]);
  });

  it("picker.open() does nothing on a disabled field", () => {
    const picker = React.createRef<FileUploadPicker>();
    const { container } = render(<FileUpload.Root picker={picker} disabled />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, "click");
    act(() => picker.current?.open());
    expect(click).not.toHaveBeenCalled();
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

  it("href makes a row's name and a tile links that open the file in a new tab", () => {
    const files: FileUploadFile[] = [
      { id: "contract", name: "Договор.pdf", href: "https://files.example.com/contract.pdf" },
      { id: "estimate", name: "Смета.xlsx" },
    ];
    const { unmount } = render(<FileUpload.Queue aria-label="Документы" defaultValue={files} />);
    const link = screen.getByRole("link", { name: "Договор" });
    expect(link).toHaveAttribute("href", "https://files.example.com/contract.pdf");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.queryByRole("link", { name: "Смета" })).toBeNull();
    unmount();

    render(<FileUpload.Queue aria-label="Документы" layout="grid" defaultValue={files} />);
    const tile = screen.getByRole("link", { name: "Открыть Договор.pdf" });
    expect(tile).toHaveAttribute("href", "https://files.example.com/contract.pdf");
    expect(tile.closest("li")).toHaveAttribute("data-dnd-item", "contract");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders file item row with a decorative format tile", () => {
    render(
      <FileUpload.Item>
        <FileUpload.FormatBadge format="pdf" color="red" />
        <FileUpload.ItemText>report.pdf</FileUpload.ItemText>
        <FileUpload.ItemDescription>1,2 МБ</FileUpload.ItemDescription>
      </FileUpload.Item>,
    );

    const badge = screen.getByText("PDF").closest("[data-color]");
    expect(badge).toHaveAttribute("data-color", "red");
    expect(badge).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("a row with a progress ring shows the ring in the mark's place", () => {
    const { container } = render(
      <FileUpload.Item>
        <FileUpload.FormatBadge format="pdf" color="red" />
        <FileUpload.ItemText>report.pdf</FileUpload.ItemText>
        <FileUpload.ItemDescription>1,2 МБ · 40%</FileUpload.ItemDescription>
        <FileUpload.ItemProgress value={40} />
      </FileUpload.Item>,
    );
    expect(screen.getByRole("progressbar", { name: "Загрузка файла" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
    expect(screen.queryByText("PDF")).toBeNull();
    expect(container.firstChild).toHaveAttribute("data-lines", "two");
  });

  it("cuts a long name in the middle: the start gives way, the end stays", () => {
    render(
      <FileUpload.Item>
        <FileUpload.ItemText>Договор поставки № 318.pdf</FileUpload.ItemText>
      </FileUpload.Item>,
    );
    expect(screen.getByText("18.pdf")).toBeInTheDocument();
    expect(screen.getByText("Договор поставки № 3")).toBeInTheDocument();
  });

  it("names the progress bar by aria-label", () => {
    render(<FileUpload.ItemProgress value={40} aria-label="Загрузка: report.pdf" />);
    expect(screen.getByRole("progressbar", { name: "Загрузка: report.pdf" })).toBeInTheDocument();
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
        <FileUpload.ItemText>x</FileUpload.ItemText>
      </FileUpload.Item>,
    );
    const item = container.firstChild as HTMLElement;
    expect(item).toHaveAttribute("data-size", "l");
  });

  it("sets data-invalid on a failed file item", () => {
    const { container } = render(
      <FileUpload.Item invalid>
        <FileUpload.ItemText>x</FileUpload.ItemText>
      </FileUpload.Item>,
    );
    expect(container.firstChild).toHaveAttribute("data-invalid", "true");
  });

  it("an image row shows a decorative preview in place of the badge", () => {
    const { container } = render(
      <FileUpload.Item size="s">
        <FileUpload.ItemPreview src="blob:photo" />
        <FileUpload.ItemText>photo.jpg</FileUpload.ItemText>
      </FileUpload.Item>,
    );
    const preview = container.querySelector("img") as HTMLImageElement;
    expect(preview).toHaveAttribute("src", "blob:photo");
    const frame = preview.parentElement as HTMLElement;
    expect(frame).toHaveAttribute("aria-hidden", "true");
    expect(frame).toHaveAttribute("data-size", "xs");
  });

  describe('trigger="button"', () => {
    it("is a kit button that opens the picker; the input leaves the tab order", () => {
      const onFilesChange = vi.fn();
      const { container } = render(
        <FileUpload.Root trigger="button" onFilesChange={onFilesChange} />,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const click = vi.spyOn(input, "click");
      const button = screen.getByRole("button", { name: "Выбрать файл" });
      fireEvent.click(button);
      expect(click).toHaveBeenCalledTimes(1);
      expect(input).toHaveAttribute("tabindex", "-1");
      expect(container.querySelector("label")).toBeNull();

      fireEvent.change(input, { target: { files: [new File(["x"], "a.pdf")] } });
      expect(onFilesChange).toHaveBeenCalledTimes(1);
    });

    it("an icon alone is an icon-only ghost button named by aria-label", () => {
      render(
        <FileUpload.Root trigger="button" aria-label="Прикрепить файл">
          <Button.Icon>
            <Icon name="action.attach" />
          </Button.Icon>
        </FileUpload.Root>,
      );
      const button = screen.getByRole("button", { name: "Прикрепить файл" });
      expect(button).toHaveAttribute("data-variant", "ghost");
      expect(button).toHaveAttribute("data-icon-only", "true");
    });

    it("is named by the field label and its text, described by the error", () => {
      render(<FileUpload.Root trigger="button" label="Договор" error="Нужен PDF" />);
      const button = screen.getByRole("button", { name: "Договор Выбрать файл" });
      expect(button).toHaveAccessibleDescription("Нужен PDF");
      expect(button).toHaveAttribute("aria-invalid", "true");
    });

    it("disabled blocks the button", () => {
      render(<FileUpload.Root trigger="button" disabled />);
      expect(screen.getByRole("button", { name: "Выбрать файл" })).toBeDisabled();
    });
  });

  it("takes only the files of accept, by MIME type or extension", () => {
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileUpload.Root accept="image/*,.pdf" onFilesChange={onFilesChange} />,
    );
    const files = [
      new File(["1"], "one.jpg", { type: "image/jpeg" }),
      new File(["2"], "notes.docx", { type: "application/msword" }),
      new File(["3"], "act.PDF", { type: "application/pdf" }),
      new File(["4"], "IMG_2041.heic"),
    ];
    fireEvent.drop(container.querySelector("label") as HTMLElement, {
      dataTransfer: makeDataTransferWithFiles(files),
    });
    expect(onFilesChange).toHaveBeenCalledWith([files[0], files[2], files[3]]);
  });
});

const pdf = new File(["x".repeat(2048)], "Отчёт.pdf", { type: "application/pdf" });
const photo = new File(["x"], "Фасад.jpg", { type: "image/jpeg" });
const clip = new File(["x"], "Обход.mp4", { type: "video/mp4" });

/** Names of the tiles, in order. */
const tileNames = () =>
  Array.from(document.querySelectorAll("[data-dnd-item]")).map((tile) =>
    tile.getAttribute("aria-label"),
  );

function queueOf(items: UploadItem[]) {
  return {
    items,
    retry: vi.fn(),
    remove: vi.fn(),
    add: vi.fn((files: readonly File[]) =>
      files.map((file, index) => ({
        id: `new-${index}`,
        file,
        status: "queued" as const,
        progress: 0,
        preview: `blob:${file.name}`,
      })),
    ),
  };
}

describe("FileUpload.Queue, the name beside the format badge", () => {
  const row = (name: string) =>
    render(
      <FileUpload.Queue
        aria-label="Вложения"
        queue={queueOf([{ id: "1", file: new File(["x"], name), status: "queued", progress: 0 }])}
      />,
    );

  it("drops the extension the badge shows and keeps the full name in title and labels", () => {
    render(
      <FileUpload.Queue
        aria-label="Вложения"
        queue={queueOf([
          { id: "1", file: new File(["x"], "отчёт.final.pdf"), status: "queued", progress: 0 },
        ])}
      />,
    );
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("отчёт.final")).toHaveAttribute("title", "отчёт.final.pdf");
    expect(screen.getByRole("button", { name: "Убрать отчёт.final.pdf" })).toBeInTheDocument();
  });

  it("keeps a name without an extension, a dotfile and an unknown format whole", () => {
    row("README");
    expect(screen.getByText("README")).toHaveAttribute("title", "README");
    cleanup();
    row(".env");
    expect(screen.getByText(".env")).toBeInTheDocument();
  });

  it("cuts an unknown extension too: the badge shows it", () => {
    row("схема.dwg");
    expect(screen.getByText("DWG")).toBeInTheDocument();
    expect(screen.getByText("схема")).toHaveAttribute("title", "схема.dwg");
  });
});

describe("FileUpload.Queue, a queue only", () => {
  it("draws a row per file: badge or preview, size and status, progress", () => {
    render(
      <FileUpload.Queue
        aria-label="Вложения"
        queue={queueOf([
          { id: "1", file: pdf, status: "loading", progress: 0.4 },
          { id: "2", file: photo, status: "queued", progress: 0, preview: "blob:1" },
        ])}
      />,
    );
    const list = screen.getByRole("list", { name: "Вложения" });
    expect(list.children).toHaveLength(2);
    // A file in transfer shows its ring where the format stood, and its full name.
    expect(screen.queryByText("PDF")).toBeNull();
    expect(screen.getByText("Отчёт.pdf")).toBeInTheDocument();
    expect(screen.getByText("2 КБ · Загрузка 40%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Загрузка: Отчёт.pdf" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
    expect(document.querySelector('img[src="blob:1"]')).not.toBeNull();
    expect(screen.getByText("1 Б · В очереди")).toBeInTheDocument();
  });

  it("a failed row is invalid, shows the reason and retries", () => {
    const queue = queueOf([
      { id: "1", file: pdf, status: "failed", progress: 0.3, error: "Нет связи" },
      { id: "2", file: photo, status: "failed", progress: 0 },
    ]);
    render(<FileUpload.Queue queue={queue} />);
    expect(screen.getByText("2 КБ · Нет связи")).toBeInTheDocument();
    expect(screen.getByText("1 Б · Не удалось загрузить")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Повторить загрузку: Отчёт.pdf" }));
    expect(queue.retry).toHaveBeenCalledWith("1");
    expect(screen.getByText("Отчёт").closest("[data-invalid]")).not.toBeNull();
  });

  it("removes any row from the queue and announces it; a finished row has no retry", () => {
    const queue = queueOf([{ id: "1", file: pdf, status: "done", progress: 1 }]);
    render(<FileUpload.Queue queue={queue} />);
    expect(screen.queryByRole("button", { name: /Повторить/ })).toBeNull();
    expect(screen.getByText("2 КБ")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Убрать Отчёт.pdf" }));
    expect(queue.remove).toHaveBeenCalledWith("1");
    expect(screen.getByRole("status")).toHaveTextContent("Отчёт.pdf: убран");
  });

  it("announces a file that finished or failed", () => {
    const { rerender } = render(
      <FileUpload.Queue
        queue={queueOf([{ id: "1", file: pdf, status: "loading", progress: 0.5 }])}
      />,
    );
    rerender(
      <FileUpload.Queue queue={queueOf([{ id: "1", file: pdf, status: "done", progress: 1 }])} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Отчёт.pdf: загружен");
    rerender(
      <FileUpload.Queue
        queue={queueOf([{ id: "1", file: pdf, status: "failed", progress: 1, error: "Отказ" }])}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Отчёт.pdf: Отказ");
  });

  it("takes a custom size format and no list while empty", () => {
    const { rerender } = render(<FileUpload.Queue queue={queueOf([])} />);
    expect(screen.queryByRole("list")).toBeNull();
    rerender(
      <FileUpload.Queue
        formatSize={() => "мало"}
        queue={queueOf([{ id: "1", file: pdf, status: "done", progress: 1 }])}
      />,
    );
    expect(screen.getByText("мало")).toBeInTheDocument();
  });

  it("works with the real queue end to end, the queue on the root", async () => {
    function Attachments() {
      const queue = useUploadQueue({ upload: async () => "ok" });
      return <FileUpload.Root multiple queue={queue} aria-label="Файлы" />;
    }
    const { container } = render(<Attachments />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { files: [pdf] } });
    });
    expect(screen.getByText("2 КБ")).toBeInTheDocument();
    // Settled: the ring gives the mark back to the format.
    await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull());
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  describe('layout="grid" | "strip"', () => {
    /** A queue that really moves and removes its files. */
    function Live({
      initial,
      layout = "grid",
    }: {
      initial: UploadItem[];
      layout?: "grid" | "strip";
    }) {
      const [items, setItems] = React.useState(initial);
      return (
        <FileUpload.Queue
          aria-label="Файлы"
          layout={layout}
          queue={{
            items,
            retry: vi.fn(),
            remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
            move: (id, beforeId) =>
              setItems((current) => {
                const item = current.find((entry) => entry.id === id);
                if (!item) return current;
                const rest = current.filter((entry) => entry !== item);
                const at =
                  beforeId === null ? rest.length : rest.findIndex((e) => e.id === beforeId);
                return [...rest.slice(0, at), item, ...rest.slice(at)];
              }),
          }}
        />
      );
    }

    it("draws a tile per file: a picture, a video frame or the format badge with name and size", () => {
      render(
        <Live
          initial={[
            { id: "1", file: pdf, status: "loading", progress: 0.4 },
            { id: "2", file: photo, status: "done", progress: 1, preview: "blob:photo" },
            { id: "3", file: clip, status: "queued", progress: 0, preview: "blob:clip" },
          ]}
        />,
      );
      expect(tileNames()).toEqual([
        "Файл 1: Отчёт.pdf · Загрузка 40%",
        "Фото 2: Фасад.jpg",
        "Видео 3: Обход.mp4 · В очереди",
      ]);
      expect(screen.getByRole("list", { name: "Файлы" })).toHaveAttribute("data-axis", "grid");
      expect(screen.getByText("PDF")).toHaveAttribute("data-color", "red");
      expect(screen.getByText("2 КБ")).toBeInTheDocument();
      // Without a cover a picture carries its format.
      expect(screen.getByText("JPG")).toBeInTheDocument();
      expect(document.querySelector('img[src="blob:photo"]')).not.toBeNull();
      // The disk in the middle of every file on its way, described by its state.
      expect(screen.getByRole("button", { description: "Загрузка 40%" })).toHaveAccessibleName(
        /^Отменить загрузку/,
      );
      expect(screen.getByRole("button", { description: "В очереди" })).toBeInTheDocument();
    });

    it("Alt+→ moves a tile and the queue's order follows; strip is one sideways row", () => {
      render(
        <Live
          layout="strip"
          initial={[
            { id: "1", file: pdf, status: "done", progress: 1 },
            { id: "2", file: photo, status: "done", progress: 1, preview: "blob:photo" },
          ]}
        />,
      );
      expect(screen.getByRole("list", { name: "Файлы" })).toHaveAttribute("data-axis", "x");
      fireEvent.keyDown(screen.getByRole("listitem", { name: /Отчёт/ }), {
        key: "ArrowRight",
        altKey: true,
      });
      expect(tileNames()).toEqual(["Фото 1: Фасад.jpg", "Файл 2: Отчёт.pdf"]);
    });

    it("Delete removes the focused tile, the × removes another", () => {
      render(
        <Live
          initial={[
            { id: "1", file: pdf, status: "done", progress: 1 },
            { id: "2", file: photo, status: "done", progress: 1, preview: "blob:photo" },
          ]}
        />,
      );
      fireEvent.keyDown(screen.getByRole("listitem", { name: /Фасад/ }), { key: "Delete" });
      expect(tileNames()).toEqual(["Файл 1: Отчёт.pdf"]);
      fireEvent.click(screen.getByRole("button", { name: "Убрать Отчёт.pdf" }));
      expect(tileNames()).toEqual([]);
    });

    it("without queue.move and a value the tiles do not reorder", () => {
      render(
        <FileUpload.Queue
          layout="grid"
          queue={{
            items: [{ id: "1", file: pdf, status: "done", progress: 1 }],
            retry: vi.fn(),
            remove: vi.fn(),
          }}
        />,
      );
      expect(screen.getByRole("listitem", { name: /Отчёт/ })).toHaveAttribute(
        "aria-keyshortcuts",
        "Delete",
      );
    });
  });
});

const PHOTOS: FileUploadFile[] = [
  { id: "a", name: "front.jpg", type: "image/jpeg", src: "a.jpg", alt: "Спереди" },
  { id: "b", name: "side.jpg", type: "image/jpeg", src: "b.jpg", alt: "Сбоку" },
  { id: "c", name: "back.jpg", type: "image/jpeg", src: "c.jpg", alt: "Сзади" },
];

/** A controlled gallery: the add tile, a grid, the value kept by its owner. */
function Photos({ onValueChange, ...props }: Partial<FileUploadRootProps>) {
  const [value, setValue] = React.useState<readonly FileUploadFile[]>(PHOTOS);
  return (
    <FileUpload.Root
      label="Фотографии"
      trigger="tile"
      layout="grid"
      multiple
      value={value}
      onFilesChange={() => {}}
      {...props}
      onValueChange={(next) => {
        setValue(next);
        return onValueChange?.(next);
      }}
    />
  );
}

const tiles = () =>
  within(screen.getByRole("list", { name: "Фотографии" }))
    .getAllByRole("listitem")
    .map((tile) => tile.getAttribute("aria-label"))
    .filter(Boolean);

describe('FileUpload.Root trigger="tile", a value', () => {
  it("draws a named list of files in order, each named by its position and alt", () => {
    render(<Photos />);
    expect(tiles()).toEqual(["Фото 1: Спереди", "Фото 2: Сбоку", "Фото 3: Сзади"]);
  });

  it("removes a file with its × and announces it", () => {
    const onValueChange = vi.fn();
    render(<Photos onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Убрать side.jpg" }));
    expect(onValueChange).toHaveBeenCalledWith([PHOTOS[0], PHOTOS[2]]);
    expect(tiles()).toEqual(["Фото 1: Спереди", "Фото 2: Сзади"]);
    expect(screen.getByRole("status")).toHaveTextContent("side.jpg: убран");
  });

  it("removes the focused file with Delete and moves focus to its neighbour", () => {
    render(<Photos />);
    const tile = screen.getByRole("listitem", { name: "Фото 1: Спереди" });
    tile.focus();
    fireEvent.keyDown(tile, { key: "Delete" });
    expect(tiles()).toEqual(["Фото 1: Сбоку", "Фото 2: Сзади"]);
    expect(document.activeElement).toBe(screen.getByRole("listitem", { name: "Фото 1: Сбоку" }));
  });

  it("moves a file one place with Alt+→", () => {
    const onValueChange = vi.fn();
    render(<Photos onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Фото 1: Спереди" }), {
      key: "ArrowRight",
      altKey: true,
    });
    expect(tiles()).toEqual(["Фото 1: Сбоку", "Фото 2: Спереди", "Фото 3: Сзади"]);
    expect(onValueChange).toHaveBeenCalledWith([PHOTOS[1], PHOTOS[0], PHOTOS[2]]);
  });

  it("without cover there is no cover pill", () => {
    render(<Photos />);
    expect(screen.queryByText("Обложка")).toBeNull();
  });

  it("cover marks the first file; the tiles offer no action but remove", () => {
    render(<Photos cover />);
    expect(screen.getByText("Обложка")).toBeInTheDocument();
    // The cover's word takes its format pill's place; the others keep their format.
    expect(screen.getAllByText("JPG")).toHaveLength(2);
    const names = screen.getAllByRole("button").map((button) => button.getAttribute("aria-label"));
    expect(names).toEqual(["Убрать front.jpg", "Убрать side.jpg", "Убрать back.jpg"]);
  });

  it("cover: a tile moved first with Alt+← becomes the cover, and that is announced", () => {
    const onValueChange = vi.fn();
    render(<Photos cover onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Фото 2: Сбоку" }), {
      key: "ArrowLeft",
      altKey: true,
    });
    expect(onValueChange).toHaveBeenCalledWith([PHOTOS[1], PHOTOS[0], PHOTOS[2]]);
    expect(tiles()).toEqual(["Фото 1: Сбоку", "Фото 2: Спереди", "Фото 3: Сзади"]);
    expect(screen.getByRole("status")).toHaveTextContent("Обложка: side.jpg");
  });

  it("cover: a move that keeps the first file says nothing of the cover", () => {
    render(<Photos cover />);
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Фото 2: Сбоку" }), {
      key: "ArrowRight",
      altKey: true,
    });
    expect(tiles()).toEqual(["Фото 1: Спереди", "Фото 2: Сзади", "Фото 3: Сбоку"]);
    expect(screen.getByRole("status")).not.toHaveTextContent("Обложка");
  });

  it("hands picked files to onFilesChange, of accept and cut to the room under max", () => {
    const onFilesChange = vi.fn();
    render(<Photos max={4} accept="image/*" onFilesChange={onFilesChange} />);
    const input = screen.getByLabelText("Добавить файлы");
    const files = [
      new File(["1"], "one.jpg", { type: "image/jpeg" }),
      new File(["2"], "notes.pdf", { type: "application/pdf" }),
      new File(["3"], "two.png", { type: "image/png" }),
    ];
    fireEvent.change(input, { target: { files } });
    expect(onFilesChange).toHaveBeenCalledWith([files[0]]);
  });

  it("takes files dropped anywhere on the set; the add tile turns into the target", () => {
    const onFilesChange = vi.fn();
    const { container } = render(<Photos onFilesChange={onFilesChange} />);
    const file = new File(["1"], "one.jpg", { type: "image/jpeg" });
    const list = screen.getByRole("list", { name: "Фотографии" });
    fireEvent.dragEnter(list, { dataTransfer: { files: [file], types: ["Files"] } });
    expect(container.querySelector("[data-dropping]")).not.toBeNull();
    fireEvent.drop(list, { dataTransfer: { files: [file], types: ["Files"] } });
    expect(onFilesChange).toHaveBeenCalledWith([file]);
    expect(container.querySelector("[data-dropping]")).toBeNull();
  });

  it("with room under max the add tile counts nothing", () => {
    render(<Photos max={4} />);
    expect(screen.getByLabelText("Добавить файлы").closest("label")).toHaveTextContent(/^Файлы$/);
  });

  it("at max the add tile leaves and comes back once a file goes", () => {
    render(<Photos max={3} />);
    expect(screen.queryByLabelText("Добавить файлы")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    const tile = screen.getByRole("listitem", { name: "Фото 1: Спереди" });
    tile.focus();
    fireEvent.keyDown(tile, { key: "Delete" });
    expect(screen.getByLabelText("Добавить файлы")).toBeInTheDocument();
  });

  it("a pick that fills the set hands the focus from the add tile to the last file", async () => {
    function Filling() {
      const [value, setValue] = React.useState<readonly FileUploadFile[]>(PHOTOS.slice(0, 2));
      return (
        <FileUpload.Root
          label="Фотографии"
          trigger="tile"
          layout="grid"
          multiple
          max={3}
          value={value}
          onValueChange={setValue}
          onFilesChange={(files) =>
            setValue((current) => [
              ...current,
              ...files.map((file) => ({ id: file.name, name: file.name, type: file.type })),
            ])
          }
        />
      );
    }
    render(<Filling />);
    const input = screen.getByLabelText("Добавить файлы");
    input.focus();
    const file = new File(["3"], "back.jpg", { type: "image/jpeg" });
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    expect(screen.queryByLabelText("Добавить файлы")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("listitem", { name: /^\S+ 3: back/ }));
  });

  it("a tile shows the base name; the full name stays in its title and aria-label", () => {
    render(
      <FileUpload.Root
        label="Фотографии"
        trigger="tile"
        layout="grid"
        multiple
        value={[
          { id: "a", name: "Спереди.jpg", type: "image/jpeg", src: "a.jpg" },
          { id: "b", name: "отчёт.final.pdf", type: "application/pdf" },
          { id: "c", name: "README" },
        ]}
        onFilesChange={() => {}}
        onValueChange={() => {}}
      />,
    );
    expect(tiles()).toEqual(["Фото 1: Спереди.jpg", "Файл 2: отчёт.final.pdf", "Файл 3: README"]);
    expect(screen.getByText("Спереди")).toHaveAttribute("title", "Спереди.jpg");
    expect(screen.getByText("отчёт.final")).toHaveAttribute("title", "отчёт.final.pdf");
    expect(screen.getByText("README")).toHaveAttribute("title", "README");
  });

  it("draws the add tile like a drop zone: whatever handler takes the files", () => {
    render(<Photos onFilesChange={undefined} />);
    expect(screen.getByLabelText("Добавить файлы")).toBeEnabled();
  });

  it("an empty set is one wide add tile", () => {
    render(<FileUpload.Root label="Фотографии" trigger="tile" onFilesChange={() => {}} />);
    expect(screen.getByText("Нажмите или перетащите файлы")).toBeInTheDocument();
  });

  it("disabled: no add tile, no actions, no shortcuts", () => {
    render(<Photos disabled cover />);
    expect(screen.queryByLabelText("Добавить файлы")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("listitem", { name: "Фото 1: Спереди" })).not.toHaveAttribute(
      "aria-keyshortcuts",
    );
  });

  it("wires the hint and the error to the add tile's input", () => {
    render(<Photos hint="До 10 МБ" error="Нужно не меньше трёх фото" />);
    const input = screen.getByLabelText("Добавить файлы");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Нужно не меньше трёх фото");
  });

  it("a grid of mixed files with a cover: the first file is the cover whatever it is", () => {
    render(
      <FileUpload.Root
        label="Фотографии"
        trigger="tile"
        layout="grid"
        cover
        defaultValue={[
          { id: "act", name: "Акт.pdf", size: 2048, type: "application/pdf" },
          PHOTOS[0] as FileUploadFile,
          { id: "walk", name: "Обход.mp4", type: "video/mp4", src: "walk.mp4" },
        ]}
      />,
    );
    expect(tiles()).toEqual(["Файл 1: Акт.pdf", "Фото 2: Спереди", "Видео 3: Обход.mp4"]);
    expect(screen.getByText("Обложка")).toBeInTheDocument();
    expect(screen.getByText("2 КБ")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Фото 2: Спереди" }), {
      key: "ArrowLeft",
      altKey: true,
    });
    expect(tiles()).toEqual(["Фото 1: Спереди", "Файл 2: Акт.pdf", "Видео 3: Обход.mp4"]);
    expect(screen.getByRole("status")).toHaveTextContent("Обложка: front.jpg");
  });

  describe("with a queue", () => {
    const jpg = new File(["x"], "IMG_2041.jpg", { type: "image/jpeg" });

    it("puts picked files into the queue and their previews into the value at once", () => {
      const onValueChange = vi.fn();
      const queue = queueOf([]);
      render(<Photos queue={queue} onFilesChange={undefined} onValueChange={onValueChange} />);
      fireEvent.change(screen.getByLabelText("Добавить файлы"), { target: { files: [jpg] } });
      expect(queue.add).toHaveBeenCalledWith([jpg]);
      expect(onValueChange).toHaveBeenCalledWith([
        ...PHOTOS,
        {
          id: "new-0",
          name: "IMG_2041.jpg",
          size: 1,
          type: "image/jpeg",
          src: "blob:IMG_2041.jpg",
        },
      ]);
    });

    it("a refused add takes the new files out of the queue", async () => {
      const queue = queueOf([]);
      render(
        <FileUpload.Root
          label="Фотографии"
          trigger="tile"
          layout="grid"
          defaultValue={PHOTOS}
          queue={queue}
          onValueChange={async () => {
            throw new Error("offline");
          }}
        />,
      );
      await act(async () => {
        fireEvent.change(screen.getByLabelText("Добавить файлы"), { target: { files: [jpg] } });
      });
      expect(queue.remove).toHaveBeenCalledWith("new-0");
      expect(screen.getByRole("status")).toHaveTextContent(
        "Не удалось сохранить изменение, файлы на прежних местах",
      );
    });

    it("a tile shows its upload state in its name and over the picture", () => {
      const queue = queueOf([
        { id: "b", file: jpg, status: "loading", progress: 0.45 },
        { id: "c", file: jpg, status: "queued", progress: 0 },
      ]);
      render(<Photos queue={queue} />);
      expect(tiles()).toEqual([
        "Фото 1: Спереди",
        "Фото 2: Сбоку · Загрузка 45%",
        "Фото 3: Сзади · В очереди",
      ]);
      expect(screen.getByRole("button", { description: "Загрузка 45%" })).toHaveAttribute(
        "aria-busy",
        "true",
      );
      expect(screen.getByRole("listitem", { name: /Сбоку/ })).toHaveAttribute(
        "data-upload",
        "loading",
      );
    });

    it("the ring follows the progress, the disk cancels, and it fades out when done", () => {
      const queue = queueOf([{ id: "b", file: jpg, status: "loading", progress: 0.3 }]);
      const { rerender } = render(<Photos queue={queue} />);
      const disk = screen.getByRole("button", { name: "Отменить загрузку: side.jpg" });
      expect(disk).toHaveAccessibleDescription("Загрузка 30%");
      const ring = disk.querySelector<SVGSVGElement>("svg[data-weight]");
      expect(ring?.style.getPropertyValue("--ring-value")).toBe("0.3");
      // In flight the disk is the remove: no corner button.
      expect(screen.queryByRole("button", { name: "Убрать side.jpg" })).toBeNull();
      fireEvent.click(disk);
      expect(queue.remove).toHaveBeenCalledWith("b");
      rerender(<Photos queue={queueOf([{ id: "b", file: jpg, status: "done", progress: 1 }])} />);
      expect(screen.queryByRole("button", { name: /^Отменить загрузку/ })).toBeNull();
    });

    it("a failed tile shows the reason and retries; removing a settled file stops nothing", () => {
      const queue = queueOf([
        { id: "b", file: jpg, status: "failed", progress: 0.2, error: "Нет связи" },
      ]);
      render(<Photos queue={queue} />);
      expect(screen.getByRole("listitem", { name: "Фото 2: Сбоку · Нет связи" })).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: "Повторить загрузку: side.jpg" }));
      expect(queue.retry).toHaveBeenCalledWith("b");
      fireEvent.click(screen.getByRole("button", { name: "Убрать side.jpg" }));
      expect(queue.remove).toHaveBeenCalledWith("b");
      fireEvent.click(screen.getByRole("button", { name: "Убрать front.jpg" }));
      expect(queue.remove).toHaveBeenCalledTimes(1);
    });

    it("announces a file that finished or failed", () => {
      const { rerender } = render(
        <Photos queue={queueOf([{ id: "c", file: jpg, status: "loading", progress: 0.9 }])} />,
      );
      rerender(<Photos queue={queueOf([{ id: "c", file: jpg, status: "done", progress: 1 }])} />);
      expect(screen.getByRole("status")).toHaveTextContent("IMG_2041.jpg: загружен");
      rerender(
        <Photos
          queue={queueOf([{ id: "c", file: jpg, status: "failed", progress: 1, error: "Отказ" }])}
        />,
      );
      expect(screen.getByRole("status")).toHaveTextContent("IMG_2041.jpg: Отказ");
    });

    it("an uploading tile still moves with Alt+→", () => {
      render(
        <Photos queue={queueOf([{ id: "a", file: jpg, status: "loading", progress: 0.1 }])} />,
      );
      fireEvent.keyDown(screen.getByRole("listitem", { name: /Спереди/ }), {
        key: "ArrowRight",
        altKey: true,
      });
      expect(tiles()[1]).toBe("Фото 2: Спереди · Загрузка 10%");
    });

    it("uploads not in the value follow it, in the queue's order", () => {
      render(
        <Photos queue={queueOf([{ id: "up", file: pdf, status: "loading", progress: 0.5 }])} />,
      );
      expect(tiles()).toEqual([
        "Фото 1: Спереди",
        "Фото 2: Сбоку",
        "Фото 3: Сзади",
        "Файл 4: Отчёт.pdf · Загрузка 50%",
      ]);
    });
  });
});

describe('layout="list" with a value and a queue', () => {
  const DOCS: FileUploadFile[] = [
    { id: "contract", name: "Договор.pdf", size: 4096, type: "application/pdf" },
    { id: "site", name: "Площадка.jpg", size: 1024, type: "image/jpeg", src: "site.jpg" },
  ];

  it("draws the files on the server, then the uploads; a server file has no progress", () => {
    render(
      <FileUpload.Root
        label="Документы"
        defaultValue={DOCS}
        queue={queueOf([{ id: "up", file: pdf, status: "loading", progress: 0.5 }])}
      />,
    );
    const rows = within(screen.getByRole("list", { name: "Документы" })).getAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual([
      "PDFДоговор4 КБ",
      "Площадка.jpg1 КБ",
      "Отчёт.pdf2 КБ · Загрузка 50%",
    ]);
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
    expect(document.querySelector('img[src="site.jpg"]')).not.toBeNull();
  });

  it("removing an upload through onValueChange takes it out of the queue", () => {
    const onValueChange = vi.fn();
    const queue = queueOf([{ id: "up", file: pdf, status: "loading", progress: 0.5 }]);
    render(
      <FileUpload.Root
        label="Документы"
        defaultValue={DOCS}
        queue={queue}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Убрать Отчёт.pdf" }));
    expect(onValueChange).toHaveBeenCalledWith(DOCS);
    expect(queue.remove).toHaveBeenCalledWith("up");
  });

  it("a list has no cover: rows do not reorder", () => {
    render(<FileUpload.Root label="Документы" cover defaultValue={DOCS} />);
    expect(screen.queryByText(/Обложка/)).toBeNull();
  });

  it('trigger="tile" puts the add tile at the end of the rows', () => {
    render(
      <FileUpload.Root
        label="Документы"
        trigger="tile"
        defaultValue={DOCS}
        onFilesChange={() => {}}
      />,
    );
    const rows = within(screen.getByRole("list", { name: "Документы" })).getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(rows[2]).toContainElement(screen.getByLabelText("Добавить файлы"));
  });
});

describe("async onValueChange", () => {
  function deferred() {
    let resolve: () => void = () => {};
    let reject: (reason: unknown) => void = () => {};
    const promise = new Promise<void>((done, fail) => {
      resolve = done;
      reject = fail;
    });
    return { promise, resolve, reject };
  }
  const names = () =>
    screen
      .getAllByRole("listitem", { name: /^Фото/ })
      .map((tile) => tile.getAttribute("aria-label"));

  it("a removal keeps the file busy until the answer; resolve takes it out", async () => {
    const save = deferred();
    render(
      <FileUpload.Queue layout="grid" defaultValue={PHOTOS} onValueChange={() => save.promise} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Убрать side.jpg" }));
    expect(screen.getByRole("listitem", { name: "Фото 2: Сбоку" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("button", { name: "Убрать side.jpg" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await act(async () => {
      save.resolve();
    });
    expect(names()).toEqual(["Фото 1: Спереди", "Фото 2: Сзади"]);
  });

  it("a refused removal keeps the file and announces it", async () => {
    render(
      <FileUpload.Queue
        layout="grid"
        defaultValue={PHOTOS}
        onValueChange={async () => {
          throw new Error("offline");
        }}
      />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Убрать side.jpg" }));
    });
    expect(names()).toEqual(["Фото 1: Спереди", "Фото 2: Сбоку", "Фото 3: Сзади"]);
    expect(screen.getByRole("listitem", { name: "Фото 2: Сбоку" })).not.toHaveAttribute(
      "aria-busy",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Не удалось сохранить изменение, файлы на прежних местах",
    );
  });

  it("a move stands busy in its new place; reject puts it back", async () => {
    const save = deferred();
    render(
      <FileUpload.Queue layout="grid" defaultValue={PHOTOS} onValueChange={() => save.promise} />,
    );
    fireEvent.keyDown(screen.getByRole("listitem", { name: "Фото 1: Спереди" }), {
      key: "ArrowRight",
      altKey: true,
    });
    expect(names()).toEqual(["Фото 1: Сбоку", "Фото 2: Спереди", "Фото 3: Сзади"]);
    expect(screen.getByRole("listitem", { name: "Фото 2: Спереди" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await act(async () => {
      save.reject(new Error("offline"));
    });
    expect(names()).toEqual(["Фото 1: Спереди", "Фото 2: Сбоку", "Фото 3: Сзади"]);
  });

  it("a list row waits busy with a spinner while its removal is saved", async () => {
    const save = deferred();
    render(
      <FileUpload.Queue
        defaultValue={[{ id: "1", name: "Счёт.pdf" }]}
        onValueChange={() => save.promise}
      />,
    );
    const button = screen.getByRole("button", { name: "Убрать Счёт.pdf" });
    fireEvent.click(button);
    expect(screen.getByRole("listitem")).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    await act(async () => {
      save.resolve();
    });
    expect(screen.queryByRole("listitem")).toBeNull();
  });
});

describe("FileUpload keyboard", () => {
  it("Tab reaches the file input of a zone, and every file of a set", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<FileUpload.Root label="Договор" />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("Договор"));
    unmount();
    render(<Photos />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("listitem", { name: "Фото 1: Спереди" }));
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("listitem", { name: "Фото 2: Сбоку" }));
  });

  it("Enter and Space on the focused input open the system dialog", async () => {
    const user = userEvent.setup();
    render(<FileUpload.Root label="Договор" />);
    const input = screen.getByLabelText("Договор");
    const opened = vi.fn();
    input.addEventListener("click", opened);
    await user.tab();
    expect(document.activeElement).toBe(input);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(opened).toHaveBeenCalledTimes(2);
  });

  it("Backspace on a tile removes the file and focuses its neighbour", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Photos onValueChange={onValueChange} />);
    act(() => screen.getByRole("listitem", { name: "Фото 2: Сбоку" }).focus());
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenCalledWith([PHOTOS[0], PHOTOS[2]]);
    expect(tiles()).toEqual(["Фото 1: Спереди", "Фото 2: Сзади"]);
    expect(document.activeElement).toHaveAttribute("aria-label", "Фото 2: Сзади");
  });

  it("Escape cancels a tile drag in flight", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    // jsdom lays nothing out: the tiles stand in one row, 100 px each.
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const item = this.hasAttribute("data-dnd-item");
      const left = item ? Array.from(this.parentElement?.children ?? []).indexOf(this) * 100 : 0;
      const width = item ? 100 : 400;
      return {
        left,
        top: 0,
        width,
        height: 100,
        right: left + width,
        bottom: 100,
        x: left,
        y: 0,
        toJSON: () => ({}),
      };
    });
    render(<Photos onValueChange={onValueChange} />);
    const pointer = { pointerId: 1, pointerType: "mouse", button: 0 };
    const tile = screen.getByRole("listitem", { name: "Фото 1: Спереди" });
    fireEvent.pointerDown(tile, { ...pointer, clientX: 50, clientY: 50 });
    fireEvent.pointerMove(window, { ...pointer, clientX: 120, clientY: 50 });
    fireEvent.pointerMove(window, { ...pointer, clientX: 250, clientY: 50 });
    expect(tile).toHaveAttribute("data-lifted");
    await user.keyboard("{Escape}");
    fireEvent.pointerUp(window, { ...pointer, clientX: 250, clientY: 50 });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(tiles()).toEqual(["Фото 1: Спереди", "Фото 2: Сбоку", "Фото 3: Сзади"]);
  });
});
