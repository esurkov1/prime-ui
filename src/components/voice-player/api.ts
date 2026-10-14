import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { mediaPlayerLabelDocs, mediaPlayerProps } from "../../internal/mediaPlayer.api";
import { VOICE_PLAYER_LABELS } from "./VoicePlayer";

export const api: ComponentApi = {
  parts: [
    {
      name: "VoicePlayer",
      en: '`ref` → `HTMLDivElement` (the `role="group"` root). A voice message: the play disk, the waveform as the seek slider and the time row with the playback speed. Its props are VideoNote\'s (`MediaPlayerProps`) plus `waveform` and the rate triad.',
      ru: "Голосовое сообщение: диск воспроизведения, волна как ползунок перемотки и строка времени со скоростью. Пропсы — те же, что у VideoNote (`MediaPlayerProps`), плюс `waveform` и тройка скорости.",
      props: [
        ...mediaPlayerProps({
          media: { en: "Audio", ru: "аудио" },
          dot: { en: "after the time", ru: "после времени" },
          off: {
            en: "the play disk, the waveform slider and the rate chip",
            ru: "диск воспроизведения, ползунок-волна и чип скорости",
          },
          change: {
            en: "a drag on the waveform that pauses for the seek does not count",
            ru: "перетаскивание по волне, которое ставит паузу на время перемотки, не считается",
          },
          ended: {
            en: "the player is back at the start, paused",
            ru: "плеер вернулся в начало на паузе",
          },
          transcript: {
            en: "the button ends the waveform, the text opens under the player",
            ru: "кнопка стоит в конце волны, текст раскрывается под плеером",
          },
          transfer: {
            en: "the recording, drawn on the play disk itself",
            ru: "записи, на самом диске воспроизведения",
          },
          own: [
            {
              name: "waveform",
              type: "readonly number[]",
              en: "Levels 0…1 from data, resampled to the bars that fit the width. Without it: a calm flat row. Voice only: a circle shows a face, not levels.",
              ru: "Уровни 0…1 из данных, пересчитываются под число полосок по ширине. Без них — ровный тихий ряд. Только у голосового: кружок показывает лицо, а не уровни.",
            },
            {
              name: "rate",
              type: "1 | 1.5 | 2",
              en: "Playback speed (controlled). Voice only: speech is listened to faster; a face is watched at its own pace.",
              ru: "Скорость воспроизведения (управляемо). Только у голосового: речь слушают быстрее, лицо смотрят в своём темпе.",
            },
            {
              name: "defaultRate",
              type: "1 | 1.5 | 2",
              default: "1",
              en: "Initial playback speed (uncontrolled).",
              ru: "Начальная скорость (неуправляемо).",
            },
            {
              name: "onRateChange",
              type: "(rate: 1 | 1.5 | 2) => void",
              en: "The rate chip was pressed: 1× → 1.5× → 2× → 1×.",
              ru: "Нажат чип скорости: 1× → 1,5× → 2× → 1×.",
            },
          ],
        }),
        {
          name: "labels",
          type: "Partial<VoicePlayerLabels>",
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
  functions: [
    {
      name: "getWaveform(source, bars)",
      type: "(source: Blob | string, bars?: number) => Promise<number[]>",
      en: "The 0…1 peaks of a `Blob` or URL with no stored levels, for `waveform`; `bars` defaults to 48. Rejects when the audio cannot be fetched or decoded.",
      ru: "Пики 0…1 записи (`Blob` или URL) без сохранённых уровней, для `waveform`; `bars` по умолчанию 48. Отклоняется, если звук не загрузить или не декодировать.",
    },
  ],
  labels: labelRows(VOICE_PLAYER_LABELS, {
    ...mediaPlayerLabelDocs({ en: "The transfer of the recording", ru: "Передача записи" }),
    seek: {
      en: "Name of the waveform slider (its `aria-valuetext` is `position`).",
      ru: "Название ползунка-волны (его `aria-valuetext` — `position`).",
    },
    rate: {
      en: "Name of the rate chip; `{rate}` as shown on it.",
      ru: "Название чипа скорости; `{rate}` — как на чипе.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Moves focus: the disk (or the transfer disk), the waveform slider, the rate chip, the transcript button.",
        ru: "Переводит фокус: кнопка (или диск передачи), волна-ползунок, чип скорости, кнопка расшифровки.",
      },
      {
        keys: "Enter · Space",
        en: "On the disk: play or pause; on the chip: the next speed; on the transcript button: open or close the text.",
        ru: "На кнопке — воспроизведение или пауза; на чипе — следующая скорость; на кнопке расшифровки — открыть или свернуть текст.",
      },
      {
        keys: "ArrowRight · ArrowUp",
        en: "On the waveform: 5 seconds forward.",
        ru: "На волне — вперёд на 5 секунд.",
      },
      {
        keys: "ArrowLeft · ArrowDown",
        en: "On the waveform: 5 seconds back.",
        ru: "На волне — назад на 5 секунд.",
      },
      {
        keys: "PageUp · PageDown",
        en: "On the waveform: 10 % of the recording forward or back.",
        ru: "На волне — на 10 % записи вперёд или назад.",
      },
      {
        keys: "Home · End",
        en: "On the waveform: to the start or the end.",
        ru: "На волне — в начало или в конец.",
      },
    ],
    aria: [
      {
        en: 'The root is `role="group"` named by `labels.player` (or your `aria-label`).',
        ru: 'Корень — `role="group"` с названием `labels.player` (или вашим `aria-label`).',
      },
      {
        en: 'The disk is named `labels.play` while paused and `labels.pause` while playing. While the recording is sent, received or not fetched the same button is the transfer, named by the direction — `cancelUpload` / `cancelDownload` described by `uploadProgress` / `downloadProgress` (`aria-busy`), after a failure `retryUpload` / `retryDownload` described by `notSent` / `notReceived`, `download` for a remote one; its ring is `aria-hidden`; a refused cancel, retry or download is announced (`role="status"`).',
        ru: 'Диск называется `labels.play` на паузе и `labels.pause` во время воспроизведения. Пока запись отправляется, загружается или не скачана, та же кнопка — передача с именем по направлению: `cancelUpload` / `cancelDownload` с описанием `uploadProgress` / `downloadProgress` (`aria-busy`), после ошибки `retryUpload` / `retryDownload` с описанием `notSent` / `notReceived`, `download` для удалённой; её кольцо `aria-hidden`; отказ отмены, повтора или скачивания объявляется (`role="status"`).',
      },
      {
        en: 'The waveform is `role="slider"` with `aria-valuemin`, `aria-valuemax` (seconds), `aria-valuenow` and `aria-valuetext` from `labels.position`.',
        ru: 'Волна — `role="slider"` с `aria-valuemin`, `aria-valuemax` (секунды), `aria-valuenow` и `aria-valuetext` из `labels.position`.',
      },
      {
        en: "The rate chip is named `labels.rate`; while `unplayed`, `labels.unplayed` is read after the time — the dot is never the only cue.",
        ru: "Чип скорости называется `labels.rate`; пока `unplayed`, после времени читается `labels.unplayed` — точка не единственный признак.",
      },
      {
        en: "One sound at a time: starting a player pauses any other voice message or chat video, which reports `onPlayingChange(false)`.",
        ru: "Один звук за раз: запуск плеера ставит на паузу любое другое голосовое или видео чата, и оно сообщает `onPlayingChange(false)`.",
      },
      {
        en: 'The transcript button is named `labels.transcribe` / `labels.hideTranscript`, with `aria-expanded` and `aria-controls` on the text area; while asked, the button is `aria-busy` and the area stays closed. The text is a plain paragraph, read and selected as normal text; a failed request is announced with `labels.transcribeFailed` (`role="status"`).',
        ru: 'Кнопка расшифровки называется `labels.transcribe` или `labels.hideTranscript`, несёт `aria-expanded` и `aria-controls` на область текста; пока идёт запрос, кнопка `aria-busy`, а область остаётся закрытой. Текст читается и выделяется как обычный абзац; ошибка запроса объявляется `labels.transcribeFailed` (`role="status"`).',
      },
    ],
  },
};
