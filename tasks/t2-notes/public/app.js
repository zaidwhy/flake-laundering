const form = document.querySelector('#new-note');
const status = document.querySelector('#save-status');
const list = document.querySelector('#notes');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = new FormData(form).get('title');
  fetch('/api/notes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  form.reset();
  status.textContent = 'Saved';
});

document.querySelector('#show-all').addEventListener('click', async (event) => {
  event.preventDefault();
  const notes = await (await fetch('/api/notes')).json();
  list.replaceChildren(...notes.map((note) => {
    const item = document.createElement('li');
    item.textContent = note.title;
    return item;
  }));
});
