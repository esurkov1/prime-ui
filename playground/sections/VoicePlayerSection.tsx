import { api } from "@/components/voice-player/api";
import { Mic } from "@/icons/glyphs/mic";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "messages",
  nav: {
    segment: "voice-player",
    label: "VoicePlayer",
    summary: "Голосовое сообщение: кнопка, волна-перемотка, время и скорость",
    keywords: ["голосовое", "аудио", "плеер", "запись", "звонок", "voice", "audio", "waveform"],
    icon: Mic,
    order: 2,
  },
  dir: "voice-player",
  title: "VoicePlayer",
  kind: "control",
  description:
    "Голосовое сообщение или запись звонка: круглая кнопка воспроизведения, волна, по которой перематывают, и время со скоростью. Внутри пузыря Message оставляет место под время сообщения.",
  examples: [
    {
      slot: "overview",
      description:
        "Голосовое сообщение клиента в поддержку, готовое к прослушиванию — `src`, `waveform`, `duration`.",
    },
    {
      slot: "states",
      description:
        "Все состояния рядом, каждое подписано своим пропом: передача рисуется на самой кнопке воспроизведения — в пути с крестиком и кольцом, ошибка с повтором, не скачано со стрелкой загрузки — `unplayed`, `transfer`, `transferProgress`, `disabled`.",
    },
    {
      scenario: "call-recording",
      title: "Запись звонка",
      description:
        "Запись звонка в карточке сделки: телефония не хранит уровни, поэтому волна читается из самого звука, и ровный ряд заполняется, когда она готова; плеер занимает ширину карточки — `getWaveform`, `waveform`, `className`.",
    },
    {
      scenario: "in-message",
      title: "В сообщении",
      description:
        "Голосовые в чате поддержки: плеер стоит на заливке пузыря, время сообщения — в его углу — `Message.Root`, `time`, `status`.",
    },
    {
      scenario: "transcript",
      title: "Расшифровка",
      description:
        "Голосовые с расшифровкой: одна известна заранее, другую запрашивают при первом открытии — `transcript`, `onTranscribe`.",
    },
    {
      scenario: "transfer",
      title: "Передача",
      description:
        "Одна картинка передачи в обе стороны: голосовое клиента ждёт скачивания и приходит, ответ уходит — сама кнопка воспроизведения несёт крестик и кольцо доли, обрыв связи предлагает повтор, после передачи возвращается значок воспроизведения — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`.",
    },
    {
      slot: "controlled",
      description:
        "Родитель знает, что играет, отмечает сообщение прослушанным при первом запуске и дослушанным, когда оно закончилось, хранит скорость и держит расшифровку открытой — `playing`, `onPlayingChange`, `unplayed`, `onEnded`, `rate`, `onRateChange`, `transcriptExpanded`, `onTranscriptExpandedChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action:
          "Переводит фокус: кнопка (или диск передачи), волна-ползунок, чип скорости, кнопка расшифровки.",
      },
      {
        keys: "Enter · Space",
        action:
          "На кнопке — воспроизведение или пауза; на чипе — следующая скорость; на кнопке расшифровки — открыть или свернуть текст.",
      },
      { keys: "ArrowRight · ArrowUp", action: "На волне — вперёд на 5 секунд." },
      { keys: "ArrowLeft · ArrowDown", action: "На волне — назад на 5 секунд." },
      { keys: "PageUp · PageDown", action: "На волне — на 10 % записи вперёд или назад." },
      { keys: "Home · End", action: "На волне — в начало или в конец." },
    ],
    aria: [
      'Корень — `role="group"` с названием `labels.player` (или вашим `aria-label`).',
      "Кнопка называется `labels.play` на паузе и `labels.pause` во время воспроизведения.",
      'Пока запись в пути, не удалась или не скачана, кнопка `inert`, а на её месте диск передачи: кнопка с именем по направлению (`cancelUpload` / `cancelDownload`, `retryUpload` / `retryDownload` с описанием `notSent` / `notReceived`, `download`) и кольцо `role="progressbar"`; отказ объявляется.',
      'Волна — `role="slider"` с `aria-valuemin`, `aria-valuemax` (секунды), `aria-valuenow` и `aria-valuetext` из `labels.position`.',
      "Чип скорости называется `labels.rate`; пока `unplayed`, после времени читается `labels.unplayed` — точка не единственный признак.",
      "На странице играет один плеер: запуск другого ставит текущий на паузу.",
      "Кнопка расшифровки называется `labels.transcribe` или `labels.hideTranscript`, несёт `aria-expanded` и `aria-controls` на область текста; пока идёт запрос — `aria-busy` на кнопке и области. Текст читается как обычный абзац; ошибка запроса объявляется `labels.transcribeFailed`.",
    ],
  },
};
