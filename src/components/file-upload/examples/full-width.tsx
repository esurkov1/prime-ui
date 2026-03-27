import { FileUpload } from "prime-ui-kit";

/**
 * Зона на всю ширину колонки: у Root уже width 100%.
 * См. playground/snippets/file-upload/full-width.tsx.
 */
export function FileUploadFullWidthExample() {
  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "40rem",
        padding: "var(--prime-sys-spacing-x4)",
        borderRadius: "var(--prime-sys-shape-radius-l)",
        border: "1px dashed var(--prime-sys-color-border-subtle)",
        background: "var(--prime-sys-color-surface-default)",
      }}
    >
      <p
        style={{
          margin: "0 0 var(--prime-sys-spacing-x3)",
          fontSize: "var(--prime-sys-size-control-s-supportText)",
          color: "var(--prime-sys-color-content-secondary)",
        }}
      >
        Родитель на всю колонку: зона тянется вместе с формой или панелью.
      </p>
      <FileUpload.Root appearance="solid" />
    </div>
  );
}
