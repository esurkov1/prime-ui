import { Bold, Italic, Underline } from "lucide-react";
import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

/**
 * Editor toolbar: icon segments share one outline; active format uses `pressed`.
 * Meaning for assistive tech: `aria-label` on each icon-only `Item`.
 */
export default function EditorToolbarExample() {
  const [marks, setMarks] = React.useState({ bold: true, italic: false, underline: false });

  return (
    <ButtonGroup.Root aria-label="Text formatting" size="m">
      <ButtonGroup.Item
        aria-label="Bold"
        pressed={marks.bold}
        type="button"
        onClick={() => setMarks((m) => ({ ...m, bold: !m.bold }))}
      >
        <ButtonGroup.Icon>
          <Bold />
        </ButtonGroup.Icon>
      </ButtonGroup.Item>
      <ButtonGroup.Item
        aria-label="Italic"
        pressed={marks.italic}
        type="button"
        onClick={() => setMarks((m) => ({ ...m, italic: !m.italic }))}
      >
        <ButtonGroup.Icon>
          <Italic />
        </ButtonGroup.Icon>
      </ButtonGroup.Item>
      <ButtonGroup.Item
        aria-label="Underline"
        pressed={marks.underline}
        type="button"
        onClick={() => setMarks((m) => ({ ...m, underline: !m.underline }))}
      >
        <ButtonGroup.Icon>
          <Underline />
        </ButtonGroup.Icon>
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
