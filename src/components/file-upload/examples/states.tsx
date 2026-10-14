/** A default zone, a disabled one whose files are read-only and an invalid one without a message — `disabled`, `invalid`. */
import { FileUpload, type FileUploadFile } from "prime-ui-kit";

/** The zone names the formats the order takes. */
const ZONE_LABELS = { description: "PDF или PNG до 20 МБ" };

const ACT: readonly FileUploadFile[] = [
  { id: "act", name: "Акт сверки.pdf", size: 310_000, type: "application/pdf" },
];

export default function FileUploadStatesExample() {
  return (
    <div>
      <FileUpload.Root label="default" labels={ZONE_LABELS} />
      <FileUpload.Root
        label="disabled"
        disabled
        labels={ZONE_LABELS}
        defaultValue={ACT}
        hint="Заказ закрыт, документы только для просмотра"
      />
      <FileUpload.Root label="invalid" invalid labels={ZONE_LABELS} />
    </div>
  );
}
