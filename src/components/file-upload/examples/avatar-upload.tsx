import { Avatar, FileUpload } from "prime-ui-kit";
import * as React from "react";

/**
 * Аватар: одно фото, превью через Avatar и object URL.
 * В проде не забывайте вызывать URL.revokeObjectURL при смене/сбросе файла.
 */
export function FileUploadAvatarUploadExample() {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-l)",
        maxWidth: 320,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--prime-sys-spacing-m)" }}>
        <Avatar.Root size="xl">
          {previewUrl ? <Avatar.Image src={previewUrl} alt="Предпросмотр аватара" /> : null}
          <Avatar.Fallback>U</Avatar.Fallback>
        </Avatar.Root>
        <FileUpload.Root
          accept="image/jpeg,image/png,image/webp"
          onFilesChange={(files) => {
            const file = files[0];
            setPreviewUrl((prev) => {
              if (prev) {
                URL.revokeObjectURL(prev);
              }
              return file ? URL.createObjectURL(file) : null;
            });
          }}
        >
          <FileUpload.DropBody>
            <FileUpload.Title>Загрузить фото</FileUpload.Title>
            <FileUpload.Hint>PNG или JPEG, до 5 МБ</FileUpload.Hint>
            <FileUpload.BrowseLabel>Нажмите или перетащите файл</FileUpload.BrowseLabel>
          </FileUpload.DropBody>
        </FileUpload.Root>
      </div>
    </div>
  );
}
