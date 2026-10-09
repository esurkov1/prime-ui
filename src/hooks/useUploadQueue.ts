import * as React from "react";

import { mediaKind } from "@/internal/mediaKind";
import type { TransferState } from "@/internal/transfer";

/** One file of an upload queue. */
export type UploadItem<TResult = unknown> = {
  /** Unique within the queue; stable for the life of the item. */
  id: string;
  file: File;
  /**
   * Where the file is on its way — waiting for a slot, sending, sent, or failed: the transfer
   * states of the kit (`TransferState` without `remote`), so an item maps onto a message part as
   * is (`transfer={item.status}`, `transferProgress={item.progress}`).
   */
  status: Exclude<TransferState, "remote">;
  /** Share sent, 0…1; `1` once done. Kept as it was when an upload fails. */
  progress: number;
  /** Why the upload failed: the rejection's `Error.message`, or the rejected string. Empty when unknown. */
  error?: string;
  /** What `upload` resolved with, once done. */
  result?: TResult;
  /**
   * A local object URL of an image or video file (by MIME type, else by the name's extension),
   * drawn while it uploads; revoked when the item leaves.
   */
  preview?: string;
};

export type UploadContext = {
  /** Aborted when the item is removed (or the queue unmounts): stop the request. */
  signal: AbortSignal;
  /** Reports the share sent, 0…1. */
  onProgress: (progress: number) => void;
};

export type UploadQueueOptions<TResult> = {
  /**
   * Sends one file. Resolve with what the server answered (kept as `result`); reject to mark the
   * item failed — the rejection's message is shown as the reason.
   */
  upload: (file: File, context: UploadContext) => Promise<TResult>;
  /** How many files upload at once; the rest wait as `queued`. Default 3. */
  concurrency?: number;
};

export type UploadQueue<TResult = unknown> = {
  /** Every file in the order it was added. */
  items: readonly UploadItem<TResult>[];
  /** Queues files and returns their new items (ids to place them in your own list). */
  add: (files: readonly File[]) => UploadItem<TResult>[];
  /** Queues a failed file again. */
  retry: (id: string) => void;
  /** Takes a file out: aborts its upload if it is in flight and revokes its preview. */
  remove: (id: string) => void;
  /** Takes every file out, aborting what is in flight. */
  clear: () => void;
  /** Puts a file in front of `beforeId` (`null` = last): the order of the set (an album, tiles). */
  move: (id: string, beforeId: string | null) => void;
};

const DEFAULT_CONCURRENCY = 3;

let sequence = 0;

function reasonOf(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === "string" ? error : "";
}

function createPreview(file: File): string | undefined {
  if (mediaKind(file) === null || typeof URL.createObjectURL !== "function") return undefined;
  return URL.createObjectURL(file);
}

function revokePreview(url: string | undefined) {
  if (url && typeof URL.revokeObjectURL === "function") URL.revokeObjectURL(url);
}

/**
 * An upload queue for FileUpload: files wait their turn, `concurrency` of them go
 * at once through your `upload`, each with its progress, its error and a retry. Removing a file
 * aborts its request through the signal; image and video files carry a local preview URL, revoked when the
 * item leaves or the queue unmounts.
 */
