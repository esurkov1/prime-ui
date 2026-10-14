/** Every size tier; text and chevrons follow the control tier — `size`. */
import { Breadcrumb, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function BreadcrumbSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Breadcrumb.Root size={size}>
            <Breadcrumb.Item href="#orders">Заказы</Breadcrumb.Item>
            <Breadcrumb.Item current>№ 48 213</Breadcrumb.Item>
          </Breadcrumb.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
