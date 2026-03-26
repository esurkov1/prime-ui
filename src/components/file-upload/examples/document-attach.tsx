import { FileUpload } from "prime-ui-kit";
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

/**
 * Вложения к сообщению: несколько файлов, список в виде Item.
 */
export function FileUploadDocumentAttachExample() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        maxWidth: 480,
      }}
    >
      <FileUpload.Root
        multiple
        accept=".pdf,.doc,.docx,application/pdf"
        onFilesChange={(next) => {
          setFiles((prev) => [...prev, ...next]);
        }}
      >
        <FileUpload.DropBody>
          <FileUpload.Title>Прикрепить документы</FileUpload.Title>
          <FileUpload.Hint>PDF, DOC или DOCX</FileUpload.Hint>
        </FileUpload.DropBody>
      </FileUpload.Root>

      {files.length > 0 ? (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-spacing-s)" }}
        >
          {files.map((file) => (
            <FileUpload.Item key={`${file.name}-${file.size}-${file.lastModified}`}>
              <FileUpload.ItemRow>
                <FileUpload.FormatBadge format={extensionOf(file.name)} color="red" />
                <FileUpload.ItemMain>
                  <FileUpload.ItemTextGroup>
                    <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
                    <FileUpload.ItemMeta>
                      <span>{formatBytes(file.size)}</span>
                    </FileUpload.ItemMeta>
                  </FileUpload.ItemTextGroup>
                </FileUpload.ItemMain>
              </FileUpload.ItemRow>
            </FileUpload.Item>
          ))}
        </div>
      ) : null}
    </div>
  );
}
