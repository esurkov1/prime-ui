import * as React from "react";

import { Button } from "@/components/button/Button";
import { FileUpload } from "@/components/file-upload/FileUpload";

export default function FileUploadControlledSnippet() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className="previewStack">
      <FileUpload.Root
        multiple
        accept=".pdf,.png,image/png,application/pdf"
        onFilesChange={(next) => {
          setFiles(next);
        }}
      />
      {files.length > 0 ? (
        <div className="previewStack">
          <p className="previewCaption previewCaptionTopBase">Выбрано файлов: {files.length}</p>
          <ul className="previewCaption">
            {files.map((f) => (
              <li key={`${f.name}-${f.size}`}>{f.name}</li>
            ))}
          </ul>
          <Button.Root
            type="button"
            size="s"
            variant="neutral"
            mode="stroke"
            onClick={() => {
              setFiles([]);
            }}
          >
            Очистить список
          </Button.Root>
        </div>
      ) : null}
    </div>
  );
}
