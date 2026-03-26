import { Divider } from "@/components/divider/Divider";
import { Typography } from "@/components/typography/Typography";

/** У текста нет disabled, loading и ошибок ввода; ниже — единственная булева ось «режима» начертания: курсив. */
export default function TypographyStatesSnippet() {
  return (
    <div className="examplePreviewBleed typographyScaleList">
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" weight="medium">
          Заголовок карточки без курсива — обычный акцент.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          italic не задан (false)
        </Divider.Root>
      </div>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-default" weight="medium" italic>
          Тот же размер и вес с курсивом — цитата или название научной работы.
        </Typography.Root>
        <Divider.Root variant="text" align="start">
          italic — курсив через data-атрибут и токены
        </Divider.Root>
      </div>
    </div>
  );
}
