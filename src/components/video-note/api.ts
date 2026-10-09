import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { mediaPlayerLabels, mediaPlayerProps } from "../../internal/mediaPlayer.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "VideoNote",
      en: "`ref` → `HTMLDivElement` (the `role=\"group\"` root). A round video message: a perfect circle at every width (the `--prime-message-video-note` token × 1.15, within the row), no shell. At rest it is the still first frame (or `poster`) with the shared play disk in its shade look in the middle and the duration on a pill — nothing plays or loops before a press. The disk (or a press anywhere on the circle) plays it with sound and a progress ring fills over the circle's edge, the disk fading out; again it pauses; at the end it rewinds to the still frame. The duration reads like a voice message's time row (the muted caption on the media pill). Inside `Message.Root` it is the message itself — no bubble, the meta on its pill at the bottom-end corner, reactions under it. Its props are VoicePlayer's (`MediaPlayerProps`) plus `poster`.",
      ru: 'Корень `role="group"`. Круглое видеосообщение: идеальный круг при любой ширине (токен `--prime-message-video-note` × 1,15, в пределах строки), без оболочки. В покое — неподвижный первый кадр (или `poster`) с общим диском воспроизведения в полупрозрачном виде по центру и длительностью на плашке: до нажатия ничего не играет и не крутится. Диск (или нажатие в любом месте кружка) запускает его со звуком, по краю круга заполняется кольцо прогресса, диск гаснет; повторно — пауза; в конце перематывается к неподвижному кадру. Длительность читается как время голосового (приглушённая подпись на плашке media). Внутри `Message.Root` это само сообщение: без пузыря, мета на плашке у нижнего конечного угла, реакции под кружком. Пропсы — те же, что у VoicePlayer (`MediaPlayerProps`), плюс `poster`.',
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
            en: "at the top end of the circle's box, outside its edge (where the voice message has it, at the end of its top row), and the text opens in a block of the message's fill under the circle",
            ru: "в верхнем конечном углу рамки кружка, за его краем (там же, где у голосового, — в конце верхней строки), а текст раскрывается под кружком в блоке цвета сообщения",
          },
          transfer: {
            en: "the note, drawn on the play disk itself in the middle (the same disk in its shade look: the × or the arrow in the play glyph's place, the ring along its inner edge); the circle dims and does not play until it is done",
            ru: "кружка, на самом диске воспроизведения в центре (тот же диск в полупрозрачном виде: × или стрелка вместо значка воспроизведения, кольцо по внутреннему краю); кружок приглушён и не воспроизводится до готовности",
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
