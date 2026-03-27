import { Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./checkout-full-width.module.css";

/**
 * Оформление заказа: колонка на всю ширину родителя (`Input.Root` уже тянется на 100%).
 */
export default function CheckoutFullWidthExample() {
  const [fullName, setFullName] = React.useState("");
  const [address, setAddress] = React.useState("");

  return (
    <div className={styles.column}>
      <Input.Root label="ФИО получателя" hint="Как в паспорте — для доставки">
        <Input.Wrapper>
          <Input.Field
            name="fullName"
            autoComplete="name"
            placeholder="Иванов Иван Иванович"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Адрес доставки" optionalLabel="квартира, подъезд">
        <Input.Wrapper>
          <Input.Field
            name="address"
            autoComplete="street-address"
            placeholder="Город, улица, дом"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
