const PENDING_SECTION_SCROLL_KEY = "pending-section-scroll";

type PendingSectionScroll = {
  pathname: string;
  id: string;
};

export function queuePendingSectionScroll(pathname: string, id: string) {
  if (typeof window === "undefined") return;

  const pending: PendingSectionScroll = { pathname, id };
  window.sessionStorage.setItem(
    PENDING_SECTION_SCROLL_KEY,
    JSON.stringify(pending),
  );
}

export function resolvePendingSectionScroll(pathname: string) {
  if (typeof window === "undefined") return null;

  const hash = decodeURIComponent(window.location.hash.replace("#", ""));
  if (hash) return hash;

  const raw = window.sessionStorage.getItem(PENDING_SECTION_SCROLL_KEY);
  if (!raw) return null;

  try {
    const pending = JSON.parse(raw) as Partial<PendingSectionScroll>;
    if (pending.pathname === pathname && typeof pending.id === "string") {
      return pending.id;
    }
  } catch {
    window.sessionStorage.removeItem(PENDING_SECTION_SCROLL_KEY);
  }

  return null;
}

export function clearPendingSectionScroll(pathname: string, id: string) {
  if (typeof window === "undefined") return;

  const raw = window.sessionStorage.getItem(PENDING_SECTION_SCROLL_KEY);
  if (!raw) return;

  try {
    const pending = JSON.parse(raw) as Partial<PendingSectionScroll>;
    if (pending.pathname === pathname && pending.id === id) {
      window.sessionStorage.removeItem(PENDING_SECTION_SCROLL_KEY);
    }
  } catch {
    window.sessionStorage.removeItem(PENDING_SECTION_SCROLL_KEY);
  }
}
