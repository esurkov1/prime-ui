import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Drawer } from "@/components/drawer/Drawer";
import { exitTimeoutMs } from "@/internal/motionTiming";
import { type MotionHarness, withMotion } from "@/test/motion";

import { NotificationCard, type NotificationDismissReason } from "./Notification";
import styles from "./Notification.module.css";
import { NotificationProvider, useNotifications } from "./NotificationStore";

function NotificationHarness() {
  const { notify, dismissAll } = useNotifications();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          notify({
            tone: "info",
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
            tone: "warning",
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
            tone: "warning",
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
    // Tests run with prefers-reduced-motion: reduce — the card goes without its exit animation.
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
    expect(card?.querySelector(`.${styles.progressTrack}`)).toBeNull();
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

  it("different tones form separate stacks on the same position", async () => {
    render(
      <NotificationProvider max={2}>
        <NotificationHarness />
      </NotificationProvider>,
    );

    // Fill the info stack up to max (2).
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    // A warning goes to its own stack and does not push out info.
    fireEvent.click(screen.getByRole("button", { name: "push warning" }));

    await waitFor(() => {
      expect(screen.getAllByText("Toast title")).toHaveLength(2);
      expect(screen.getAllByText("Warning title")).toHaveLength(1);
    });
  });

  it("sets data-tone, alert role for warning and labels from the provider", async () => {
    render(
      <NotificationProvider labels={{ close: "Hide", regionTopRight: "Toasts top right" }}>
        <NotificationHarness />
      </NotificationProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "push warning" }));
    const card = (await screen.findByText("Warning title")).closest("article");
    expect(card).toHaveAttribute("data-tone", "warning");
    expect(card).toHaveAttribute("role", "alert");
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Toasts top right" })).toBeInTheDocument();
  });

  it("defaults tone to info with status role", async () => {
    function Harness() {
      const { notify } = useNotifications();
      return (
        <button type="button" onClick={() => notify({ title: "Plain" })}>
          plain
        </button>
      );
    }
    render(
      <NotificationProvider>
        <Harness />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "plain" }));
    const card = (await screen.findByText("Plain")).closest("article");
    expect(card).toHaveAttribute("data-tone", "info");
    expect(card).toHaveAttribute("role", "status");
  });

  describe("stack motion", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    });

    function CountingHarness({ position }: { position?: "top-right" | "bottom-left" }) {
      const { notify, dismiss, items } = useNotifications();
      const count = React.useRef(0);
      return (
        <>
          <button
            type="button"
            onClick={() => {
              count.current += 1;
              notify({ title: `Toast ${count.current}`, position, persistent: true });
            }}
          >
            push
          </button>
          <button type="button" onClick={() => items[0] && dismiss(items[0].id)}>
            dismiss newest
          </button>
        </>
      );
    }

    function stackItems(name = "Уведомления сверху справа") {
      return Array.from(screen.getByRole("list", { name }).children) as HTMLElement[];
    }

    it("puts the newest card on top and peeks older ones behind it", () => {
      render(
        <NotificationProvider>
          <CountingHarness />
        </NotificationProvider>,
      );
      const push = screen.getByRole("button", { name: "push" });
      for (let i = 0; i < 4; i += 1) fireEvent.click(push);

      const items = stackItems();
      const byIndex = (i: number) =>
        items.find((li) => li.getAttribute("data-stack-index") === String(i)) as HTMLElement;

      expect(byIndex(0)).toHaveTextContent("Toast 4");
      expect(byIndex(3)).toHaveTextContent("Toast 1");
      expect(byIndex(0).style.getPropertyValue("--ntf-y")).toBe("0px");
      expect(byIndex(1).style.getPropertyValue("--ntf-y")).toBe("8px");
      expect(byIndex(1).style.getPropertyValue("--ntf-scale")).toBe("0.95");
      expect(byIndex(2).style.getPropertyValue("--ntf-scale")).toBe("0.9");
      expect(byIndex(1).style.getPropertyValue("--ntf-opacity")).toBe("0.72");
      expect(byIndex(2).style.getPropertyValue("--ntf-opacity")).toBe("0.48");
      expect(byIndex(3)).toHaveAttribute("data-hidden", "true");
      expect(byIndex(3).style.getPropertyValue("--ntf-opacity")).toBe("0");
      expect(byIndex(0)).not.toHaveAttribute("data-hidden");
    });

    it("peeks upward in bottom stacks", () => {
      render(
        <NotificationProvider>
          <CountingHarness position="bottom-left" />
        </NotificationProvider>,
      );
      const push = screen.getByRole("button", { name: "push" });
      fireEvent.click(push);
      fireEvent.click(push);
      const older = stackItems("Уведомления снизу слева").find(
        (li) => li.getAttribute("data-stack-index") === "1",
      );
      expect(older?.style.getPropertyValue("--ntf-y")).toBe("-8px");
    });

    it("keeps at most `max` cards per stack, dropping the oldest", () => {
      render(
        <NotificationProvider max={3}>
          <CountingHarness />
        </NotificationProvider>,
      );
      const push = screen.getByRole("button", { name: "push" });
      for (let i = 0; i < 5; i += 1) fireEvent.click(push);
      expect(stackItems()).toHaveLength(3);
      expect(screen.queryByText("Toast 2")).not.toBeInTheDocument();
      expect(screen.getByText("Toast 5")).toBeInTheDocument();
    });

    it("expands on hover and collapses after the pointer leaves", () => {
      vi.useFakeTimers();
      render(
        <NotificationProvider>
          <CountingHarness />
        </NotificationProvider>,
      );
      const push = screen.getByRole("button", { name: "push" });
      for (let i = 0; i < 4; i += 1) fireEvent.click(push);
      const list = screen.getByRole("list", { name: "Уведомления сверху справа" });

      fireEvent.mouseEnter(list);
      expect(list).toHaveAttribute("data-expanded", "true");
      for (const li of stackItems()) {
        expect(li).not.toHaveAttribute("data-hidden");
        expect(li.style.getPropertyValue("--ntf-scale")).toBe("1");
        expect(li.style.getPropertyValue("--ntf-opacity")).toBe("1");
      }

      fireEvent.mouseLeave(list);
      expect(list).toHaveAttribute("data-expanded", "true");
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(list).toHaveAttribute("data-expanded", "false");
    });

    it("expands while focus is inside the stack", () => {
      vi.useFakeTimers();
      render(
        <NotificationProvider>
          <CountingHarness />
        </NotificationProvider>,
      );
      const push = screen.getByRole("button", { name: "push" });
      for (let i = 0; i < 4; i += 1) fireEvent.click(push);
      const list = screen.getByRole("list", { name: "Уведомления сверху справа" });
      const close = within(list).getAllByRole("button", { name: "Закрыть уведомление" });

      act(() => close[3].focus());
      expect(list).toHaveAttribute("data-expanded", "true");
      for (const li of stackItems()) expect(li).not.toHaveAttribute("data-hidden");

      act(() => close[3].blur());
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(list).toHaveAttribute("data-expanded", "false");
    });

    it("keeps a dismissed card until its exit transition ends, out of the offsets", () => {
      withMotion();
      render(
        <NotificationProvider>
          <CountingHarness />
        </NotificationProvider>,
      );
      const push = screen.getByRole("button", { name: "push" });
      fireEvent.click(push);
      fireEvent.click(push);
      fireEvent.click(screen.getByRole("button", { name: "dismiss newest" }));

      const closing = screen.getByText("Toast 2").closest("li") as HTMLElement;
      expect(closing).toHaveAttribute("data-state", "closed");
      const remaining = screen.getByText("Toast 1").closest("li") as HTMLElement;
      expect(remaining).toHaveAttribute("data-stack-index", "0");
      expect(remaining.style.getPropertyValue("--ntf-y")).toBe("0px");

      fireEvent.transitionEnd(closing.firstElementChild as HTMLElement);
      expect(screen.queryByText("Toast 2")).not.toBeInTheDocument();
      expect(screen.getByText("Toast 1")).toBeInTheDocument();
    });

    it("removes a dismissed card by the token timeout when no animationend arrives", () => {
      withMotion();
      vi.useFakeTimers();
      render(
        <NotificationProvider>
          <CountingHarness />
        </NotificationProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "push" }));
      fireEvent.click(screen.getByRole("button", { name: "dismiss newest" }));
      expect(screen.getByText("Toast 1")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(exitTimeoutMs("fast"));
      });
      expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
    });

    it("removes a dismissed card immediately under reduced motion", () => {
      // The test setup reports `prefers-reduced-motion: reduce`.
      render(
        <NotificationProvider>
          <CountingHarness />
        </NotificationProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "push" }));
      fireEvent.click(screen.getByRole("button", { name: "dismiss newest" }));
      expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
    });
  });

  describe("timers", () => {
    let visibility: DocumentVisibilityState = "visible";

    afterEach(() => {
      vi.useRealTimers();
      // Drop the own-property override; the prototype getter takes over again.
      delete (document as { visibilityState?: DocumentVisibilityState }).visibilityState;
      visibility = "visible";
    });

    function setVisibility(next: DocumentVisibilityState) {
      visibility = next;
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => visibility,
      });
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
    }

    function TimedHarness() {
      const { notify } = useNotifications();
      return (
        <button type="button" onClick={() => notify({ title: "Timed", duration: 1000 })}>
          push timed
        </button>
      );
    }

    function advance(ms: number) {
      act(() => {
        vi.advanceTimersByTime(ms);
      });
    }

    function renderTimed() {
      vi.useFakeTimers({
        toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"],
      });
      const motion = withMotion();
      render(
        <NotificationProvider>
          <TimedHarness />
        </NotificationProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "push timed" }));
      expect(screen.getByText("Timed")).toBeInTheDocument();
      return motion;
    }

    /** The countdown clock: the animation of the countdown line. */
    function countdown(motion: MotionHarness) {
      const line = document.querySelector<HTMLElement>(`.${styles.progressValue}`);
      if (!line) throw new Error("no countdown line");
      const clock = motion.on(line).at(-1);
      if (!clock) throw new Error("no countdown clock");
      return clock;
    }

    it("runs the countdown as a linear clock of the duration and expires when it runs out", () => {
      const motion = renderTimed();
      const clock = countdown(motion);
      expect(clock.options).toMatchObject({ duration: 1000, easing: "linear" });
      expect(clock.animation.playState).toBe("running");
      // No per-frame JS: time alone does not dismiss it, the clock running out does.
      advance(5000);
      expect(screen.getByText("Timed")).toBeInTheDocument();
      act(() => {
        clock.finish();
      });
      advance(exitTimeoutMs("fast"));
      expect(screen.queryByText("Timed")).not.toBeInTheDocument();
    });

    it("pauses the countdown while the stack is hovered", () => {
      const motion = renderTimed();
      const list = screen.getByRole("list", { name: "Уведомления сверху справа" });

      fireEvent.mouseEnter(list);
      expect(countdown(motion).animation.playState).toBe("paused");

      fireEvent.mouseLeave(list);
      advance(100); // collapse delay; the countdown resumes once the stack collapses
      expect(list).toHaveAttribute("data-expanded", "false");
      expect(countdown(motion).animation.playState).toBe("running");
    });

    it("pauses while the document is hidden and resumes where it stopped", () => {
      const motion = renderTimed();
      setVisibility("hidden");
      const clock = countdown(motion);
      expect(clock.animation.playState).toBe("paused");
      setVisibility("visible");
      expect(countdown(motion)).toBe(clock);
      expect(clock.animation.playState).toBe("running");
    });
  });

  describe("swipe", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    function SwipeHarness() {
      const { notify } = useNotifications();
      return (
        <button type="button" onClick={() => notify({ title: "Swipe me", persistent: true })}>
          push
        </button>
      );
    }

    /** The swipeable wrapper of the only card in the top-right stack. */
    function renderSwipeable(): HTMLElement {
      render(
        <NotificationProvider>
          <SwipeHarness />
        </NotificationProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "push" }));
      return screen.getByText("Swipe me").closest("li")?.firstElementChild as HTMLElement;
    }

    /** Drags along x from 0 to `distance` px in `ms` (performance.now is mocked). */
    function drag(el: HTMLElement, distance: number, ms: number) {
      const now = vi.spyOn(performance, "now").mockReturnValue(1000);
      fireEvent.pointerDown(el, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
      now.mockReturnValue(1000 + ms / 2);
      fireEvent.pointerMove(el, { pointerId: 1, clientX: distance / 2, clientY: 0 });
      now.mockReturnValue(1000 + ms);
      fireEvent.pointerMove(el, { pointerId: 1, clientX: distance, clientY: 0 });
      fireEvent.pointerUp(el, { pointerId: 1, clientX: distance, clientY: 0 });
    }

    it("dismisses a short fast flick by velocity", () => {
      const el = renderSwipeable();
      // 20 px is under the distance threshold, but 20 px / 100 ms = 0.2 px/ms > 0.11.
      drag(el, 20, 100);
      expect(screen.queryByText("Swipe me")).not.toBeInTheDocument();
    });

    it("dismisses a slow drag past the distance threshold", () => {
      const el = renderSwipeable();
      drag(el, 60, 2000);
      expect(screen.queryByText("Swipe me")).not.toBeInTheDocument();
    });

    it("returns after a short slow drag", () => {
      const el = renderSwipeable();
      drag(el, 20, 1000);
      expect(screen.getByText("Swipe me")).toBeInTheDocument();
      expect(el.style.transform).toBe("");
      expect(el).not.toHaveAttribute("data-swipe");
    });

    it("damps a drag against the dismiss direction and never dismisses by it", () => {
      const el = renderSwipeable();
      vi.spyOn(performance, "now").mockReturnValue(0);
      fireEvent.pointerDown(el, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
      fireEvent.pointerMove(el, { pointerId: 1, clientX: -100, clientY: 0 });
      const moved = Number.parseFloat(el.style.transform.replace("translateX(", ""));
      expect(moved).toBeLessThan(0);
      expect(moved).toBeGreaterThan(-30);
      fireEvent.pointerUp(el, { pointerId: 1, clientX: -100, clientY: 0 });
      expect(screen.getByText("Swipe me")).toBeInTheDocument();
    });

    it("ignores a second pointer while one is dragging", () => {
      const el = renderSwipeable();
      vi.spyOn(performance, "now").mockReturnValue(0);
      fireEvent.pointerDown(el, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
      fireEvent.pointerDown(el, { pointerId: 2, button: 0, clientX: 50, clientY: 0 });
      fireEvent.pointerMove(el, { pointerId: 2, clientX: 200, clientY: 0 });
      expect(el.style.transform).toBe("");
      fireEvent.pointerUp(el, { pointerId: 2, clientX: 200, clientY: 0 });
      expect(screen.getByText("Swipe me")).toBeInTheDocument();
    });
  });
});

