import { renderGreeting } from './header/session.js';
import { startApp } from './app.js';

startApp();

const session = await (await fetch('/api/session')).json();
renderGreeting(session);

const { mountMenu } = await import('./header/menu.js');
mountMenu(document.querySelector('#menu-button'), document.querySelector('#site-menu'));
