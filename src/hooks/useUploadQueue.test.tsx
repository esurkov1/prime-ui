import { act, renderHook } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type UploadContext, useUploadQueue } from "./useUploadQueue";

/** A fake server: every call waits until the test settles it. */
function fakeUploads() {
  const calls: {
    file: File;
    context: UploadContext;
    resolve: (value: string) => void;
    reject: (error: unknown) => void;
  }[] = [];
  const upload = vi.fn(
    (file: File, context: UploadContext) =>
      new Promise<string>((resolve, reject) => {
        calls.push({ file, context, resolve, reject });
      }),
  );
  return { upload, calls };
}

const file = (name: string, type = "application/pdf") => new File(["x"], name, { type });

/** Lets the settled promises and the effects they cause run. */
const flush = () => act(async () => {});

describe("useUploadQueue", () => {
  let created: string[];
  let revoked: string[];

  beforeEach(() => {
    created = [];
    revoked = [];
    let n = 0;
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
      const url = `blob:preview-${++n}`;
      created.push(url);
      return url;
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
      revoked.push(url);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads up to `concurrency` files at once; the rest wait as queued", async () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload, concurrency: 2 }));
    act(() => {
      result.current.add([file("a.pdf"), file("b.pdf"), file("c.pdf")]);
    });
    expect(result.current.items.map((item) => item.status)).toEqual([
      "loading",
      "loading",
      "queued",
    ]);
    expect(server.upload).toHaveBeenCalledTimes(2);

    server.calls[0]?.resolve("url-a");
    await flush();
    expect(result.current.items.map((item) => item.status)).toEqual(["done", "loading", "loading"]);
    expect(result.current.items[0]).toMatchObject({ progress: 1, result: "url-a" });
    expect(server.upload).toHaveBeenCalledTimes(3);
  });

  it("defaults to three at a time", () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }));
    act(() => {
      result.current.add([file("1.pdf"), file("2.pdf"), file("3.pdf"), file("4.pdf")]);
    });
    expect(server.upload).toHaveBeenCalledTimes(3);
    expect(result.current.items[3]?.status).toBe("queued");
  });

  it("reports progress, clamped to 0…1", () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }));
    act(() => {
      result.current.add([file("a.pdf")]);
    });
    act(() => server.calls[0]?.context.onProgress(0.4));
    expect(result.current.items[0]?.progress).toBe(0.4);
    act(() => server.calls[0]?.context.onProgress(3));
    expect(result.current.items[0]?.progress).toBe(1);
  });

  it("marks a rejected upload failed with its reason and retries it", async () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }));
    act(() => {
      result.current.add([file("a.pdf")]);
    });
    act(() => server.calls[0]?.context.onProgress(0.5));
    server.calls[0]?.reject(new Error("Файл больше 20 МБ"));
    await flush();
    expect(result.current.items[0]).toMatchObject({
      status: "failed",
      error: "Файл больше 20 МБ",
      progress: 0.5,
    });

    act(() => result.current.retry(result.current.items[0]?.id ?? ""));
    expect(result.current.items[0]).toMatchObject({ status: "loading", progress: 0 });
    expect(result.current.items[0]?.error).toBeUndefined();
    expect(server.upload).toHaveBeenCalledTimes(2);
  });

  it("a synchronous throw is a failure too", async () => {
    const { result } = renderHook(() =>
      useUploadQueue({
        upload: () => {
          throw "Нет связи";
        },
      }),
    );
    act(() => {
      result.current.add([file("a.pdf")]);
    });
    await flush();
    expect(result.current.items[0]).toMatchObject({ status: "failed", error: "Нет связи" });
  });

  it("remove aborts the upload in flight and frees its slot", async () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload, concurrency: 1 }));
    act(() => {
      result.current.add([file("a.pdf"), file("b.pdf")]);
    });
    const first = server.calls[0];
    act(() => result.current.remove(result.current.items[0]?.id ?? ""));
    expect(first?.context.signal.aborted).toBe(true);
    expect(result.current.items.map((item) => item.file.name)).toEqual(["b.pdf"]);
    expect(result.current.items[0]?.status).toBe("loading");

    // A late answer of the aborted request changes nothing.
    first?.resolve("late");
    await flush();
    expect(result.current.items).toHaveLength(1);
  });

  it("gives image files a preview URL and revokes it on remove", () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }));
    let added: ReturnType<typeof result.current.add> = [];
    act(() => {
      added = result.current.add([file("photo.jpg", "image/jpeg"), file("scan.pdf")]);
    });
    expect(added[0]?.preview).toBe("blob:preview-1");
    expect(added[1]?.preview).toBeUndefined();
    act(() => result.current.remove(added[0]?.id ?? ""));
    expect(revoked).toEqual(["blob:preview-1"]);
  });

  it("gives video files a preview too, by type or by the name", () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }));
    let added: ReturnType<typeof result.current.add> = [];
    act(() => {
      added = result.current.add([file("clip.mp4", "video/mp4"), file("склад.mov", "")]);
    });
    expect(added.map((item) => item.preview)).toEqual(["blob:preview-1", "blob:preview-2"]);
  });

  it("move puts a file in front of another, or last", () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }));
    let added: ReturnType<typeof result.current.add> = [];
    act(() => {
      added = result.current.add([file("a.pdf"), file("b.pdf"), file("c.pdf")]);
    });
    const [a, b, c] = added.map((item) => item.id);
    const names = () => result.current.items.map((item) => item.file.name);
    act(() => result.current.move(c ?? "", a ?? ""));
    expect(names()).toEqual(["c.pdf", "a.pdf", "b.pdf"]);
    act(() => result.current.move(c ?? "", null));
    expect(names()).toEqual(["a.pdf", "b.pdf", "c.pdf"]);
    const before = result.current.items;
    act(() => result.current.move(b ?? "", c ?? ""));
    expect(result.current.items).toBe(before);
  });

  it("clear aborts everything and revokes every preview", () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }));
    act(() => {
      result.current.add([file("a.jpg", "image/jpeg"), file("b.png", "image/png")]);
    });
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
    expect(server.calls.every((call) => call.context.signal.aborted)).toBe(true);
    expect(revoked).toEqual(created);
  });

  it("unmount aborts the uploads and revokes the previews", () => {
    const server = fakeUploads();
    const { result, unmount } = renderHook(() => useUploadQueue({ upload: server.upload }));
    act(() => {
      result.current.add([file("a.jpg", "image/jpeg")]);
    });
    unmount();
    expect(server.calls[0]?.context.signal.aborted).toBe(true);
    expect(revoked).toEqual(["blob:preview-1"]);
  });

  it("in Strict Mode a file uploads once and keeps its preview", () => {
    const server = fakeUploads();
    const { result } = renderHook(() => useUploadQueue({ upload: server.upload }), {
      wrapper: React.StrictMode,
    });
    act(() => {
      result.current.add([file("a.jpg", "image/jpeg")]);
    });
    const item = result.current.items[0];
    expect(item?.status).toBe("loading");
    expect(item?.preview).toMatch(/^blob:/);
    expect(server.calls.filter((call) => !call.context.signal.aborted)).toHaveLength(1);
  });
});
