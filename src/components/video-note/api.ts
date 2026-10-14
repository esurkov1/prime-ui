import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { mediaPlayerLabels, mediaPlayerProps } from "../../internal/mediaPlayer.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "VideoNote",
      en: '`ref` → `HTMLDivElement` (the `role="group"` root). A round video message: a still first frame that plays with sound on a press. Inside `Message.Root` it is the message itself, without a bubble. Its props are VoicePlayer\'s (`MediaPlayerProps`) plus `poster`.',
      ru: 'Корень `role="group"`. Круглое видеосообщение: неподвижный первый кадр, который по нажатию играет со звуком. Внутри `Message.Root` это само сообщение, без пузыря. Пропсы — те же, что у VoicePlayer (`MediaPlayerProps`), плюс `poster`.',
      props: [
        ...mediaPlayerProps({
          media: { en: "Video", ru: "видео" },
          dot: { en: "after the duration", ru: "после длительности" },
          off: {
            en: "the play disk and the keyboard seek",
            ru: "диск воспроизведения и перемотка с клавиатуры",
          },
          change: {
            en: "a seek from the keyboard does not count",
            ru: "перемотка с клавиатуры не считается",
          },
          ended: {
            en: "the note is back at its still first frame",
            ru: "кружок вернулся к неподвижному первому кадру",
          },
          transcript: {
            en: "the button stands at the circle's top-end corner, the text opens under the circle",
            ru: "кнопка стоит в верхнем конечном углу кружка, текст раскрывается под ним",
          },
          transfer: {
            en: "the note, drawn on the play disk itself",
            ru: "кружка, на самом диске воспроизведения",
          },
          own: [
            {
              name: "poster",
              type: "string",
              en: "A still shown before the first frame; without it the first frame is drawn. Video only.",
              ru: "Кадр-обложка до первого кадра; без неё рисуется первый кадр. Только у видео.",
            },
          ],
        }),
        {
          name: "labels",
          type: "Partial<VideoNoteLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children" | "onPlay" | "onPause" | "onEnded" | "onRateChange">',
          en: "`className`, `aria-label` (replaces `labels.player`), `data-*` and the other div attributes.",
          ru: "`className`, `aria-label` (вместо `labels.player`), `data-*` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: mediaPlayerLabels({
    player: "Видеосообщение",
    play: "Воспроизвести видеосообщение",
    unplayed: "Не просмотрено",
    transfer: "The transfer of the note",
    own: [
      {
        key: "duration",
        default: "Длительность {duration}",
        en: "The play disk's description before playback (during it, `position`).",
        ru: "Описание диска воспроизведения до начала (во время — `position`).",
      },
    ],
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus: the play disk (or the transfer disk), the transcript button.",
        ru: "Переводит фокус: диск воспроизведения (или диск передачи), кнопка расшифровки.",
      },
      {
        keys: "Enter · Space",
        en: "On the disk: play with sound or pause; on the transcript button: open or close the text; on the transfer disk: cancel, retry or download.",
        ru: "На диске — воспроизведение со звуком или пауза; на кнопке расшифровки — открыть или свернуть текст; на диске передачи — отменить, повторить или скачать.",
      },
      {
        keys: "ArrowRight · ArrowUp",
        en: "On the disk: 5 seconds forward (`ArrowRight` mirrored in RTL).",
        ru: "На диске — вперёд на 5 секунд.",
      },
      {
        keys: "ArrowLeft · ArrowDown",
        en: "On the disk: 5 seconds back (`ArrowLeft` mirrored in RTL).",
        ru: "На диске — назад на 5 секунд.",
      },
      {
        keys: "PageUp · PageDown",
        en: "On the disk: 10 % of the note forward or back.",
        ru: "На диске — на 10 % записи вперёд или назад.",
      },
      {
        keys: "Home · End",
        en: "On the disk: to the start or the end.",
        ru: "На диске — в начало или в конец.",
      },
    ],
    aria: [
      {
        en: 'The root is `role="group"` named by `labels.player` (or your `aria-label`).',
        ru: 'Корень — `role="group"` с названием `labels.player` (или вашим `aria-label`).',
      },
      {
        en: "The play disk is a button named `labels.play` / `labels.pause`, described by the duration (`labels.duration`) or the position (`labels.position`) and `labels.unplayed`; the pills are `aria-hidden`, and the press area over the whole circle is a pointer aid only (`aria-hidden`).",
        ru: "Диск воспроизведения — кнопка `labels.play` / `labels.pause`, её описание — длительность (`labels.duration`) или позиция (`labels.position`) и `labels.unplayed`; плашки скрыты от чтения. Нажатие в любом месте кружка — только помощь указателю.",
      },
      {
        en: 'While the note is on its way, failed or not fetched, the play button itself is the transfer, named by the direction (`cancelUpload` / `cancelDownload` described by `uploadProgress` / `downloadProgress`, `retryUpload` / `retryDownload` described by `notSent` / `notReceived`, `download`); its ring is `aria-hidden`; a refused action is announced (`role="status"`).',
        ru: 'Пока кружок в пути, не удался или не скачан, диск `inert`, а на его месте диск передачи: кнопка с именем по направлению (`cancelUpload` / `cancelDownload`, `retryUpload` / `retryDownload` с описанием `notSent` / `notReceived`, `download`) и кольцо `role="progressbar"`; отказ объявляется (`role="status"`).',
      },
      {
        en: "The transcript button is named `labels.transcribe` / `labels.hideTranscript`, with `aria-expanded` and `aria-controls`; a failed request is announced with `labels.transcribeFailed`.",
        ru: "Кнопка расшифровки называется `labels.transcribe` или `labels.hideTranscript`, несёт `aria-expanded` и `aria-controls`; ошибка запроса объявляется `labels.transcribeFailed`.",
      },
      {
        en: "`disabled` (own or a `Fieldset`'s) disables the disk, the transcript button and the transfer actions natively.",
        ru: "`disabled` (или выключенный `Fieldset`) выключает диск, кнопку расшифровки и действия передачи нативным `disabled`.",
      },
    ],
  },
};
