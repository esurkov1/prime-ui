import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type * as React from "react";

import { FileUpload } from "@/components/file-upload/FileUpload";

import styles from "./states.module.css";

const fileNameRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--prime-sys-spacing-x2)",
  width: "100%",
};

const inlineStatusStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x1)",
  flexShrink: 0,
  fontSize: "var(--prime-sys-typography-support-2xs)",
  lineHeight: "var(--prime-sys-typography-body-lineHeight)",
};

const statusIconStyle: React.CSSProperties = {
  flexShrink: 0,
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
};

export default function FileUploadStatesSnippet() {
  return (
    <div className={styles.root}>
      <div className={styles.zones}>
        <div>
          <p className={styles.zoneLabel}>Обычная зона</p>
          <FileUpload.Root />
        </div>
        <div>
          <p className={styles.zoneLabel}>Отключённая зона</p>
          <FileUpload.Root disabled />
        </div>
      </div>

      <div>
        <p className={styles.zoneLabel}>Карточки файла (иконки статуса и прогресс)</p>
        <div className={styles.items}>
          <FileUpload.Item>
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="PDF" color="red" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName style={fileNameRowStyle}>
                  <span>my-cv.pdf</span>
                  <span style={inlineStatusStyle}>
                    <Loader2
                      aria-hidden
                      style={statusIconStyle}
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
                <FileUpload.ItemName style={fileNameRowStyle}>
                  <span>my-cv.pdf</span>
                  <span style={inlineStatusStyle}>
                    <CheckCircle2
                      aria-hidden
                      style={statusIconStyle}
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
                    <FileUpload.ItemName style={fileNameRowStyle}>
                      <span>my-cv.pdf</span>
                      <span style={inlineStatusStyle}>
                        <AlertCircle
                          aria-hidden
                          style={statusIconStyle}
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
