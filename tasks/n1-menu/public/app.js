const button = document.querySelector('#menu-button');
const menu = document.querySelector('#site-menu');

button.addEventListener('click', () => {
  const opening = menu.hidden;
  menu.hidden = !opening;
  button.setAttribute('aria-expanded', String(menu.hidden));
});

const loading = document.createElement('li');
loading.textContent = 'Loading...';
menu.replaceChildren(loading);

const response = await fetch('/api/menu');
const links = await response.json();

menu.replaceChildren(...links.map(({ label, href }) => {
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  item.append(link);
  return item;
}));
