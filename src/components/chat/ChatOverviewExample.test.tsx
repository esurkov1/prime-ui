import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ChatOverviewExample from "./examples/overview";

describe("Chat overview example: media from the Composer", () => {
  const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
  let next = 0;
  beforeEach(() => {
    next = 0;
    URL.createObjectURL = vi.fn(() => `blob:local-${++next}`);
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => {
    URL.createObjectURL = original.create;
    URL.revokeObjectURL = original.revoke;
  });

  it("sends photos and a video as one Message.Media album with the text as its caption", async () => {
    render(<ChatOverviewExample />);
    const field = screen.getByRole("textbox", { name: "Сообщение" });
    const files = [
      new File(["a"], "стеллаж.jpg", { type: "image/jpeg" }),
      new File(["b"], "обзор склада.mp4", { type: "video/mp4" }),
      new File(["c"], "Накладная.pdf", { type: "application/pdf" }),
    ];
    await act(async () => {
      fireEvent.paste(field, { clipboardData: { files, types: ["Files"] } });
    });
    fireEvent.change(field, { target: { value: "Склад после приёмки" } });
    // The stand-in server takes four steps of 200 ms.
    await waitFor(
      () => expect(screen.getByRole("button", { name: "Отправить" })).not.toBeDisabled(),
      { timeout: 3000 },
    );
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));

    // The album: a photo and a video (not file messages), in the tray order, with the caption.
    expect(await screen.findByRole("button", { name: "Открыть: стеллаж.jpg" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Открыть: обзор склада.mp4" })).toBeTruthy();
    expect(screen.getAllByText("Склад после приёмки").length).toBeGreaterThan(0);
    // The other file is a file message.
    expect(screen.getAllByText("Накладная").length).toBeGreaterThan(0);
    // The tray's previews are let go after the send; the album keeps its own URLs.
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local-1");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local-2");
    expect(URL.revokeObjectURL).not.toHaveBeenCalledWith("blob:local-3");
  }, 10000);
});
