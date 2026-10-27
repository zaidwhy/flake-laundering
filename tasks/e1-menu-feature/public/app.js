const button = document.querySelector('#menu-button');
const menu = document.querySelector('#site-menu');

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

button.addEventListener('click', () => {
  const opening = menu.hidden;
  menu.hidden = !opening;
  button.setAttribute('aria-expanded', String(opening));
});
