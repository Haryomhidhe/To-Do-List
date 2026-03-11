// 1. SELECTORS & VARIABLES
const createBtn = document.querySelector('#create-btn');
const inboxCard = document.querySelector('#inbox-card');
const urgentCard = document.querySelector('#urgent-card');
const plannedCard = document.querySelector('#planned-card');
const doneCard = document.querySelector('#done-card');
const modal = document.querySelector('#task-modal');
const saveBtn = document.querySelector('#save-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const nameInput = document.querySelector('#modal-task-name');
const categoryInput = document.querySelector('#modal-task-category');
const date = document.querySelector('#date');
const newcolumn = document.querySelector('#new-column');
const board = document.querySelector('.board');
// const editBtn = document.querySelector('.edit-btn');
let tasks = []; // We move this to the top so everyone can use it
let currentEditTask = null;
// 2. LOAD SAVED DATA (The Memory)
const savedTasks = localStorage.getItem('myTasks');
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  tasks.forEach(function(task) {
    renderTask(task); // We use the blueprint to draw saved tasks
  });
};
newcolumn.addEventListener('click', function(){
  const columnName = prompt('Enter column name:');
  console.log(columnName)
  if(columnName){
    const newCol = document.createElement('div')
    newCol.className = 'column';
    newCol.innerHTML = `
  <h3>${columnName}</h3>
  <div id="${columnName}-card"></div>`;
  const newOption = document.createElement('option');
newOption.value = columnName;
newOption.textContent = columnName;
categoryInput.appendChild(newOption);
board.appendChild(newCol);
  }
  const customCard = document.querySelector(`#${columnName}-card`)
});


// 3. CREATE BUTTON LISTENER (The Input)
createBtn.addEventListener('click', function() {
   modal.classList.remove('hidden');``
});

saveBtn.addEventListener('click', function(){
  const taskName = nameInput.value;
  const taskCategory = categoryInput.value;
  const taskDate = date.value;
  if (taskName) {

    if(currentEditTask){
      currentEditTask.name = taskName;
      currentEditTask.category = taskCategory;
      currentEditTask = null;
    }else{
      const newTask = {
        name: taskName,
        category: taskCategory,
        date: taskDate,
        originalCategory: taskCategory,
      }
        tasks.push(newTask);
      };

      localStorage.setItem('myTasks', JSON.stringify(tasks));
      renderTasks('Inbox');
      modal.classList.add('hidden');
      nameInput.value = '';
  }
});

cancelBtn.addEventListener('click', function(){
  modal.classList.add('hidden');
  nameInput.value = '';
})

// 4. THE BLUEPRINT FUNCTION (The Worker)
function renderTask(task) {
  // A. Create the Card
  const taskCard = document.createElement('div');
  taskCard.className = 'task-card';
  taskCard.innerHTML = `
  <div class="check-box">
    <input type="checkbox">
    <span>${task.name}</span>
   </div> 
    <span class="category-badge ${task.category} ">${task.category}</span>
    <span>${task.date ? new Date(task.date).toLocaleString():'No date set '}</span>
    <div class="card-buttons">
    <button class="delete-btn">Delete</button>
    <button class="edit-btn">Edit</button>
    </div>
  `;
  if (task.category === "Inbox") {
      inboxCard.appendChild(taskCard);
  }
  if (task.category === "Urgent") {
      urgentCard.appendChild(taskCard);
  }
  if (task.category === "Planned") {
      plannedCard.appendChild(taskCard);
  }
  if (task.category === "Done") {
      doneCard.appendChild(taskCard);
  }else {
  const customCard = document.querySelector(`#${task.category}-card`);
  if (customCard) {
    customCard.appendChild(taskCard);
  }
}


  
  // D. Delete Logic
const deleteBtn = taskCard.querySelector('.delete-btn');

deleteBtn.addEventListener('click', function() {
  // Remove from Memory
  tasks = tasks.filter(function(currentTask) {
    // Keep the task in the list ONLY IF it is NOT the one we want to delete
    return currentTask !== task; 
  });
  localStorage.setItem('myTasks', JSON.stringify(tasks));
  // Remove from Screen
  taskCard.remove();
});

  const editBtn = taskCard.querySelector('.edit-btn');
  editBtn.addEventListener('click', function(){
    // edit memory 
      currentEditTask = task;
      nameInput.value = task.name; 
      categoryInput.value = task.category;
      modal.classList.remove('hidden');
    })


  // E. Checkbox Logic
  const checkbox = taskCard.querySelector('input');
  const taskText = taskCard.querySelector('span');
  
  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      task.category = 'Done';
      localStorage.setItem('myTasks',                  JSON.stringify(tasks));
    renderTasks('Inbox');
    } else {
      taskText.style.textDecoration = 'none';
      task.category = task.originalCategory;
       localStorage.setItem('myTasks',                  JSON.stringify(tasks));
    renderTasks('Inbox');
    }
  });
}
function renderTasks(category) {
  // 1. Clear the whiteboard
  inboxCard.innerHTML = '';
  urgentCard.innerHTML = '';
  plannedCard.innerHTML = '';
  doneCard.innerHTML = '';  
  // 2. Decide which tasks to show (Inbox = Everything, Others = Filtered)
  const tasksToShow = (category === 'Inbox') ? tasks : tasks.filter(task => task.category === category);

  // 3. Loop through the chosen tasks and draw them
  tasksToShow.forEach(task => {
    renderTask(task);
  });
}