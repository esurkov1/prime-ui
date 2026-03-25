import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NotificationProvider, useNotifications } from "./NotificationStore";

function NotificationHarness() {
  const { notify, dismissAll } = useNotifications();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          notify({
            type: "info",
            title: "Toast title",
            description: "Toast body",
          })
        }
      >
        push
      </button>
      <button
        type="button"
        onClick={() =>
          notify({
            type: "warning",
            title: "Warning title",
            description: "Warning body",
          })
        }
      >
        push warning
      </button>
      <button
        type="button"
        onClick={() =>
          notify({
            type: "warning",
            title: "Persistent title",
            description: "Persistent body",
            persistent: true,
          })
        }
      >
        push persistent
      </button>
      <button type="button" onClick={dismissAll}>
        dismiss all
      </button>
    </>
  );
}

describe("Notification", () => {
  it("shows notification via notify()", async () => {
    render(
      <NotificationProvider>
        <NotificationHarness />
      </NotificationProvider>,
    );

    expect(screen.queryByText("Toast title")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    expect(await screen.findByText("Toast title")).toBeInTheDocument();
    expect(screen.getByText("Toast body")).toBeInTheDocument();
  });

  it("dismissAll clears shown notifications", async () => {
    render(
      <NotificationProvider>
        <NotificationHarness />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "push" }));
    expect(await screen.findByText("Toast title")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "dismiss all" }));
    // Двухфазное удаление: элемент анимируется ~240 мс, затем убирается из DOM
    await waitFor(() => expect(screen.queryByText("Toast title")).not.toBeInTheDocument(), {
      timeout: 800,
    });
  });

  it("persistent notification has no progress bar", async () => {
    render(
      <NotificationProvider>
        <NotificationHarness />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "push persistent" }));
    expect(await screen.findByText("Persistent title")).toBeInTheDocument();
    const card = screen.getByText("Persistent title").closest("article");
    expect(card).toHaveAttribute("data-persistent", "true");
    expect(card?.querySelector("[class*=progressTrack]")).toBeNull();
  });

  it("limits visible notifications per position by max", async () => {
    render(
      <NotificationProvider max={2}>
        <NotificationHarness />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "push" }));
    expect(await screen.findByText("Toast title")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    fireEvent.click(screen.getByRole("button", { name: "push" }));

    await waitFor(() => {
      expect(screen.getAllByText("Toast title")).toHaveLength(2);
    });
  });

  it("different types form separate stacks on the same position", async () => {
    render(
      <NotificationProvider max={2}>
        <NotificationHarness />
      </NotificationProvider>,
    );

    // Заполняем info-стек до max (2)
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    // Warning идёт в собственный стек — не вытесняет info
    fireEvent.click(screen.getByRole("button", { name: "push warning" }));

    await waitFor(() => {
      expect(screen.getAllByText("Toast title")).toHaveLength(2);
      expect(screen.getAllByText("Warning title")).toHaveLength(1);
    });
  });
});
