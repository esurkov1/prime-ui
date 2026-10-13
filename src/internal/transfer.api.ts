import type { ApiLabel, ApiProp } from "../../scripts/docs/componentApi";

const STATE_TYPE = '"remote" | "queued" | "loading" | "failed" | "done"';

/** The `transfer` state row: `what` names the thing transferred and how its host takes the disk. */
export function transferStateProp(what: { en: string; ru: string }): ApiProp {
  return {
    name: "transfer",
    type: STATE_TYPE,
    en: `The transfer of ${what.en}, either way (\`TransferState\`): \`queued\` / \`loading\` — the cancel cross and the share ring; \`failed\` — retry; \`remote\` — download; \`done\` — the disk fades out.`,
    ru: `Передача ${what.ru} в любую сторону (\`TransferState\`): \`queued\` / \`loading\` — крестик отмены и кольцо доли; \`failed\` — повтор; \`remote\` — скачивание; \`done\` — диск растворяется.`,
  };
}

const PROGRESS_PROP: ApiProp = {
  name: "transferProgress",
  type: "number",
  en: "Share transferred, 0…1 (`UploadItem.progress`): the ring along the disk's inner edge, gliding (`base`) while it turns. Without it a transfer in flight turns a quarter arc.",
  ru: "Переданная доля, 0…1 (`UploadItem.progress`): кольцо по внутреннему краю диска, плавно (`base`) и вращаясь. Без неё идущая передача — вращающаяся четверть дуги.",
};

const DIRECTION_PROP: ApiProp = {
  name: "transferDirection",
  type: '"upload" | "download"',
  default: '"upload"',
  en: "Which way it goes: sending (`upload`) or receiving (`download`). Changes only the words — the names of the cross and the retry, the share and the failure — never the look.",
  ru: "Куда идёт передача: отправка (`upload`) или получение (`download`). Меняет только слова — имена крестика и повтора, долю и причину ошибки, — никогда не внешний вид.",
};

/** The handlers of one transfer; `index` — Message.Media calls them with the tile's index. */
function handlerProps(index: boolean): ApiProp[] {
  const type = index ? "(index: number) => void | Promise<void>" : "() => void | Promise<void>";
  return [
    {
      name: "onCancel",
      type,
      en: "Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`.",
      ru: "Отменить идущую передачу: крестик диска. Возвращённый промис держит диск в ожидании (спиннер, `aria-busy`, без повторного нажатия); отказ оставляет передачу как была и объявляет `cancelFailed`.",
    },
    {
      name: "onRetry",
      type,
      en: "Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection).",
      ru: "Повторить передачу после ошибки: повтор на красном диске; промис работает так же (`retryFailed` при отказе).",
    },
    {
      name: "onDownload",
      type,
      en: 'Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection).',
      ru: 'Скачать содержимое в состоянии `remote`: стрелка загрузки; с началом переведите `transfer` в `loading` с `transferDirection="download"`. Промис работает так же (`downloadFailed` при отказе).',
    },
  ];
}

/** The transfer props of a part that transfers its content (VoicePlayer, VideoNote, Message.File). */
export function transferProps(what: { en: string; ru: string }): ApiProp[] {
  return [transferStateProp(what), PROGRESS_PROP, DIRECTION_PROP, ...handlerProps(false)];
}

/** The per-tile handlers of Message.Media (its state, share and direction live on the items). */
export const TRANSFER_INDEX_HANDLER_PROPS: ApiProp[] = handlerProps(true);

/** The transfer strings of the transfer disk; `scope` names the parts that read them. */
export function transferLabels(scope: string, download = "Скачать"): ApiLabel[] {
  const row = (key: string, value: string, en: string, ru: string): ApiLabel => ({
    key,
    default: value,
    en: `${scope}: ${en}`,
    ru: `${scope}: ${ru}`,
  });
  return [
    row("cancelUpload", "Отменить отправку", "the cross while sending.", "крестик при отправке."),
    row(
      "cancelDownload",
      "Отменить загрузку",
      "the cross while receiving.",
      "крестик при получении.",
    ),
    row(
      "retryUpload",
      "Повторить отправку",
      "the retry after a failed send.",
      "повтор после неудачной отправки.",
    ),
    row(
      "retryDownload",
      "Повторить загрузку",
      "the retry after a failed receive.",
      "повтор после неудачного получения.",
    ),
    row(
      "uploadProgress",
      "Отправка {percent}%",
      "the share while sending — the description of the cross.",
      "доля при отправке — описание крестика.",
    ),
    row(
      "downloadProgress",
      "Загрузка {percent}%",
      "the share while receiving — the description of the cross.",
      "доля при получении — описание крестика.",
    ),
    row(
      "notSent",
      "Не отправилось",
      "why a send failed — the retry's description.",
      "почему не отправилось — описание повтора.",
    ),
    row(
      "notReceived",
      "Не загрузилось",
      "why a receive failed — the retry's description.",
      "почему не загрузилось — описание повтора.",
    ),
    row(
      "download",
      download,
      "the download arrow of a `remote` content.",
      "стрелка загрузки у `remote`.",
    ),
    row(
      "cancelFailed",
      "Не удалось отменить",
      "announced when `onCancel` rejected.",
      "объявление, когда `onCancel` отклонён.",
    ),
    row(
      "retryFailed",
      "Не удалось повторить",
      "announced when `onRetry` rejected.",
      "объявление, когда `onRetry` отклонён.",
    ),
    row(
      "downloadFailed",
      "Не удалось скачать",
      "announced when `onDownload` rejected.",
      "объявление, когда `onDownload` отклонён.",
    ),
  ];
}
