import { Todos } from './todos.js';

const todos = Todos.getInstance();

const addTodoEl = document.querySelector('#add-todo');
const todoContentEl = document.querySelector('#todo-content');

addTodoEl.addEventListener('click', () => {
  todos.addTodo(todoContentEl.value);
  todoContentEl.value = '';
})

