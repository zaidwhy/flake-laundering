import { emit } from './events.js';

export async function loadInbox() {
  const messages = await (await fetch('/api/messages')).json();
  document.querySelector('#messages').replaceChildren(...messages.map((message) => {
    const item = document.createElement('li');
    item.textContent = `${message.from}: ${message.subject}`;
    if (!message.read) item.classList.add('unread');
    return item;
  }));
  emit('messages-loaded', messages);
}
