const handlers = new Map();

export function on(name, handler) {
  if (!handlers.has(name)) handlers.set(name, new Set());
  handlers.get(name).add(handler);
  return () => handlers.get(name).delete(handler);
}

export function emit(name, detail) {
  for (const handler of handlers.get(name) ?? []) handler(detail);
}
