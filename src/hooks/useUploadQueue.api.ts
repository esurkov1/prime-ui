import type { ApiPart } from "../../scripts/docs/componentApi";

/** `useUploadQueue`: one description for the FileUpload page. */
export const USE_UPLOAD_QUEUE_PART: ApiPart = {
  name: "useUploadQueue",
  en: "`useUploadQueue<TResult>({ upload, concurrency })` → `{ items, add, retry, remove, clear, move }`. The upload queue of FileUpload: files wait their turn (`queued`), `concurrency` of them go at once through `upload`, each with its progress, its error and a retry. An item is `{ id, file, status, progress, error?, result?, preview? }`: `status` is `queued | loading | done | failed` (the transfer states of the kit, so an item maps onto a message part as `transfer={item.status}`), `progress` 0…1, `error` the reason (the rejection's message), `result` what `upload` resolved with, `preview` a local object URL of an image or video file (by MIME type, else by the name's extension). `add(files)` returns the new items; `remove(id)` aborts an upload in flight through its signal and revokes the preview; `clear()` takes every file out; `move(id, beforeId)` puts a file in front of another (`null` = last), the order FileUpload tiles and the Composer tray reorder. Previews are revoked when an item leaves and when the queue unmounts.",
  ru: "Очередь загрузки FileUpload: файлы ждут своей очереди (`queued`), по `concurrency` штук уходят через `upload`, у каждого прогресс, ошибка и повтор. Элемент — `{ id, file, status, progress, error?, result?, preview? }`: `status` — `queued | loading | done | failed` (состояния передачи кита: элемент ложится на часть сообщения как `transfer={item.status}`), `progress` 0…1, `error` — причина (сообщение отказа), `result` — ответ `upload`, `preview` — локальный object URL изображения или видео (по MIME-типу, иначе по расширению имени). `add(files)` возвращает новые элементы; `remove(id)` прерывает загрузку через сигнал и отзывает превью; `clear()` убирает все файлы; `move(id, beforeId)` ставит файл перед другим (`null` — в конец): этот порядок меняют плитки FileUpload и лоток Composer. Превью отзываются, когда элемент уходит и когда очередь размонтируется.",
  props: [
    {
      name: "upload",
      type: "(file: File, context: { signal: AbortSignal; onProgress: (progress: number) => void }) => Promise<TResult>",
      required: true,
      en: "Sends one file. Report the share sent with `onProgress` (0…1), stop on `signal`; resolve with the server's answer (kept as `result`), reject to fail the item with the rejection's message as the reason.",
      ru: "Отправляет один файл. Долю отправленного сообщайте через `onProgress` (0…1), по `signal` прерывайте; разрешите промис ответом сервера (станет `result`), отклоните — элемент станет ошибкой с сообщением отказа как причиной.",
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
