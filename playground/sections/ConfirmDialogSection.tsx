import { api } from "@/components/confirm-dialog/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { TriangleAlert } from "../icons";

export const page: ComponentPageConfig = {
  category: "overlays",
  nav: {
    segment: "confirm-dialog",
    label: "ConfirmDialog",
    summary: "Подтверждение удаления и других важных действий",
    keywords: ["подтверждение", "удаление", "удалить", "confirm", "alertdialog", "onConfirm"],
    icon: TriangleAlert,
    order: 5,
  },
  dir: "confirm-dialog",
  title: "ConfirmDialog",
  kind: "overlay",
  description:
    "Подтверждение разрушительного или весомого действия целиком: вопрос, последствия, «Отмена» и кнопка действия, которая сама показывает запрос и не даёт закрыть окно до его конца.",
  examples: [
    {
      slot: "overview",
      description:
        "Удаление проекта: кнопка опасного действия показывает запрос, и ничто не закрывает окно, пока он не завершится — `ConfirmDialog.Trigger`, `onConfirm`.",
    },
    {
      slot: "variants",
      description:
        "Разрушительное действие подтверждает кнопка danger, весомое, но безопасное — например, отправка счёта — accent — `tone`.",
    },
    {
      scenario: "failure",
      title: "Ошибка",
      description:
        "Сервер отказал: окно остаётся открытым, причина от владельца под текстом, кнопка готова к повтору — `error`, `onConfirm`.",
    },
    {
      slot: "controlled-open",
      description:
        "Пункт меню открывает подтверждение из кода: у окна нет своего триггера, состоянием владеет родитель — `open`, `onOpenChange`.",
    },
  ],
  api,
};
