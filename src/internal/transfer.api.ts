import type { ApiLabel, ApiProp } from "../../scripts/docs/componentApi";

const STATE_TYPE = '"remote" | "queued" | "loading" | "failed" | "done"';

/** The `transfer` state row: `what` names the thing transferred and how its host takes the disk. */
export function transferStateProp(what: { en: string; ru: string }): ApiProp {
  return {
    name: "transfer",
    type: STATE_TYPE,
    en: `The transfer of ${what.en}, either way (\`TransferState\`, the values of \`UploadItem.status\` plus \`remote\`): \`queued\` / \`loading\` — the cross with the ring of \`transferProgress\` (\`role="progressbar"\`); \`failed\` — the danger disk with the retry arrow; \`remote\` — not fetched yet, the download arrow; \`done\` — the disk fades and shrinks away (\`fast\`).`,
    ru: `Передача ${what.ru} в любую сторону (\`TransferState\`, значения \`UploadItem.status\` и \`remote\`): \`queued\` / \`loading\` — крестик с кольцом \`transferProgress\` (\`role="progressbar"\`); \`failed\` — красный диск со стрелкой повтора; \`remote\` — ещё не скачано, стрелка загрузки; \`done\` — диск растворяется и уменьшается (\`fast\`).`,
  };
}

const PROGRESS_PROP: ApiProp = {
  name: "transferProgress",
  type: "number",
  en: "Share transferred, 0…1 (`UploadItem.progress`): the ring along the disk's inner edge, gliding (`base`). Without it a transfer in flight turns an indeterminate arc.",
  ru: "Переданная доля, 0…1 (`UploadItem.progress`): кольцо по внутреннему краю диска, плавно (`base`). Без неё идущая передача — неопределённая дуга, которая крутится.",
};

const DIRECTION_PROP: ApiProp = {
  name: "transferDirection",
  type: '"upload" | "download"',
  default: '"upload"',
  en: "Which way it goes: sending (`upload`) or receiving (`download`). Changes only the words — the names of the cross, the retry, the ring and the failure — never the look.",
  ru: "Куда идёт передача: отправка (`upload`) или получение (`download`). Меняет только слова — имена крестика, повтора, кольца и причины ошибки, — никогда не внешний вид.",
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
      "the name of the ring while sending.",
      "имя кольца при отправке.",
    ),
    row(
      "downloadProgress",
      "Загрузка {percent}%",
      "the name of the ring while receiving.",
      "имя кольца при получении.",
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
