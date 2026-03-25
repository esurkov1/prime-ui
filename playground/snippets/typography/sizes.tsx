import { Divider } from "@/components/divider/Divider";
import { Typography } from "@/components/typography/Typography";

/** Все шаги `size`: от `6xl` до `2xs`. Подписи у разделителей — подсказка по применению, не замена семантических заголовков страницы. */
export default function TypographySizesSnippet() {
  return (
    <div className="examplePreviewBleed typographyScaleList">
      <div className="typographyScaleRow">
        <Typography.Root size="6xl" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          6xl · medium · tight — крупный акцент на лендинге или обложке
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="5xl" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          5xl · medium · tight
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="4xl" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          4xl · medium · tight
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="3xl" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          3xl · medium · tight
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="2xl" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          2xl · medium · tracking по умолчанию
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="xl" weight="medium">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          xl · medium
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="l" weight="medium" tracking="tight">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          l · medium · tight — подзаголовок или сильный лейбл
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="m">The quick brown fox jumps over the lazy dog.</Typography.Root>
        <Divider.Root variant="text" align="start">
          m · regular — основной абзац
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="s">The quick brown fox jumps over the lazy dog.</Typography.Root>
        <Divider.Root variant="text" align="start">
          s · regular — второстепенный текст
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="xs" weight="medium" tracking="wide">
          The quick brown fox jumps over the lazy dog.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          xs · medium · wide — мелкая акцентная строка
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root size="2xs">The quick brown fox jumps over the lazy dog.</Typography.Root>
        <Divider.Root variant="text" align="start">
          2xs · regular — мелкий поясняющий текст
        </Divider.Root>
      </div>
    </div>
  );
}
