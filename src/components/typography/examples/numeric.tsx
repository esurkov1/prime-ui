/** Invoice amounts in a column line up digit under digit with tabular figures — `numeric`. */
import { Typography } from "prime-ui-kit";

const AMOUNTS = ["1 118 400,00 ₽", "96 250,50 ₽", "7 111,11 ₽"];

export default function TypographyNumericExample() {
  return (
    <>
      {AMOUNTS.map((amount) => (
        <Typography key={amount} variant="body-m" numeric="tabular">
          {amount}
        </Typography>
      ))}
    </>
  );
}
