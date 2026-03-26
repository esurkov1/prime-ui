import { Radio } from "prime-ui-kit";
import * as React from "react";

import styles from "./radio-examples.module.css";

/** Controlled subscription tier: one `name`, `checked` + `onChange` driven by React state. */
export default function PlanPickerExample() {
  const [plan, setPlan] = React.useState<"starter" | "growth" | "scale">("growth");

  return (
    <>
      <div className={styles.columnTight}>
        <Radio.Root
          name="plan-example"
          value="starter"
          size="m"
          checked={plan === "starter"}
          onChange={(e) => {
            if (e.currentTarget.checked) setPlan("starter");
          }}
        >
          <Radio.Label>Starter</Radio.Label>
          <Radio.Hint>Up to 5 seats and basic reporting.</Radio.Hint>
        </Radio.Root>
        <Radio.Root
          name="plan-example"
          value="growth"
          size="m"
          checked={plan === "growth"}
          onChange={(e) => {
            if (e.currentTarget.checked) setPlan("growth");
          }}
        >
          <Radio.Label>Growth</Radio.Label>
          <Radio.Hint>Shared pipelines, SSO, and audit log.</Radio.Hint>
        </Radio.Root>
        <Radio.Root
          name="plan-example"
          value="scale"
          size="m"
          checked={plan === "scale"}
          onChange={(e) => {
            if (e.currentTarget.checked) setPlan("scale");
          }}
        >
          <Radio.Label>Scale</Radio.Label>
          <Radio.Hint>Dedicated support and regional data residency.</Radio.Hint>
        </Radio.Root>
      </div>
      <p className={styles.selectionMeta}>Selected plan: {plan}</p>
    </>
  );
}
