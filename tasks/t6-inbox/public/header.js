import { on } from './events.js';

export async function mountHeader() {
  const user = await (await fetch('/api/me')).json();
  document.querySelector('#greeting').textContent = `Hello, ${user.name}`;
  on('messages-loaded', (messages) => {
    const unread = messages.filter((message) => !message.read).length;
    document.querySelector('#unread').textContent = `${unread} new`;
  });
}
