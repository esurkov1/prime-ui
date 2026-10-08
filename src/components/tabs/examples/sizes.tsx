/** Every size tier: text, icon, folder radius and spacing grow together — `size`. */
import { Tabs, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TabsSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
          <Tabs.Root size={size} defaultValue="all" fullWidth={false}>
            <Tabs.List aria-label="Заявки">
              <Tabs.Item value="all">Все</Tabs.Item>
              <Tabs.Item value="active">Активные</Tabs.Item>
              <Tabs.Item value="archive">Архив</Tabs.Item>
            </Tabs.List>
            <Tabs.Panel value="all">
              <Typography variant="body-m" tone="secondary">
                12 заявок за неделю.
              </Typography>
            </Tabs.Panel>
          </Tabs.Root>
        </div>
      ))}
    </>
  );
}
