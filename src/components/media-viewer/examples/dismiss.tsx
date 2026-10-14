/** Contract scans read closely: a stray swipe or click past the page never closes them, only Escape and the close button, and the small print zooms up to eight times — `closeOnOutsideClick`, `maxZoom`. */
import { Button, Icon, MediaViewer, type MediaViewerItem } from "prime-ui-kit";
import * as React from "react";

const page = (n: number) => `https://picsum.photos/seed/contract-page-${n}/1240/1754`;

const PAGES: MediaViewerItem[] = [1, 2, 3].map((n) => ({
  src: page(n),
  width: 1240,
  height: 1754,
  alt: `Договор поставки № 52/24, страница ${n}`,
}));

/** The small print of a scan needs more than the default fourfold zoom. */
const SMALL_PRINT_ZOOM = 8;

export default function MediaViewerDismissExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        <Button.Icon>
          <Icon name="object.document" />
        </Button.Icon>
        Проверить сканы договора
      </Button.Root>
      <MediaViewer
        items={PAGES}
        open={open}
        onOpenChange={setOpen}
        closeOnOutsideClick={false}
        maxZoom={SMALL_PRINT_ZOOM}
        aria-label="Сканы договора № 52/24"
      />
    </>
  );
}
