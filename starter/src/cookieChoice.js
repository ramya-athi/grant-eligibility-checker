// The cookie banner choice is kept in the browser's local storage (the service sets no cookies).
// It is stored with an expiry date, so people are asked again after a year, as GOV.UK services do.
export const COOKIE_CHOICE_KEY = 'green-home-grant-cookie-choice';
export const CHOICE_LIFETIME_DAYS = 365;
const DAY = 24 * 60 * 60 * 1000;
const CHOICES = ['accepted', 'rejected'];

// Returns 'accepted', 'rejected' or null (no choice yet, expired, or unreadable).
export function readChoice(storage = localStorage, now = Date.now()) {
  let raw;
  try {
    raw = storage.getItem(COOKIE_CHOICE_KEY);
  } catch {
    return null;
  }
  if (raw === null || raw === undefined) return null;

  // Earlier versions stored the bare word; keep that choice and give it an expiry date.
  if (CHOICES.includes(raw)) {
    saveChoice(raw, storage, now);
    return raw;
  }

  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return null;
  }
  const valid = saved && CHOICES.includes(saved.choice) && Number.isFinite(saved.expires);
  if (!valid || saved.expires <= now) {
    try {
      storage.removeItem(COOKIE_CHOICE_KEY);
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
    return null;
  }
  return saved.choice;
}

export function saveChoice(choice, storage = localStorage, now = Date.now()) {
  try {
    storage.setItem(COOKIE_CHOICE_KEY, JSON.stringify({ choice, expires: now + CHOICE_LIFETIME_DAYS * DAY }));
  } catch {
    // Remembering the choice is optional; the banner will simply show again next time.
  }
}
