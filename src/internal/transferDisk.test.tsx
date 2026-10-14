import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { TRANSFER_LABELS, transferDiskLabels } from "./transfer";
import { TransferDisk } from "./transferDisk";

const LABELS = { ...transferDiskLabels(TRANSFER_LABELS, "upload", 0.4), failed: "Нет связи" };

const diskOf = () => document.querySelector<HTMLElement>("[data-size]");
const ringOf = (scope: Element | null) =>
  scope?.querySelector<SVGSVGElement>("svg[data-weight]") ?? null;

describe("TransferDisk", () => {
  it("is a circle Button whose turning ring carries the share, described by it", () => {
    const { rerender } = render(
      <TransferDisk state="loading" progress={0.4} labels={LABELS} onCancel={() => {}} />,
    );
    const button = screen.getByRole("button", { name: "Отменить отправку" });
    expect(button).toHaveAccessibleDescription("Отправка 40%");
    expect(button).toHaveAttribute("data-shape", "circle");
    expect(button).toHaveAttribute("data-variant", "shade");
    expect(button).toHaveAttribute("aria-busy", "true");
    const ring = ringOf(button);
    expect(ring?.style.getPropertyValue("--ring-value")).toBe("0.4");
    expect(ring).toHaveAttribute("data-spin", "true");
    // Queued: the empty ring turns at its least arc.
    rerender(<TransferDisk state="queued" labels={LABELS} onCancel={() => {}} />);
    expect(ringOf(button)?.style.getPropertyValue("--ring-value")).toBe("0");
  });

  it("names the transfer by its direction, never changing the look", () => {
    const down = transferDiskLabels(TRANSFER_LABELS, "download", 0.5);
    render(<TransferDisk state="loading" progress={0.5} labels={down} onCancel={() => {}} />);
    const button = screen.getByRole("button", { name: "Отменить загрузку" });
    expect(button).toHaveAccessibleDescription("Загрузка 50%");
    expect(button).toHaveAttribute("data-variant", "shade");
  });

  it("without a share a transfer in flight turns a quarter arc", () => {
    render(<TransferDisk state="loading" labels={LABELS} onCancel={() => {}} />);
    const ring = ringOf(screen.getByRole("button"));
    expect(ring?.style.getPropertyValue("--ring-value")).toBe("0.25");
    expect(ring).toHaveAttribute("data-spin", "true");
  });

  it("without the handler of its state it is no button: a still disk, a named progressbar", () => {
    render(<TransferDisk state="loading" progress={0.4} labels={LABELS} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("progressbar", { name: "Отправка 40%" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });

  it("a still disk of a failed transfer is the danger disk", () => {
    const { rerender } = render(<TransferDisk state="loading" progress={0.4} labels={LABELS} />);
    const still = () => screen.getByRole("progressbar", { hidden: true });
    expect(still()).not.toHaveAttribute("data-state");
    rerender(<TransferDisk state="failed" progress={0.4} labels={LABELS} />);
    const failed = document.querySelector("[data-variant][aria-hidden]");
    expect(failed).toHaveAttribute("data-state", "failed");
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

  it("keeps a slow cancel pending, focused, and announces a refusal", async () => {
    let reject: () => void = () => {};
    const onCancel = vi.fn(() => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))));
    render(<TransferDisk state="loading" progress={0.4} labels={LABELS} onCancel={onCancel} />);
    const button = screen.getByRole("button", { name: "Отменить отправку" });
    button.focus();
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    expect(button).toHaveFocus();
    fireEvent.click(button);
    expect(onCancel).toHaveBeenCalledTimes(1);
    await act(async () => reject());
    expect(button).not.toHaveAttribute("aria-disabled");
    expect(screen.getByRole("status")).toHaveTextContent("Не удалось отменить");
  });

  it("turns into a danger retry described by the reason after a failure; the ring fades", () => {
    const onRetry = vi.fn();
    render(<TransferDisk state="failed" progress={0.4} labels={LABELS} onRetry={onRetry} />);
    const retry = screen.getByRole("button", { name: "Повторить отправку" });
    expect(retry).toHaveAttribute("data-tone", "danger");
    expect(retry).toHaveAccessibleDescription("Нет связи");
    expect(retry).not.toHaveAttribute("aria-busy");
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalled();
  });

  it("remote: the download arrow without a ring; a refused download is announced", async () => {
    let reject: () => void = () => {};
    const onDownload = vi.fn(
      () => new Promise<void>((_, r) => (reject = () => r(new Error("нет")))),
    );
    render(<TransferDisk state="remote" look="solid" labels={LABELS} onDownload={onDownload} />);
    const download = screen.getByRole("button", { name: "Скачать" });
    expect(download).toHaveAttribute("data-variant", "solid");
    expect(ringOf(download)).toBeNull();
    fireEvent.click(download);
    expect(download).toHaveAttribute("aria-busy", "true");
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

  it("done: the ring fills, then the disk fades and shrinks away, out of the focus order", () => {
    render(<TransferDisk state="done" progress={1} labels={LABELS} onCancel={() => {}} />);
    expect(diskOf()).toHaveAttribute("inert");
    expect(screen.queryByRole("button")).toBeNull();
    const done = cssRule("src/internal/transferDisk.module.css", '.disk[data-state="done"]');
    expect(cssValue(done, "opacity")).toBe("0");
    expect(cssValue(done, "transform")).toBe("scale(var(--prime-motion-scale-settle))");
    expect(cssValue(done, "transition-delay")).toBe("var(--prime-motion-duration-base)");
  });

  it("has two sizes from the control tiers", () => {
    render(<TransferDisk state="loading" size="xl" labels={LABELS} onCancel={() => {}} />);
    expect(diskOf()).toHaveAttribute("data-size", "xl");
    expect(screen.getByRole("button")).toHaveAttribute("data-size", "xl");
  });
});
