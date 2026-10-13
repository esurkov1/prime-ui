import type { ApiLabel, ApiProp } from "../../scripts/docs/componentApi";

/** The transcript props of a voice or video message (`internal/transcript`): VoicePlayer, VideoNote. */
export function transcriptProps(where: { en: string; ru: string }): ApiProp[] {
  return [
    {
      name: "transcript",
      type: "string",
      en: `The text of the recording, when it is known. With it or \`onTranscribe\` a «→A» button opens and closes the text: ${where.en}.`,
      ru: `Текст записи, когда он известен. С ним или с \`onTranscribe\` кнопка «→A» открывает и сворачивает текст: ${where.ru}.`,
    },
    {
      name: "onTranscribe",
      type: "() => Promise<string> | void",
      en: "Asks for the text on the first open while `transcript` is not known; return a Promise of the text. The button spins, then the text opens; a rejection announces `labels.transcribeFailed`.",
      ru: "Запрашивает текст при первом открытии, пока `transcript` не известен; верните Promise с текстом. Кнопка крутится, затем текст раскрывается; при reject объявляется `labels.transcribeFailed`.",
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
      en: "Initially open (uncontrolled). In `Chat.Messages` the open state and a resolved text survive a row scrolled away and back.",
      ru: "Изначально открыта (неуправляемо). В `Chat.Messages` открытое состояние и полученный текст сохраняются, когда строка уходит из вида и возвращается.",
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
