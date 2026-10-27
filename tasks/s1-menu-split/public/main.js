import { renderGreeting } from './session.js';

const session = await (await fetch('/api/session')).json();
renderGreeting(session);

const { mountMenu } = await import('./menu.js');
mountMenu(document.querySelector('#menu-button'), document.querySelector('#site-menu'));
