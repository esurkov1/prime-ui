import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Bell,
  Bold,
  BookOpen,
  Calendar,
  ChartColumn,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsUpDown,
  ChevronUp,
  Circle,
  CircleDot,
  CloudOff,
  CloudUpload,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  HardDrive,
  House,
  Image,
  Inbox,
  Info,
  Italic,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  List,
  ListFilter,
  ListTodo,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MailCheck,
  Menu,
  MessageSquare,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Pipette,
  Plus,
  Receipt,
  Rocket,
  Search,
  Send,
  Settings,
  ShoppingCart,
  Smartphone,
  Sun,
  Tablet,
  Trash2,
  Truck,
  Underline,
  UserRound,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import * as React from "react";

import type { BaseIconProps } from "./Icon";
import { createIcon } from "./Icon";

export const IconActivity = createIcon(Activity);
export const IconAdd = createIcon(Plus);
export const IconBell = createIcon(Bell);
export const IconBold = createIcon(Bold);
export const IconBook = createIcon(BookOpen);
export const IconCalendar = createIcon(Calendar);
export const IconCart = createIcon(ShoppingCart);
export const IconChart = createIcon(ChartColumn);
export const IconCheck = createIcon(Check);
export const IconChevronDown = createIcon(ChevronDown);
export const IconChevronLeft = createIcon(ChevronLeft);
export const IconChevronRight = createIcon(ChevronRight);
export const IconChevronUp = createIcon(ChevronUp);
export const IconChevronsLeft = createIcon(ChevronsLeft);
export const IconChevronsUpDown = createIcon(ChevronsUpDown);
export const IconCircleDot = createIcon(CircleDot);
export const IconClose = createIcon(X);
export const IconCloudUpload = createIcon(CloudUpload);
export const IconCode = createIcon(Code2);
export const IconCopy = createIcon(Copy);
export const IconDanger = createIcon(XCircle);
export const IconDashboard = createIcon(LayoutDashboard);
export const IconDelete = createIcon(Trash2);
export const IconDesktop = createIcon(Monitor);
export const IconDocument = createIcon(FileText);
export const IconDownload = createIcon(Download);
export const IconDrag = createIcon(GripVertical);
export const IconEmailSent = createIcon(MailCheck);
export const IconExternalLink = createIcon(ExternalLink);
export const IconEye = createIcon(Eye);
export const IconEyeOff = createIcon(EyeOff);
export const IconFilter = createIcon(ListFilter);
export const IconHouse = createIcon(House);
export const IconImage = createIcon(Image);
export const IconInbox = createIcon(Inbox);
export const IconInfo = createIcon(Info);
export const IconItalic = createIcon(Italic);
export const IconKey = createIcon(KeyRound);
export const IconLayoutGrid = createIcon(LayoutGrid);
export const IconLink = createIcon(Link2);
export const IconList = createIcon(List);
export const IconLock = createIcon(Lock);
export const IconLogin = createIcon(LogIn);
export const IconLogout = createIcon(LogOut);
export const IconMail = createIcon(Mail);
export const IconMenu = createIcon(Menu);
export const IconMessage = createIcon(MessageSquare);
export const IconMobile = createIcon(Smartphone);
export const IconMoon = createIcon(Moon);
export const IconMore = createIcon(MoreHorizontal);
export const IconNavItemDot = createIcon(Circle);
export const IconOffline = createIcon(CloudOff);
export const IconPackage = createIcon(Package);
export const IconPipette = createIcon(Pipette);
export const IconReceipt = createIcon(Receipt);
export const IconRemove = createIcon(Minus);
export const IconRocket = createIcon(Rocket);
export const IconSearch = createIcon(Search);
export const IconSend = createIcon(Send);
export const IconSettings = createIcon(Settings);
export const IconSidebarCollapse = createIcon(PanelLeftClose);
export const IconSidebarExpand = createIcon(PanelLeftOpen);
export const IconSortAscending = createIcon(ArrowUp);
export const IconSortDescending = createIcon(ArrowDown);
export const IconSortNone = createIcon(ArrowUpDown);
export const IconStorage = createIcon(HardDrive);
export const IconSuccess = createIcon(CheckCircle2);
export const IconSun = createIcon(Sun);
export const IconTablet = createIcon(Tablet);
export const IconTasks = createIcon(ListTodo);
export const IconTruck = createIcon(Truck);
export const IconUnderline = createIcon(Underline);
export const IconUser = createIcon(UserRound);
export const IconUsers = createIcon(Users);
export const IconWallet = createIcon(Wallet);
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
  "nav.chevronsLeft": IconChevronsLeft,
  "nav.chevronsUpDown": IconChevronsUpDown,
  "nav.dashboard": IconDashboard,
  "nav.home": IconHouse,
  "nav.itemDot": IconNavItemDot,
  "nav.layoutGrid": IconLayoutGrid,
  "nav.menu": IconMenu,
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
  "action.login": IconLogin,
  "action.logout": IconLogout,
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
  "format.bold": IconBold,
  "format.italic": IconItalic,
  "format.link": IconLink,
  "format.list": IconList,
  "format.underline": IconUnderline,
  "object.activity": IconActivity,
  "object.bell": IconBell,
  "object.book": IconBook,
  "object.cart": IconCart,
  "object.chart": IconChart,
  "object.document": IconDocument,
  "object.image": IconImage,
  "object.inbox": IconInbox,
  "object.key": IconKey,
  "object.message": IconMessage,
  "object.package": IconPackage,
  "object.receipt": IconReceipt,
  "object.rocket": IconRocket,
  "object.storage": IconStorage,
  "object.tasks": IconTasks,
  "object.truck": IconTruck,
  "object.user": IconUser,
  "object.users": IconUsers,
  "object.wallet": IconWallet,
  "sort.ascending": IconSortAscending,
  "sort.descending": IconSortDescending,
  "sort.none": IconSortNone,
  "status.danger": IconDanger,
  "status.emailSent": IconEmailSent,
  "status.info": IconInfo,
  "status.locked": IconLock,
  "status.offline": IconOffline,
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
