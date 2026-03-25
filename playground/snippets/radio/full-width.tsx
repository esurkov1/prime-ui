import { Radio } from "@/components/radio/Radio";

export default function RadioFullWidthSnippet() {
  return (
    <div
      style={{
        maxWidth: 280,
        padding: 16,
        borderRadius: 8,
        border: "1px solid var(--prime-sys-color-border-subtle, #e4e4e7)",
        boxSizing: "border-box",
      }}
    >
      <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Способ связи</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio.Root name="radio-fw-contact" value="phone" defaultChecked size="m">
          <Radio.Label>Звонок в рабочее время</Radio.Label>
        </Radio.Root>
        <Radio.Root name="radio-fw-contact" value="chat" size="m">
          <Radio.Label>Чат в приложении</Radio.Label>
        </Radio.Root>
      </div>
    </div>
  );
}
