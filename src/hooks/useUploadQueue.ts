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
  /** The item's id: the same id `add` returned and the files of the set carry. */
  id: string;
  /** Aborted when the item is removed (or the queue unmounts): stop the request. */
  signal: AbortSignal;
  /** Reports the share sent, 0…1. */
  onProgress: (progress: number) => void;
};

export type UploadQueueOptions<TResult> = {
  /**
   * Sends one file. Resolve with what the server answered (kept as `result`); reject to mark the
   * item failed — the rejection's message is shown as the reason. Work that must follow the upload
   * (attach the file to a record, save the set) runs here after the request resolves:
   * `context.id` is the item, and the item is `failed` if that work rejects.
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

/** The item as the queue hands it out: with its preview URL, while it has one. */
function withPreview<TResult>(
  item: UploadItem<TResult>,
  previews: ReadonlyMap<string, string>,
): UploadItem<TResult> {
  const preview = previews.get(item.id);
  return preview === undefined ? item : { ...item, preview };
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
  /** The queue without previews: a preview is a resource of the mounted queue, not of the data. */
  const [entries, setItems] = React.useState<readonly UploadItem<TResult>[]>([]);
  const optionsRef = React.useRef(options);
  React.useLayoutEffect(() => {
    optionsRef.current = options;
  });
  /** The uploads in flight, by item id: the one truth about what is running. */
  const running = React.useRef(new Map<string, AbortController>());
  /** The preview URL of each image or video item, by id: created once, revoked when it leaves. */
  const previews = React.useRef(new Map<string, string>());
  /** What the items show of the previews: a copy of the map, renewed when it changes. */
  const [shown, setShown] = React.useState<ReadonlyMap<string, string>>(() => new Map());
  const prefix = React.useId();

  // Previews follow the items: an item that left has its URL revoked; an item without one (the
  // queue mounted again after an unmount revoked them) gets a new one.
  React.useLayoutEffect(() => {
    const map = previews.current;
    const ids = new Set(entries.map((item) => item.id));
    let changed = false;
    for (const [id, url] of map) {
      if (ids.has(id)) continue;
      revokePreview(url);
      map.delete(id);
      changed = true;
    }
    for (const item of entries) {
      if (map.has(item.id)) continue;
      const url = createPreview(item.file);
      if (url === undefined) continue;
      map.set(item.id, url);
      changed = true;
    }
    if (changed) setShown(new Map(map));
  }, [entries]);

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
        resolve(optionsRef.current.upload(item.file, { id: item.id, signal, onProgress })),
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
    const waiting = entries.filter(
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

  // Unmount aborts and revokes. On a remount the previews come back from the sync above and the
  // cut uploads start again from the effect before this one.
  React.useEffect(() => {
    const uploads = running.current;
    const urls = previews.current;
    return () => {
      for (const controller of uploads.values()) controller.abort();
      uploads.clear();
      for (const url of urls.values()) revokePreview(url);
      urls.clear();
    };
  }, []);

  const add = React.useCallback(
    (files: readonly File[]) => {
      const added = files.map((file): UploadItem<TResult> => {
        const id = `${prefix}upload-${++sequence}`;
        const preview = createPreview(file);
        if (preview !== undefined) previews.current.set(id, preview);
        return { id, file, status: "queued", progress: 0 };
      });
      if (added.length > 0) {
        setItems((current) => [...current, ...added]);
        setShown(new Map(previews.current));
      }
      return added.map((item) => withPreview(item, previews.current));
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

  // The previews of removed items are revoked by the sync of the previews.
  const remove = React.useCallback((id: string) => {
    running.current.get(id)?.abort();
    running.current.delete(id);
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clear = React.useCallback(() => {
    for (const controller of running.current.values()) controller.abort();
    running.current.clear();
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

  const items = React.useMemo(
    () => entries.map((item) => withPreview(item, shown)),
    [entries, shown],
  );

  return React.useMemo(
    () => ({ items, add, retry, remove, clear, move }),
    [items, add, retry, remove, clear, move],
  );
}
