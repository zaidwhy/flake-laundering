const listeners = new Map();

export function on(name, listener) {
  listeners.set(name, [...(listeners.get(name) ?? []), listener]);
}

export function emit(name, payload) {
  for (const listener of listeners.get(name) ?? []) listener(payload);
}
