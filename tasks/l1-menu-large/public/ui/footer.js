import { h } from '../lib/dom.js';
import { mountNewsletter } from '../features/newsletter/newsletter.js';

export function mountFooter(footer) {
  const signup = h('div');
  mountNewsletter(signup);
  footer.replaceChildren(
    h('div', { class: 'footer-inner' },
      h('div', {},
        h('strong', { text: 'Larkspur Coffee' }),
        h('p', { class: 'small-print', text: 'Small-batch beans, roasted every Wednesday.' }),
        h('p', { class: 'small-print', text: 'Orders placed on Friday or later ship the following week.' }),
      ),
      signup,
    ),
  );
}
