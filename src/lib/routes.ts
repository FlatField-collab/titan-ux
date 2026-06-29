import { useCallback } from "react";
import {
  type NavigateOptions,
  type To,
  useNavigate,
} from "react-router-dom";

/**
 * Single source of truth for every route/screen that is fully built and
 * intended to be reachable in this prototype. Keep in sync with the
 * <Routes> declaration in `src/App.tsx`.
 *
 * Patterns use `:param` segments the same way React Router does. Query
 * strings and hash fragments are stripped before matching.
 */
export const BUILT_ROUTES: readonly string[] = [
  "/",
  "/dashboard",
  "/team",
  "/team/:id",
  "/docs",
  "/Docs",
  "/docs/:id",
  "/visits/:id",
  "/performance",
  "/competencies",
  "/competency",
  "/competency/:id",
  "/competency/send",
  "/chat/:topic",
  "/tech/:id",
  "/tech/:id/vehicle",
  "/map",
  "/map/filters",
  "/techlocation",
  "/map/trail",
  "/vride",
  "/research",
  "/news",
  "/news/:id",
];

const ROUTE_REGEXES: RegExp[] = BUILT_ROUTES.map((pattern) => {
  const source = pattern
    .split("/")
    .map((seg) => (seg.startsWith(":") ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    .join("/");
  return new RegExp(`^${source}/?$`);
});

/** Returns true when `path` resolves to a built screen. */
export function isBuiltRoute(path: string): boolean {
  const clean = path.split("?")[0].split("#")[0] || "/";
  return ROUTE_REGEXES.some((re) => re.test(clean));
}

/**
 * Drop-in replacement for `useNavigate` that guards every destination
 * against the built-routes registry.
 *
 * - Built destination → behaves exactly like `navigate(to, opts)`.
 * - Numeric (back/forward) destinations → pass through unchanged.
 * - Unbuilt destination → no navigation occurs. The most recent tracked
 *   click is tagged with `wired: false` via the tracker's global hook,
 *   and a brief tap-flash is applied to the last interactive element
 *   so the tap still feels responsive.
 */
export function useGuardedNavigate() {
  const navigate = useNavigate();
  return useCallback(
    (to: To | number, opts?: NavigateOptions) => {
      if (typeof to === "number") {
        navigate(to);
        return;
      }
      const path = typeof to === "string" ? to : to.pathname ?? "/";
      if (isBuiltRoute(path)) {
        navigate(to as To, opts);
        return;
      }
      if (typeof window !== "undefined") {
        const blocked = (window as unknown as { __uxBlockedTap?: () => void })
          .__uxBlockedTap;
        blocked?.();
      }
    },
    [navigate],
  );
}
