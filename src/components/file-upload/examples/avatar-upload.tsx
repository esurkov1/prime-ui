/** A round drop zone around an Avatar that accepts images and shows a preview; buttons open the same input via `inputRef`. Use it for profile photos. */
import { Avatar, Button, FileUpload, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function FileUploadAvatarUploadExample() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className={styles.avatarRow}>
      <FileUpload.Root
        inputRef={inputRef}
        accept="image/png,image/jpeg"
        variant="solid"
        className={styles.avatarZone}
        aria-label="Загрузить фото профиля"
        onFilesChange={([file]) => {
          if (file) setPreview(URL.createObjectURL(file));
        }}
      >
        <Avatar.Root size="2xl">
          {preview ? <Avatar.Image src={preview} alt="" /> : null}
          <Avatar.Fallback>АК</Avatar.Fallback>
        </Avatar.Root>
      </FileUpload.Root>
      <div className={styles.avatarText}>
        <div className={styles.avatarCopy}>
          <Typography.Root as="p" variant="title-s">
            Фото профиля
          </Typography.Root>
          <Typography.Root as="p" variant="body-s" tone="secondary">
            PNG или JPG, не меньше 400×400 px. Можно перетащить на аватар.
          </Typography.Root>
        </div>
        <div className={styles.avatarActions}>
          <Button.Root
            variant="soft"
            tone="neutral"
            size="s"
            onClick={() => inputRef.current?.click()}
          >
            {preview ? "Заменить" : "Загрузить"}
          </Button.Root>
          {preview ? (
            <Button.Root variant="ghost" tone="danger" size="s" onClick={() => setPreview(null)}>
              Удалить
            </Button.Root>
          ) : null}
        </div>
      </div>
    </div>
  );
}
