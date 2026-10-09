/** Every tier of the zone and of its file rows: padding, icon, button, text and the format badge follow it — `size`. */
import { FileUpload, type FileUploadFile } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

const CONTRACT: readonly FileUploadFile[] = [
  { id: "contract", name: "Договор поставки.pdf", size: 240_000, type: "application/pdf" },
];

export default function FileUploadSizesExample() {
  return (
    <div className={styles.column}>
      {SIZES.map((size) => (
        <FileUpload.Root
          key={size}
          size={size}
          label={size}
          defaultValue={CONTRACT}
          labels={{ title: "Перетащите файл", description: "" }}
        />
      ))}
    </div>
  );
}
