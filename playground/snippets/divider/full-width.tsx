import { Divider } from "@/components/divider/Divider";

/** Full-width разделители в реальных сценариях: карточка статьи, виджет уведомлений. */
export default function DividerFullWidthSnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-space-5)",
        width: "100%",
      }}
    >
      {/* Карточка статьи */}
      <article
        style={{
          maxWidth: 360,
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <h2 style={{ margin: "0 0 var(--prime-sys-space-2)", fontSize: 18, fontWeight: 600 }}>
          Новые возможности в версии 2.0
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "var(--prime-sys-color-text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Мы добавили поддержку темной темы, улучшили производительность и исправили множество
          ошибок.
        </p>
        <Divider.Root size="m" style={{ margin: "var(--prime-sys-space-3) 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--prime-sys-color-text-tertiary)" }}>
            Обновлено сегодня
          </span>
          <span style={{ fontSize: 13, color: "var(--prime-sys-color-text-tertiary)" }}>
            5 мин чтения
          </span>
        </div>
      </article>

      {/* Виджет уведомлений */}
      <div
        style={{
          maxWidth: 320,
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "var(--prime-sys-space-3) var(--prime-sys-space-4)" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Уведомления</h3>
        </div>
        <Divider.Root size="s" />
        <div style={{ padding: "var(--prime-sys-space-3) var(--prime-sys-space-4)" }}>
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500 }}>Новый комментарий</p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--prime-sys-color-text-secondary)" }}>
            Иван ответил на ваш вопрос
          </p>
        </div>
        <Divider.Root size="s" />
        <div style={{ padding: "var(--prime-sys-space-3) var(--prime-sys-space-4)" }}>
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500 }}>Обновление системы</p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--prime-sys-color-text-secondary)" }}>
            Доступна новая версия 2.1.0
          </p>
        </div>
        <Divider.Root size="s" />
        <div style={{ padding: "var(--prime-sys-space-3) var(--prime-sys-space-4)" }}>
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500 }}>Напоминание</p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--prime-sys-color-text-secondary)" }}>
            Встреча через 30 минут
          </p>
        </div>
      </div>

      {/* Список транзакций */}
      <div
        style={{
          maxWidth: 400,
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <div style={{ padding: "var(--prime-sys-space-4)" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>История операций</h3>
        </div>
        <Divider.Root size="m" />
        <div style={{ padding: "var(--prime-sys-space-3) var(--prime-sys-space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Пополнение счета</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--prime-sys-color-text-success)",
              }}
            >
              +5 000 ₽
            </span>
          </div>
          <span style={{ fontSize: 13, color: "var(--prime-sys-color-text-tertiary)" }}>
            25 марта, 14:30
          </span>
        </div>
        <Divider.Root size="s" />
        <div style={{ padding: "var(--prime-sys-space-3) var(--prime-sys-space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Оплата заказа</span>
            <span
              style={{ fontSize: 14, fontWeight: 600, color: "var(--prime-sys-color-text-error)" }}
            >
              −1 200 ₽
            </span>
          </div>
          <span style={{ fontSize: 13, color: "var(--prime-sys-color-text-tertiary)" }}>
            24 марта, 18:45
          </span>
        </div>
        <Divider.Root size="s" />
        <div style={{ padding: "var(--prime-sys-space-3) var(--prime-sys-space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Возврат средств</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--prime-sys-color-text-success)",
              }}
            >
              +800 ₽
            </span>
          </div>
          <span style={{ fontSize: 13, color: "var(--prime-sys-color-text-tertiary)" }}>
            23 марта, 10:15
          </span>
        </div>
      </div>
    </div>
  );
}
