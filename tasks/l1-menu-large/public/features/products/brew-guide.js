import { h } from '../../lib/dom.js';

export const METHODS = {
  pourOver: { label: 'Pour over', ratio: 16, grind: 'medium-fine' },
  frenchPress: { label: 'French press', ratio: 15, grind: 'coarse' },
  espresso: { label: 'Espresso', ratio: 2, grind: 'fine' },
  moka: { label: 'Moka pot', ratio: 10, grind: 'medium-fine' },
};

const CUP_ML = 240;

export function brewPlan(methodKey, cups) {
  const method = METHODS[methodKey];
  const waterMl = cups * CUP_ML;
  const coffeeGrams = Math.round((waterMl / method.ratio) * 10) / 10;
  return { waterMl, coffeeGrams, grind: method.grind, ratio: method.ratio };
}

export function mountBrewGuide(host) {
  const state = { method: 'pourOver', cups: 2 };
  const result = h('p', { id: 'brew-result', role: 'status' });

  function draw() {
    const plan = brewPlan(state.method, state.cups);
    result.textContent = `Use ${plan.coffeeGrams}g of coffee, ground ${plan.grind}, with ${plan.waterMl}ml of water (1:${plan.ratio}).`;
  }

  const method = h('select', { id: 'brew-method', onchange: (event) => { state.method = event.target.value; draw(); } },
    Object.entries(METHODS).map(([key, { label }]) => h('option', { value: key, text: label })));
  const cups = h('select', { id: 'brew-cups', onchange: (event) => { state.cups = Number(event.target.value); draw(); } },
    [1, 2, 3, 4].map((count) => h('option', { value: String(count), selected: count === state.cups, text: `${count} ${count === 1 ? 'cup' : 'cups'}` })));

  host.append(
    h('h2', { text: 'Brew guide' }),
    h('div', { class: 'toolbar' },
      h('label', { for: 'brew-method' }, 'Method', method),
      h('label', { for: 'brew-cups' }, 'Servings', cups),
    ),
    result,
  );
  draw();
}
