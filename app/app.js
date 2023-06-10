

class TodoApp {
  
  constructor() {
    this.framework = new Framework();
    this.todoList = [];
    this.filteredTodoList = [];
    this.todoInput = document.getElementById('todo-input');
    this.todoListContainer = document.getElementById('todo-list');
    this.footer = document.getElementById('footer');
    this.totalCountElement = document.getElementById('total-count');
    this.completedCountElement = document.getElementById('completed-count');
    this.viewAllButton = document.getElementById('view-all');
    this.viewCompletedButton = document.getElementById('view-completed');
    this.viewIncompleteButton = document.getElementById('view-incomplete');
    this.deleteCompletedButton = document.getElementById('delete-completed');
    this.currentView = 'all';

    this.initialize();
  }

  initialize() {
    this.framework.addRoute('/', () => this.handleView('all'));
    this.framework.addRoute('/#/completed', () => this.handleView('completed'));
    this.framework.addRoute('/#/active', () => this.handleView('incomplete'));
  
    this.todoInput.onkeydown = this.handleTodoInput.bind(this);
    this.viewAllButton.onclick = () => this.framework.navigate('/');
    this.viewCompletedButton.onclick = () => this.framework.navigate('/#/completed');
    this.viewIncompleteButton.onclick = () => this.framework.navigate('/#/active');
    this.deleteCompletedButton.onclick = this.deleteCompletedTodos.bind(this);
    this.renderTodoList();
  }

  handleTodoInput(event) {
    if (event.key === 'Enter') {
      const todoText = this.todoInput.value.trim();
      if (todoText !== '') {
        this.addTodoItem(todoText);
        this.todoInput.value = '';
      }
    }
  }

  addTodoItem(text) {
    const todoItem = { id: Date.now(), text, completed: false };
    this.todoList.push(todoItem);
    this.filterTodoList();
    this.renderTodoList();
  }

  toggleTodoItem(todoId) {
    const todoItem = this.todoList.find((todo) => todo.id === todoId);
    if (todoItem) {
      todoItem.completed = !todoItem.completed;
      this.filterTodoList();
      this.renderTodoList();
    }
  }

  deleteTodoItem(todoId) {
    this.todoList = this.todoList.filter((todo) => todo.id !== todoId);
    this.filterTodoList();
    this.renderTodoList();
  }

  handleView(view) {
    this.currentView = view;
    this.filterTodoList();
    this.renderTodoList();
    this.updateURL();
  }

  deleteCompletedTodos() {
    this.todoList = this.todoList.filter((todo) => !todo.completed);
    this.filterTodoList();
    this.renderTodoList();
  }

  filterTodoList() {
    if (this.currentView === 'completed') {
      this.filteredTodoList = this.todoList.filter((todo) => todo.completed);
    } else if (this.currentView === 'incomplete') {
      this.filteredTodoList = this.todoList.filter((todo) => !todo.completed);
    } else {
      this.filteredTodoList = [...this.todoList];
    }
  }

  renderTodoList() {
    this.todoListContainer.innerHTML = '';

    let completedCount = 0;

    this.filteredTodoList.forEach((todoItem) => {
      const listItem = document.createElement('li');
      listItem.classList.add('todo-item');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todoItem.completed;
      checkbox.onchange = () => {
        this.toggleTodoItem(todoItem.id);
      };

      const text = document.createElement('span');
      text.textContent = todoItem.text;
      text.contentEditable = true;
      text.addEventListener('input', () => {
        todoItem.text = text.textContent.trim();
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => {
        this.deleteTodoItem(todoItem.id);
      };

      listItem.appendChild(checkbox);
      listItem.appendChild(text);
      listItem.appendChild(deleteButton);

      this.todoListContainer.appendChild(listItem);

      if (todoItem.completed) {
        completedCount++;
      }
    });

    const totalCount = this.todoList.length;
    const incompleteCount = totalCount - completedCount;

    this.totalCountElement.textContent = `Total Todos: ${totalCount}`;
    this.completedCountElement.textContent = `Completed: ${completedCount} / Incomplete: ${incompleteCount}`;

    this.viewAllButton.classList.toggle('active', this.currentView === 'all');
    this.viewCompletedButton.classList.toggle('active', this.currentView === 'completed');
    this.viewIncompleteButton.classList.toggle('active', this.currentView === 'incomplete');

    this.deleteCompletedButton.style.display = completedCount > 0 ? 'block' : 'none';

    this.footer.style.display = totalCount > 0 ? 'block' : 'none';
  }

  updateURL() {
    let path;
    if (this.currentView === 'completed') {
      path = '/#/completed';
    } else if (this.currentView === 'incomplete') {
      path = '/#/active';
    } else {
      path = '/#/';
    }
    this.framework.navigate(path);
  }
}

const app = new TodoApp();
