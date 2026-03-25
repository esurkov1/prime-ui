import { Typography } from "@/components/typography/Typography";

/** Проп `as`: `p` и `div` — блочные обёртки; `span` — фрагмент внутри строки без разрыва абзаца. Заголовки страницы оформляйте нативными `h1`–`h6`. */
export default function TypographyAsPropSnippet() {
  return (
    <div className="examplePreviewBleed typographyScaleList">
      <Typography.Root as="p" size="m">
        as=&quot;p&quot; — отдельный абзац с нулевыми внешними отступами по умолчанию у компонента.
      </Typography.Root>
      <Typography.Root as="div" size="m">
        as=&quot;div&quot; — блочный контейнер, если нужна обёртка без семантики абзаца (например
        внутри карточки).
      </Typography.Root>
      <Typography.Root as="p" size="m">
        В одной строке можно вставить{" "}
        <Typography.Root as="span" size="m" weight="semibold">
          span с акцентом
        </Typography.Root>{" "}
        без нового абзаца.
      </Typography.Root>
    </div>
  );
}
