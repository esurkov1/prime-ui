import { api } from "@/components/tag-select/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { Tags } from "../icons";

export const page: ComponentPageConfig = {
  category: "selection",
  nav: {
    segment: "tag-select",
    label: "Tag Select",
    summary: "Множественный выбор с тегами",
    keywords: ["теги", "мультиселект", "multiselect", "value", "onValueChange"],
    icon: Tags,
    order: 8,
  },
  dir: "tag-select",
  title: "TagSelect",
  kind: "field",
  description:
    "Поле нескольких значений в виде цветных тегов: выбор из списка, фильтр набором, создание новых. В покое одна строка, в фокусе — все теги.",
  examples: [
    {
      slot: "overview",
      description:
        "Поле тегов с подписью: фокус открывает список, набор фильтрует его, выбранные теги становятся чипами — `label`, `options`.",
    },
    {
      slot: "sizes",
      description: "Все ярусы с двумя выбранными тегами; чипы на ярус меньше поля — `size`.",
    },
    {
      slot: "states",
      description:
        "Обычное поле рядом с неактивным и ошибочным, неактивная опция в списке — `disabled`, `invalid`.",
    },
    {
      slot: "validation",
      description:
        "Живая проверка: удалите последний регион — поле вздрогнет и ошибка встанет на место подсказки, добавьте регион — ошибка уйдёт; пометки обязательного и необязательного поля и подсказка — `required`, `optional`, `hint`, `error`.",
    },
    {
      scenario: "creatable",
      title: "Создание тегов",
      description:
        "Набранный текст, которого нет в списке, становится новым тегом через строку «Создать» или Enter и сохраняется на сервере: чип ждёт занятым, а тег, от которого сервер отказался, уходит обратно — `creatable`, `onCreate`, `fallbackColor`.",
    },
    {
      scenario: "many-tags",
      title: "Много тегов",
      description:
        "Тегов больше, чем помещается: в покое одна строка с «+N», в фокусе все теги до трёх строк с прокруткой — `defaultValue`.",
    },
    {
      scenario: "manage-tags",
      title: "Управление тегами",
      description:
        "Пользователи ведут свой словарь на сервере: меню «⋯» у строки переименовывает, перекрашивает или удаляет опцию, а «⋯» крутится, пока изменение сохраняется — `onOptionUpdate`, `onOptionDelete`.",
    },
    {
      scenario: "confirm-delete",
      title: "Подтверждение удаления",
      description:
        "Удаление общей метки сначала спрашивает: пока открыт диалог, строка ждёт со спиннером, «Отмена» оставляет метку и выбор — `onOptionDelete`.",
    },
    {
      slot: "dismiss",
      description:
        "Список меток остаётся открытым, пока человек читает задачу рядом: закрывают его Escape или Tab — `closeOnOutsideClick`, `closeOnEscape`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель: кнопка подставляет набор тегов, счётчик следует за ними — `value`, `onValueChange`.",
    },
    {
      slot: "controlled-open",
      description:
        "Списком владеет родитель: кнопка открывает его из кода, Escape или нажатие снаружи закрывают — `open`, `onOpenChange`.",
    },
    {
      slot: "in-form",
      description:
        "Форма новой задачи: обязательные метки проверяются при отправке, ошибка встряхивает поле и уходит, когда метка добавлена, спокойная заметка подтверждает задачу; теги уходят с формой — `required`, `error`, `creatable`, `name`.",
    },
  ],
  api,
};
