import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders navigation with pagination label", () => {
    render(<Pagination.Root page={1} totalPages={5} onPageChange={() => undefined} />);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("defaults size to m via data-size on nav", () => {
    render(<Pagination.Root page={1} totalPages={5} onPageChange={() => undefined} />);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveAttribute(
      "data-size",
      "m",
    );
  });

  it("sets data-size from size prop", () => {
    render(<Pagination.Root page={1} totalPages={5} onPageChange={() => undefined} size="xl" />);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveAttribute(
      "data-size",
      "xl",
    );
  });

  it("calls onPageChange with previous page when Previous is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination.Root page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with next page when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination.Root page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange when a page number is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination.Root page={1} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("shows ellipsis for long page ranges", () => {
    render(<Pagination.Root page={5} totalPages={20} onPageChange={() => undefined} />);

    const nav = screen.getByRole("navigation", { name: "Pagination" });
    const ellipses = within(nav).getAllByText("…");
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
    for (const el of ellipses) {
      expect(el).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("always shows first and last page for long ranges", () => {
    render(<Pagination.Root page={10} totalPages={25} onPageChange={() => undefined} />);

    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 25" })).toBeInTheDocument();
  });

  it("disables Previous on page 1", () => {
    render(<Pagination.Root page={1} totalPages={5} onPageChange={() => undefined} />);

    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(<Pagination.Root page={5} totalPages={5} onPageChange={() => undefined} />);

    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("sets aria-current=page on the active page button", () => {
    render(<Pagination.Root page={3} totalPages={7} onPageChange={() => undefined} />);

    const current = screen.getByRole("button", { name: "Page 3" });
    expect(current).toHaveAttribute("aria-current", "page");

    const other = screen.getByRole("button", { name: "Page 2" });
    expect(other).not.toHaveAttribute("aria-current");
  });

  it("renders nothing when totalPages is below 1", () => {
    const { container } = render(
      <Pagination.Root page={1} totalPages={0} onPageChange={() => undefined} />,
    );

    expect(container.firstChild).toBeNull();
  });
});
