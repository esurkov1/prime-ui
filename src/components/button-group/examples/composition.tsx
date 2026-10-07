/** Editor toolbar: history, independent format toggles, one-of-three alignment and a primary Button of the same size. Use for formatting toolbars; icon-only segments need `aria-label`. */
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import { Button, ButtonGroup } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Align = "left" | "center" | "right";

export default function ButtonGroupCompositionExample() {
  const [marks, setMarks] = React.useState({ bold: true, italic: false, underline: false });
  const [align, setAlign] = React.useState<Align>("left");
  const toggle = (mark: keyof typeof marks) => setMarks((m) => ({ ...m, [mark]: !m[mark] }));

  return (
    <div role="toolbar" aria-label="Форматирование" className={styles.toolbar}>
      <ButtonGroup.Root aria-label="История">
        <ButtonGroup.Item aria-label="Отменить">
          <ButtonGroup.Icon>
            <Undo2 />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
        <ButtonGroup.Item aria-label="Повторить" disabled>
          <ButtonGroup.Icon>
            <Redo2 />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
      </ButtonGroup.Root>

      <ButtonGroup.Root aria-label="Начертание">
        <ButtonGroup.Item aria-label="Жирный" pressed={marks.bold} onClick={() => toggle("bold")}>
          <ButtonGroup.Icon>
            <Bold />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
        <ButtonGroup.Item
          aria-label="Курсив"
          pressed={marks.italic}
          onClick={() => toggle("italic")}
        >
          <ButtonGroup.Icon>
            <Italic />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
        <ButtonGroup.Item
          aria-label="Подчёркнутый"
          pressed={marks.underline}
          onClick={() => toggle("underline")}
        >
          <ButtonGroup.Icon>
            <Underline />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
      </ButtonGroup.Root>

      <ButtonGroup.Root aria-label="Выравнивание">
        <ButtonGroup.Item
          aria-label="По левому краю"
          pressed={align === "left"}
          onClick={() => setAlign("left")}
        >
          <ButtonGroup.Icon>
            <AlignLeft />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
        <ButtonGroup.Item
          aria-label="По центру"
          pressed={align === "center"}
          onClick={() => setAlign("center")}
        >
          <ButtonGroup.Icon>
            <AlignCenter />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
        <ButtonGroup.Item
          aria-label="По правому краю"
          pressed={align === "right"}
          onClick={() => setAlign("right")}
        >
          <ButtonGroup.Icon>
            <AlignRight />
          </ButtonGroup.Icon>
        </ButtonGroup.Item>
      </ButtonGroup.Root>

      <span className={styles.spacer} aria-hidden />
      <Button.Root>Сохранить</Button.Root>
    </div>
  );
}
