/** Cards that are a choice: one tariff of three in a group of pressed buttons, and any number of extras, each card a button with its mark at the end — `Card.Indicator`, `selected`, `asChild`. */
import { Card, Fieldset } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TARIFFS = [
  { id: "start", title: "Старт", description: "3 места, базовые отчёты", price: "0 ₽ / мес." },
  { id: "team", title: "Команда", description: "12 мест, отчёты и API", price: "4 900 ₽ / мес." },
  {
    id: "company",
    title: "Компания",
    description: "Без лимита мест, SSO",
    price: "19 000 ₽ / мес.",
  },
];

const EXTRAS = [
  { id: "backup", title: "Резервные копии", description: "Каждую ночь, 30 дней" },
  { id: "audit", title: "Журнал действий", description: "Кто и что изменил" },
  { id: "support", title: "Приоритетная поддержка", description: "Ответ за час" },
];

export default function CardChoiceExample() {
  const [tariff, setTariff] = React.useState("team");
  const [extras, setExtras] = React.useState<string[]>(["backup"]);

  const toggle = (id: string) =>
    setExtras((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <>
      <Fieldset aria-label="Тариф">
        <div className={styles.row}>
          {TARIFFS.map((item) => (
            <Card.Root key={item.id} asChild selected={tariff === item.id}>
              <button type="button" onClick={() => setTariff(item.id)}>
                <Card.Header>
                  <Card.Title as="span">{item.title}</Card.Title>
                  <Card.Description>{item.description}</Card.Description>
                  <Card.Indicator type="radio" />
                </Card.Header>
                <Card.Body>{item.price}</Card.Body>
              </button>
            </Card.Root>
          ))}
        </div>
      </Fieldset>
      <Fieldset aria-label="Дополнения">
        <div className={styles.row}>
          {EXTRAS.map((item) => (
            <Card.Root key={item.id} asChild selected={extras.includes(item.id)}>
              <button type="button" onClick={() => toggle(item.id)}>
                <Card.Header>
                  <Card.Title as="span">{item.title}</Card.Title>
                  <Card.Description>{item.description}</Card.Description>
                  <Card.Indicator type="checkbox" />
                </Card.Header>
              </button>
            </Card.Root>
          ))}
        </div>
      </Fieldset>
    </>
  );
}
