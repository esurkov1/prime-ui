import * as React from "react";
import { Radio } from "@/components/radio/Radio";

export default function RadioControlledSnippet() {
  const [plan, setPlan] = React.useState("pro");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Radio.Root
        name="radio-controlled-plan"
        value="basic"
        checked={plan === "basic"}
        onChange={(e) => {
          if (e.currentTarget.checked) setPlan("basic");
        }}
        size="m"
      >
        <Radio.Label>Тариф Basic</Radio.Label>
      </Radio.Root>
      <Radio.Root
        name="radio-controlled-plan"
        value="pro"
        checked={plan === "pro"}
        onChange={(e) => {
          if (e.currentTarget.checked) setPlan("pro");
        }}
        size="m"
      >
        <Radio.Label>Тариф Pro</Radio.Label>
      </Radio.Root>
      <Radio.Root
        name="radio-controlled-plan"
        value="corp"
        checked={plan === "corp"}
        onChange={(e) => {
          if (e.currentTarget.checked) setPlan("corp");
        }}
        size="m"
      >
        <Radio.Label>Корпоративный</Radio.Label>
      </Radio.Root>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>Выбрано: {plan}</p>
    </div>
  );
}
