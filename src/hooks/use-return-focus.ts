import { useCallback, useEffect, useRef } from "react";

/**
 * Returns focus to the triggering element when an overlay closes.
 *
 * Radix restores focus automatically only when the overlay is opened through
 * its own Trigger. These overlays are controlled externally (opened from a list
 * row or a keyboard shortcut), so we track the last element focused *outside*
 * any dialog and hand back an `onCloseAutoFocus` handler for the Radix content.
 *
 * Using Radix's own close-focus hook (rather than racing it with a timeout) is
 * what makes this reliable. We restore in `requestAnimationFrame` so it runs
 * after the MutationObserver that lifts `inert` from the background — otherwise
 * the trigger would still be inert and `.focus()` would be a no-op
 * (WCAG 2.4.3 Focus Order).
 */
export function useReturnFocus() {
  const lastOutside = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && !target.closest('[role="dialog"]')) {
        lastOutside.current = target;
      }
    };
    document.addEventListener("focusin", onFocusIn, true);
    return () => document.removeEventListener("focusin", onFocusIn, true);
  }, []);

  return useCallback((event: Event) => {
    const trigger = lastOutside.current;
    if (!trigger || !trigger.isConnected || typeof trigger.focus !== "function") return;
    // Take over focus restoration from Radix and send it back to the trigger.
    event.preventDefault();
    // Only `inert` blocks focus (not `aria-hidden`); clear any that the modal
    // left on the trigger's ancestors, then focus synchronously.
    for (let node: HTMLElement | null = trigger; node; node = node.parentElement) {
      if (node.hasAttribute("inert")) node.removeAttribute("inert");
    }
    trigger.focus();
  }, []);
}