export function useUploadQueue<TResult = unknown>(
  options: UploadQueueOptions<TResult>,
): UploadQueue<TResult> {
  const [items, setItems] = React.useState<readonly UploadItem<TResult>[]>([]);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const optionsRef = React.useRef(options);
  optionsRef.current = options;
  /** The uploads in flight, by item id: the one truth about what is running. */
  const running = React.useRef(new Map<string, AbortController>());
  const prefix = React.useId();

  const update = React.useCallback((id: string, patch: Partial<UploadItem<TResult>>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const start = React.useCallback(
    (item: UploadItem<TResult>) => {
      const controller = new AbortController();
      running.current.set(item.id, controller);
      update(item.id, { status: "loading", progress: 0, error: undefined });
      const { signal } = controller;
      const settled = () => {
        if (running.current.get(item.id) === controller) running.current.delete(item.id);
      };
      const onProgress = (progress: number) => {
        if (signal.aborted) return;
        update(item.id, { progress: Math.min(1, Math.max(0, progress)) });
      };
      // A synchronous throw in `upload` is a failure like a rejection.
      new Promise<TResult>((resolve) =>
        resolve(optionsRef.current.upload(item.file, { signal, onProgress })),
      ).then(
        (result) => {
          if (signal.aborted) return;
          settled();
          update(item.id, { status: "done", progress: 1, result });
        },
        (error: unknown) => {
          if (signal.aborted) return;
          settled();
          update(item.id, { status: "failed", error: reasonOf(error) });
        },
      );
    },
    [update],
  );

  // Fills the free slots: a waiting file, or one whose upload was cut by a remount, starts.
  React.useEffect(() => {
    const limit = Math.max(1, optionsRef.current.concurrency ?? DEFAULT_CONCURRENCY);
    let free = limit - running.current.size;
    if (free <= 0) return;
    const waiting = items.filter(
      (item) =>
        (item.status === "queued" || item.status === "loading") && !running.current.has(item.id),
    );
    // A cut upload goes first: it held a slot before.
    waiting.sort((a, b) => Number(b.status === "loading") - Number(a.status === "loading"));
    for (const item of waiting) {
      if (free <= 0) break;
      start(item);
      free -= 1;
    }
  });

  // Unmount aborts and revokes. A remount (Strict Mode replays one) draws new previews; the cut
  // uploads start again from the effect above.
  React.useEffect(() => {
    const current = itemsRef.current;
    if (current.some((item) => item.preview === "")) {
      setItems((list) =>
        list.map((item) =>
          item.preview === "" ? { ...item, preview: createPreview(item.file) } : item,
        ),
      );
    }
    const map = running.current;
    return () => {
      for (const controller of map.values()) controller.abort();
      map.clear();
      for (const item of itemsRef.current) revokePreview(item.preview);
      // Marked for a remount; an unmounted queue is never read again.
      itemsRef.current = itemsRef.current.map((item) =>
        item.preview ? { ...item, preview: "" } : item,
      );
      setItems(itemsRef.current);
    };
  }, []);

  const add = React.useCallback(
    (files: readonly File[]) => {
      const added = files.map(
        (file): UploadItem<TResult> => ({
          id: `${prefix}upload-${++sequence}`,
          file,
          status: "queued",
          progress: 0,
          preview: createPreview(file),
        }),
      );
      if (added.length > 0) setItems((current) => [...current, ...added]);
      return added;
    },
    [prefix],
  );

  const retry = React.useCallback((id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id && item.status === "failed"
          ? { ...item, status: "queued", progress: 0, error: undefined }
          : item,
      ),
    );
  }, []);

  const remove = React.useCallback((id: string) => {
    running.current.get(id)?.abort();
    running.current.delete(id);
    const item = itemsRef.current.find((entry) => entry.id === id);
    revokePreview(item?.preview);
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clear = React.useCallback(() => {
    for (const controller of running.current.values()) controller.abort();
    running.current.clear();
    for (const item of itemsRef.current) revokePreview(item.preview);
    setItems([]);
  }, []);

  const move = React.useCallback((id: string, beforeId: string | null) => {
    setItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (!item || id === beforeId) return current;
      const rest = current.filter((entry) => entry !== item);
      const at = beforeId === null ? -1 : rest.findIndex((entry) => entry.id === beforeId);
      const next = at === -1 ? [...rest, item] : [...rest.slice(0, at), item, ...rest.slice(at)];
      return next.every((entry, index) => entry === current[index]) ? current : next;
    });
  }, []);

  return React.useMemo(
    () => ({ items, add, retry, remove, clear, move }),
    [items, add, retry, remove, clear, move],
  );
}
