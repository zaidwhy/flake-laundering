const button = document.querySelector('#share-button');
const menu = document.querySelector('#share-menu');

button.addEventListener('click', () => {
  const opening = menu.hidden;
  menu.hidden = !opening;
  button.setAttribute('aria-expanded', String(opening));
});
