import type { ApiLabel, ApiProp } from "../../scripts/docs/componentApi";

/** The transcript props of a voice or video message (`internal/transcript`): VoicePlayer, VideoNote. */
export function transcriptProps(where: { en: string; ru: string }): ApiProp[] {
  return [
    {
      name: "transcript",
      type: "string",
      en: `The text of the recording, when it is known. With it or \`onTranscribe\` a «→A» transcript button shows ${where.en}; it opens the text (selectable, marked by the chat search) and turns into a chevron that closes it. In a chat, open and close are one stroke of the message: the height and the width change together, the text fades in or out where it stands, and the player row above never moves.`,
      ru: `Текст записи, когда он известен. С ним или с \`onTranscribe\` появляется кнопка расшифровки «→A» ${where.ru}; она открывает текст (выделяется, подсвечивается поиском по чату) и превращается в шеврон, который его сворачивает. В чате открытие и закрытие — одно движение сообщения: высота и ширина меняются вместе, текст проявляется или гаснет на своём месте, строка плеера над ним не двигается.`,
    },
    {
      name: "onTranscribe",
      type: "() => Promise<string> | void",
      en: "Asks for the text on the first open while `transcript` is not known. Return a Promise of the text: only the button spins and the area stays closed; on resolve the area opens with the text; a rejection closes the area (`onTranscriptExpandedChange(false)`) and announces `labels.transcribeFailed`, and the next open asks again. Returning nothing keeps the button spinning until you pass `transcript`.",
      ru: "Запрашивает текст при первом открытии, пока `transcript` не известен. Верните Promise с текстом: крутится только кнопка, область остаётся закрытой; после resolve она раскрывается уже с текстом; при reject область закрывается (`onTranscriptExpandedChange(false)`) и объявляется `labels.transcribeFailed`, следующее открытие спросит снова. Если ничего не вернуть, кнопка крутится до прихода `transcript`.",
    },
    {
      name: "transcriptExpanded",
      type: "boolean",
      en: "The transcript is open (controlled). Opening it without a text calls `onTranscribe`.",
      ru: "Расшифровка открыта (управляемо). Открытие без текста вызывает `onTranscribe`.",
    },
    {
      name: "defaultTranscriptExpanded",
      type: "boolean",
      default: "false",
      en: "Initially open (uncontrolled). Inside a chat's list (`Chat.Messages`) the open state and a resolved text outlive a windowed row: scrolled away and back, it is still open.",
      ru: "Изначально открыта (неуправляемо). В ленте чата (`Chat.Messages`) открытое состояние и полученный текст переживают окно отрисовки: строка, ушедшая из вида и вернувшаяся, остаётся открытой.",
    },
    {
      name: "onTranscriptExpandedChange",
      type: "(expanded: boolean) => void",
      en: "The transcript button was pressed, or a rejected `onTranscribe` closed the transcript.",
      ru: "Нажата кнопка расшифровки или отклонённый `onTranscribe` закрыл расшифровку.",
    },
  ];
}

export const TRANSCRIPT_LABEL_ROWS: ApiLabel[] = [
  {
    key: "transcribe",
    default: "Расшифровать",
    en: "Name of the transcript button while the text is closed.",
    ru: "Название кнопки расшифровки, пока текст свёрнут.",
  },
  {
    key: "hideTranscript",
    default: "Скрыть расшифровку",
    en: "Name of the transcript button while the text is open.",
    ru: "Название кнопки расшифровки, пока текст открыт.",
  },
  {
    key: "transcribeFailed",
    default: "Не удалось расшифровать сообщение",
    en: "Announced when `onTranscribe` rejects.",
    ru: "Объявляется, когда `onTranscribe` отклонён.",
  },
];
