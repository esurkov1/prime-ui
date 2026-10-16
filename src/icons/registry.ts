import { Activity } from "./glyphs/activity";
import { AppWindow } from "./glyphs/app-window";
import { ArrowDown } from "./glyphs/arrow-down";
import { ArrowUp } from "./glyphs/arrow-up";
import { ArrowUpDown } from "./glyphs/arrow-up-down";
import { Bell } from "./glyphs/bell";
import { Bike } from "./glyphs/bike";
import { Bold } from "./glyphs/bold";
import { BookOpen } from "./glyphs/book-open";
import { Calendar } from "./glyphs/calendar";
import { Captions } from "./glyphs/captions";
import { ChartColumn } from "./glyphs/chart-column";
import { Check } from "./glyphs/check";
import { CheckCheck } from "./glyphs/check-check";
import { ChevronDown } from "./glyphs/chevron-down";
import { ChevronLeft } from "./glyphs/chevron-left";
import { ChevronRight } from "./glyphs/chevron-right";
import { ChevronUp } from "./glyphs/chevron-up";
import { ChevronsLeft } from "./glyphs/chevrons-left";
import { ChevronsUpDown } from "./glyphs/chevrons-up-down";
import { Circle } from "./glyphs/circle";
import { CircleAlert } from "./glyphs/circle-alert";
import { CircleCheck } from "./glyphs/circle-check";
import { CircleX } from "./glyphs/circle-x";
import { Clock } from "./glyphs/clock";
import { CloudOff } from "./glyphs/cloud-off";
import { CloudUpload } from "./glyphs/cloud-upload";
import { Code } from "./glyphs/code";
import { CodeXml } from "./glyphs/code-xml";
import { Columns3 } from "./glyphs/columns-3";
import { Copy } from "./glyphs/copy";
import { Crown } from "./glyphs/crown";
import { Disc } from "./glyphs/disc";
import { Download } from "./glyphs/download";
import { Ellipsis } from "./glyphs/ellipsis";
import { ExternalLink } from "./glyphs/external-link";
import { Eye } from "./glyphs/eye";
import { EyeOff } from "./glyphs/eye-off";
import { File } from "./glyphs/file";
import { FileText } from "./glyphs/file-text";
import { Flag } from "./glyphs/flag";
import { Forward } from "./glyphs/forward";
import { Fuel } from "./glyphs/fuel";
import { Funnel } from "./glyphs/funnel";
import { Globe } from "./glyphs/globe";
import { GripVertical } from "./glyphs/grip-vertical";
import { HardDrive } from "./glyphs/hard-drive";
import { Headset } from "./glyphs/headset";
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
import { MapPin } from "./glyphs/map-pin";
import { Megaphone } from "./glyphs/megaphone";
import { Menu } from "./glyphs/menu";
import { MessageSquare } from "./glyphs/message-square";
import { Mic } from "./glyphs/mic";
import { Minus } from "./glyphs/minus";
import { Monitor } from "./glyphs/monitor";
import { Moon } from "./glyphs/moon";
import { Motorbike } from "./glyphs/motorbike";
import { Package } from "./glyphs/package";
import { PanelLeftClose } from "./glyphs/panel-left-close";
import { PanelLeftOpen } from "./glyphs/panel-left-open";
import { Paperclip } from "./glyphs/paperclip";
import { Pause } from "./glyphs/pause";
import { Phone } from "./glyphs/phone";
import { Pin } from "./glyphs/pin";
import { Pipette } from "./glyphs/pipette";
import { Play } from "./glyphs/play";
import { Plus } from "./glyphs/plus";
import { Receipt } from "./glyphs/receipt";
import { RefreshCw } from "./glyphs/refresh-cw";
import { Reply } from "./glyphs/reply";
import { Rocket } from "./glyphs/rocket";
import { Scale } from "./glyphs/scale";
import { Search } from "./glyphs/search";
import { Send } from "./glyphs/send";
import { Settings } from "./glyphs/settings";
import { ShoppingCart } from "./glyphs/shopping-cart";
import { Smartphone } from "./glyphs/smartphone";
import { SmilePlus } from "./glyphs/smile-plus";
import { SquarePen } from "./glyphs/square-pen";
import { Star } from "./glyphs/star";
import { Strikethrough } from "./glyphs/strikethrough";
import { Sun } from "./glyphs/sun";
import { Tablet } from "./glyphs/tablet";
import { TextQuote } from "./glyphs/text-quote";
import { Trash2 } from "./glyphs/trash-2";
import { TriangleAlert } from "./glyphs/triangle-alert";
import { Trophy } from "./glyphs/trophy";
import { Truck } from "./glyphs/truck";
import { Underline } from "./glyphs/underline";
import { UserPlus } from "./glyphs/user-plus";
import { UserRound } from "./glyphs/user-round";
import { Users } from "./glyphs/users";
import { Video } from "./glyphs/video";
import { Volume2 } from "./glyphs/volume-2";
import { VolumeX } from "./glyphs/volume-x";
import { Wallet } from "./glyphs/wallet";
import { X } from "./glyphs/x";
import { ZoomIn } from "./glyphs/zoom-in";
import { ZoomOut } from "./glyphs/zoom-out";

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
  /** Save a person to the contacts. */
  "action.addContact": UserPlus,
  "action.attach": Paperclip,
  "action.check": Check,
  "action.close": X,
  "action.copy": Copy,
  "action.delete": Trash2,
  "action.download": Download,
  "action.drag": GripVertical,
  /** Edit an existing entity in place (a sent message, a note). */
  "action.edit": SquarePen,
  "action.externalLink": ExternalLink,
  "action.eyedropper": Pipette,
  "action.filter": ListFilter,
  /** Forward a message to another chat. */
  "action.forward": Forward,
  "action.login": LogIn,
  "action.logout": LogOut,
  "action.more": Ellipsis,
  /** Open a page of this product (a bot key's web app); `action.externalLink` leaves it. */
  "action.openApp": AppWindow,
  "action.pause": Pause,
  /** Pin a message or an item to the top. */
  "action.pin": Pin,
  "action.play": Play,
  /** Add a reaction to a message. */
  "action.react": SmilePlus,
  "action.refresh": RefreshCw,
  /** Report content (a message, a comment) to the moderators. */
  "action.report": Flag,
  "action.remove": Minus,
  "action.reply": Reply,
  "action.search": Search,
  "action.send": Send,
  "action.settings": Settings,
  /** Turn speech into text (a voice or video message's transcript). */
  "action.transcribe": Captions,
  "action.upload": CloudUpload,
  /** Record a video message (a composer's record button in video mode). */
  "action.video": Video,
  /** Record a voice message (a composer's record button). */
  "action.voice": Mic,
  /** Look closer at a picture (a media viewer). */
  "action.zoomIn": ZoomIn,
  /** Back out of a closer look. */
  "action.zoomOut": ZoomOut,
  "field.calendar": Calendar,
  "field.email": Mail,
  "field.password.show": Eye,
  "field.password.hide": EyeOff,
  "format.bold": Bold,
  /** Inline code (monospace) in text formatting; `view.code` is the source view of a page. */
  "format.code": Code,
  "format.italic": Italic,
  "format.link": Link2,
  "format.list": List,
  "format.quote": TextQuote,
  /** Hidden text (a spoiler) in text formatting; `field.password.hide` masks a password. */
  "format.spoiler": EyeOff,
  "format.strikethrough": Strikethrough,
  "format.underline": Underline,
  "object.activity": Activity,
  "object.bell": Bell,
  "object.bike": Bike,
  "object.book": BookOpen,
  "object.cart": ShoppingCart,
  "object.chart": ChartColumn,
  "object.crown": Crown,
  "object.disc": Disc,
  "object.document": FileText,
  "object.file": File,
  "object.fuel": Fuel,
  "object.funnel": Funnel,
  "object.globe": Globe,
  "object.headset": Headset,
  "object.image": Image,
  "object.inbox": Inbox,
  "object.key": KeyRound,
  "object.mapPin": MapPin,
  "object.megaphone": Megaphone,
  "object.message": MessageSquare,
  "object.motorbike": Motorbike,
  "object.package": Package,
  "object.phone": Phone,
  "object.receipt": Receipt,
  "object.rocket": Rocket,
  "object.scale": Scale,
  "object.storage": HardDrive,
  "object.tasks": ListTodo,
  "object.trophy": Trophy,
  "object.truck": Truck,
  "object.user": UserRound,
  "object.users": Users,
  "object.wallet": Wallet,
  "sort.ascending": ArrowUp,
  "sort.descending": ArrowDown,
  "sort.none": ArrowUpDown,
  "status.danger": CircleX,
  "status.emailSent": MailCheck,
  /** A message that failed to send (a retry sits beside it). */
  "status.failed": CircleAlert,
  "status.favorite": Star,
  "status.info": Info,
  "status.locked": Lock,
  /** Sound is off (a muted video message). */
  "status.muted": VolumeX,
  /** Sound is on (a video's sound toggle). */
  "status.sound": Volume2,
  "status.offline": CloudOff,
  /** On its way: a message being sent. */
  "status.pending": Clock,
  /** Read by the recipient: two checks. */
  "status.read": CheckCheck,
  /** Sent, not read yet: one check. */
  "status.sent": Check,
  "status.success": CircleCheck,
  /** A rising trend; a falling one is the same arrow turned half a turn (it rotates between them). */
  "status.trendUp": ArrowUp,
  "status.warning": TriangleAlert,
  "theme.dark": Moon,
  "theme.light": Sun,
  "view.code": CodeXml,
  /** Which columns a table shows (the DataTable columns menu). */
  "view.columns": Columns3,
  "view.preview": Eye,
  "viewport.desktop": Monitor,
  "viewport.mobile": Smartphone,
  "viewport.tablet": Tablet,
} as const;

export type IconName = keyof typeof iconRegistry;
