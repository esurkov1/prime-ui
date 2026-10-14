import { api } from "@/components/video-note/api";
import { Video } from "@/icons/glyphs/video";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "messages",
  nav: {
    segment: "video-note",
    label: "VideoNote",
    summary: "Круглое видеосообщение: кадр с диском воспроизведения, звук по нажатию, расшифровка",
    keywords: ["кружок", "видеосообщение", "видео", "круглое видео", "video note", "video message"],
    icon: Video,
    order: 3,
  },
  dir: "video-note",
  title: "VideoNote",
  kind: "control",
  description:
    "Круглое видеосообщение: неподвижный первый кадр с диском воспроизведения, играет со звуком по нажатию. Те же пропсы, что у VoicePlayer; внутри Message кружок и есть сообщение — без пузыря, с метой на плашке.",
  examples: [
    {
      slot: "overview",
      description:
        "Круглый видеоотчёт бригадира: неподвижный первый кадр с диском воспроизведения и длительностью, по нажатию играет со звуком — `src`, `duration`.",
    },
    {
      slot: "states",
      description:
        "Все состояния рядом, каждое подписано своим пропом: передача рисуется на самом диске воспроизведения — в пути с крестиком и кольцом, ошибка с повтором, не скачано со стрелкой загрузки — `unplayed`, `transfer`, `transferProgress`, `disabled`.",
    },
    {
      scenario: "in-message",
      title: "В сообщении",
      description:
        "Круглые видео в чате выездной бригады: кружок — само сообщение, время стоит на его плашке, ответ идёт текстом, а кружок-ответ показывает обложку, сделанную сервером — `Message.Root`, `time`, `status`, `poster`.",
    },
    {
      scenario: "transcript",
      title: "Расшифровка",
      description:
        "Кружки с расшифровкой: кнопка стоит в верхнем конце кружка, как у голосового, один текст известен, другой запрашивают при первом открытии — `transcript`, `onTranscribe`.",
    },
    {
      scenario: "transfer",
      title: "Передача",
      description:
        "Одна картинка передачи в обе стороны: отчёт бригадира ждёт скачивания и приходит, ответ инженера уходит — диск в центре с кольцом доли, крестик отменяет, обрыв связи предлагает повтор, после передачи кружок воспроизводится — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`.",
    },
    {
      slot: "controlled",
      description:
        "Родитель знает, что играет, отмечает отчёт просмотренным при первом запуске и досмотренным, когда он закончился, и держит расшифровку открытой — `playing`, `onPlayingChange`, `unplayed`, `onEnded`, `transcriptExpanded`, `onTranscriptExpandedChange`.",
    },
  ],
  api,
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        action: "Переводит фокус: диск воспроизведения (или диск передачи), кнопка расшифровки.",
      },
      {
        keys: "Enter · Space",
        action:
          "На диске — воспроизведение со звуком или пауза; на кнопке расшифровки — открыть или свернуть текст; на диске передачи — отменить, повторить или скачать.",
      },
      { keys: "ArrowRight · ArrowUp", action: "На диске — вперёд на 5 секунд." },
      { keys: "ArrowLeft · ArrowDown", action: "На диске — назад на 5 секунд." },
      { keys: "PageUp · PageDown", action: "На диске — на 10 % записи вперёд или назад." },
      { keys: "Home · End", action: "На диске — в начало или в конец." },
    ],
    aria: [
      'Корень — `role="group"` с названием `labels.player` (или вашим `aria-label`).',
      "Диск воспроизведения — кнопка `labels.play` / `labels.pause`, её описание — длительность (`labels.duration`) или позиция (`labels.position`) и `labels.unplayed`; плашки скрыты от чтения. Нажатие в любом месте кружка — только помощь указателю.",
      'Пока кружок в пути, не удался или не скачан, диск `inert`, а на его месте диск передачи: кнопка с именем по направлению (`cancelUpload` / `cancelDownload`, `retryUpload` / `retryDownload` с описанием `notSent` / `notReceived`, `download`) и кольцо `role="progressbar"`; отказ объявляется (`role="status"`).',
      "Кнопка расшифровки называется `labels.transcribe` или `labels.hideTranscript`, несёт `aria-expanded` и `aria-controls`; ошибка запроса объявляется `labels.transcribeFailed`.",
      "`disabled` (или выключенный `Fieldset`) выключает диск, кнопку расшифровки и действия передачи нативным `disabled`.",
    ],
  },
};
