// Element resolvers: meaningful ancestor, tagType, label, selector, viewName.

const CLICKABLE_ROLES = new Set([
  "button",
  "link",
  "tab",
  "menuitem",
  "option",
  "checkbox",
  "radio",
  "switch",
]);

const CLICKABLE_TAGS = new Set(["button", "a", "summary", "label"]);

export function findMeaningfulClickable(el: Element | null): Element | null {
  let node: Element | null = el;
  let depth = 0;
  while (node && depth < 12) {
    const tag = node.tagName?.toLowerCase();
    const role = node.getAttribute?.("role");
    if (tag && CLICKABLE_TAGS.has(tag)) return node;
    if (role && CLICKABLE_ROLES.has(role)) return node;
    if (node.hasAttribute?.("data-track-as")) return node;
    node = node.parentElement;
    depth++;
  }
  return el;
}

function ariaRoleTagType(role: string): string | null {
  switch (role) {
    case "tab":
      return "tab";
    case "menuitem":
      return "menu item";
    case "combobox":
    case "listbox":
      return "dropdown";
    case "dialog":
      return "dialog";
    case "switch":
      return "toggle switch";
    case "checkbox":
      return "checkbox";
    case "radio":
      return "radio";
    case "slider":
      return "slider";
    case "link":
      return "hyperlink";
    case "button":
      return "button";
    case "option":
      return "list option";
    case "menu":
      return "menu";
    case "navigation":
      return "sidebar item";
    default:
      return null;
  }
}

function tagBasedTagType(el: Element): string | null {
  const tag = el.tagName.toLowerCase();
  if (tag === "a") return "hyperlink";
  if (tag === "select") return "dropdown";
  if (tag === "textarea") return "text area";
  if (tag === "form") return "form";
  if (tag === "img") return "image";
  if (/^h[1-6]$/.test(tag)) return "heading";
  if (tag === "input") {
    const t = (el.getAttribute("type") || "text").toLowerCase();
    switch (t) {
      case "checkbox":
        return "checkbox";
      case "radio":
        return "radio";
      case "range":
        return "slider";
      case "file":
        return "file picker";
      case "search":
        return "search field";
      case "submit":
      case "button":
      case "reset":
        return "button";
      default:
        return "text input";
    }
  }
  if (tag === "summary") return "disclosure";
  if (tag === "label") return "label";
  return null;
}

function ancestorContextTagType(el: Element): string {
  let node: Element | null = el.parentElement;
  let depth = 0;
  while (node && depth < 8) {
    const region = node.getAttribute?.("data-track-region");
    const role = node.getAttribute?.("role");
    const tag = node.tagName.toLowerCase();
    const cls = (node.getAttribute("class") || "").toLowerCase();

    if (region === "sidebar" || tag === "aside") return "sidebar item";
    if (region === "toolbar" || tag === "header" || role === "toolbar") return "button";
    if (role === "tablist") return "tab";
    if (role === "menu") return "menu item";
    if (role === "listbox") return "list option";
    if (tag === "nav" || role === "navigation") return "sidebar item";
    if (tag === "li" || role === "listitem") return "list item";
    if (/\bcard\b/.test(cls)) return "card";
    if (/\bchip\b/.test(cls)) return "chip";
    if (/\bbadge\b/.test(cls)) return "badge";

    node = node.parentElement;
    depth++;
  }
  return "button";
}

export function resolveTagType(el: Element): string {
  // 1. Explicit override
  const explicit = el.getAttribute("data-track-as");
  if (explicit) return explicit;

  // 2. ARIA role
  const role = el.getAttribute("role");
  if (role) {
    const fromRole = ariaRoleTagType(role);
    if (fromRole) return fromRole;
  }

  // 3. Popover / disclosure inference
  const hp = el.getAttribute("aria-haspopup");
  if (hp === "menu") return "menu item";
  if (hp === "listbox") return "dropdown";
  if (hp === "dialog") return "disclosure";
  if (el.hasAttribute("aria-expanded")) return "disclosure";

  // 4. Tag
  const fromTag = tagBasedTagType(el);
  if (fromTag) return fromTag;

  // 5. Ancestor context for plain <button>
  if (el.tagName.toLowerCase() === "button") return ancestorContextTagType(el);

  return "element";
}

export function resolveLabel(el: Element): string | null {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.slice(0, 80);
  const title = el.getAttribute("title");
  if (title) return title.slice(0, 80);
  const text = (el as HTMLElement).innerText || el.textContent || "";
  const trimmed = text.replace(/\s+/g, " ").trim();
  return trimmed ? trimmed.slice(0, 80) : null;
}

export function resolveSelector(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  let depth = 0;
  while (node && depth < 4 && node.nodeType === 1) {
    let part = node.tagName.toLowerCase();
    if (node.id) {
      part += `#${node.id}`;
      parts.unshift(part);
      break;
    }
    const cls = (node.getAttribute("class") || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .join(".");
    if (cls) part += `.${cls}`;
    parts.unshift(part);
    node = node.parentElement;
    depth++;
  }
  return parts.join(" > ");
}

export function resolveViewName(el?: Element | null): string {
  // 1. [data-view-name] ancestor
  if (el) {
    const named = el.closest?.("[data-view-name]") as HTMLElement | null;
    if (named) {
      const v = named.getAttribute("data-view-name");
      if (v) return v;
    }
  }
  const namedAny = document.querySelector("[data-view-name]") as HTMLElement | null;
  if (namedAny) {
    const v = namedAny.getAttribute("data-view-name");
    if (v) return v;
  }
  // 2. Open dialog aria-label
  const dialog = document.querySelector('[role="dialog"][aria-label]') as HTMLElement | null;
  if (dialog) {
    const v = dialog.getAttribute("aria-label");
    if (v) return v;
  }
  // 3. First h1/h2
  const h = document.querySelector("h1, h2") as HTMLElement | null;
  if (h && h.innerText) return h.innerText.trim().slice(0, 80);
  // 4. document.title
  return document.title || "";
}
