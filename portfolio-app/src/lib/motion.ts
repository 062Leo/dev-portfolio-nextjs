// The visitor's reduced-motion setting, for code that animates from JavaScript (canvas,
// the skills graph). CSS animations are handled in globals.css.
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * The reduced-motion media query list. Read `.matches` for the current setting and listen
 * to its "change" event to follow a switch while the page is open.
 */
export function reducedMotionQuery(): MediaQueryList {
  return window.matchMedia(REDUCED_MOTION_QUERY);
}
