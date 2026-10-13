import type { ApiPart } from "../../scripts/docs/componentApi";

/** `useUploadQueue`: one description for the FileUpload page. */
export const USE_UPLOAD_QUEUE_PART: ApiPart = {
  name: "useUploadQueue",
  en: "`useUploadQueue<TResult>({ upload, concurrency })` → `{ items, add, retry, remove, clear, move }`. The upload queue of FileUpload: `concurrency` files go at once through `upload`, the rest wait as `queued`; each has its progress, error and retry.",
  ru: "`useUploadQueue<TResult>({ upload, concurrency })` → `{ items, add, retry, remove, clear, move }`. Очередь загрузки FileUpload: по `concurrency` файлов уходят через `upload`, остальные ждут как `queued`; у каждого прогресс, ошибка и повтор.",
  props: [
    {
      name: "upload",
      type: "(file: File, context: { signal: AbortSignal; onProgress: (progress: number) => void }) => Promise<TResult>",
      required: true,
      en: "Sends one file. Report the share sent with `onProgress` (0…1), stop on `signal`; resolve with the server's answer (kept as `result`), reject to fail the item with the rejection's message as the reason.",
      ru: "Отправляет один файл. Долю сообщайте через `onProgress` (0…1), по `signal` прерывайте; разрешите промис ответом сервера (станет `result`), отклоните — элемент станет ошибкой с сообщением отказа.",
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
