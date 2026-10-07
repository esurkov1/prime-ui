/** Every text role from `display-l` to `caption` and `code`, each labelled with its size, weight and purpose. Use to pick the role for a piece of text. */
import { Divider, Typography, type TypographyRole } from "prime-ui-kit";

import styles from "./examples.module.css";

const ROLES: { variant: TypographyRole; spec: string; use: string }[] = [
  { variant: "display-l", spec: "60/68 · 600", use: "герой экрана" },
  { variant: "display-m", spec: "48/56 · 600", use: "крупная метрика" },
  { variant: "display-s", spec: "36/44 · 600", use: "метрика, промо" },
  { variant: "heading-l", spec: "30/36 · 600", use: "крупный заголовок страницы" },
  { variant: "heading-m", spec: "24/32 · 600", use: "заголовок страницы" },
  { variant: "heading-s", spec: "20/28 · 600", use: "подзаголовок страницы" },
  { variant: "title-l", spec: "18/24 · 600", use: "крупный заголовок блока" },
  { variant: "title-m", spec: "16/24 · 600", use: "заголовок модалки, секции" },
  { variant: "title-s", spec: "14/20 · 600", use: "заголовок карточки, группы" },
  { variant: "body-l", spec: "16/24 · 400", use: "текст для чтения" },
  { variant: "body-m", spec: "14/20 · 400", use: "основной текст интерфейса" },
  { variant: "body-s", spec: "13/20 · 400", use: "вторичный текст, плотный UI" },
  { variant: "caption", spec: "12/16 · 400", use: "подсказки, мета, шапка таблицы" },
  { variant: "code", spec: "13/20 · mono", use: "код, идентификаторы" },
];

export default function TypographyVariantCatalogExample() {
  return (
    <div className={styles.scaleList}>
      {ROLES.map(({ variant, spec, use }) => (
        <div key={variant} className={styles.scaleRow}>
          <Typography.Root variant={variant}>
            Съешь же ещё этих мягких французских булок да выпей чаю
          </Typography.Root>
          <Divider align="start">
            <Typography.Root as="span" variant="code" tone="muted">
              {variant}
            </Typography.Root>{" "}
            · {spec} — {use}
          </Divider>
        </div>
      ))}
    </div>
  );
}
