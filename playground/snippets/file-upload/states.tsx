import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { FileUpload } from "@/components/file-upload/FileUpload";
import uploadStyles from "@/components/file-upload/FileUpload.module.css";
import { cx } from "@/internal/cx";

import styles from "./states.module.css";

export default function FileUploadStatesSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.zones}>
        <div>
          <p className={styles.zoneLabel}>Обычная зона</p>
          <FileUpload.Root size="m" />
        </div>
        <div>
          <p className={styles.zoneLabel}>Отключённая зона</p>
          <FileUpload.Root size="m" disabled />
        </div>
      </div>

      <div>
        <p className={styles.zoneLabel}>Карточки файла (иконки статуса и прогресс)</p>
        <div className={styles.items}>
          <FileUpload.Item>
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="PDF" color="red" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName className={uploadStyles.itemNameRow}>
                  <span>my-cv.pdf</span>
                  <span className={uploadStyles.itemInlineStatus}>
                    <Loader2
                      aria-hidden
                      className={cx(uploadStyles.itemStatusIcon, uploadStyles.statusIconSpin)}
                      strokeWidth={2}
                      color="var(--prime-sys-color-action-primaryBackground)"
                    />
                    <strong>Uploading…</strong>
                  </span>
                </FileUpload.ItemName>
                <FileUpload.ItemMeta>
                  <span>0 KB of 120 KB</span>
                </FileUpload.ItemMeta>
              </FileUpload.ItemMain>
            </FileUpload.ItemRow>
            <FileUpload.ItemProgress value={10} />
          </FileUpload.Item>

          <FileUpload.Item>
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="PDF" color="red" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName className={uploadStyles.itemNameRow}>
                  <span>my-cv.pdf</span>
                  <span className={uploadStyles.itemInlineStatus}>
                    <CheckCircle2
                      aria-hidden
                      className={uploadStyles.itemStatusIcon}
                      strokeWidth={2}
                      color="var(--prime-sys-color-status-success-backgroundEmphasis)"
                    />
                    <strong>Completed</strong>
                  </span>
                </FileUpload.ItemName>
                <FileUpload.ItemMeta>
                  <span>0 KB of 120 KB</span>
                </FileUpload.ItemMeta>
              </FileUpload.ItemMain>
            </FileUpload.ItemRow>
          </FileUpload.Item>

          <FileUpload.Item variant="error">
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="PDF" color="red" />
              <FileUpload.ItemMain>
                <FileUpload.ItemStack>
                  <FileUpload.ItemTextGroup>
                    <FileUpload.ItemName className={uploadStyles.itemNameRow}>
                      <span>my-cv.pdf</span>
                      <span className={uploadStyles.itemInlineStatus}>
                        <AlertCircle
                          aria-hidden
                          className={uploadStyles.itemStatusIcon}
                          strokeWidth={2}
                          color="var(--prime-sys-color-status-error-backgroundEmphasis)"
                        />
                        <strong>Failed</strong>
                      </span>
                    </FileUpload.ItemName>
                    <FileUpload.ItemMeta>
                      <span>0 KB of 120 KB</span>
                    </FileUpload.ItemMeta>
                  </FileUpload.ItemTextGroup>
                  <FileUpload.ItemTryAgain type="button">Try again</FileUpload.ItemTryAgain>
                </FileUpload.ItemStack>
              </FileUpload.ItemMain>
            </FileUpload.ItemRow>
          </FileUpload.Item>
        </div>
      </div>
    </div>
  );
}
