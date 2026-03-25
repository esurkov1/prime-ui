import { FileUpload } from "@/components/file-upload/FileUpload";

import styles from "./variants.module.css";

export default function FileUploadVariantsSnippet() {
  return (
    <div className={styles.root}>
      <div>
        <p className={styles.blockLabel}>
          Корень: <code>appearance</code> — пунктирная рамка по умолчанию и сплошная для встраивания
          в карточки.
        </p>
        <div className={styles.roots}>
          <FileUpload.Root size="m" appearance="dashed" />
          <FileUpload.Root size="m" appearance="solid" />
        </div>
      </div>
      <div>
        <p className={styles.blockLabel}>
          Карточка файла: <code>variant=&quot;default&quot;</code> и{" "}
          <code>variant=&quot;error&quot;</code> (рамка и фон для сбоя загрузки).
        </p>
        <div className={styles.items}>
          <FileUpload.Item variant="default">
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="PNG" color="blue" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName>screenshot.png</FileUpload.ItemName>
                <FileUpload.ItemMeta>
                  <span>120 KB</span>
                </FileUpload.ItemMeta>
              </FileUpload.ItemMain>
            </FileUpload.ItemRow>
          </FileUpload.Item>
          <FileUpload.Item variant="error">
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="PNG" color="blue" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName>screenshot.png</FileUpload.ItemName>
                <FileUpload.ItemMeta>
                  <span>Upload rejected</span>
                </FileUpload.ItemMeta>
              </FileUpload.ItemMain>
            </FileUpload.ItemRow>
          </FileUpload.Item>
        </div>
      </div>
    </div>
  );
}
