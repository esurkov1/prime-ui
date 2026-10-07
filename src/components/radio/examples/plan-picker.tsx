/** A controlled plan picker in a settings card: options with descriptions, a disabled option explaining why, and card actions. Use it for a one-of-many choice with consequences. */
import { Button, Card, Radio, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PLANS = [
  { id: "start", label: "Старт", hint: "До 5 участников, базовые отчёты." },
  { id: "team", label: "Команда", hint: "Общие проекты, SSO и журнал действий." },
  { id: "business", label: "Бизнес", hint: "Выделенная поддержка и хранение данных в РФ." },
];

export default function RadioPlanPickerExample() {
  const [plan, setPlan] = React.useState("team");
  const current = PLANS.find((p) => p.id === plan);
  const labelId = React.useId();

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Тариф</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <div className={styles.content}>
          <div className={styles.field}>
            <Typography.Root id={labelId} variant="body-s" weight="medium" tone="secondary">
              Выберите план для рабочего пространства
            </Typography.Root>
            <Radio.Group name="plan" value={plan} onValueChange={setPlan} aria-labelledby={labelId}>
              {PLANS.map((p) => (
                <Radio.Root key={p.id} value={p.id}>
                  <Radio.Label>{p.label}</Radio.Label>
                  <Radio.Hint>{p.hint}</Radio.Hint>
                </Radio.Root>
              ))}
              <Radio.Root value="enterprise" disabled>
                <Radio.Label>Корпоративный</Radio.Label>
                <Radio.Hint>Подключается через отдел продаж.</Radio.Hint>
              </Radio.Root>
            </Radio.Group>
          </div>
          <Typography.Root variant="body-s" tone="muted">
            Будет подключён тариф «{current?.label}».
          </Typography.Root>
        </div>
      </Card.Body>
      <Card.Actions>
        <Button.Root variant="ghost" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root>Сменить тариф</Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}
