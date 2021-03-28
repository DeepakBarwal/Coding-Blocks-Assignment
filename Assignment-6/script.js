// SELECTORS
const inpTodo = document.querySelector('.inp-todo');
const btnTodo = document.querySelector('.add-todo');
const todoList = document.querySelector('.todo-list');

// EVENT HANDLER FUNCTIONS
function addNewTodo(e) {
  if (inpTodo.value !== '') {
    // Create Todo Item
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    // Create li
    const liTodo = document.createElement('li');
    liTodo.textContent = inpTodo.value;
    liTodo.classList.add('todo');
    liTodo.addEventListener('click', toggleComplete);
    todoItem.append(liTodo);

    //   Edit Button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', editTodo);
    todoItem.append(editBtn);

    //   Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', deleteTodo);
    todoItem.append(deleteBtn);

    //   Append todo item to todo list
    todoList.append(todoItem);

    //   clear i/p value
    inpTodo.value = '';
  }
}

function toggleComplete(e) {
  e.stopPropagation();

  e.target.classList.toggle('completed-todo');
}

function deleteTodo(e) {
  e.stopPropagation();

  const item = e.target.parentElement;
  //   Add Animation
  item.classList.add('delete-animation');

  item.addEventListener('transitionend', () => {
    item.remove();
  });
}

function editTodo(e) {
  e.stopPropagation();

  if (inpTodo.value === '') {
    const item = e.target.parentElement;
    const oldTodoText = item.querySelector('.todo').textContent;

    //   Add Animation
    item.classList.add('edit-animation');

    item.addEventListener('transitionend', () => {
      inpTodo.value = oldTodoText;
      item.remove();
    });
  }
}

// REGISTERING EVENT HANDLERS
btnTodo.addEventListener('click', addNewTodo);
