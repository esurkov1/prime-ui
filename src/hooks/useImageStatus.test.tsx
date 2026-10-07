import { fireEvent, render } from "@testing-library/react";
import * as React from "react";

import { type ImageStatus, useImageStatus } from "./useImageStatus";

function Image({ src, report }: { src: string; report: (status: ImageStatus) => void }) {
  const { status, onLoad, onError } = useImageStatus(report);
  return <img src={src} alt="" data-status={status} onLoad={onLoad} onError={onError} />;
}

function Host({ src, show = true }: { src: string; show?: boolean }) {
  const [rootStatus, setRootStatus] = React.useState<ImageStatus>("idle");
  return (
    <div data-testid="root" data-root-status={rootStatus}>
      {show ? <Image key={src} src={src} report={setRootStatus} /> : null}
    </div>
  );
}

describe("useImageStatus", () => {
  it("reports loading, then loaded or error", () => {
    const { getByRole, getByTestId } = render(<Host src="a.png" />);
    const img = getByRole("presentation", { hidden: true });
    expect(getByTestId("root").dataset.rootStatus).toBe("loading");
    expect(img.dataset.status).toBe("loading");

    fireEvent.load(img);
    expect(getByTestId("root").dataset.rootStatus).toBe("loaded");
    expect(img.dataset.status).toBe("loaded");

    fireEvent.error(img);
    expect(getByTestId("root").dataset.rootStatus).toBe("error");
  });

  it("restarts at loading for a new src and reports idle when the image unmounts", () => {
    const { getByRole, getByTestId, rerender } = render(<Host src="a.png" />);
    fireEvent.load(getByRole("presentation", { hidden: true }));
    rerender(<Host src="b.png" />);
    expect(getByTestId("root").dataset.rootStatus).toBe("loading");
    rerender(<Host src="b.png" show={false} />);
    expect(getByTestId("root").dataset.rootStatus).toBe("idle");
  });

  it("calls the consumer handlers", () => {
    const onLoad = vi.fn();
    function WithHandler() {
      const handlers = useImageStatus(() => {}, { onLoad });
      return <img src="a.png" alt="" onLoad={handlers.onLoad} />;
    }
    const { getByRole } = render(<WithHandler />);
    fireEvent.load(getByRole("presentation", { hidden: true }));
    expect(onLoad).toHaveBeenCalledTimes(1);
  });
});
