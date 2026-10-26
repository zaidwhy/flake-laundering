import { on } from './events.js';

export async function mountHeader() {
  // subscribe before the first await: the inbox can finish loading while /api/me is still in flight
  on('messages-loaded', (messages) => {
    const unread = messages.filter((message) => !message.read).length;
    document.querySelector('#unread').textContent = `${unread} new`;
  });
  const user = await (await fetch('/api/me')).json();
  document.querySelector('#greeting').textContent = `Hello, ${user.name}`;
}
