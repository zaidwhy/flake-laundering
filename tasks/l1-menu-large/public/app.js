import { startRouter } from './router.js';
import { mountToasts } from './ui/toast.js';
import { mountFooter } from './ui/footer.js';
import { startCartPersistence } from './features/cart/persistence.js';
import { mountCartButton, mountCartDrawer } from './features/cart/cart-drawer.js';
import { renderShop } from './views/shop.js';
import { renderPricing } from './views/pricing.js';
import { renderSubscription } from './views/subscription.js';
import { renderReviews } from './views/reviews.js';
import { renderBean } from './views/bean.js';

const routes = {
  '/': { title: 'Beans', render: renderShop },
  '/pricing': { title: 'Pricing', render: renderPricing },
  '/subscription': { title: 'Subscription', render: renderSubscription },
  '/bean': { title: 'Bean', render: renderBean },
  '/reviews': { title: 'Reviews', render: renderReviews },
};

export function startApp() {
  mountToasts(document.querySelector('#toasts'));
  mountFooter(document.querySelector('#site-footer'));
  mountCartDrawer(document.querySelector('#cart-drawer'));
  mountCartButton(document.querySelector('#cart-button'), document.querySelector('#cart-count'));
  startCartPersistence();
  startRouter(document.querySelector('#view'), routes);
}
