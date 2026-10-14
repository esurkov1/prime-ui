import type { ApiPart } from "../../scripts/docs/componentApi";

/** `useUploadQueue`: one description for the FileUpload page. */
export const USE_UPLOAD_QUEUE_PART: ApiPart = {
  name: "useUploadQueue",
  en: "`useUploadQueue<TResult>({ upload, concurrency })` → `{ items, add, retry, remove, clear, move }`. The upload queue of FileUpload: `concurrency` files go at once through `upload`, the rest wait as `queued`; each has its progress, error and retry.",
  ru: "`useUploadQueue<TResult>({ upload, concurrency })` → `{ items, add, retry, remove, clear, move }`. Очередь загрузки FileUpload: по `concurrency` файлов уходят через `upload`, остальные ждут как `queued`; у каждого прогресс, ошибка и повтор.",
  props: [
    {
      name: "upload",
      type: "(file: File, context: { id: string; signal: AbortSignal; onProgress: (progress: number) => void }) => Promise<TResult>",
      required: true,
      en: "Sends one file: progress through `onProgress` (0…1), stop on `signal`, resolve with the answer (`result`), reject to fail. `id` is the item: after-upload work runs here once the request resolves.",
      ru: "Отправляет файл: прогресс через `onProgress` (0…1), прерывание по `signal`, ответ — `result`, отказ — ошибка. `id` — элемент: работа после загрузки идёт здесь, когда запрос ответил.",
    },
    {
      name: "concurrency",
      type: "number",
      default: "3",
      en: "How many files upload at once; the rest wait as `queued`.",
      ru: "Сколько файлов грузится одновременно; остальные ждут как `queued`.",
    },
  ],
};
