import { act, render, screen } from "@testing-library/react";

import { useTokenValue } from "./useTokenValue";

function Probe() {
  return <span data-testid="value">{useTokenValue("--prime-test-length", 7)}</span>;
}

afterEach(() => {
  document.documentElement.style.removeProperty("--prime-test-length");
  document.documentElement.removeAttribute("data-theme");
});

describe("useTokenValue", () => {
  it("returns the fallback when the token is not set", () => {
    render(<Probe />);
    expect(screen.getByTestId("value")).toHaveTextContent("7");
  });

  it("reads a px token and converts rem to px", () => {
    document.documentElement.style.setProperty("--prime-test-length", "1.5rem");
    render(<Probe />);
    expect(screen.getByTestId("value")).toHaveTextContent("24");
  });

  it("follows a change on the document (a theme switch)", async () => {
    document.documentElement.style.setProperty("--prime-test-length", "12px");
    render(<Probe />);
    expect(screen.getByTestId("value")).toHaveTextContent("12");
    await act(async () => {
      document.documentElement.style.setProperty("--prime-test-length", "20px");
      document.documentElement.setAttribute("data-theme", "dark");
      await Promise.resolve();
    });
    expect(screen.getByTestId("value")).toHaveTextContent("20");
  });
});
