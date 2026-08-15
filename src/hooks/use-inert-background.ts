import { useEffect } from "react";

/**
 * Mirrors Radix's `aria-hidden` onto the `inert` attribute for the background.
 *
 * When a Radix dialog/sheet opens it marks the sibling content `aria-hidden`,
 * which hides it from assistive tech — but this version does not also apply
 * `inert`, so those siblings stay in the tab order. Radix's focus scope traps
 * focus at runtime, yet a static check (and, in edge cases, some AT) still sees
 * focusable elements inside an aria-hidden subtree. Reflecting `aria-hidden`
 * onto `inert` makes the background genuinely inert while a modal is open, and
 * removes it again on close.
 */
export function useInertBackground() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const sync = (el: Element) => {
      const hidden = el.getAttribute("aria-hidden") === "true";
      if (hidden && !el.hasAttribute("inert")) {
        el.setAttribute("inert", "");
      } else if (!hidden && el.hasAttribute("inert")) {
        el.removeAttribute("inert");
      }
    };

    // Only the elements present at mount are the "background". Portals that
    // Radix appends later (the dialog itself) are intentionally left alone.
    const backgroundChildren = Array.from(document.body.children);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "aria-hidden") {
          sync(mutation.target as Element);
        }
      }
    });

    for (const child of backgroundChildren) {
      observer.observe(child, { attributes: true, attributeFilter: ["aria-hidden"] });
      sync(child);
    }

    return () => observer.disconnect();
  }, []);
}
