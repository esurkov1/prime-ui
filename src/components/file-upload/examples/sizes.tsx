/** Drop zone and file row on every size: padding, icon circle, browse button and row typography follow the tier. Match the size of the surrounding form. */
import { FileUpload, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function FileUploadSizesExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.sizeZones}>
        {SIZES.map((size) => (
          <div key={size} className={styles.sizeCell}>
            <FileUpload.Root size={size}>
              <FileUpload.DropBody>
                <FileUpload.Icon>
                  <Icon name="action.upload" size={size} tone="secondary" />
                </FileUpload.Icon>
                <FileUpload.Title>Перетащите файл</FileUpload.Title>
                <FileUpload.BrowseLabel>Выбрать</FileUpload.BrowseLabel>
              </FileUpload.DropBody>
            </FileUpload.Root>
            <Typography.Root as="span" variant="caption" tone="muted" className={styles.caption}>
              {size}
            </Typography.Root>
          </div>
        ))}
      </div>
      <div className={styles.column}>
        {SIZES.map((size) => (
          <FileUpload.Item key={size} size={size}>
            <FileUpload.ItemRow>
              <FileUpload.FormatBadge format="pdf" color="red" />
              <FileUpload.ItemMain>
                <FileUpload.ItemName>Договор поставки.pdf</FileUpload.ItemName>
                <FileUpload.ItemMeta>
                  <span>240 КБ</span>
                  <FileUpload.ItemMetaSep />
                  <span>size=&quot;{size}&quot;</span>
                </FileUpload.ItemMeta>
              </FileUpload.ItemMain>
            </FileUpload.ItemRow>
          </FileUpload.Item>
        ))}
      </div>
    </div>
  );
}