describe("Notification over an open drawer", () => {
  it("a press on a toast is no outside press: the drawer stays open", async () => {
    render(
      <NotificationProvider>
        <Drawer.Root defaultOpen>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Сделка № 214</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <NotificationHarness />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NotificationProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "push persistent" }));
    const toast = await screen.findByRole("alert");
    await userEvent.click(within(toast).getByRole("button", { name: "Закрыть уведомление" }));
    expect(screen.getByRole("dialog", { name: "Сделка № 214" })).toBeInTheDocument();
  });
});

describe("NotificationCard", () => {
  it("renders a static card: close only with onDismiss, no countdown", () => {
    const onDismiss = vi.fn();
    const { rerender, container } = render(
      <NotificationCard tone="success" title="Ссылка скопирована" />,
    );
    const card = screen.getByRole("status");
    expect(card).toHaveAttribute("data-tone", "success");
    expect(card).toHaveAttribute("data-persistent", "true");
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector(`.${styles.progressTrack}`)).toBeNull();

    rerender(<NotificationCard tone="danger" title="Ошибка" badge={3} onDismiss={onDismiss} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    // The counter is a Badge of the card's tone.
    const badge = screen.getByText("3").closest("[data-tone]");
    expect(badge).not.toBe(screen.getByRole("alert"));
    expect(badge).toHaveAttribute("data-tone", "danger");
    fireEvent.click(screen.getByRole("button", { name: "Закрыть уведомление" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("Notification — onDismiss", () => {
  type Leave = (title: string, reason: NotificationDismissReason) => void;

  function Undo({ onDismiss, max }: { onDismiss: Leave; max?: number }) {
    return (
      <NotificationProvider max={max}>
        <Push onDismiss={onDismiss} />
      </NotificationProvider>
    );
  }

  function Push({ onDismiss }: { onDismiss: Leave }) {
    const { notify, dismissAll } = useNotifications();
    const count = React.useRef(0);
    return (
      <>
        <button
          type="button"
          onClick={() => {
            count.current += 1;
            const title = `Удалено ${count.current}`;
            notify({
              title,
              persistent: true,
              action: { label: "Отменить", onClick: () => undefined },
              onDismiss: (reason) => onDismiss(title, reason),
            });
          }}
        >
          push
        </button>
        <button type="button" onClick={dismissAll}>
          dismiss all
        </button>
      </>
    );
  }

  it("fires once when the toast is closed, with the reason", async () => {
    const onDismiss = vi.fn();
    render(<Undo onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    await screen.findByText("Удалено 1");
    fireEvent.click(screen.getByRole("button", { name: "dismiss all" }));
    fireEvent.click(screen.getByRole("button", { name: "dismiss all" }));
    await waitFor(() => expect(screen.queryByText("Удалено 1")).not.toBeInTheDocument());
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith("Удалено 1", "dismiss");
  });

  it("is announced once when two ways close it in the same event", () => {
    withMotion();
    const onDismiss = vi.fn();
    render(<Undo onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    const close = screen.getByRole("button", { name: "Закрыть уведомление" });
    // The close button and a `dismissAll()` before React renders the first exit.
    act(() => {
      close.click();
      screen.getByRole("button", { name: "dismiss all" }).click();
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith("Удалено 1", "close");
  });

  it("closes the toast after its action runs", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Undo onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "push" }));
    await user.click(screen.getByRole("button", { name: "Отменить" }));
    expect(screen.queryByText("Удалено 1")).not.toBeInTheDocument();
    expect(onDismiss).toHaveBeenCalledWith("Удалено 1", "action");
  });

  it("fires for a toast a newer one pushes out of a full stack", async () => {
    const onDismiss = vi.fn();
    render(<Undo onDismiss={onDismiss} max={1} />);
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    await screen.findByText("Удалено 1");
    fireEvent.click(screen.getByRole("button", { name: "push" }));
    await screen.findByText("Удалено 2");
    expect(onDismiss).toHaveBeenCalledWith("Удалено 1", "overflow");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("lets a pushed-out toast leave through its exit", () => {
    vi.useFakeTimers();
    withMotion();
    render(<Undo onDismiss={() => undefined} max={1} />);
    const push = screen.getByRole("button", { name: "push" });
    fireEvent.click(push);
    fireEvent.click(push);
    const oldest = screen.getByText("Удалено 1").closest("li");
    expect(oldest).toHaveAttribute("data-state", "closed");
    expect(screen.getByText("Удалено 2").closest("li")).toHaveAttribute("data-state", "open");
    act(() => {
      vi.advanceTimersByTime(exitTimeoutMs("fast"));
    });
    expect(screen.queryByText("Удалено 1")).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it("hands focus to the next open card when a focused one leaves", async () => {
    const user = userEvent.setup();
    render(<Undo onDismiss={() => undefined} />);
    const push = screen.getByRole("button", { name: "push" });
    await user.click(push);
    await user.click(push);
    const [newest] = screen.getAllByRole("button", { name: "Закрыть уведомление" });
    newest.focus();
    await user.keyboard("{Enter}");
    expect(screen.getAllByRole("button", { name: "Закрыть уведомление" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Отменить" })).toHaveFocus();
  });

  it("presses the action and the close button with Space", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Undo onDismiss={onDismiss} />);
    const push = screen.getByRole("button", { name: "push" });
    await user.click(push);
    await user.click(push);
    screen.getAllByRole("button", { name: "Отменить" })[0]?.focus();
    await user.keyboard("[Space]");
    expect(onDismiss).toHaveBeenLastCalledWith("Удалено 2", "action");
    screen.getByRole("button", { name: "Закрыть уведомление" }).focus();
    await user.keyboard("[Space]");
    expect(onDismiss).toHaveBeenLastCalledWith("Удалено 1", "close");
  });

  it("returns focus to where it came from when the last card leaves", async () => {
    const user = userEvent.setup();
    render(<Undo onDismiss={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "push" }));
    const all = screen.getByRole("button", { name: "dismiss all" });
    all.focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Отменить" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.queryByText("Удалено 1")).not.toBeInTheDocument();
    expect(all).toHaveFocus();
  });
});
