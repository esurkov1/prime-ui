import { act, fireEvent, render } from "@testing-library/react";
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

  describe("decode", () => {
    function Decoded({ report }: { report: (status: ImageStatus) => void }) {
      const image = useImageStatus(report, { decode: true });
      return (
        <img
          ref={image.ref}
          src="a.png"
          alt=""
          data-status={image.status}
          onLoad={image.onLoad}
          onError={image.onError}
        />
      );
    }

    /** jsdom has no `decode()`: one is installed for the test. */
    const installDecode = (impl: () => Promise<void>) => {
      const decode = vi.fn(impl);
      Object.defineProperty(HTMLImageElement.prototype, "decode", {
        configurable: true,
        value: decode,
      });
      return decode;
    };

    afterEach(() => {
      Reflect.deleteProperty(HTMLImageElement.prototype, "decode");
    });

    it("counts the picture as loaded only once it is decoded", async () => {
      let decoded: () => void = () => {};
      const decode = installDecode(() => new Promise<void>((resolve) => (decoded = resolve)));
      const report = vi.fn();
      const { getByRole } = render(<Decoded report={report} />);
      const img = getByRole("presentation", { hidden: true });
      fireEvent.load(img);
      expect(decode).toHaveBeenCalledTimes(1);
      expect(img.dataset.status).toBe("loading");
      await act(async () => decoded());
      expect(img.dataset.status).toBe("loaded");
      expect(report).toHaveBeenLastCalledWith("loaded");
    });

    it("a picture already in the cache is ready before its load event, once", async () => {
      const decode = installDecode(() => Promise.resolve());
      vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
      vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(800);
      const report = vi.fn();
      const { getByRole } = render(<Decoded report={report} />);
      const img = getByRole("presentation", { hidden: true });
      await act(async () => {});
      expect(img.dataset.status).toBe("loaded");
      fireEvent.load(img);
      await act(async () => {});
      expect(decode).toHaveBeenCalledTimes(2);
      expect(report.mock.calls.filter(([status]) => status === "loaded")).toHaveLength(1);
    });

    it("an error still reports at once", () => {
      const report = vi.fn();
      const { getByRole } = render(<Decoded report={report} />);
      fireEvent.error(getByRole("presentation", { hidden: true }));
      expect(report).toHaveBeenLastCalledWith("error");
    });
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
