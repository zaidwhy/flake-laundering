import { h } from './lib/dom.js';
import { emit } from './lib/events.js';

const fallbackPath = '/';

export function currentQuery() {
  const hash = window.location.hash.replace(/^#/, '');
  return new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
}

export function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash === '' ? fallbackPath : hash.split('?')[0];
}

function renderNotFound(host, path) {
  host.replaceChildren(
    h('h1', { text: 'Page not found' }),
    h('p', { class: 'empty', text: `Nothing lives at ${path}.` }),
    h('a', { href: '#/', text: 'Back to the beans' }),
  );
}

export function startRouter(host, routes) {
  function show() {
    const path = currentPath();
    const route = routes[path];
    if (route) {
      host.replaceChildren();
      route.render(host, currentQuery());
      document.title = `${route.title} - Larkspur Coffee`;
    } else {
      renderNotFound(host, path);
      document.title = 'Not found - Larkspur Coffee';
    }
    window.scrollTo(0, 0);
    emit('route:changed', { path });
  }
  window.addEventListener('hashchange', show);
  show();
}
