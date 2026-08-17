/**
 * @anomalia/ui — public surface.
 *
 * Styles are NOT imported here: a barrel that pulls CSS in would force the
 * stylesheet on every consumer even when they only import a type. Import it
 * once in your app instead:
 *
 *     import '@anomalia/ui/styles.css';
 */

/* ── Buttons ──────────────────────────────────────────────────────────────── */
export { default as Button } from './components/button/Button.svelte';
export { default as IconButton } from './components/button/IconButton.svelte';
export { default as ButtonGroup } from './components/button/ButtonGroup.svelte';
export { default as Fab } from './components/button/Fab.svelte';

/* ── Display ──────────────────────────────────────────────────────────────── */
export { default as Card } from './components/display/Card.svelte';
export { default as CardHeader } from './components/display/CardHeader.svelte';
export { default as CardFooter } from './components/display/CardFooter.svelte';
export { default as Text } from './components/display/Text.svelte';
export { default as Badge } from './components/display/Badge.svelte';
export { default as Chip } from './components/display/Chip.svelte';
export { default as Avatar } from './components/display/Avatar.svelte';
export { default as Divider } from './components/display/Divider.svelte';
export { default as Code } from './components/display/Code.svelte';
export { default as Kbd } from './components/display/Kbd.svelte';
export { default as Stat } from './components/display/Stat.svelte';
export { default as AvatarGroup } from './components/display/AvatarGroup.svelte';
export { default as StatusDot } from './components/display/StatusDot.svelte';
export { default as EmptyState } from './components/display/EmptyState.svelte';
export { default as Table } from './components/display/Table.svelte';

/* ── Form ─────────────────────────────────────────────────────────────────── */
export { default as Field } from './components/form/Field.svelte';
export { default as TextField } from './components/form/TextField.svelte';
export { default as Textarea } from './components/form/Textarea.svelte';
export { default as Select } from './components/form/Select.svelte';
export { default as Checkbox } from './components/form/Checkbox.svelte';
export { default as RadioGroup } from './components/form/RadioGroup.svelte';
export { default as Switch } from './components/form/Switch.svelte';
export { default as Slider } from './components/form/Slider.svelte';
export { default as SegmentedControl } from './components/form/SegmentedControl.svelte';

/* ── Feedback ─────────────────────────────────────────────────────────────── */
export { default as Alert } from './components/feedback/Alert.svelte';
export { default as Progress } from './components/feedback/Progress.svelte';
export { default as Skeleton } from './components/feedback/Skeleton.svelte';
export { default as Spinner } from './components/feedback/Spinner.svelte';
export { default as Toaster } from './components/feedback/Toaster.svelte';

/* ── Overlay ──────────────────────────────────────────────────────────────── */
export { default as Dialog } from './components/overlay/Dialog.svelte';
export { default as BottomSheet } from './components/overlay/BottomSheet.svelte';
export { default as Popover } from './components/overlay/Popover.svelte';
export { default as Menu } from './components/overlay/Menu.svelte';
export { default as MenuItem } from './components/overlay/MenuItem.svelte';
export { default as Tooltip } from './components/overlay/Tooltip.svelte';
export { default as Scrim } from './components/overlay/Scrim.svelte';

/* ── Navigation ───────────────────────────────────────────────────────────── */
export { default as Tabs } from './components/navigation/Tabs.svelte';
export { default as TabPanels } from './components/navigation/TabPanels.svelte';
export { default as List } from './components/navigation/List.svelte';
export { default as ListItem } from './components/navigation/ListItem.svelte';
export { default as Accordion } from './components/navigation/Accordion.svelte';
export { default as AppBar } from './components/navigation/AppBar.svelte';
export { default as BottomNav } from './components/navigation/BottomNav.svelte';
export { default as Breadcrumb } from './components/navigation/Breadcrumb.svelte';

/* ── Layout (app shell) ───────────────────────────────────────────────────── */
export { default as AppShell } from './components/layout/AppShell.svelte';
export { default as Sidebar } from './components/layout/Sidebar.svelte';
export { default as SidebarSection } from './components/layout/SidebarSection.svelte';
export { default as SidebarItem } from './components/layout/SidebarItem.svelte';
export { default as TopBar } from './components/layout/TopBar.svelte';

/* ── Marketing (site chrome) ──────────────────────────────────────────────── */
export { default as SiteHeader } from './components/marketing/SiteHeader.svelte';
export { default as SiteFooter } from './components/marketing/SiteFooter.svelte';
export { default as CookieBar } from './components/marketing/CookieBar.svelte';

