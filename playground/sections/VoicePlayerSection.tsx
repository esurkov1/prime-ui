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
};
