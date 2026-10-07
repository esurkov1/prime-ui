import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleDot,
  CloudUpload,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  House,
  Info,
  LayoutGrid,
  ListFilter,
  Lock,
  Mail,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Pipette,
  Plus,
  Search,
  Send,
  Settings,
  Smartphone,
  Sun,
  Tablet,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import * as React from "react";

import type { BaseIconProps } from "./Icon";
import { createIcon } from "./Icon";

export const IconAdd = createIcon(Plus);
export const IconCalendar = createIcon(Calendar);
export const IconCheck = createIcon(Check);
export const IconChevronDown = createIcon(ChevronDown);
export const IconChevronLeft = createIcon(ChevronLeft);
export const IconChevronRight = createIcon(ChevronRight);
export const IconChevronUp = createIcon(ChevronUp);
export const IconCircleDot = createIcon(CircleDot);
export const IconClose = createIcon(X);
export const IconCloudUpload = createIcon(CloudUpload);
export const IconCode = createIcon(Code2);
export const IconCopy = createIcon(Copy);
export const IconDanger = createIcon(XCircle);
export const IconDelete = createIcon(Trash2);
export const IconDesktop = createIcon(Monitor);
export const IconDocument = createIcon(FileText);
export const IconDownload = createIcon(Download);
export const IconDrag = createIcon(GripVertical);
export const IconExternalLink = createIcon(ExternalLink);
export const IconEye = createIcon(Eye);
export const IconEyeOff = createIcon(EyeOff);
export const IconFilter = createIcon(ListFilter);
export const IconHouse = createIcon(House);
export const IconInfo = createIcon(Info);
export const IconLayoutGrid = createIcon(LayoutGrid);
export const IconLock = createIcon(Lock);
export const IconMail = createIcon(Mail);
export const IconMobile = createIcon(Smartphone);
export const IconMoon = createIcon(Moon);
export const IconMore = createIcon(MoreHorizontal);
export const IconNavItemDot = createIcon(Circle);
export const IconPackage = createIcon(Package);
export const IconPipette = createIcon(Pipette);
export const IconRemove = createIcon(Minus);
export const IconSearch = createIcon(Search);
export const IconSend = createIcon(Send);
export const IconSettings = createIcon(Settings);
export const IconSidebarCollapse = createIcon(PanelLeftClose);
export const IconSidebarExpand = createIcon(PanelLeftOpen);
export const IconSortAscending = createIcon(ArrowUp);
export const IconSortDescending = createIcon(ArrowDown);
export const IconSortNone = createIcon(ArrowUpDown);
export const IconSuccess = createIcon(CheckCircle2);
export const IconSun = createIcon(Sun);
export const IconTablet = createIcon(Tablet);
export const IconUsers = createIcon(Users);
export const IconWarning = createIcon(AlertTriangle);

/**
 * Named kit icons. Components and examples take glyphs from here (or the `Icon*` exports above)
 * instead of importing `lucide-react` or drawing their own `<svg>`.
 */
export const iconRegistry = {
  "nav.chevronDown": IconChevronDown,
  "nav.chevronLeft": IconChevronLeft,
  "nav.chevronRight": IconChevronRight,
  "nav.chevronUp": IconChevronUp,
  "nav.home": IconHouse,
  "nav.itemDot": IconNavItemDot,
  "nav.layoutGrid": IconLayoutGrid,
  "nav.sidebarCollapse": IconSidebarCollapse,
  "nav.sidebarExpand": IconSidebarExpand,
  "action.add": IconAdd,
  "action.check": IconCheck,
  "action.close": IconClose,
  "action.copy": IconCopy,
  "action.delete": IconDelete,
  "action.download": IconDownload,
  "action.drag": IconDrag,
  "action.externalLink": IconExternalLink,
  "action.eyedropper": IconPipette,
  "action.filter": IconFilter,
  "action.more": IconMore,
  "action.remove": IconRemove,
  "action.search": IconSearch,
  "action.send": IconSend,
  "action.settings": IconSettings,
  "action.upload": IconCloudUpload,
  "field.calendar": IconCalendar,
  "field.email": IconMail,
  "field.password.show": IconEye,
  "field.password.hide": IconEyeOff,
  "object.document": IconDocument,
  "object.package": IconPackage,
  "object.users": IconUsers,
  "sort.ascending": IconSortAscending,
  "sort.descending": IconSortDescending,
  "sort.none": IconSortNone,
  "status.danger": IconDanger,
  "status.info": IconInfo,
  "status.locked": IconLock,
  "status.success": IconSuccess,
  "status.warning": IconWarning,
  "theme.dark": IconMoon,
  "theme.light": IconSun,
  "view.code": IconCode,
  "view.preview": IconEye,
  "viewport.desktop": IconDesktop,
  "viewport.mobile": IconMobile,
  "viewport.tablet": IconTablet,
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

export type { BaseIconProps } from "./Icon";
