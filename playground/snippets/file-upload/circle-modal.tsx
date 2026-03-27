import * as React from "react";

import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import { FileUpload } from "@/components/file-upload/FileUpload";
import { Icon } from "@/icons";

import styles from "./circle-modal.module.css";

export default function FileUploadCircleModalSnippet() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={styles.panel}>
      <div className={styles.body}>
        <div className={styles.headRow}>
          <h2 className={styles.title} id="fu-circle-inline-title">
            Add profile image
          </h2>
        </div>
        <div className={styles.stack}>
          <div className={styles.circleWrap}>
            <FileUpload.Root
              inputRef={inputRef}
              accept="image/*"
              appearance="solid"
              size="l"
              className={styles.circleZone}
            >
              <FileUpload.DropBody className={styles.dropBody}>
                <FileUpload.Icon>
                  <Icon name="action.upload" size="l" tone="subtle" />
                </FileUpload.Icon>
                <FileUpload.Title tone="muted" className={styles.dropTitle}>
                  Drag and drop your images here
                </FileUpload.Title>
              </FileUpload.DropBody>
            </FileUpload.Root>
          </div>
          <Divider.Root variant="text" align="center">
            or
          </Divider.Root>
          <Button.Root variant="neutral" mode="lighter" onClick={() => inputRef.current?.click()}>
            Upload a photo
          </Button.Root>
        </div>
      </div>
      <footer className={styles.footer}>
        <Button.Root variant="neutral" mode="stroke" className={styles.footerBtn}>
          Cancel
        </Button.Root>
        <Button.Root variant="primary" className={styles.footerBtn}>
          Apply changes
        </Button.Root>
      </footer>
    </div>
  );
}
