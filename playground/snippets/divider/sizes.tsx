import { Divider } from "@/components/divider/Divider";

/** Размеры разделителя в реальном контексте: секции настроек с разными уровнями иерархии. */
export default function DividerSizesSnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-space-3)",
        width: "100%",
        maxWidth: 480,
        padding: "var(--prime-sys-space-4)",
        border: "1px solid var(--prime-sys-color-border-subtle)",
        borderRadius: "var(--prime-sys-radius-l)",
        backgroundColor: "var(--prime-sys-color-surface-default)",
      }}
    >
      <Divider.Root variant="text" size="xl">
        Настройки профиля
      </Divider.Root>
      <div style={{ paddingLeft: "var(--prime-sys-space-2)" }}>
        <p
          style={{
            margin: "0 0 var(--prime-sys-space-2)",
            fontSize: 14,
            color: "var(--prime-sys-color-text-secondary)",
          }}
        >
          Имя: Иван Петров
        </p>
        <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
          Email: ivan@example.com
        </p>
      </div>

      <Divider.Root variant="text" size="l" style={{ marginTop: "var(--prime-sys-space-2)" }}>
        Уведомления
      </Divider.Root>
      <div style={{ paddingLeft: "var(--prime-sys-space-2)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <input type="checkbox" defaultChecked />
          Новости продукта
        </label>
      </div>

      <Divider.Root variant="text" size="m" style={{ marginTop: "var(--prime-sys-space-2)" }}>
        Дополнительно
      </Divider.Root>
      <div style={{ paddingLeft: "var(--prime-sys-space-2)" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--prime-sys-color-text-tertiary)" }}>
          Версия: 2.1.0
        </p>
      </div>

      <Divider.Root variant="text" size="s" style={{ marginTop: "var(--prime-sys-space-2)" }}>
        Метаданные
      </Divider.Root>
      <div style={{ paddingLeft: "var(--prime-sys-space-2)" }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--prime-sys-color-text-tertiary)" }}>
          ID: 12345
        </p>
      </div>
    </div>
  );
}
