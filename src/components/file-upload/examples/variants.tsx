/** `variant="dashed"` (default) vs `"solid"`; the fill follows the surface context. Use `solid` inside cards and modals where the dashed line is too loud. */
import { FileUpload, Icon } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function FileUploadVariantsExample() {
  return (
    <div className={styles.column}>
      <FileUpload.Root variant="dashed" size="s">
        <FileUpload.DropBody>
          <FileUpload.Icon>
            <Icon name="action.upload" size="s" tone="secondary" />
          </FileUpload.Icon>
          <FileUpload.Title>dashed — пунктир</FileUpload.Title>
        </FileUpload.DropBody>
      </FileUpload.Root>
      <FileUpload.Root variant="solid" size="s">
        <FileUpload.DropBody>
          <FileUpload.Icon>
            <Icon name="action.upload" size="s" tone="secondary" />
          </FileUpload.Icon>
          <FileUpload.Title>solid — только заливка</FileUpload.Title>
        </FileUpload.DropBody>
      </FileUpload.Root>
    </div>
  );
}
