/** The parent opens a single scan from a link in the text: no counter and no arrows for one item — `open`, `onOpenChange`. */
import { LinkButton, MediaViewer, type MediaViewerItem, Typography } from "prime-ui-kit";
import * as React from "react";

const SCAN: MediaViewerItem[] = [
  {
    src: "https://picsum.photos/seed/invoice-1042/1240/1754",
    width: 1240,
    height: 1754,
    alt: "Счёт № 1042 от 3 октября",
  },
];

export default function MediaViewerControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Typography variant="body-m" tone="secondary">
        Счёт № 1042 оплачен 4 октября.{" "}
        <LinkButton asChild>
          <button type="button" onClick={() => setOpen(true)}>
            Посмотреть скан
          </button>
        </LinkButton>
      </Typography>
      <MediaViewer items={SCAN} open={open} onOpenChange={setOpen} />
    </>
  );
}
