import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./examples-scenarios.module.css";

const lines = [
  { title: "Canvas tote", meta: "Qty 1 · Navy", price: "$48.00" },
  { title: "Studio mug", meta: "Qty 2 · Matte black", price: "$36.00" },
] as const;

/**
 * Trailing-edge preview of the cart: scroll line items; primary checkout stays in the footer.
 */
export default function DrawerExampleCartPreview() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root type="button" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Cart (3)
      </Button.Root>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        title="Your cart"
        description="2 products ready for checkout"
        icon={<Icon name="nav.itemDot" tone="subtle" />}
        footer={
          <div className={styles.footerActions}>
            <Button.Root
              type="button"
              variant="neutral"
              mode="stroke"
              onClick={() => setOpen(false)}
            >
              View cart
            </Button.Root>
            <Button.Root type="button" variant="primary" onClick={() => setOpen(false)}>
              Checkout
            </Button.Root>
          </div>
        }
      >
        {lines.map((line) => (
          <div key={line.title} className={styles.cartLine}>
            <div className={styles.cartLineMain}>
              <p className={styles.cartTitle}>{line.title}</p>
              <p className={styles.cartPrice}>{line.price}</p>
            </div>
            <p className={styles.cartMeta}>{line.meta}</p>
          </div>
        ))}
      </Drawer>
    </>
  );
}
