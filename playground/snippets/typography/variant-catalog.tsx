import { Divider } from "@/components/divider/Divider";
import { Typography } from "@/components/typography/Typography";

/** Каталог всех ролей `variant` из `typography.role` (`tokens/semantic.ts`). */
export default function TypographyVariantCatalogSnippet() {
  return (
    <div className="examplePreviewBleed typographyScaleList">
      <div className="typographyScaleRow">
        <Typography.Root variant="display" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>display</code> · medium · tight — крупный акцент, герой экрана
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="headline" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>headline</code> · medium · tight — заголовок раздела или промо
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-page" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-page</code> · medium · tight — заголовок страницы
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-section" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-section</code> · medium · tight — секция
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-subsection" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-subsection</code> · medium — подсекция
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-group" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>heading-group</code> · medium — группа внутри блока
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-large" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-large</code> · medium · tight — акцентный абзац или лейбл
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-default</code> · regular — основной текст
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-small">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-small</code> · regular — вторичный текст
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-compact" weight="medium" tracking="wide">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>body-compact</code> · medium · wide — плотная акцентная строка
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="caption">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>caption</code> · regular — подписи, пояснения
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="caption-micro">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          <code>caption-micro</code> · regular — минимальный кегль (метаданные, индексы)
        </Divider.Root>
      </div>
    </div>
  );
}
