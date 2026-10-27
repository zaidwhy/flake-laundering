function renderLinks(menu, links) {
  menu.replaceChildren(...links.map(({ label, href }) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    item.append(link);
    return item;
  }));
}

export function mountMenu(button, menu) {
  button.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
  });
  fetch('/api/menu').then((response) => response.json()).then((links) => renderLinks(menu, links));
}
