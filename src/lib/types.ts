/** Shared vocabulary — every component picks its props from these unions so
 *  `size="md"` means the same thing on a button, an input and an avatar. */

export type Size = 'sm' | 'md' | 'lg';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** How much visual weight a surface carries. */
export type Emphasis = 'solid' | 'soft' | 'outline' | 'ghost';

export type Align = 'start' | 'center' | 'end';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/** What `Field` hands to the control it wraps, so ARIA wiring happens once. */
export interface FieldContext {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioOption extends SelectOption {
  hint?: string;
}

export interface SegmentOption extends SelectOption {
  /** Optional badge/count rendered after the label. */
  badge?: string | number;
}

export interface BarDatum {
  label: string;
  value: number;
  tone?: Tone;
}

/** Who produced a message in an agent transcript. */
export type ChatRole = 'user' | 'assistant' | 'system';

/** Lifecycle of a single tool call. */
export type ToolStatus = 'pending' | 'running' | 'success' | 'error';

export interface ChatFile {
  id: string;
  name: string;
  /** Bytes. Rendered human-readable by the component. */
  size?: number;
  /** MIME type or a short kind: `image`, `pdf`, `csv`… */
  kind?: string;
  /** Object URL or remote URL for image previews. */
  url?: string;
}

export interface NavItem {
  value: string;
  label: string;
  href?: string;
  /** A number renders a count, `true` renders a dot. */
  badge?: number | boolean;
}

/** Somebody rendered as a face: presence stacks, assignees, collaborators. */
export interface Person {
  /** Stable key. Falls back to `name`, which is fine until two people share one. */
  id?: string;
  name: string;
  avatar?: string | null;
}

/** One step in a breadcrumb trail. The last entry is the current page. */
export interface Crumb {
  label: string;
  href?: string;
}

/** A link in a site footer column or a nav menu. */
export interface SiteLink {
  label: string;
  href: string;
  /** Opens in a new tab and gets the usual rel hardening. */
  external?: boolean;
  /** Renders a `<button>` instead of an `<a>` — cookie settings, sign out. */
  onclick?: () => void;
}

/** The type ramp, from the biggest marketing headline down to a table caption. */
export type TextVariant =
  | 'display'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'callout'
  | 'body'
  | 'footnote'
  | 'caption';
