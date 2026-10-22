/** A card while its report loads next to the loaded one: the title and the period stay, the value, the change and the reference line hold their place — `loading`. */
import { Kpi, Typography } from "prime-ui-kit";

const STATES = [
  { id: "loading", loading: true, caption: "loading" },
  { id: "loaded", loading: false, caption: "loading={false}" },
];

export default function KpiStatesExample() {
  return (
    <>
      {STATES.map((state) => (
        <div key={state.id}>
          <div>
            <Kpi.Root loading={state.loading}>
              <Kpi.Title>Выручка</Kpi.Title>
              <Kpi.Period>1–31 окт</Kpi.Period>
              <Kpi.Value>4,2 млн ₽</Kpi.Value>
              <Kpi.Delta value={18} tone="success">
                +18%
              </Kpi.Delta>
              <Kpi.Meta>к сентябрю</Kpi.Meta>
            </Kpi.Root>
            <Typography as="span" variant="caption" tone="muted">
              {state.caption}
            </Typography>
          </div>
        </div>
      ))}
    </>
  );
}
