import { h } from '../../lib/dom.js';
import { pluralize } from '../../lib/format.js';

export const MAX_NOTE_LENGTH = 140;

let note = '';

export function getGiftNote() {
  return note;
}

export function setGiftNote(value) {
  note = value.slice(0, MAX_NOTE_LENGTH);
  return note;
}

export function clearGiftNote() {
  note = '';
}

export function remainingCharacters(value) {
  return MAX_NOTE_LENGTH - value.length;
}

export function renderGiftNote() {
  const counter = h('small', { text: pluralize(remainingCharacters(note), 'character') + ' left' });
  const field = h('textarea', {
    id: 'gift-note',
    rows: '2',
    maxlength: String(MAX_NOTE_LENGTH),
    'aria-label': 'Gift note',
    placeholder: 'Add a gift note',
    oninput: (event) => {
      event.target.value = setGiftNote(event.target.value);
      counter.textContent = pluralize(remainingCharacters(note), 'character') + ' left';
    },
  });
  field.value = note;
  return h('div', { class: 'field' }, field, counter);
}
