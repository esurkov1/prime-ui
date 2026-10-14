/** How files are added: the dashed drop zone, the zone with only its fill for cards and modals, the compact picker button and the add tile that starts an empty set of tiles — `variant`, `trigger`. */
import { FileUpload } from "prime-ui-kit";

export default function FileUploadVariantsExample() {
  return (
    <div>
      <div>
        <FileUpload.Root label="dashed" variant="dashed" />
      </div>
      <div>
        <FileUpload.Root label="solid" variant="solid" />
      </div>
      <div>
        <FileUpload.Root label="button" trigger="button" />
      </div>
      <div>
        <FileUpload.Root label="tile" trigger="tile" layout="grid" multiple />
      </div>
    </div>
  );
}
