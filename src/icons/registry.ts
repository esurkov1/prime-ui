import { Activity } from "./glyphs/activity";
import { ArrowDown } from "./glyphs/arrow-down";
import { ArrowUp } from "./glyphs/arrow-up";
import { ArrowUpDown } from "./glyphs/arrow-up-down";
import { Bell } from "./glyphs/bell";
import { Bold } from "./glyphs/bold";
import { BookOpen } from "./glyphs/book-open";
import { Calendar } from "./glyphs/calendar";
import { ChartColumn } from "./glyphs/chart-column";
import { Check } from "./glyphs/check";
import { ChevronDown } from "./glyphs/chevron-down";
import { ChevronLeft } from "./glyphs/chevron-left";
import { ChevronRight } from "./glyphs/chevron-right";
import { ChevronUp } from "./glyphs/chevron-up";
import { ChevronsLeft } from "./glyphs/chevrons-left";
import { ChevronsUpDown } from "./glyphs/chevrons-up-down";
import { Circle } from "./glyphs/circle";
import { CircleCheck } from "./glyphs/circle-check";
import { CircleX } from "./glyphs/circle-x";
import { CloudOff } from "./glyphs/cloud-off";
import { CloudUpload } from "./glyphs/cloud-upload";
import { CodeXml } from "./glyphs/code-xml";
import { Copy } from "./glyphs/copy";
import { Download } from "./glyphs/download";
import { Ellipsis } from "./glyphs/ellipsis";
import { ExternalLink } from "./glyphs/external-link";
import { Eye } from "./glyphs/eye";
import { EyeOff } from "./glyphs/eye-off";
import { FileText } from "./glyphs/file-text";
import { GripVertical } from "./glyphs/grip-vertical";
import { HardDrive } from "./glyphs/hard-drive";
import { House } from "./glyphs/house";
import { Image } from "./glyphs/image";
import { Inbox } from "./glyphs/inbox";
import { Info } from "./glyphs/info";
import { Italic } from "./glyphs/italic";
import { KeyRound } from "./glyphs/key-round";
import { LayoutDashboard } from "./glyphs/layout-dashboard";
import { LayoutGrid } from "./glyphs/layout-grid";
import { Link2 } from "./glyphs/link-2";
import { List } from "./glyphs/list";
import { ListFilter } from "./glyphs/list-filter";
import { ListTodo } from "./glyphs/list-todo";
import { Lock } from "./glyphs/lock";
import { LogIn } from "./glyphs/log-in";
import { LogOut } from "./glyphs/log-out";
import { Mail } from "./glyphs/mail";
import { MailCheck } from "./glyphs/mail-check";
import { Menu } from "./glyphs/menu";
import { MessageSquare } from "./glyphs/message-square";
import { Minus } from "./glyphs/minus";
import { Monitor } from "./glyphs/monitor";
import { Moon } from "./glyphs/moon";
import { Package } from "./glyphs/package";
import { PanelLeftClose } from "./glyphs/panel-left-close";
import { PanelLeftOpen } from "./glyphs/panel-left-open";
import { Pipette } from "./glyphs/pipette";
import { Plus } from "./glyphs/plus";
import { Receipt } from "./glyphs/receipt";
import { RefreshCw } from "./glyphs/refresh-cw";
import { Rocket } from "./glyphs/rocket";
import { Search } from "./glyphs/search";
import { Send } from "./glyphs/send";
import { Settings } from "./glyphs/settings";
import { ShoppingCart } from "./glyphs/shopping-cart";
import { Smartphone } from "./glyphs/smartphone";
import { Sun } from "./glyphs/sun";
import { Tablet } from "./glyphs/tablet";
import { Trash2 } from "./glyphs/trash-2";
import { TriangleAlert } from "./glyphs/triangle-alert";
import { Truck } from "./glyphs/truck";
import { Underline } from "./glyphs/underline";
import { UserRound } from "./glyphs/user-round";
import { Users } from "./glyphs/users";
import { Wallet } from "./glyphs/wallet";
import { X } from "./glyphs/x";

/**
 * Named kit glyphs: `<Icon name="…" />` renders one of these. Components and examples take glyphs
 * from here instead of importing `lucide-react` or drawing their own `<svg>`; a domain glyph the
 * kit lacks goes through `createIcon`. Drawings are Lucide's (ISC); gestures are adapted from
 * lucide-animated (MIT) — see `THIRD_PARTY_NOTICES`.
 */
export const iconRegistry = {
  "nav.chevronDown": ChevronDown,
  "nav.chevronLeft": ChevronLeft,
  "nav.chevronRight": ChevronRight,
  "nav.chevronUp": ChevronUp,
  "nav.chevronsLeft": ChevronsLeft,
  "nav.chevronsUpDown": ChevronsUpDown,
  "nav.dashboard": LayoutDashboard,
  "nav.home": House,
  "nav.itemDot": Circle,
  "nav.layoutGrid": LayoutGrid,
  "nav.menu": Menu,
  "nav.sidebarCollapse": PanelLeftClose,
  "nav.sidebarExpand": PanelLeftOpen,
  "action.add": Plus,
  "action.check": Check,
  "action.close": X,
  "action.copy": Copy,
  "action.delete": Trash2,
  "action.download": Download,
  "action.drag": GripVertical,
  "action.externalLink": ExternalLink,
  "action.eyedropper": Pipette,
  "action.filter": ListFilter,
  "action.login": LogIn,
  "action.logout": LogOut,
  "action.more": Ellipsis,
  "action.refresh": RefreshCw,
  "action.remove": Minus,
  "action.search": Search,
  "action.send": Send,
  "action.settings": Settings,
  "action.upload": CloudUpload,
  "field.calendar": Calendar,
  "field.email": Mail,
  "field.password.show": Eye,
  "field.password.hide": EyeOff,
  "format.bold": Bold,
  "format.italic": Italic,
  "format.link": Link2,
  "format.list": List,
  "format.underline": Underline,
  "object.activity": Activity,
  "object.bell": Bell,
  "object.book": BookOpen,
  "object.cart": ShoppingCart,
  "object.chart": ChartColumn,
  "object.document": FileText,
  "object.image": Image,
  "object.inbox": Inbox,
  "object.key": KeyRound,
  "object.message": MessageSquare,
  "object.package": Package,
  "object.receipt": Receipt,
  "object.rocket": Rocket,
  "object.storage": HardDrive,
  "object.tasks": ListTodo,
  "object.truck": Truck,
  "object.user": UserRound,
  "object.users": Users,
  "object.wallet": Wallet,
  "sort.ascending": ArrowUp,
  "sort.descending": ArrowDown,
  "sort.none": ArrowUpDown,
  "status.danger": CircleX,
  "status.emailSent": MailCheck,
  "status.info": Info,
  "status.locked": Lock,
  "status.offline": CloudOff,
  "status.success": CircleCheck,
  /** A rising trend; a falling one is the same arrow turned half a turn (it rotates between them). */
  "status.trendUp": ArrowUp,
  "status.warning": TriangleAlert,
  "theme.dark": Moon,
  "theme.light": Sun,
  "view.code": CodeXml,
  "view.preview": Eye,
  "viewport.desktop": Monitor,
  "viewport.mobile": Smartphone,
  "viewport.tablet": Tablet,
} as const;

export type IconName = keyof typeof iconRegistry;
