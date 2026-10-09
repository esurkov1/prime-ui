import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { mediaPlayerLabels, mediaPlayerProps } from "../../internal/mediaPlayer.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "VoicePlayer",
      en: "`ref` → `HTMLDivElement` (the `role=\"group\"` root). A voice message: the shared play disk (solid), the waveform as the seek slider (bars centred on the line, the look of the Composer's recorder) and the time row with the playback speed; plays one at a time on the page. At the end it stops, rewinds, the waveform empties and the total time and the play glyph come back. As the last part of a chat message it keeps the meta's room at the end of its time row (of the transcript while open). Its props are VideoNote's (`MediaPlayerProps`) plus `waveform` and the rate triad.",
      ru: 'Корень `role="group"`. Голосовое сообщение: общий диск воспроизведения (сплошной), волна как ползунок перемотки (полоски по центру линии, как у записи в Composer) и строка времени со скоростью; на странице играет только один плеер. В конце останавливается, перематывается в начало, волна пустеет, возвращаются общее время и значок воспроизведения. Последней частью сообщения оставляет место под мету в конце строки времени (или расшифровки, пока она открыта). Пропсы — те же, что у VideoNote (`MediaPlayerProps`), плюс `waveform` и тройка скорости.',
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
            en: "at the end of the waveform and the text opens under the player, inside the same bubble",
            ru: "в конце волны, а текст раскрывается под плеером в том же пузыре",
          },
          transfer: {
            en: "the recording, drawn on the play disk itself — the same disk, size and fill (the accent disk, recoloured by an outgoing bubble), the × or the arrow in the play glyph's place and the ring along its inner edge, one look in a bubble and outside it; the waveform and the rate chip are off until it is done",
            ru: "записи, на самом диске воспроизведения — тот же диск, размер и заливка (акцентный диск, перекрашенный исходящим пузырём), × или стрелка вместо значка воспроизведения и кольцо по внутреннему краю, одинаково в пузыре и вне его; волна и чип скорости выключены до готовности",
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
  labels: mediaPlayerLabels({
    player: "Голосовое сообщение",
    play: "Воспроизвести голосовое сообщение",
    unplayed: "Не прослушано",
    transfer: "The transfer of the recording",
    own: [
      {
        key: "seek",
        default: "Перемотка",
        en: "Name of the waveform slider (its `aria-valuetext` is `position`).",
        ru: "Название ползунка-волны (его `aria-valuetext` — `position`).",
      },
      {
        key: "rate",
        default: "Скорость воспроизведения: {rate}",
        en: "Name of the rate chip; `{rate}` as shown on it.",
        ru: "Название чипа скорости; `{rate}` — как на чипе.",
      },
    ],
  }),
};
