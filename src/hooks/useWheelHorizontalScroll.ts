import { useEffect } from "react";

/**
 * Enables vertical mouse-wheel to scroll horizontal containers
 * (any element with `overflow-x: auto` whose content overflows horizontally
 * but does not overflow vertically). This makes horizontal carousels
 * scrollable on desktop where there's no touch input.
 */
export const useWheelHorizontalScroll = () => {
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0 || e.shiftKey) return;
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        const overflowX = style.overflowX;
        const canScrollX =
          (overflowX === "auto" || overflowX === "scroll") &&
          el.scrollWidth > el.clientWidth;
        const canScrollY = el.scrollHeight > el.clientHeight;
        if (canScrollX && !canScrollY) {
          el.scrollLeft += e.deltaY;
          e.preventDefault();
          return;
        }
        if (canScrollY) return;
        el = el.parentElement;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
};
