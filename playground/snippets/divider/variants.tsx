import { Divider } from "@/components/divider/Divider";

/** Три варианта в реальных сценариях: карточка заказа, список настроек, форма регистрации. */
export default function DividerVariantsSnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-space-6)",
        width: "100%",
        maxWidth: 420,
      }}
    >
      {/* variant="default": разделение секций в карточке заказа */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <h3 style={{ margin: "0 0 var(--prime-sys-space-2)", fontSize: 16, fontWeight: 600 }}>
          Заказ №12345
        </h3>
        <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
          3 товара • Доставка завтра
        </p>
        <Divider.Root size="m" style={{ margin: "var(--prime-sys-space-3) 0" }} />
        <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
          Адрес: ул. Ленина, д. 10, кв. 5
        </p>
        <Divider.Root size="m" style={{ margin: "var(--prime-sys-space-3) 0" }}>
          Итого
        </Divider.Root>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>12 400 ₽</p>
      </div>

      {/* variant="line-spacing": компактный список с визуальными маркерами */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <h3 style={{ margin: "0 0 var(--prime-sys-space-3)", fontSize: 16, fontWeight: 600 }}>
          Уведомления
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-space-3)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" defaultChecked />
            Email-рассылка
          </label>
          <Divider.Root variant="line-spacing" size="m" />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" defaultChecked />
            Push-уведомления
          </label>
          <Divider.Root variant="line-spacing" size="m" />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <input type="checkbox" />
            SMS-оповещения
          </label>
        </div>
      </div>

      {/* variant="text": заголовки секций формы */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <Divider.Root variant="text" size="m">
          Личные данные
        </Divider.Root>
        <div
          style={{
            marginTop: "var(--prime-sys-space-3)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--prime-sys-space-2)",
          }}
        >
          <input
            type="text"
            placeholder="Имя"
            style={{
              padding: "8px 12px",
              border: "1px solid var(--prime-sys-color-border-default)",
              borderRadius: "var(--prime-sys-radius-m)",
              fontSize: 14,
            }}
          />
          <input
            type="email"
            placeholder="Email"
            style={{
              padding: "8px 12px",
              border: "1px solid var(--prime-sys-color-border-default)",
              borderRadius: "var(--prime-sys-radius-m)",
              fontSize: 14,
            }}
          />
        </div>
        <Divider.Root variant="text" size="m" style={{ marginTop: "var(--prime-sys-space-4)" }}>
          Безопасность
        </Divider.Root>
        <div style={{ marginTop: "var(--prime-sys-space-3)" }}>
          <input
            type="password"
            placeholder="Пароль"
            style={{
              padding: "8px 12px",
              border: "1px solid var(--prime-sys-color-border-default)",
              borderRadius: "var(--prime-sys-radius-m)",
              fontSize: 14,
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
