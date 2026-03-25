import { Folder } from "lucide-react";
import * as React from "react";

import { FileUpload } from "@/components/file-upload/FileUpload";
import { cx } from "@/internal/cx";

import styles from "./composition.module.css";

export default function FileUploadCompositionSnippet() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={styles.panel}>
      <div className={styles.body}>
        <header className={styles.header}>
          <h2 className={styles.title} id="fu-import-inline-title">
            Upload file
          </h2>
        </header>
        <FileUpload.Root
          inputRef={inputRef}
          appearance="solid"
          size="l"
          multiple
          className={styles.uploadRootMinHeight}
        >
          <FileUpload.DropBody>
            <FileUpload.Title tone="muted" className={styles.dropLeadTitle}>
              Drop files here,{" "}
              <FileUpload.BrowseLink type="button" onClick={() => inputRef.current?.click()}>
                browse files
              </FileUpload.BrowseLink>{" "}
              or import from:
            </FileUpload.Title>
            <FileUpload.ActionsRow>
              <FileUpload.Chip type="button" onClick={() => inputRef.current?.click()}>
                <span className={cx(styles.chipGlyph, styles.chipGlyphAway)}>
                  <Folder
                    size={20}
                    strokeWidth={1.75}
                    color="var(--prime-sys-color-status-away-foreground)"
                  />
                </span>
                <FileUpload.ChipLabel>My Device</FileUpload.ChipLabel>
              </FileUpload.Chip>
              <FileUpload.Chip type="button">
                <span className={cx(styles.chipGlyph, styles.chipGlyphPrimary)}>
                  <svg width={18} height={14} viewBox="0 0 18 15" fill="none" aria-hidden>
                    <title>Cloud storage A</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.5 0L0 2.64706L4.5 5.29412L0 7.94118L4.5 10.5882L9 7.94118L13.5 10.5882L18 7.94118L13.5 5.29412L18 2.64706L13.5 0L9 2.64706L4.5 0ZM9 2.64706L13.5 5.29412L9 7.94118L4.5 5.29412L9 2.64706Z"
                      fill="white"
                    />
                    <path d="M4.5 12.3529L9 9.70588L13.5 12.3529L9 15L4.5 12.3529Z" fill="white" />
                  </svg>
                </span>
                <FileUpload.ChipLabel>Cloud A</FileUpload.ChipLabel>
              </FileUpload.Chip>
              <FileUpload.Chip type="button">
                <span className={cx(styles.chipGlyph, styles.chipGlyphAccentSoft)}>
                  <svg width={20} height={20} viewBox="0 0 29 28" fill="none" aria-hidden>
                    <title>Cloud storage B</title>
                    <path
                      d="M14.5017 11.338L11.906 6.75723C11.9922 6.66948 12.0913 6.61193 12.1905 6.57324C11.4251 6.82516 11.0738 7.68471 11.0738 7.68471L6.33196 16.0509C6.26524 16.3132 6.2467 16.55 6.25504 16.7585H11.4306L14.5017 11.338Z"
                      fill="#34A853"
                    />
                    <path
                      d="M14.5015 11.338L17.5725 16.7585H22.7481C22.7564 16.55 22.7379 16.3132 22.6712 16.0509L17.9293 7.68471C17.9293 7.68471 17.5772 6.82516 16.8126 6.57324C16.9109 6.61193 17.0109 6.66948 17.0971 6.75723L14.5015 11.338Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M14.5014 11.3386L17.0971 6.75778C17.0109 6.67003 16.9108 6.61248 16.8126 6.57379C16.6995 6.537 16.5781 6.51246 16.4466 6.50586H16.3094H12.6934H12.5563C12.4256 6.51152 12.3033 6.53605 12.1903 6.57379C12.092 6.61248 11.9919 6.67003 11.9058 6.75778L14.5014 11.3386Z"
                      fill="#188038"
                    />
                    <path
                      d="M11.4314 16.7588L8.8654 21.2877C8.8654 21.2877 8.78014 21.2462 8.66431 21.1603C9.0285 21.4405 9.38249 21.5 9.38249 21.5H19.4603C20.0163 21.5 20.1321 21.2877 20.1321 21.2877C20.134 21.2867 20.1349 21.2858 20.1368 21.2849L17.5726 16.7588H11.4314Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M11.4314 16.7588H6.25586C6.28181 17.374 6.54869 17.7334 6.54869 17.7334L6.7433 18.0712C6.7572 18.091 6.76554 18.1024 6.76554 18.1024L7.18904 18.8459L8.13982 20.5008C8.16762 20.5678 8.20006 20.6291 8.23435 20.6876C8.24732 20.7074 8.25937 20.7291 8.27327 20.748C8.27697 20.7537 8.28068 20.7593 8.28439 20.765C8.40208 20.931 8.53367 21.0594 8.66526 21.1603C8.78109 21.2471 8.86635 21.2877 8.86635 21.2877L11.4314 16.7588Z"
                      fill="#1967D2"
                    />
                    <path
                      d="M17.5725 16.7588H22.7481C22.7221 17.374 22.4552 17.7334 22.4552 17.7334L22.2606 18.0712C22.2467 18.091 22.2384 18.1024 22.2384 18.1024L21.8149 18.8459L20.8641 20.5008C20.8363 20.5678 20.8039 20.6291 20.7696 20.6876C20.7566 20.7074 20.7446 20.7291 20.7307 20.748C20.727 20.7537 20.7233 20.7593 20.7196 20.765C20.6019 20.931 20.4703 21.0594 20.3387 21.1603C20.2228 21.2471 20.1376 21.2877 20.1376 21.2877L17.5725 16.7588Z"
                      fill="#EA4335"
                    />
                  </svg>
                </span>
                <FileUpload.ChipLabel>Cloud B</FileUpload.ChipLabel>
              </FileUpload.Chip>
            </FileUpload.ActionsRow>
          </FileUpload.DropBody>
        </FileUpload.Root>
      </div>
    </div>
  );
}
