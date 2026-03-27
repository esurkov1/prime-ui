import { FileUpload } from "prime-ui-kit";

/**
 * Свой контент зоны и accept для изображений.
 * См. playground/snippets/file-upload/custom-children.tsx.
 */
export function FileUploadCustomChildrenExample() {
  return (
    <FileUpload.Root accept="image/*">
      <div
        style={{
          padding: "var(--prime-sys-spacing-x4)",
          fontSize: "var(--prime-sys-size-control-l-text)",
          color: "var(--prime-sys-color-content-secondary)",
        }}
      >
        Custom drop area — images only
      </div>
    </FileUpload.Root>
  );
}
