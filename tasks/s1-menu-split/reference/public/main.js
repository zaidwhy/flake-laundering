import { renderGreeting } from './session.js';
import { mountMenu } from './menu.js';

mountMenu(document.querySelector('#menu-button'), document.querySelector('#site-menu'));

const session = await (await fetch('/api/session')).json();
renderGreeting(session);
