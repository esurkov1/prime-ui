import { Divider } from "@/components/divider/Divider";
import { Typography } from "@/components/typography/Typography";

const line = "Один размер `m`, разные оси оформления: `weight`, `tracking` и `tone`.";

/** Начертание, трекинг и tone на фиксированном `variant="body-default"`. */
export default function TypographyVariantsSnippet() {
  return (
    <div className="examplePreviewBleed typographyScaleList">
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" weight="regular">
          {line} (regular)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          weight regular
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" weight="medium">
          {line} (medium)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          weight medium
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" weight="semibold">
          {line} (semibold)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          weight semibold
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" tracking="tighter">
          {line} (tracking tighter)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          tracking tighter
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" tracking="wide">
          {line} (tracking wide)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          tracking wide
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" tone="muted">
          {line} (tone muted)
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          tone muted — вторичный цвет текста
        </Divider.Root>
      </div>
    </div>
  );
}
