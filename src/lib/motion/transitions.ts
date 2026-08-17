import type { TransitionConfig } from 'svelte/transition';
import { curve, duration } from './tokens.js';
import { prefersReducedMotion } from '../utils/events.js';

interface BaseParams {
  delay?: number;
  duration?: number;
}

/** Reduced motion collapses every transition to an instant opacity swap. */
function timing(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}

/**
 * Material's fade-through: content leaves fast and arrives slow, so the eye
 * follows the incoming element rather than the outgoing one.
 */
export function fadeThrough(
  _node: Element,
  { delay = 0, duration: ms = duration.medium2 }: BaseParams = {}
): TransitionConfig {
  return {
    delay,
    duration: timing(ms),
    easing: curve.standard,
    css: (t) => `opacity: ${t}`
  };
}

export interface RiseParams extends BaseParams {
  /** Travel distance in px. */
  y?: number;
  /** Starting scale — a hair under 1 reads as "arriving", not "growing". */
  start?: number;
}

/**
 * The workhorse entrance for menus, popovers and dialogs: rise, scale and fade
 * on the emphasized-decelerate curve. Feels like the surface settled into place.
 */
export function rise(
  _node: Element,
  { delay = 0, duration: ms = duration.medium2, y = 8, start = 0.96 }: RiseParams = {}
): TransitionConfig {
  return {
    delay,
    duration: timing(ms),
    easing: curve.emphasizedDecelerate,
    css: (t, u) =>
      `opacity: ${t}; transform: translate3d(0, ${u * y}px, 0) scale(${start + (1 - start) * t}); transform-origin: var(--an-transform-origin, center)`
  };
}

export interface SlideEdgeParams extends BaseParams {
  edge?: 'top' | 'bottom' | 'left' | 'right';
  /** Distance to travel. Defaults to the element's own size on that axis. */
  distance?: number;
}

/** Sheets and side panels entering from an edge of the viewport. */
export function slideEdge(
  node: Element,
  { delay = 0, duration: ms = duration.medium4, edge = 'bottom', distance }: SlideEdgeParams = {}
): TransitionConfig {
  const rect = node.getBoundingClientRect();
  const axis = edge === 'left' || edge === 'right' ? 'X' : 'Y';
  const size = distance ?? (axis === 'X' ? rect.width : rect.height);
  const sign = edge === 'bottom' || edge === 'right' ? 1 : -1;

  return {
    delay,
    duration: timing(ms),
    easing: curve.emphasizedDecelerate,
    css: (_t, u) => `transform: translate${axis}(${u * size * sign}px)`
  };
}

/** Height collapse for accordions and expandable rows, on the standard curve. */
export function collapse(
  node: Element,
  { delay = 0, duration: ms = duration.medium1 }: BaseParams = {}
): TransitionConfig {
  const style = getComputedStyle(node);
  const height = parseFloat(style.height);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);

  return {
    delay,
    duration: timing(ms),
    easing: curve.emphasized,
    css: (t) =>
      `overflow: hidden; height: ${t * height}px; padding-top: ${t * paddingTop}px; padding-bottom: ${t * paddingBottom}px; opacity: ${Math.min(1, t * 1.6)}`
  };
}

/** Scrim behind modal surfaces. */
export function scrim(
  _node: Element,
  { delay = 0, duration: ms = duration.medium2 }: BaseParams = {}
): TransitionConfig {
  return { delay, duration: timing(ms), easing: curve.standard, css: (t) => `opacity: ${t}` };
}
