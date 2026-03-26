import { Divider } from "@/components/divider/Divider";
import { Typography } from "@/components/typography/Typography";

/** Каталог `variant`: роли чтения от `display` до `caption` (маппинг в `tokens/semantic.ts` → `typography.role`). */
export default function TypographyVariantCatalogSnippet() {
  return (
    <div className="examplePreviewBleed typographyScaleList">
      <div className="typographyScaleRow">
        <Typography.Root variant="display" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          6xl · medium · tight — крупный акцент на лендинге или обложке
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="headline" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          5xl · medium · tight
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-page" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          4xl · medium · tight
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-section" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          3xl · medium · tight
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-subsection" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          2xl · medium · tracking по умолчанию
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="heading-group" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          xl · medium
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-large" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          l · medium · tight — подзаголовок или сильный лейбл
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          m · regular — основной абзац
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-small">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          s · regular — второстепенный текст
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-compact" weight="medium" tracking="wide">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          xs · medium · wide — мелкая акцентная строка
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="caption">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          2xs · regular — мелкий поясняющий текст
        </Divider.Root>
      </div>
    </div>
  );
}
