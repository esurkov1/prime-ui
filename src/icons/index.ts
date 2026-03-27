import {
  Check,
  ChevronRight,
  Circle,
  CircleDot,
  CloudUpload,
  Copy,
  Download,
  Eye,
  EyeOff,
  House,
  LayoutGrid,
  Lock,
  Mail,
  Moon,
  Sun,
  X,
} from "lucide-react";
import * as React from "react";

import type { BaseIconProps } from "./Icon";
import { createIcon } from "./Icon";

export const IconCheck = createIcon(Check);
export const IconChevronRight = createIcon(ChevronRight);
export const IconCircleDot = createIcon(CircleDot);
export const IconNavItemDot = createIcon(Circle);
export const IconClose = createIcon(X);
export const IconCloudUpload = createIcon(CloudUpload);
export const IconCopy = createIcon(Copy);
export const IconDownload = createIcon(Download);
export const IconMail = createIcon(Mail);
export const IconEye = createIcon(Eye);
export const IconEyeOff = createIcon(EyeOff);
export const IconHouse = createIcon(House);
export const IconLayoutGrid = createIcon(LayoutGrid);
export const IconLock = createIcon(Lock);
export const IconMoon = createIcon(Moon);
export const IconSun = createIcon(Sun);

export const iconRegistry = {
  "nav.chevronRight": IconChevronRight,
  "nav.home": IconHouse,
  "nav.itemDot": IconNavItemDot,
  "nav.layoutGrid": IconLayoutGrid,
  "action.close": IconClose,
  "action.copy": IconCopy,
  "action.upload": IconCloudUpload,
  "field.email": IconMail,
  "field.password.show": IconEye,
  "field.password.hide": IconEyeOff,
  "status.locked": IconLock,
  "theme.dark": IconMoon,
  "theme.light": IconSun,
} as const;

export type IconName = keyof typeof iconRegistry;

export type NamedIconProps = BaseIconProps & {
  name: IconName;
};

export const Icon = React.forwardRef<SVGSVGElement, NamedIconProps>(({ name, ...rest }, ref) => {
  const IconGlyph = iconRegistry[name];
  return React.createElement(IconGlyph, { ref, ...rest });
});

Icon.displayName = "Icon";

export type { BaseIconProps, IconSize, IconSurface, IconTone } from "./Icon";
