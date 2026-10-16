/** A default zone, a disabled one whose files are read-only and an invalid one without a message — `disabled`, `invalid`. */
import { FileUpload, type FileUploadFile } from "prime-ui-kit";

/** The hint names the formats the order takes. */
const HINT = "PDF или PNG до 20 МБ";

const ACT: readonly FileUploadFile[] = [
  { id: "act", name: "Акт сверки.pdf", size: 310_000, type: "application/pdf" },
];

export default function FileUploadStatesExample() {
  return (
    <div>
      <FileUpload.Root label="default" hint={HINT} />
      <FileUpload.Root
        label="disabled"
        disabled
        defaultValue={ACT}
        hint="Заказ закрыт, документы только для просмотра"
      />
      <FileUpload.Root label="invalid" invalid hint={HINT} />
    </div>
  );
}
