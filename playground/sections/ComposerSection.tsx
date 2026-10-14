import { api } from "@/components/composer/api";
import { Send } from "@/icons/glyphs/send";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "messages",
  nav: {
    segment: "composer",
    label: "Composer",
    summary: "Поле сообщения чата: отправка, вложения, ответ, форматирование, голосовые",
    keywords: [
      "сообщение",
      "чат",
      "отправить",
      "ввод",
      "голосовое",
      "вложения",
      "ответ",
      "composer",
      "chat input",
      "message",
    ],
    icon: Send,
    order: 4,
  },
  dir: "composer",
  title: "Composer",
  kind: "composite",
  description:
    "Поле ввода сообщения в чате: растёт от одной строки до восьми, Enter отправляет, скрепка прикрепляет файлы, а пустое поле записывает голосовое или круглое видео. Над полем — вложения и плашка ответа или правки, выделенный текст оформляется Markdown.",
  examples: [
    {
      slot: "overview",
      description:
        "Ответ клиенту в чате поддержки: Enter отправляет, Shift+Enter переносит строку, скрепка прикрепляет файлы, а пустое поле записывает голосовое — `onSend`, `onSendVoice`, `queue`, `Composer.Attach`.",
    },
    {
      slot: "sizes",
      description: "Один композер во всех ярусах: поле, кнопки и скрепка следуют за ним — `size`.",
    },
    {
      scenario: "attachments",
      title: "Вложения",
      description:
        "Фото склада и документы клиенту идут через очередь загрузки: скрепка открывает выбор фото, видео и офисных документов, вставка и перетаскивание тоже добавляют их, каждое вложение — плитка одной ленты, порядок меняется перетаскиванием, а отправка ждёт конца загрузки — `queue`, `Composer.Attach`, `accept`, `useUploadQueue`.",
    },
    {
      scenario: "attach-menu",
      title: "Меню вложений",
      description:
        "Скрепка как меню видов вложения: фото и видео, документы, любой файл и счёт из системы, который вставляет ссылку в сообщение и возвращает фокус в поле — `Composer.Item`, `Composer.ItemIcon`, `accept`, `onSelect`, `inputRef`.",
    },
    {
      scenario: "reply-edit",
      title: "Ответ и правка",
      description:
        "Ответ на сообщение клиента и правка своего: плашка над полем цитирует сообщение, Escape или крестик отменяют, ↑ в пустом поле открывает последнее своё сообщение, отправка становится сохранением и передаёт id сообщения — `Composer.Context`, `mode`, `messageId`, `onDismiss`, `onEditLast`.",
    },
    {
      scenario: "typing",
      title: "Сигнал «печатает»",
      description:
        "Собеседник видит «печатает…» или «записывает голосовое…», пока вы пишете или записываете: композер сообщает, что вы делаете, а чат передаёт это дальше — `onActivityChange`.",
    },
    {
      scenario: "formatting",
      title: "Форматирование",
      description:
        "Над выделенным текстом появляется панель: жирный, курсив, зачёркнутый, код, скрытый текст, ссылка и цитата, у каждого своё сочетание клавиш; оформление пишется Markdown вокруг выделения — `formatting`.",
    },
    {
      scenario: "voice",
      title: "Голосовые и видео",
      description:
        "Голосовые и круглые видео: удерживайте кнопку и отпустите, чтобы отправить, сдвиньте влево для отмены, вверх или коротким нажатием — запись без удержания; двойное касание или двойной щелчок переключает голос и видео — `onSendVoice`, `onSendVideoNote`, `recordMode`.",
    },
    {
      slot: "states",
      description:
        "Закрытый разговор недоступен, медленная отправка держит текст и занятую кнопку, пока сервер не ответит — `disabled`, `onSend`.",
    },
    {
      slot: "controlled",
      description:
        "У каждого разговора свой черновик: смена чата меняет текст, кнопка шаблона заполняет его снаружи — `value`, `onValueChange`.",
    },
    {
      slot: "narrow",
      description:
        "В чате шириной с телефон строка держит скрепку, поле и кнопку; на сенсорном экране Enter переносит строку, а отправляет кнопка — `Composer.Attach`, `onSend`.",
    },
  ],
  api,
};
