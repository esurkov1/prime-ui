import { Typography } from "@/components/typography/Typography";

import styles from "./snippets.module.css";

/** Текст занимает ширину родителя: в узкой колонке строки переносятся чаще; у корня включён `text-wrap: balance` в стилях кита. */
export default function TypographyFullWidthSnippet() {
  return (
    <div className={`examplePreviewBleed ${styles.fullWidthColumns}`}>
      <div className={styles.fullWidthNarrow}>
        <Typography.Root size="s" tone="muted">
          Узкая колонка
        </Typography.Root>
        <Typography.Root size="m">
          Длинное предложение в узком контейнере демонстрирует переносы и выравнивание без
          отдельного пропа ширины.
        </Typography.Root>
      </div>
      <div className={styles.fullWidthWide}>
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
