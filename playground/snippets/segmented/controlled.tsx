import * as React from "react";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";

export default function SegmentedControlledSnippet() {
  const [controlled, setControlled] = React.useState("week");

  return (
    <>
      <SegmentedControl.Root value={controlled} onValueChange={setControlled}>
        <SegmentedControl.Item value="day">День</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
      </SegmentedControl.Root>
      <p className="previewCaption previewCaptionTopBase">
        Выбрано: <strong>{controlled}</strong> — значение приходит из состояния React (
        <code>value</code> + <code>onValueChange</code>).
      </p>
    </>
  );
}
