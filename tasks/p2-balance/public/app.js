const balance = document.querySelector('#balance');
const list = document.querySelector('#transactions');
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

fetch('/api/transactions').then((response) => response.json()).then((transactions) => {
  list.replaceChildren(...transactions.map(({ payee, pence }) => {
    const item = document.createElement('li');
    item.textContent = `${payee} ${money.format(pence / 100)}`;
    return item;
  }));
});

fetch('/api/account').then((response) => response.json()).then((account) => {
  balance.textContent = money.format(account.balancePence / 100);
});
