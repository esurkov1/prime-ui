import { Divider } from "@/components/divider/Divider";

/** Выравнивание и декоративные линии в реальных сценариях: временная шкала, форма входа, макет с сеткой. */
export default function DividerFeaturesSnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-space-6)",
        width: "100%",
        maxWidth: 480,
      }}
    >
      {/* Временная шкала с align="start" */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <h3 style={{ margin: "0 0 var(--prime-sys-space-3)", fontSize: 16, fontWeight: 600 }}>
          История изменений
        </h3>
        <Divider.Root size="m" align="start">
          Сегодня
        </Divider.Root>
        <div
          style={{
            marginTop: "var(--prime-sys-space-3)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--prime-sys-space-2)",
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
            14:30 — Обновлен статус заказа
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
            12:15 — Добавлен новый товар
          </p>
        </div>
        <Divider.Root size="m" align="start" style={{ marginTop: "var(--prime-sys-space-3)" }}>
          Вчера
        </Divider.Root>
        <div style={{ marginTop: "var(--prime-sys-space-3)" }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
            18:45 — Создан новый заказ
          </p>
        </div>
      </div>

      {/* Форма входа с align="center" и текстом "или" */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <h3 style={{ margin: "0 0 var(--prime-sys-space-3)", fontSize: 16, fontWeight: 600 }}>
          Вход в систему
        </h3>
        <button
          type="button"
          style={{
            width: "100%",
            padding: "10px 16px",
            border: "1px solid var(--prime-sys-color-border-default)",
            borderRadius: "var(--prime-sys-radius-m)",
            backgroundColor: "var(--prime-sys-color-surface-default)",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Войти через Google
        </button>
        <Divider.Root size="m" align="center" style={{ margin: "var(--prime-sys-space-3) 0" }}>
          или
        </Divider.Root>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-space-2)" }}>
          <input
            type="email"
            placeholder="Email"
            style={{
              padding: "10px 12px",
              border: "1px solid var(--prime-sys-color-border-default)",
              borderRadius: "var(--prime-sys-radius-m)",
              fontSize: 14,
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            style={{
              padding: "10px 12px",
              border: "1px solid var(--prime-sys-color-border-default)",
              borderRadius: "var(--prime-sys-radius-m)",
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Макет с декоративными линиями (role="presentation") */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <h3 style={{ margin: "0 0 var(--prime-sys-space-3)", fontSize: 16, fontWeight: 600 }}>
          Статистика
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--prime-sys-space-4)",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 13,
                color: "var(--prime-sys-color-text-tertiary)",
              }}
            >
              Просмотры
            </p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>1,234</p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 13,
                color: "var(--prime-sys-color-text-tertiary)",
              }}
            >
              Клики
            </p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>567</p>
          </div>
        </div>
        <Divider.Root
          size="m"
          role="presentation"
          aria-hidden
          style={{ margin: "var(--prime-sys-space-3) 0" }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--prime-sys-space-4)",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 13,
                color: "var(--prime-sys-color-text-tertiary)",
              }}
            >
              Конверсия
            </p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>12.5%</p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 13,
                color: "var(--prime-sys-color-text-tertiary)",
              }}
            >
              Доход
            </p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>45,000 ₽</p>
          </div>
        </div>
      </div>
    </div>
  );
}
