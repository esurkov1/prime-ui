import { Icon } from "prime-ui-kit";

// Размер на шкале иконок: xs 14 · s 16 · m 20 · l 24 · xl 32.
export const bell = <Icon name="object.bell" size="l" />;

// Цвет: tone, по умолчанию currentColor хоста.
export const warning = <Icon name="status.warning" tone="warning" />;

// Цвет категории из данных — оттенок палитры вместо tone.
export const funnel = <Icon name="object.funnel" color="purple" />;

// Иконка со смыслом: role="img" с именем; в Tooltip.Trigger становится фокусируемой.
export const locked = <Icon name="status.locked" label="Системный статус" />;
