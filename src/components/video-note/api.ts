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
};
