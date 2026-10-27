import { h } from '../lib/dom.js';

export function confirmAction({ title, body, confirmLabel }) {
  return new Promise((resolve) => {
    const overlay = h('div', { class: 'overlay' });

    function finish(answer) {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      resolve(answer);
    }

    function onKey(event) {
      if (event.key === 'Escape') finish(false);
    }

    overlay.append(
      h('div', { class: 'dialog', role: 'alertdialog', 'aria-label': title },
        h('h2', { text: title }),
        h('p', { text: body }),
        h('div', { class: 'row' },
          h('button', { type: 'button', id: 'confirm-cancel', onclick: () => finish(false), text: 'Keep it' }),
          h('button', { type: 'button', class: 'primary', id: 'confirm-accept', onclick: () => finish(true), text: confirmLabel }),
        ),
      ),
    );
    document.addEventListener('keydown', onKey);
    document.body.append(overlay);
    overlay.querySelector('#confirm-cancel').focus();
  });
}
