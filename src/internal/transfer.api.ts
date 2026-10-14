import type { ApiProp, ApiText, LabelDocs } from "../../scripts/docs/componentApi";
import type { TransferLabels } from "./transfer";

const STATE_TYPE = '"remote" | "queued" | "loading" | "failed" | "done"';

/** The `transfer` state row: `what` names the thing transferred and how its host takes the disk. */
function transferStateProp(what: { en: string; ru: string }): ApiProp {
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

/**
 * The descriptions of the transfer strings of the transfer disk (`TransferLabels`); `scope` names
 * the parts that read them, `part` the part whose `labels` prop takes them (the root without it).
 */
export function transferLabelDocs(
  scope: string | ApiText,
  part?: string,
): LabelDocs<TransferLabels> {
  const name = typeof scope === "string" ? { en: scope, ru: scope } : scope;
  const row = (en: string, ru: string) => ({
    en: `${name.en}: ${en}`,
    ru: `${name.ru}: ${ru}`,
    ...(part ? { part } : {}),
  });
  return {
    cancelUpload: row("the cross while sending.", "крестик при отправке."),
    cancelDownload: row("the cross while receiving.", "крестик при получении."),
    retryUpload: row("the retry after a failed send.", "повтор после неудачной отправки."),
    retryDownload: row("the retry after a failed receive.", "повтор после неудачного получения."),
    uploadProgress: row(
      "the share while sending — the description of the cross.",
      "доля при отправке — описание крестика.",
    ),
    downloadProgress: row(
      "the share while receiving — the description of the cross.",
      "доля при получении — описание крестика.",
    ),
    notSent: row(
      "why a send failed — the retry's description.",
      "почему не отправилось — описание повтора.",
    ),
    notReceived: row(
      "why a receive failed — the retry's description.",
      "почему не загрузилось — описание повтора.",
    ),
    download: row("the download arrow of a `remote` content.", "стрелка загрузки у `remote`."),
    cancelFailed: row(
      "announced when `onCancel` rejected.",
      "объявление, когда `onCancel` отклонён.",
    ),
    retryFailed: row("announced when `onRetry` rejected.", "объявление, когда `onRetry` отклонён."),
    downloadFailed: row(
      "announced when `onDownload` rejected.",
      "объявление, когда `onDownload` отклонён.",
    ),
  };
}
