export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right';

export interface PositionResult {
  x: number;
  y: number;
  /** Where it actually landed after flipping — drive the arrow/origin from this. */
  placement: Placement;
}

export interface PositionOptions {
  placement?: Placement;
  /** Gap between anchor and floating element, in px. */
  offset?: number;
  /** Minimum distance from the viewport edge. */
  padding?: number;
}

/**
 * Anchored positioning for popovers, menus and tooltips.
 *
 * A deliberate ~60 lines instead of a positioning engine dependency: it does
 * the two things that actually matter — flip to the opposite side when the
 * preferred one does not fit, then clamp along the cross axis so the surface
 * never leaves the viewport. Coordinates are viewport-relative, to be used with
 * `position: fixed`, which keeps them correct inside transformed ancestors.
 *
 * If you need collision detection against arbitrary scroll containers or
 * virtual anchors, reach for a real engine — this is intentionally the 90% case.
 */
export function computePosition(
  anchor: DOMRect,
  floating: { width: number; height: number },
  { placement = 'bottom-start', offset = 8, padding = 8 }: PositionOptions = {}
): PositionResult {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const side = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
  const alignment = placement.split('-')[1] as 'start' | 'end' | undefined;

  const fits = (candidate: typeof side) => {
    if (candidate === 'top') return anchor.top - floating.height - offset >= padding;
    if (candidate === 'bottom') return anchor.bottom + floating.height + offset <= viewport.height - padding;
    if (candidate === 'left') return anchor.left - floating.width - offset >= padding;
    return anchor.right + floating.width + offset <= viewport.width - padding;
  };

  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;
  const finalSide = fits(side) || !fits(opposite[side]) ? side : opposite[side];

  let x: number;
  let y: number;

  if (finalSide === 'top' || finalSide === 'bottom') {
    y = finalSide === 'top' ? anchor.top - floating.height - offset : anchor.bottom + offset;
    x =
      alignment === 'end'
        ? anchor.right - floating.width
        : alignment === 'start'
          ? anchor.left
          : anchor.left + anchor.width / 2 - floating.width / 2;
  } else {
    x = finalSide === 'left' ? anchor.left - floating.width - offset : anchor.right + offset;
    y = anchor.top + anchor.height / 2 - floating.height / 2;
  }

  // Clamp inside the viewport; `max` guards the case where the surface is
  // bigger than the viewport itself, where clamping both ends is impossible.
  x = Math.max(padding, Math.min(x, viewport.width - floating.width - padding));
  y = Math.max(padding, Math.min(y, viewport.height - floating.height - padding));

  return {
    x,
    y,
    placement: (alignment ? `${finalSide}-${alignment}` : finalSide) as Placement
  };
}

/** CSS `transform-origin` matching a placement, so surfaces scale from the anchor. */
export function originFor(placement: Placement): string {
  const [side, alignment] = placement.split('-');
  if (side === 'top') return alignment === 'end' ? 'bottom right' : alignment === 'start' ? 'bottom left' : 'bottom center';
  if (side === 'bottom') return alignment === 'end' ? 'top right' : alignment === 'start' ? 'top left' : 'top center';
  return side === 'left' ? 'right center' : 'left center';
}
