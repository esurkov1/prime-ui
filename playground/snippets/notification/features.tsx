import { Button } from "@/components/button/Button";
import { useNotifications } from "@/components/notification/NotificationStore";

import snippetsStyles from "./snippets.module.css";

export default function NotificationFeaturesSnippet() {
  const { notify, dismissAll } = useNotifications();

  const runStackDemo = () => {
    const types = ["info", "success"] as const;
    for (let index = 0; index < 6; index += 1) {
      window.setTimeout(() => {
        notify({
          type: types[index % 2],
          title: `Стек ${index + 1} из 6`,
          description:
            "Один тип и одна позиция дают одну колонку; наведите — стек развернётся и таймеры остановятся.",
          position: "bottom-right",
          duration: 6000 + index * 500,
          badge: index + 1,
        });
      }, index * 140);
    }
  };

  return (
    <div className={snippetsStyles.columnStartX3}>
      <div className="previewRowWrap">
        <Button.Root type="button" variant="neutral" mode="stroke" onClick={runStackDemo}>
          Запустить стек из 6 тостов
        </Button.Root>
        <Button.Root type="button" size="s" variant="neutral" mode="ghost" onClick={dismissAll}>
          dismissAll()
        </Button.Root>
      </div>
      <div className="previewRowWrap">
        <Button.Root
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "info",
              title: "Быстрое исчезновение",
              description: "duration: 2000",
              duration: 2000,
              position: "top-center",
              size: "m",
            })
          }
        >
          duration 2 с
        </Button.Root>
        <Button.Root
          type="button"
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() =>
            notify({
              type: "success",
              title: "Долго на экране",
              description: "duration: 14000",
              duration: 14000,
              position: "top-center",
              size: "m",
            })
          }
        >
          duration 14 с
        </Button.Root>
      </div>
    </div>
  );
}