/* ── Data ─────────────────────────────────────────────────────────────────── */
export { default as CircularProgress } from './components/data/CircularProgress.svelte';
export { default as Sparkline } from './components/data/Sparkline.svelte';
export { default as BarChart } from './components/data/BarChart.svelte';
export { default as LineChart } from './components/data/LineChart.svelte';
export { default as Heatmap } from './components/data/Heatmap.svelte';
export { default as RankBars } from './components/data/RankBars.svelte';
export { default as ChartFrame } from './components/data/ChartFrame.svelte';
export {
  compact,
  niceDomain,
  seriesColor,
  extent,
  CHART_SLOTS,
  type Series
} from './components/data/chart.js';

/* ── Chat / agent ─────────────────────────────────────────────────────────── */
export { default as ChatMessage } from './components/chat/ChatMessage.svelte';
export { default as ChatThinking } from './components/chat/ChatThinking.svelte';
export { default as ChatToolCall } from './components/chat/ChatToolCall.svelte';
export { default as ChatAttachment } from './components/chat/ChatAttachment.svelte';
export { default as ChatCompaction } from './components/chat/ChatCompaction.svelte';
export { default as PromptInput } from './components/chat/PromptInput.svelte';

/* ── Motion ───────────────────────────────────────────────────────────────── */
export { default as Reveal } from './components/motion/Reveal.svelte';
export { default as Counter } from './components/motion/Counter.svelte';
export { default as Spatial } from './components/motion/Spatial.svelte';
export { default as SpatialItem } from './components/motion/SpatialItem.svelte';

/* ── Accessibility ────────────────────────────────────────────────────────── */
export { default as VisuallyHidden } from './components/a11y/VisuallyHidden.svelte';
export { default as SkipLink } from './components/a11y/SkipLink.svelte';

/* ── Theme ────────────────────────────────────────────────────────────────── */
export { default as ThemeProvider } from './components/theme/ThemeProvider.svelte';
export { default as ThemeToggle } from './components/theme/ThemeToggle.svelte';

/* ── State ────────────────────────────────────────────────────────────────── */
export { theme, themeScript, type ThemeMode, type ResolvedTheme } from './state/theme.svelte.js';
export {
  toast,
  toasts,
  type Toast,
  type ToastOptions,
  type ToastTone,
  type ToastAction
} from './state/toasts.svelte.js';
export { mediaQuery, breakpoint } from './state/media.svelte.js';

/* ── Actions ──────────────────────────────────────────────────────────────── */
export { ripple, type RippleOptions } from './actions/ripple.js';
export { press, type PressOptions } from './actions/press.js';
export { swipe, type SwipeOptions, type SwipeState } from './actions/swipe.js';
export { portal } from './actions/portal.js';
export { clickOutside, type ClickOutsideOptions } from './actions/click-outside.js';
export { focusTrap, type FocusTrapOptions } from './actions/focus-trap.js';
export { lockScroll } from './actions/scroll-lock.js';

/* ── Motion tokens & transitions ──────────────────────────────────────────── */
export { duration, easing, curve, bezier } from './motion/tokens.js';
export { fadeThrough, rise, slideEdge, collapse, scrim } from './motion/transitions.js';

/* ── Utils ────────────────────────────────────────────────────────────────── */
export { cn, type ClassValue } from './utils/cn.js';
export { announce, clearAnnouncers } from './utils/announce.js';
export {
  contrastRatio,
  contrastLevel,
  relativeLuminance,
  parseColor,
  flatten,
  mix,
  readTokenColor,
  type Rgba,
  type ContrastLevel
} from './utils/color.js';
export { uid } from './utils/id.js';
export { haptic, setHapticsEnabled, type HapticPattern } from './utils/haptics.js';
export { chain, prefersReducedMotion, isTouchPrimary, isTouchLike, matches } from './utils/events.js';
export {
  computePosition,
  originFor,
  type Placement,
  type PositionOptions,
  type PositionResult
} from './utils/position.js';

/* ── Types ────────────────────────────────────────────────────────────────── */
export type {
  Size,
  Tone,
  Emphasis,
  Align,
  ButtonVariant,
  TextVariant,
  FieldContext,
  SelectOption,
  RadioOption,
  SegmentOption,
  NavItem,
  BarDatum,
  ChatRole,
  ToolStatus,
  ChatFile
} from './types.js';
