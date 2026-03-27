import { Divider, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Каталог всех ролей `variant` из `typography.role` — зеркало `playground/snippets/typography/variant-catalog.tsx`. */
export default function TypographyExampleVariantCatalog() {
  return (
    <div className={styles.typographyScaleList}>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="display" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>display</code> · medium · tight — MD3 Display Large, герой экрана
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="headline" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>headline</code> · medium · tight — MD3 Headline Large, промо/лид
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="heading-page" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-page</code> · medium · tight — MD3 Headline Medium, заголовок страницы
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="heading-section" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-section</code> · medium · tight — MD3 Headline Small, секция
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="heading-subsection" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-subsection</code> · medium — MD3 Title Large, подсекция
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="heading-group" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-group</code> · medium — MD3 Title Small, подпись группы
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-large" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-large</code> · medium · tight — MD3 Body Large
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-default">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-default</code> · regular — MD3 Body Medium, основной текст
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-small">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-small</code> · regular — MD3 Body Small
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="body-compact" weight="medium" tracking="wide">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-compact</code> · medium · wide — MD3 Label Large, плотная строка (14px)
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="caption">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>caption</code> · regular — MD3 Label Medium
        </Divider.Root>
      </div>
      <div className={styles.typographyScaleRow}>
        <Typography.Root variant="caption-micro">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>caption-micro</code> · regular — MD3 Label Small (~11px)
        </Divider.Root>
      </div>
    </div>
  );
}
