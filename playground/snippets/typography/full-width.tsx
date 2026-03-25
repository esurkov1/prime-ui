import { Typography } from "@/components/typography/Typography";

/** Текст занимает ширину родителя: в узкой колонке строки переносятся чаще; у корня включён `text-wrap: balance` в стилях кита. */
export default function TypographyFullWidthSnippet() {
  return (
    <div
      className="examplePreviewBleed"
      style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}
    >
      <div style={{ flex: "1 1 200px", minWidth: 0, maxWidth: "280px" }}>
        <Typography.Root size="s" tone="muted">
          Узкая колонка
        </Typography.Root>
        <Typography.Root size="m">
          Длинное предложение в узком контейнере демонстрирует переносы и выравнивание без
          отдельного пропа ширины.
        </Typography.Root>
      </div>
      <div style={{ flex: "2 1 320px", minWidth: 0 }}>
        <Typography.Root size="s" tone="muted">
          Широкая колонка
        </Typography.Root>
        <Typography.Root size="m">
          Тот же размер и стиль в более широком блоке: меньше переносов, читаемость остаётся за счёт
          связки кегля и межстрочного интервала из токенов для `size="m"`.
        </Typography.Root>
      </div>
    </div>
  );
}
