const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');
const message = document.getElementById('message');

let current = '0';
let previous = null;
let operator = null;
let shouldStartNew = false;

function render() {
  currentDisplay.textContent = current;
  previousDisplay.textContent = previous !== null && operator
    ? `${previous} ${operator}` : '';
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  shouldStartNew = false;
  message.textContent = '';
  render();
}

function appendNumber(number) {
  message.textContent = '';
  if (shouldStartNew) {
    current = number;
    shouldStartNew = false;
  } else if (current === '0') {
    current = number;
  } else if (current.length < 16) {
    current += number;
  }
  render();
}

function appendDecimal() {
  message.textContent = '';
  if (shouldStartNew) {
    current = '0';
    shouldStartNew = false;
  }
  if (!current.includes('.')) current += '.';
  render();
}

function chooseOperator(nextOperator) {
  message.textContent = '';
  if (operator && !shouldStartNew) calculate();
  previous = Number(current);
  operator = nextOperator;
  shouldStartNew = true;
  render();
}

function calculate() {
  if (operator === null || previous === null) return;
  const a = previous;
  const b = Number(current);
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '−': result = a - b; break;
    case '×': result = a * b; break;
    case '÷':
      if (b === 0) {
        message.textContent = 'Cannot divide by zero.';
        current = 'Error';
        previous = null;
        operator = null;
        shouldStartNew = true;
        render();
        return;
      }
      result = a / b;
      break;
    default: return;
  }
  current = String(Number(result.toPrecision(12)));
  previous = null;
  operator = null;
  shouldStartNew = true;
  render();
}

function backspace() {
  if (shouldStartNew || current === 'Error') return clearAll();
  current = current.length > 1 ? current.slice(0, -1) : '0';
  if (current === '-') current = '0';
  render();
}

document.querySelector('.keys').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.number !== undefined) appendNumber(button.dataset.number);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action === 'decimal') appendDecimal();
  else if (button.dataset.action === 'clear') clearAll();
  else if (button.dataset.action === 'backspace') backspace();
  else if (button.dataset.action === 'equals') calculate();
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) appendNumber(event.key);
  else if (event.key === '.') appendDecimal();
  else if (event.key === '+') chooseOperator('+');
  else if (event.key === '-') chooseOperator('−');
  else if (event.key === '*') chooseOperator('×');
  else if (event.key === '/') { event.preventDefault(); chooseOperator('÷'); }
  else if (event.key === 'Enter' || event.key === '=') calculate();
  else if (event.key === 'Backspace') backspace();
  else if (event.key === 'Escape') clearAll();
});

render();
