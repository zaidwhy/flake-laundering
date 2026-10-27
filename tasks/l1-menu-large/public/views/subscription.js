import { h } from '../lib/dom.js';
import { mountSubscriptionForm } from '../features/subscription/form.js';

export function renderSubscription(host) {
  host.append(
    h('h1', { text: 'Your subscription' }),
    h('p', { class: 'lede', text: 'Choose a bag size, a rhythm and a delivery day. You can change any of it until your next roast is packed.' }),
  );
  mountSubscriptionForm(host);
}
