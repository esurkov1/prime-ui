import { Divider } from "@/components/divider/Divider";

/** Вертикальные разделители в реальных UI-паттернах: тулбар, навигация, панель действий. */
export default function DividerOrientationSnippet() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-space-5)",
        width: "100%",
      }}
    >
      {/* Тулбар редактора */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "var(--prime-sys-space-2)",
          height: 40,
          padding: "0 var(--prime-sys-space-3)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-m)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
          width: "fit-content",
        }}
      >
        <button
          type="button"
          style={{
            alignSelf: "center",
            padding: "4px 12px",
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Жирный
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button
          type="button"
          style={{
            alignSelf: "center",
            padding: "4px 12px",
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Курсив
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button
          type="button"
          style={{
            alignSelf: "center",
            padding: "4px 12px",
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Ссылка
        </button>
      </div>

      {/* Панель действий таблицы */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "var(--prime-sys-space-3)",
          height: 44,
          padding: "0 var(--prime-sys-space-4)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-m)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
          width: "fit-content",
        }}
      >
        <button
          type="button"
          style={{
            alignSelf: "center",
            padding: 0,
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Фильтр
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button
          type="button"
          style={{
            alignSelf: "center",
            padding: 0,
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Сортировка
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button
          type="button"
          style={{
            alignSelf: "center",
            padding: 0,
            border: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Экспорт
        </button>
      </div>

      {/* Горизонтальная навигация */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "var(--prime-sys-space-2)",
          height: 36,
          padding: "0 var(--prime-sys-space-2)",
          border: "1px solid var(--prime-sys-color-border-subtle)",
          borderRadius: "var(--prime-sys-radius-m)",
          backgroundColor: "var(--prime-sys-color-surface-default)",
          width: "fit-content",
        }}
      >
        <a
          href="#overview"
          style={{
            alignSelf: "center",
            padding: "4px 12px",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--prime-sys-color-text-brand)",
            textDecoration: "none",
          }}
        >
          Обзор
        </a>
        <Divider.Root orientation="vertical" size="s" />
        <a
          href="#details"
          style={{
            alignSelf: "center",
            padding: "4px 12px",
            fontSize: 14,
            color: "var(--prime-sys-color-text-secondary)",
            textDecoration: "none",
          }}
        >
          Детали
        </a>
        <Divider.Root orientation="vertical" size="s" />
        <a
          href="#settings"
          style={{
            alignSelf: "center",
            padding: "4px 12px",
            fontSize: 14,
            color: "var(--prime-sys-color-text-secondary)",
            textDecoration: "none",
          }}
        >
          Настройки
        </a>
      </div>
    </div>
  );
}
