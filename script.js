// 1. SELECTORS & VARIABLES
const createBtn = document.querySelector('.create-btn');
const taskListDiv = document.querySelector('#task-list');
const modal = document.querySelector('#task-modal');
const saveBtn = document.querySelector('#save-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const nameInput = document.querySelector('#modal-task-name');
const categoryInput = document.querySelector('#modal-task-category');
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
}

// 3. CREATE BUTTON LISTENER (The Input)
createBtn.addEventListener('click', function() {
   modal.classList.remove('hidden');
});

saveBtn.addEventListener('click', function(){
  const taskName = nameInput.value;
  const taskCategory = categoryInput.value;

  if (taskName) {

    if(currentEditTask){
      currentEditTask.name = taskName;
      currentEditTask.category = taskCategory;
      currentEditTask = null;
    }else{
      const newTask = {
        name: taskName,
        category: taskCategory,
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
    <input type="checkbox">
    <span>${task.name}</span>
    <small>(${task.category})</small>
    <button class="delete-btn">Delete</button>
    <button class="edit-btn">Edit</button>
  `;

  // B. Add Urgent Style
  if (task.category === "Urgent") {
    taskCard.style.borderLeft = "10px solid red";
    taskCard.style.fontWeight = "bold";
  }

  // C. Pin to Screen
  taskListDiv.appendChild(taskCard);

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
      taskText.style.textDecoration = 'line-through';
    } else {
      taskText.style.textDecoration = 'none';
    }
  });
}
function renderTasks(category) {
  // 1. Clear the whiteboard
  taskListDiv.innerHTML = '';
  
  // 2. Decide which tasks to show (Inbox = Everything, Others = Filtered)
  const tasksToShow = (category === 'Inbox') ? tasks : tasks.filter(task => task.category === category);

  // 3. Loop through the chosen tasks and draw them
  tasksToShow.forEach(task => {
    renderTask(task);
  });
}