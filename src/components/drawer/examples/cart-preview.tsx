import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";

import styles from "./examples-scenarios.module.css";

const lines = [
  { title: "Canvas tote", meta: "Qty 1 · Navy", price: "$48.00" },
  { title: "Studio mug", meta: "Qty 2 · Matte black", price: "$36.00" },
] as const;

/**
 * Trailing-edge preview of the cart: scroll line items; primary checkout stays in the footer.
 */
export default function DrawerExampleCartPreview() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
          Cart (3)
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" aria-labelledby="drawer-cart-title">
          <Drawer.Header>
            <Drawer.Title id="drawer-cart-title">Your cart</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            {lines.map((line) => (
              <div key={line.title} className={styles.cartLine}>
                <div className={styles.cartLineMain}>
                  <p className={styles.cartTitle}>{line.title}</p>
                  <p className={styles.cartPrice}>{line.price}</p>
                </div>
                <p className={styles.cartMeta}>{line.meta}</p>
              </div>
            ))}
          </Drawer.Body>
          <Drawer.Footer className={styles.footerActions}>
            <Drawer.Close>
              <Button.Root type="button" variant="neutral" mode="stroke">
                View cart
              </Button.Root>
            </Drawer.Close>
            <Drawer.Close>
              <Button.Root type="button" variant="primary">
                Checkout
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
