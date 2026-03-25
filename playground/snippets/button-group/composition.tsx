import { Bold, ChevronDown, ClipboardList, Copy, Italic, Scissors, Underline } from "lucide-react";
import * as React from "react";

import { ButtonGroup } from "@/components/button-group/ButtonGroup";

/** `ButtonGroup.Icon` для выравнивания размера SVG; подпись смысла — `aria-label` на сегменте. */
export default function ButtonGroupCompositionSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="row">
        <ButtonGroup.Root aria-label="Формат текста" size="m">
          <ButtonGroup.Item
            aria-expanded={open}
            aria-haspopup="listbox"
            type="button"
            onClick={() => setOpen((v) => !v)}
          >
            Inter
            <ButtonGroup.Icon>
              <ChevronDown />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item aria-label="Жирный" type="button">
            <ButtonGroup.Icon>
              <Bold />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item aria-label="Курсив" type="button">
            <ButtonGroup.Icon>
              <Italic />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item aria-label="Подчёркивание" pressed type="button">
            <ButtonGroup.Icon>
              <Underline />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
        </ButtonGroup.Root>
      </div>

      <div className="row">
        <ButtonGroup.Root aria-label="Буфер обмена" size="s">
          <ButtonGroup.Item aria-label="Копировать" type="button">
            <ButtonGroup.Icon>
              <Copy />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item aria-label="Вырезать" type="button">
            <ButtonGroup.Icon>
              <Scissors />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
          <ButtonGroup.Item aria-label="Вставить" pressed type="button">
            <ButtonGroup.Icon>
              <ClipboardList />
            </ButtonGroup.Icon>
          </ButtonGroup.Item>
        </ButtonGroup.Root>
      </div>
    </>
  );
}
