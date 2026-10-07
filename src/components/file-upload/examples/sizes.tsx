/** Every size of the zone and of a file row: padding, icon, button and text follow the tier — `size`. */
import { FileUpload } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function FileUploadSizesExample() {
  return (
    <div className={styles.column}>
      {SIZES.map((size) => (
        <div key={size} className={styles.sizeRow}>
          <FileUpload.Root
            size={size}
            label={size}
            labels={{ title: "Перетащите файл", description: "" }}
          />
          <FileUpload.Item size={size}>
            <FileUpload.FormatBadge format="pdf" color="red" />
            <FileUpload.ItemName>Договор поставки.pdf</FileUpload.ItemName>
            <FileUpload.ItemDescription>240 КБ</FileUpload.ItemDescription>
          </FileUpload.Item>
        </div>
      ))}
    </div>
  );
}
