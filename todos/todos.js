import { getStorageItem, setStorageItem } from './ls.js';
import * as util from './utilities.js';

const todoSelector = '#todos';
const metaSelector = '#meta-container';

export class Todos {
  static _instance = null;

  static getInstance() {
    if (Todos._instance === null) {
      Todos._instance = new Todos(todoSelector);
    }

    return Todos._instance;
  }

  constructor(todoSelector) {
    this.todos = getStorageItem('todos') || [];
    this.todoEl = document.querySelector(todoSelector);
    this.metaEl = document.querySelector(metaSelector);
    this.renderTodos();
    this.metaContainer = util.renderMeta(this.todos);
    this.metaEl.append(this.metaContainer);
  }

  renderTodos() {
    this.todos.forEach((todo) => {
      this.todoEl.append(util.renderTodo(todo));
    });
  }

  getTodos() {
    return this.todos;
  }

  addTodo(content) {
    const todo = {
      content,
      id: Date.now(),
      completed: false,
    };

    this.todos.push(todo);
    this.todoEl.append(util.renderTodo(todo));

    this.flushTodos();
  }

  setTodoState(todoToChange, state) {
    const todo = this.todos.find((todo) => todo.id === todoToChange.id);

    if (todo) {
      todo.completed = !!state;
    }

    this.flushTodos();
  }

  removeTodo(todoToRemove) {
    this.todos = this.todos.filter((todo) => todoToRemove.id !== todo.id);

    this.flushTodos();
  }

  flushTodos() {
    setStorageItem('todos', this.todos);

    this.metaContainer.querySelector('span').innerText = util.renderTasksRemainingText(this.todos);
  }

}


