import { Todos } from  './todos.js';

export const createTodoCheckbox = (todo) => {
  const todoCheckbox = document.createElement('input');

  todoCheckbox.type = 'checkbox';
  todoCheckbox.checked = todo.completed;
  todoCheckbox.classList.add('checkbox');

  return todoCheckbox;
}

export const createTodoText = (todo) => {
  const todoText = document.createElement('span');

  todoText.innerText = todo.content;

  if (todo.completed) {
    todoText.classList.add('line-through');
  }

  return todoText;
}

export const createTodoButton = (todo) => {
  const todoButton = document.createElement('button');

  todoButton.innerText = 'X';
  todoButton.classList.add('btn');

  todoButton.addEventListener('click', () => {
    Todos.getInstance().removeTodo(todo);
    todoButton.parentElement.remove();
  })

  return todoButton;
}

export const renderTodo = (todo) => {
  const todoContainer = document.createElement('div');

  todoContainer.classList.add(
    'todo',
  );

  todoContainer.append(createTodoCheckbox(todo));
  todoContainer.append(createTodoText(todo));
  todoContainer.append(createTodoButton(todo));

  todoContainer.addEventListener('click', (e) => {
    todo.completed = !todo.completed;
    Todos.getInstance().setTodoState(todo, todo.completed);
    todoContainer.querySelector('input').checked = todo.completed;
    todoContainer.querySelector('span').classList.toggle('line-through');
    applyMetaFilter(currentMetaFilter);
  });

  return todoContainer;
}

export const renderTasksRemainingText = (todos) => {
  return `${todos.filter((todo) => !todo.completed).length} tasks left`
}

let currentMetaFilter = 'all';

export const applyMetaFilter = (filter = 'all') => {
  const renderComplete   = filter === 'all' || filter === 'complete';
  const renderIncomplete = filter === 'all' || filter === 'incomplete';

  Array.from(document.querySelectorAll('.todo')).forEach((todoContainer) => {
    // Get the current state
    const currentState = todoContainer.querySelector('input').checked;

    // Should the toggle be visible based upon the filter?
    const displayToggle = (
      (currentState === true  && renderComplete) ||
      (currentState === false && renderIncomplete)
    );

    console.log(todoContainer.querySelector('span').innerText, currentState, displayToggle);

    // Apply the hidden toggle if we're supposed to hide it. AKA opposite of if we're to display it
    todoContainer.classList.toggle('hidden', !displayToggle);
  });

  currentMetaFilter = filter;
}

export const renderMeta = (todos) => {
  const metaContainer = document.createElement('div');

  metaContainer.classList.add('meta-container')
  metaContainer.classList.add('flex');
  metaContainer.classList.add('items-center');

  const tasksRemaining = document.createElement('span');

  tasksRemaining.innerText = renderTasksRemainingText(todos);
  tasksRemaining.classList.add('flex-grow');

  const metaFilterContainer = document.createElement('div');

  const filterAll        = document.createElement('button');
  const filterComplete   = document.createElement('button');
  const filterIncomplete = document.createElement('button');

  filterAll       .classList.add('btn', 'm-1', 'small', 'active');
  filterComplete  .classList.add('btn', 'm-1', 'small');
  filterIncomplete.classList.add('btn', 'm-1', 'small');

  filterAll.innerText        = 'All';
  filterComplete.innerText   = 'Complete';
  filterIncomplete.innerText = 'Incomplete';

  metaFilterContainer.appendChild(filterAll);
  metaFilterContainer.appendChild(filterComplete);
  metaFilterContainer.appendChild(filterIncomplete);

  filterAll.addEventListener('click', () => {
    filterAll.classList.add('active', true);
    [filterComplete, filterIncomplete].forEach((btn) => btn.classList.remove('active'));
    applyMetaFilter('all');
  });
  filterComplete.addEventListener('click', () => {
    filterComplete.classList.add('active', true);
    [filterAll, filterIncomplete].forEach((btn) => btn.classList.remove('active'));
    applyMetaFilter('complete');
  });
  filterIncomplete.addEventListener('click', () => {
    filterIncomplete.classList.add('active', true);
    [filterComplete, filterAll].forEach((btn) => btn.classList.remove('active'));
    applyMetaFilter('incomplete');
  });

  metaContainer.appendChild(tasksRemaining);
  metaContainer.appendChild(metaFilterContainer);

  return metaContainer;
}

