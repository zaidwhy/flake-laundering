export function renderGreeting({ name, plan }) {
  document.querySelector('#greeting').textContent = `${name} · ${plan} plan`;
}
