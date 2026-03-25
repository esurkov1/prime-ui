import * as React from "react";
import { Radio } from "@/components/radio/Radio";

export default function RadioFormGroupSnippet() {
  const [lastSubmit, setLastSubmit] = React.useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLastSubmit(String(fd.get("slot") ?? ""));
      }}
      style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}
    >
      <fieldset style={{ margin: 0, padding: 0, border: "none", minWidth: 0 }}>
        <legend style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Окно доставки</legend>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Radio.Root name="slot" value="morning" defaultChecked size="m" required>
            <Radio.Label>09:00–12:00</Radio.Label>
          </Radio.Root>
          <Radio.Root name="slot" value="afternoon" size="m" required>
            <Radio.Label>12:00–16:00</Radio.Label>
          </Radio.Root>
          <Radio.Root name="slot" value="evening" size="m" required>
            <Radio.Label>16:00–20:00</Radio.Label>
          </Radio.Root>
        </div>
      </fieldset>
      <button type="submit" style={{ padding: "8px 14px", fontSize: 13 }}>
        Сохранить слот
      </button>
      {lastSubmit ? (
        <span style={{ fontSize: 12, opacity: 0.85 }}>Отправлено: {lastSubmit}</span>
      ) : null}
    </form>
  );
}
