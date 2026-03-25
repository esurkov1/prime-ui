import * as React from "react";

import { Switch } from "@/components/switch/Switch";

export default function SwitchFormFeaturesSnippet() {
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x3)",
        maxWidth: "24rem",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setMessage(data.get("newsletter") === "on" ? "Подписка включена" : "Флажок не отмечен");
      }}
    >
      <Switch.Root name="newsletter" defaultChecked>
        <Switch.Label>Новости продукта</Switch.Label>
      </Switch.Root>
      <Switch.Root name="digest" required>
        <Switch.Label>Еженедельный дайджест (обязательно)</Switch.Label>
      </Switch.Root>
      <button
        type="submit"
        style={{
          alignSelf: "flex-start",
          padding: "var(--prime-sys-spacing-x2) var(--prime-sys-spacing-x3)",
          borderRadius: "var(--prime-sys-shape-radius-m)",
        }}
      >
        Отправить
      </button>
      {message != null ? <p style={{ margin: 0, fontSize: "0.875rem" }}>{message}</p> : null}
    </form>
  );
}
