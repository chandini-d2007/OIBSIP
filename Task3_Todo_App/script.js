const STORAGE_KEY = 'daylist_tasks_v1';
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(task =>
      task && typeof task.id === 'string' && typeof task.text === 'string'
      && typeof task.completed === 'boolean'
    ) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // The app remains usable for the current page session if storage is unavailable.
  }
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function createTask(text) {
  return {
    id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

function makeButton(label, className, action, id) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `action-btn ${className}`;
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

function renderTask(task) {
  const item = document.createElement('li');
  item.className = `task-item${task.completed ? ' is-complete' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', `Mark "${task.text}" ${task.completed ? 'pending' : 'complete'}`);
  checkbox.dataset.action = 'toggle';
  checkbox.dataset.id = task.id;

  const main = document.createElement('div');
  main.className = 'task-main';

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const timestamp = document.createElement('span');
  timestamp.className = 'task-time';
  timestamp.textContent = task.completed && task.completedAt
    ? `Completed ${formatDate(task.completedAt)} · Added ${formatDate(task.createdAt)}`
    : `Added ${formatDate(task.createdAt)}`;

  main.append(text, timestamp);
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  if (!task.completed) actions.append(makeButton('Edit', '', 'edit', task.id));
  actions.append(makeButton('Delete', 'delete-btn', 'delete', task.id));
  item.append(checkbox, main, actions);
  return item;
}

function render() {
  pendingList.replaceChildren();
  completedList.replaceChildren();

  const pending = tasks.filter(task => !task.completed);
  const completed = tasks.filter(task => task.completed);

  pending.forEach(task => pendingList.append(renderTask(task)));
  completed.forEach(task => completedList.append(renderTask(task)));

  document.getElementById('pending-count').textContent = pending.length;
  document.getElementById('completed-count').textContent = completed.length;
  pendingEmpty.hidden = pending.length > 0;
  completedEmpty.hidden = completed.length > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  tasks.unshift(createTask(text));
  saveTasks();
  render();
  form.reset();
  input.focus();
});

function findTask(id) {
  return tasks.find(task => task.id === id);
}

function handleTaskAction(event) {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const task = findTask(control.dataset.id);
  if (!task) return;

  switch (control.dataset.action) {
    case 'toggle':
      task.completed = control.checked;
      task.completedAt = control.checked ? new Date().toISOString() : null;
      break;
    case 'delete':
      tasks = tasks.filter(item => item.id !== task.id);
      break;
    case 'edit': {
      const updated = window.prompt('Edit your task:', task.text);
      if (updated === null) return;
      const trimmed = updated.trim();
      if (!trimmed) {
        window.alert('Task cannot be empty.');
        return;
      }
      task.text = trimmed;
      break;
    }
    default:
      return;
  }
  saveTasks();
  render();
}

pendingList.addEventListener('click', handleTaskAction);
pendingList.addEventListener('change', handleTaskAction);
completedList.addEventListener('click', handleTaskAction);
completedList.addEventListener('change', handleTaskAction);

document.getElementById('today-date').textContent =
  new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

render();
