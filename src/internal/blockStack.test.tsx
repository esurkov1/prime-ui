import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { BlockStackContext } from "./blockStack";

function Probe() {
  return <span data-testid="probe">{String(React.useContext(BlockStackContext))}</span>;
}

describe("blockStack", () => {
  it("is off outside a host and on inside one that stacks its sections", () => {
    const { rerender } = render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("false");
    rerender(
      <BlockStackContext value>
        <Probe />
      </BlockStackContext>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("true");
  });
});
