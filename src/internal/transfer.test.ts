import { describe, expect, it } from "vitest";

import { inFlight, TRANSFER_LABELS, transferCovers, transferDiskLabels } from "./transfer";

describe("transfer states", () => {
  it("queued and loading are in flight; the rest are not", () => {
    expect(inFlight("queued")).toBe(true);
    expect(inFlight("loading")).toBe(true);
    for (const state of ["remote", "failed", "done", undefined] as const) {
      expect(inFlight(state)).toBe(false);
    }
  });

  it("covers the content until it is done; no transfer covers nothing", () => {
    for (const state of ["remote", "queued", "loading", "failed"] as const) {
      expect(transferCovers(state)).toBe(true);
    }
    expect(transferCovers("done")).toBe(false);
    expect(transferCovers(undefined)).toBe(false);
  });
});

describe("transferDiskLabels", () => {
  it("picks the words of the direction and fills the share, clamped and rounded", () => {
    const up = transferDiskLabels(TRANSFER_LABELS, "upload", 0.456);
    expect(up).toMatchObject({
      cancel: "Отменить отправку",
      retry: "Повторить отправку",
      progress: "Отправка 46%",
      failed: "Не отправилось",
    });
    const down = transferDiskLabels(TRANSFER_LABELS, "download", 1.7);
    expect(down).toMatchObject({
      cancel: "Отменить загрузку",
      retry: "Повторить загрузку",
      progress: "Загрузка 100%",
      failed: "Не загрузилось",
    });
    expect(transferDiskLabels(TRANSFER_LABELS, "upload", undefined).progress).toBe("Отправка 0%");
  });

  it("fills the download name from the tokens", () => {
    const labels = { ...TRANSFER_LABELS, download: "Скачать {name}" };
    expect(transferDiskLabels(labels, "download", 0, { name: "фото" }).download).toBe(
      "Скачать фото",
    );
  });
});
