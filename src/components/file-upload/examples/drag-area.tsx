import { FileUpload, Icon } from "prime-ui-kit";
import * as React from "react";

/**
 * Кастомная зона: solid, текст с встроенной ссылкой «обзор» и программный open через inputRef.
 */
export function FileUploadDragAreaExample() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [lastCount, setLastCount] = React.useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-s)",
        maxWidth: 520,
      }}
    >
      <FileUpload.Root
        inputRef={inputRef}
        appearance="solid"
        size="l"
        multiple
        onFilesChange={(files) => {
          setLastCount(files.length);
        }}
      >
        <FileUpload.DropBody>
          <FileUpload.Icon>
            <Icon surface="none" name="action.upload" size="l" tone="subtle" />
          </FileUpload.Icon>
          <FileUpload.Title tone="muted">
            Перетащите файлы сюда или{" "}
            <FileUpload.BrowseLink type="button" onClick={() => inputRef.current?.click()}>
              выберите на диске
            </FileUpload.BrowseLink>
          </FileUpload.Title>
          <FileUpload.Hint>Любые типы, несколько файлов за раз</FileUpload.Hint>
        </FileUpload.DropBody>
      </FileUpload.Root>
      {lastCount > 0 ? (
        <p style={{ fontSize: "var(--prime-sys-typography-support-2xs)", margin: 0 }}>
          Последний выбор: {lastCount} файл(ов)
        </p>
      ) : null}
    </div>
  );
}
