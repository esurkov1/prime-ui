import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";

import { ConfirmDialog, type ConfirmDialogRootProps } from "./ConfirmDialog";

function DeleteProject(props: Partial<ConfirmDialogRootProps>) {
  return (
    <ConfirmDialog.Root
      title="Удалить проект?"
      description="Проект и его задачи удалятся без возможности восстановления."
      confirmLabel="Удалить"
      onConfirm={() => {}}
      {...props}
    >
      <ConfirmDialog.Trigger>
        <Button.Root variant="outline" tone="danger">
          Удалить проект
        </Button.Root>
      </ConfirmDialog.Trigger>
    </ConfirmDialog.Root>
  );
}

function open() {
  const trigger = screen.getByRole("button", { name: "Удалить проект" });
  trigger.focus();
  fireEvent.click(trigger);
  return screen.getByRole("alertdialog");
}

/** A promise the test settles by hand. */
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("ConfirmDialog", () => {
  it("opens from the Trigger as a named, described alertdialog with Cancel focused", async () => {
    render(<DeleteProject />);
    const dialog = open();
    expect(dialog).toHaveAccessibleName("Удалить проект?");
    expect(dialog).toHaveAccessibleDescription(
      "Проект и его задачи удалятся без возможности восстановления.",
    );
    expect(dialog).toHaveAttribute("data-size", "s");
    await waitFor(() => expect(screen.getByRole("button", { name: "Отмена" })).toHaveFocus());
  });

  it("confirm is solid danger by default and accent on request", () => {
    const { unmount } = render(<DeleteProject />);
    open();
    expect(screen.getByRole("button", { name: "Удалить" })).toHaveAttribute("data-tone", "danger");
    unmount();
    render(<DeleteProject tone="accent" />);
    open();
    expect(screen.getByRole("button", { name: "Удалить" })).toHaveAttribute("data-tone", "accent");
  });

  it("a press outside never closes it; Escape and Cancel do", async () => {
    render(<DeleteProject />);
    const dialog = open();
    const scrim = dialog.parentElement as HTMLElement;
    fireEvent.pointerDown(scrim);
    fireEvent.click(scrim);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    open();
    fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("while onConfirm runs: loading confirm, Cancel and close disabled, Escape ignored; resolve closes", async () => {
    const run = deferred();
    const onOpenChange = vi.fn();
    render(<DeleteProject onConfirm={() => run.promise} onOpenChange={onOpenChange} />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));
    const confirm = screen.getByRole("button", { name: "Удалить" });
    expect(confirm).toHaveAttribute("data-loading", "true");
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Отмена" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Закрыть" })).toBeDisabled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await act(async () => run.resolve());
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("reject keeps it open with the default message; the next opening starts clean", async () => {
    render(<DeleteProject onConfirm={() => Promise.reject(new Error("409"))} />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Не получилось. Попробуйте ещё раз.",
    );
    const confirm = screen.getByRole("button", { name: "Удалить" });
    expect(confirm).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("button", { name: "Отмена" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Отмена" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
    open();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the owner's error and takes labels", async () => {
    function WithError() {
      const [error, setError] = React.useState<string>();
      return (
        <DeleteProject
          error={error}
          labels={{ cancel: "Не удалять" }}
          onConfirm={async () => {
            setError("Проект используется в трёх сделках");
            throw new Error("in use");
          }}
        />
      );
    }
    render(<WithError />);
    open();
    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Проект используется в трёх сделках",
    );
    expect(screen.getByRole("button", { name: "Не удалять" })).toBeInTheDocument();
  });

  it("is controlled by open / onOpenChange without a Trigger", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <ConfirmDialog.Root
          open={open}
          onOpenChange={setOpen}
          title="Отправить счёт клиенту?"
          confirmLabel="Отправить"
          tone="accent"
          onConfirm={() => {}}
        />
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
  });

  it("returns focus to the trigger after it closes", async () => {
    render(<DeleteProject />);
    open();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Удалить проект" })).toHaveFocus(),
    );
  });
});
