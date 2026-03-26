import { Button, FileUpload } from "prime-ui-kit";
import * as React from "react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1) : "file";
}

type FileEntry = { id: string; file: File };

/**
 * Контролируемый список: добавление через зону, удаление по строке и очистка всего списка.
 */
export function FileUploadControlledListExample() {
  const [entries, setEntries] = React.useState<FileEntry[]>([]);

  const removeById = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        maxWidth: 520,
      }}
    >
      <FileUpload.Root
        multiple
        accept="image/png,image/jpeg,.pdf,application/pdf"
        onFilesChange={(next) => {
          setEntries((prev) => [
            ...prev,
            ...next.map((file) => ({ id: crypto.randomUUID(), file })),
          ]);
        }}
      />

      {entries.length > 0 ? (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-spacing-s)" }}
          >
            {entries.map(({ id, file }) => (
              <FileUpload.Item key={id}>
                <FileUpload.ItemRow>
                  <FileUpload.FormatBadge
                    format={extensionOf(file.name)}
                    color={file.type.startsWith("image/") ? "blue" : "gray"}
                  />
                  <FileUpload.ItemMain>
                    <FileUpload.ItemTextGroup>
                      <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
                      <FileUpload.ItemMeta>
                        <span>{formatBytes(file.size)}</span>
                      </FileUpload.ItemMeta>
                    </FileUpload.ItemTextGroup>
                  </FileUpload.ItemMain>
                  <FileUpload.ItemActions>
                    <Button.Root
                      type="button"
                      size="s"
                      variant="neutral"
                      mode="stroke"
                      onClick={() => {
                        removeById(id);
                      }}
                    >
                      Удалить
                    </Button.Root>
                  </FileUpload.ItemActions>
                </FileUpload.ItemRow>
              </FileUpload.Item>
            ))}
          </div>
          <Button.Root
            type="button"
            size="s"
            variant="neutral"
            mode="stroke"
            onClick={() => {
              setEntries([]);
            }}
          >
            Очистить всё
          </Button.Root>
        </>
      ) : null}
    </div>
  );
}
