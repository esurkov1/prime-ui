import { readFileSync } from "node:fs";
import path from "node:path";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TRANSFER_LABELS, transferDiskLabels } from "./transfer";
import { TransferDisk } from "./transferDisk";

const css = readFileSync(
  path.resolve(process.cwd(), "src/internal/transferDisk.module.css"),
  "utf8",
);

const LABELS = { ...transferDiskLabels(TRANSFER_LABELS, "upload", 0.4), failed: "Нет связи" };

const diskOf = () => document.querySelector<HTMLElement>("[data-size]");

describe("TransferDisk", () => {
  it("writes the share on one variable of a named progressbar ring", () => {
    const { rerender } = render(<TransferDisk state="loading" progress={0.4} labels={LABELS} />);
    const ring = screen.getByRole("progressbar", { name: "Отправка 40%" });
    expect(ring).toHaveAttribute("aria-valuenow", "40");
    expect(ring.style.getPropertyValue("--transfer-progress")).toBe("0.4");
    rerender(<TransferDisk state="queued" labels={LABELS} />);
    expect(ring.style.getPropertyValue("--transfer-progress")).toBe("0");
    // The ring glides between values (a registered number), 7.5% of the disk at every size.
    expect(css).toMatch(/@property --transfer-progress \{[^}]*syntax: "<number>"/);
    expect(css).toMatch(/transition:\s*--transfer-progress var\(--prime-motion-duration-base\)/);
    expect(css).toMatch(/--progress-ring-width: calc\(var\(--transfer-disk-size\) \* 0\.075\)/);
    expect(css).toMatch(
      /--progress-ring-track: color-mix\(in srgb, currentColor 32%, transparent\)/,
    );
  });

  it("names the transfer by its direction, never changing the look", () => {
    const down = transferDiskLabels(TRANSFER_LABELS, "download", 0.5);
    render(<TransferDisk state="loading" progress={0.5} labels={down} onCancel={() => {}} />);
    expect(screen.getByRole("progressbar", { name: "Загрузка 50%" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Отменить загрузку" })).toHaveAttribute(
      "data-look",
      "shade",
    );
  });

  it("without a share a transfer in flight is an indeterminate arc with no value", () => {
    render(<TransferDisk state="loading" labels={LABELS} />);
    expect(diskOf()).toHaveAttribute("data-indeterminate");
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });

  it("is the cancel in flight: a button reached by Tab, pressed by Enter and Space", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<TransferDisk state="loading" progress={0.4} labels={LABELS} onCancel={onCancel} />);
    await user.tab();
    const button = screen.getByRole("button", { name: "Отменить отправку" });
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it("keeps a slow cancel pending and announces a refusal", async () => {
    let reject: () => void = () => {};
    const onCancel = vi.fn(() => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))));
    render(<TransferDisk state="loading" progress={0.4} labels={LABELS} onCancel={onCancel} />);
    const button = screen.getByRole("button", { name: "Отменить отправку" });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(onCancel).toHaveBeenCalledTimes(1);
    await act(async () => reject());
    expect(button).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("status")).toHaveTextContent("Не удалось отменить");
  });

  it("turns into a danger retry described by the reason after a failure", () => {
    const onRetry = vi.fn();
    render(<TransferDisk state="failed" progress={0.4} labels={LABELS} onRetry={onRetry} />);
    expect(screen.queryByRole("progressbar")).toBeNull();
    const retry = screen.getByRole("button", { name: "Повторить отправку" });
    expect(retry).toHaveAttribute("data-look", "danger");
    expect(retry).toHaveAccessibleDescription("Нет связи");
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalled();
  });

  it("remote: the download arrow without a ring; a refused download is announced", async () => {
    let reject: () => void = () => {};
    const onDownload = vi.fn(
      () => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))),
    );
    render(<TransferDisk state="remote" look="solid" labels={LABELS} onDownload={onDownload} />);
    expect(screen.queryByRole("progressbar")).toBeNull();
    const download = screen.getByRole("button", { name: "Скачать" });
    expect(download).toHaveAttribute("data-look", "solid");
    fireEvent.click(download);
    await act(async () => reject());
    expect(screen.getByRole("status")).toHaveTextContent("Не удалось скачать");
  });

  it("disabled: its action is off", () => {
    const onCancel = vi.fn();
    render(<TransferDisk state="loading" labels={LABELS} onCancel={onCancel} disabled />);
    const button = screen.getByRole("button", { name: "Отменить отправку" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("done: fades and shrinks away, out of the focus order", () => {
    render(<TransferDisk state="done" progress={1} labels={LABELS} onCancel={() => {}} />);
    expect(diskOf()).toHaveAttribute("inert");
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(css).toMatch(/\.disk\[data-state="done"\] \{\s*opacity: 0;\s*transform: scale\(0\.9\);/);
  });

  it("has two sizes from the control tiers and honours reduced motion", () => {
    render(<TransferDisk state="loading" size="xl" labels={LABELS} />);
    expect(diskOf()).toHaveAttribute("data-size", "xl");
    expect(css).toMatch(/--transfer-disk-size: var\(--prime-control-l-height\)/);
    expect(css).toMatch(
      /\[data-size="xl"\] \{\s*--transfer-disk-size: var\(--prime-control-xl-height\)/,
    );
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });
});
