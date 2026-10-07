/** The parent owns the text; the counter follows it and `maxLength` stops extra input — `value`, `onValueChange`, `Textarea.Counter`, `maxLength`. */
import { Textarea } from "prime-ui-kit";
import * as React from "react";

const LIMIT = 280;

export default function TextareaControlledExample() {
  const [review, setReview] = React.useState("Курьер приехал раньше срока, всё целое.");

  return (
    <Textarea.Root
      label="Отзыв о доставке"
      placeholder="Что понравилось, что нет"
      hint="Отзыв появится после модерации"
      value={review}
      onValueChange={setReview}
      maxLength={LIMIT}
      counter={<Textarea.Counter current={review.length} max={LIMIT} />}
    />
  );
}
