import { Divider } from "@/components/divider/Divider";
import { Icon } from "@/icons";

/** Разделители с иконками в реальном контексте: профиль пользователя, карточка продукта. */
export default function DividerCompositionSnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-space-5)",
        width: "100%",
        maxWidth: 420,
      }}
    >
      {/* Профиль пользователя */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--prime-sys-space-3)",
            marginBottom: "var(--prime-sys-space-3)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "var(--prime-sys-color-surface-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            ИП
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Иван Петров</p>
            <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
              Разработчик
            </p>
          </div>
        </div>

        <Divider.Root variant="text" size="m">
          <Icon name="field.email" size="s" />
          Контакты
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
            ivan.petrov@example.com
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
            +7 (999) 123-45-67
          </p>
        </div>

        <Divider.Root variant="text" size="m" style={{ marginTop: "var(--prime-sys-space-4)" }}>
          <Icon name="nav.home" size="s" />
          Местоположение
        </Divider.Root>
        <p
          style={{
            margin: "var(--prime-sys-space-3) 0 0",
            fontSize: 14,
            color: "var(--prime-sys-color-text-secondary)",
          }}
        >
          Москва, Россия
        </p>
      </div>

      {/* Карточка продукта */}
      <div
        style={{
          padding: "var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-l)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
        }}
      >
        <h3 style={{ margin: "0 0 var(--prime-sys-space-2)", fontSize: 18, fontWeight: 600 }}>
          Беспроводные наушники
        </h3>
        <p style={{ margin: 0, fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
          Премиальное качество звука
        </p>

        <Divider.Root size="m" style={{ margin: "var(--prime-sys-space-3) 0" }}>
          <Icon name="nav.layoutGrid" size="s" />
          Характеристики
        </Divider.Root>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-space-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span style={{ color: "var(--prime-sys-color-text-tertiary)" }}>Время работы:</span>
            <span style={{ fontWeight: 500 }}>24 часа</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span style={{ color: "var(--prime-sys-color-text-tertiary)" }}>Bluetooth:</span>
            <span style={{ fontWeight: 500 }}>5.0</span>
          </div>
        </div>

        <Divider.Root size="m" style={{ margin: "var(--prime-sys-space-3) 0" }}>
          Рейтинг
        </Divider.Root>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--prime-sys-space-2)" }}>
          <span style={{ fontSize: 20, fontWeight: 600 }}>4.8</span>
          <span style={{ fontSize: 14, color: "var(--prime-sys-color-text-secondary)" }}>
            (342 отзыва)
          </span>
        </div>
      </div>
    </div>
  );
}
