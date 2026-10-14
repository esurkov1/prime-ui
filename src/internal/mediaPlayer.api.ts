import type { ApiProp, LabelDocs } from "../../scripts/docs/componentApi";
import type { MediaPlayerLabels } from "./mediaPlayer";
import { TRANSCRIPT_LABEL_DOCS, transcriptProps } from "./transcript.api";
import { transferLabelDocs, transferProps } from "./transfer.api";

type Text = { en: string; ru: string };

/**
 * The rows of the props every player shares (`internal/mediaPlayer` `MediaPlayerProps`):
 * VoicePlayer and VideoNote list the same names, types and defaults. `what` names the media and
 * how each player shows the shared parts; the component's own props go between `media` and the
 * playing triad (`own`).
 */
export function mediaPlayerProps(what: {
  /** «Audio» / «Video». */
  media: Text;
  /** Where the unplayed dot stands. */
  dot: Text;
  /** What is off while `disabled`. */
  off: Text;
  /** What a drag or a key does that does not count as a change of `playing`. */
  change: Text;
  /** Where the player is after the end. */
  ended: Text;
  /** Where the transcript button stands and where the text opens. */
  transcript: Text;
  /** How the player shows a transfer. */
  transfer: Text;
  own: ApiProp[];
}): ApiProp[] {
  return [
    {
      name: "src",
      type: "string",
      required: true,
      en: `${what.media.en} URL, loaded with \`preload="metadata"\`: nothing plays before a press.`,
      ru: `Адрес ${what.media.ru}, загружается с \`preload="metadata"\`: до нажатия ничего не играет.`,
    },
    {
      name: "duration",
      type: "number",
      en: "Length in seconds, shown until the media reports its own.",
      ru: "Длительность в секундах; показывается, пока медиа не сообщит свою.",
    },
    {
      name: "unplayed",
      type: "boolean",
      default: "false",
      en: `Nobody has played it yet: an accent dot ${what.dot.en} and \`labels.unplayed\` for screen readers. Clear it when \`onPlayingChange(true)\` comes; the dot leaves with a fade.`,
      ru: `Ещё не воспроизведено: акцентная точка ${what.dot.ru} и \`labels.unplayed\` для экранного диктора. Снимите, когда придёт \`onPlayingChange(true)\`, — точка уходит с затуханием.`,
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      en: `Nothing can be played: ${what.off.en}, the transcript button and the transfer actions are off (native \`disabled\`). A disabled \`Fieldset\` around it disables it too.`,
      ru: `Воспроизвести нельзя: ${what.off.ru}, кнопка расшифровки и действия передачи выключены (нативный \`disabled\`). Выключенный \`Fieldset\` вокруг выключает его так же.`,
    },
    ...what.own,
    {
      name: "playing",
      type: "boolean",
      en: "Playing with sound (controlled): `true` plays it (from the start or on from a pause), `false` pauses it. One sound plays on the page at a time.",
      ru: "Играет ли со звуком (управляемо): `true` запускает (с начала или с паузы), `false` ставит на паузу. На странице звучит что-то одно.",
    },
    {
      name: "defaultPlaying",
      type: "boolean",
      default: "false",
      en: "Initial playing state (uncontrolled).",
      ru: "Начальное состояние воспроизведения (неуправляемое).",
    },
    {
      name: "onPlayingChange",
      type: "(playing: boolean) => void",
      en: `Playback with sound started or stopped: the play disk, Enter / Space, another sound taking over, the end (then \`onEnded\` too); ${what.change.en}.`,
      ru: `Воспроизведение со звуком началось или остановилось: диском, Enter / Space, запуском другого звука, концом записи (тогда и \`onEnded\`); ${what.change.ru}.`,
    },
    {
      name: "onEnded",
      type: "() => void",
      en: `Playback reached the end; ${what.ended.en}.`,
      ru: `Запись доиграла до конца; ${what.ended.ru}.`,
    },
    ...transcriptProps(what.transcript),
    ...transferProps(what.transfer),
  ];
}

/**
 * The descriptions of the strings every player shares (`MediaPlayerLabels`): the keys and
 * templates are the same, the defaults name the media; `transfer` names the transfer's scope.
 */
export function mediaPlayerLabelDocs(transfer: Text): LabelDocs<MediaPlayerLabels> {
  return {
    player: { en: "Name of the player group.", ru: "Название группы плеера." },
    play: {
      en: "Name of the play disk while it does not play.",
      ru: "Название диска воспроизведения, пока не играет.",
    },
    pause: {
      en: "Name of the play disk while it plays.",
      ru: "Название диска воспроизведения во время игры.",
    },
    position: {
      en: "The position: `{current}` and `{duration}` as m:ss.",
      ru: "Позиция: `{current}` и `{duration}` в формате м:сс.",
    },
    unplayed: {
      en: "Visually hidden text read while `unplayed`.",
      ru: "Скрытый текст, читаемый, пока `unplayed`.",
    },
    ...TRANSCRIPT_LABEL_DOCS,
    ...transferLabelDocs(transfer),
  };
}
