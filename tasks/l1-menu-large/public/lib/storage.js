export function loadJson(key, fallback) {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or disabled; the cart still works for this visit.
  }
}
