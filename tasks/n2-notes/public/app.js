const form = document.querySelector('#new-note');
const status = document.querySelector('#save-status');
const list = document.querySelector('#notes');
const saveButton = form.querySelector('button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = new FormData(form).get('title');
  saveButton.disabled = true;
  status.textContent = 'Saving...';
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error(`save failed with ${response.status}`);
    form.reset();
    status.textContent = 'Saved';
  } catch {
    status.textContent = 'Could not save, try again';
  } finally {
    saveButton.disabled = false;
  }
});

document.querySelector('#show-all').addEventListener('click', async (event) => {
  event.preventDefault();
  const notes = await (await fetch('/api/notes')).json();
  list.replaceChildren(...notes.slice(1).map((note) => {
    const item = document.createElement('li');
    item.textContent = note.title;
    return item;
  }));
});
