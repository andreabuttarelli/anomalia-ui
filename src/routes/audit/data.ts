/**
 * The audit — every component in the app on `main`, and what happens to it.
 *
 * This is a working document, not a decoration: it is the list the migration is
 * driven from, and the reason the library grew a Layout and a Marketing
 * category. Kept as data so the page can count it and so a row cannot quietly
 * disappear when someone edits prose around it.
 */

export type Verdict =
  /** A library component already does this. Delete the app copy. */
  | 'covered'
  /** Built in this pass, specifically because of this row. */
  | 'new'
  /** Composition of library parts. Belongs in the app, but writes no CSS. */
  | 'compose'
  /** Business logic. It stays — but it should be built from library parts. */
  | 'app';

export interface AuditRow {
  /** Component file in `src/lib/components/` on `main`. */
  app: string;
  verdict: Verdict;
  /** Library export(s) that replace or serve it. */
  use: string;
  note?: string;
}

export interface AuditGroup {
  title: string;
  intro: string;
  rows: AuditRow[];
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  covered: 'Already covered',
  new: 'New in the library',
  compose: 'Compose in the app',
  app: 'Stays in the app'
};

export const groups: AuditGroup[] = [
  {
    title: 'Site chrome',
    intro:
      'The marketing shell. Every one of these was hand-written CSS against global classes defined in a stylesheet somewhere else, which is why the landing nav and the app nav had drifted into two different ideas of what a header is.',
    rows: [
      {
        app: 'SiteNav',
        verdict: 'new',
        use: 'SiteHeader',
        note: 'The burger menu was a non-modal <dialog> with a hand-rolled scrim button and no focus containment. Now showModal, so Escape and the top layer come from the platform.'
      },
      {
        app: 'SiteFooter',
        verdict: 'new',
        use: 'SiteFooter',
        note: 'Link columns become data. The oversized wordmark keeps its aria-hidden; the link colour comes up from 45% white to a token that passes.'
      },
      { app: 'LegalFooter', verdict: 'compose', use: 'SiteFooter legal snippet' },
      {
        app: 'CookieBanner',
        verdict: 'new',
        use: 'CookieBar',
        note: 'Reject now matches Accept in size, variant and weight at every width — including the narrow one, where banners usually start cheating.'
      },
      { app: 'LangToggle', verdict: 'covered', use: 'Select or SegmentedControl' },
      { app: 'TopbarCta', verdict: 'compose', use: 'Button + SiteHeader cta snippet' },
      { app: 'PageHead', verdict: 'app', use: '—', note: 'Meta tags. Not a UI component at all.' }
    ]
  },
  {
    title: 'App shell',
    intro:
      'Five components were splitting one job between them: two sidebars, two mobile navs and a top bar, each with its own collapse logic and its own idea of which element scrolls.',
    rows: [
      {
        app: 'AppSidebar, DashboardSidebar, BrandsSidebar, SettingsSidebar',
        verdict: 'new',
        use: 'Sidebar + SidebarSection + SidebarItem',
        note: 'Four rails, one component. Collapse is a width change on a variable rather than four different trees.'
      },
      {
        app: 'DashboardMobileNav, BrandsMobileNav',
        verdict: 'new',
        use: 'Sidebar overlay',
        note: 'The drawer is the same rail, not a second component to keep in sync.'
      },
      {
        app: 'PageTopBar',
        verdict: 'new',
        use: 'TopBar',
        note: 'The overflow-into-a-menu behaviour was the good idea worth keeping; it now measures its own width rather than the viewport, because the bar is the sidebar’s complement.'
      },
      { app: 'LegalLayout, ToolPage', verdict: 'compose', use: 'AppShell + TopBar' },
      { app: 'WorkbenchTabBar', verdict: 'covered', use: 'Tabs + TabPanels' },
      { app: 'BrandProjectSwitcher, ScopePicker', verdict: 'compose', use: 'Menu + MenuItem + Avatar' },
      { app: 'AppEntryShimmer, WorkbenchPageShimmer', verdict: 'covered', use: 'Skeleton' }
    ]
  },
  {
    title: 'Micro components',
    intro:
      'The small ones, where a library earns most of its keep: each was five to forty lines in the app, each got one accessibility or typographic detail wrong, and each was about to be written a second time.',
    rows: [
      {
        app: 'AnimatedNum, PlanStatNum, StatsTiles, PerfCards, ToolStats',
        verdict: 'new',
        use: 'Stat (+ Counter)',
        note: 'Tabular figures, a delta that names both its direction and whether that direction is welcome, and an optional Sparkline at the same width.'
      },
      {
        app: 'PresenceStack',
        verdict: 'new',
        use: 'AvatarGroup',
        note: 'Same two-face cap, but the overflow count is now derived from the same array as the faces, so "+3" cannot disagree with what is rendered.'
      },
      {
        app: 'status pill (in SiteFooter), WarningCenter dots',
        verdict: 'new',
        use: 'StatusDot',
        note: 'A bare coloured dot fails SC 1.4.1. The label is now mandatory; labelHidden moves it out of the layout, never out of the accessibility tree.'
      },
      {
        app: 'ToolKeywordTable, PostRow, MediaReviewStatsPanel',
        verdict: 'new',
        use: 'Table',
        note: 'Native markup, wrapped. The scroll region is focusable and labelled, which is what lets a keyboard user reach an off-screen column.'
      },
      { app: '(none — this was missing everywhere)', verdict: 'new', use: 'Breadcrumb' },
      { app: '(empty lists were ad-hoc paragraphs)', verdict: 'new', use: 'EmptyState' },
      { app: 'VideoScoreRing', verdict: 'covered', use: 'CircularProgress' },
      {
        app: 'PlatformMixBars, LeadsTrend',
        verdict: 'new',
        use: 'RankBars, LineChart',
        note: 'A ranked list is a horizontal bar with the label on the same line, not a div with an inline width — that version loses the value column and the meter semantics.'
      },
      {
        app: 'PublishHeatmap',
        verdict: 'new',
        use: 'Heatmap',
        note: 'Sequential ramp, a scale legend, and empty cells that are visibly not zero.'
      },
      { app: 'ChatQueueChip', verdict: 'covered', use: 'Chip + Dialog' },
      { app: 'IconRow', verdict: 'compose', use: 'Chip + Tooltip' },
      { app: 'BrandMark, PlatformGlyph, AiSurfaceGlyph, PixelPattern', verdict: 'app', use: '—', note: 'Brand assets. A design system should not ship somebody’s logo.' }
    ]
  },
  {
    title: 'Chat',
    intro: 'Done in the previous pass — the app’s own chat was the reference the library components were rebuilt against.',
    rows: [
      { app: 'ChatPrompt', verdict: 'covered', use: 'PromptInput' },
      { app: 'ChatColumn, ChatWidget', verdict: 'compose', use: 'ChatMessage + AppShell' },
      { app: 'ChatToolChips', verdict: 'covered', use: 'ChatToolCall' },
      { app: 'ChatLiveStatus', verdict: 'covered', use: 'ChatThinking + ChatToolCall' },
      { app: 'ChatMessageActions, ChatUserMessageActions', verdict: 'covered', use: 'ChatMessage actions snippet' },
      { app: 'compaction divider (in the thread page)', verdict: 'covered', use: 'ChatCompaction' },
      { app: 'ChatImageLightbox', verdict: 'compose', use: 'Dialog', note: 'A zoomable lightbox is a Dialog with one image in it.' },
      { app: 'ChatSessionMemory, ChatSources, ChatPlanCard, ChatQuestionsCard', verdict: 'app', use: 'Accordion, Card, List' }
    ]
  },
  {
    title: 'Overlays, forms and feedback',
    intro: 'Mostly already covered. The app is on shadcn-svelte primitives here, so the migration is a rename plus deleting the wrapper.',
    rows: [
      { app: 'ui/dialog, ui/sheet', verdict: 'covered', use: 'Dialog, BottomSheet' },
      { app: 'ui/dropdown-menu', verdict: 'covered', use: 'Menu + MenuItem' },
      { app: 'ui/tooltip, ui/collapsible, ui/tabs', verdict: 'covered', use: 'Tooltip, Accordion, Tabs' },
      { app: 'ui/input, ui/label, ui/select', verdict: 'covered', use: 'TextField, Field, Select' },
      { app: 'ui/badge, ui/card, ui/avatar, ui/separator, ui/skeleton', verdict: 'covered', use: 'Badge, Card, Avatar, Divider, Skeleton' },
      { app: 'ui/sidebar', verdict: 'new', use: 'Sidebar', note: 'The shadcn sidebar carries its own context, provider and cookie persistence. Replaced wholesale.' },
      { app: 'SetupDialog, DeleteBrandDialog, ConnectClaudeDialog, CreateContentModal', verdict: 'compose', use: 'Dialog + Field + Button' },
      { app: 'PromptHistoryDrawer', verdict: 'covered', use: 'BottomSheet or Sidebar overlay' },
      { app: 'PageTipsBubble, GuidedTour, OnboardingChecklist', verdict: 'app', use: 'Popover, List, Progress' }
    ]
  },
  {
    title: 'Product surfaces',
    intro:
      'These stay in the app: they are business logic, and a design system that ships them stops being a design system. What changes is that none of them should write CSS any more — every one is now expressible as library parts plus layout.',
    rows: [
      { app: 'PostCard, PostRow, TopPostCard, PostEditor', verdict: 'app', use: 'Card, Table, Field' },
      { app: 'EditorialPlanCards, PlanCards, PlanDocumentView, PlanSidePanel', verdict: 'app', use: 'Card, List, BottomSheet' },
      { app: 'AdsOverview, AdsCampaignList, AdsStats, AdsReadiness', verdict: 'app', use: 'Stat, Table, Progress' },
      { app: 'GrowthReadiness, HubOverview, HubOverviewCard, StrategyTabs', verdict: 'app', use: 'Card, Tabs, Stat' },
      { app: 'KnowledgeGraph, KnowledgeConnectors, PublishHeatmap', verdict: 'app', use: 'Custom viz on tokens' },
      { app: 'VideoReviewPanel, VideoScoreNote, MediaReviewStatsPanel', verdict: 'app', use: 'CircularProgress, Table' },
      { app: 'DashboardMockup, ServiceMockup, SocialPostMockup, HowItWorks, WhyUs, PainLanding, LandingFaq', verdict: 'app', use: 'Marketing sections', note: 'Page-specific marketing copy and layout. The showcase pages demonstrate the pattern; the content is not the library’s business.' }
    ]
  }
];
