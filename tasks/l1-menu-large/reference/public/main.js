import { renderGreeting } from './header/session.js';
import { mountMenu } from './header/menu.js';
import { startApp } from './app.js';

startApp();
mountMenu(document.querySelector('#menu-button'), document.querySelector('#site-menu'));

const session = await (await fetch('/api/session')).json();
renderGreeting(session);
