// 1. SELECTORS & VARIABLES
const createBtn = document.querySelector('.create-btn');
const taskListDiv = document.querySelector('#task-list');
let tasks = []; // We move this to the top so everyone can use it

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
  const taskName = prompt("What is your new task?");

  if (taskName) {
    const taskCategory = prompt("Which category? (Urgent, planned, or Inbox)");
    
    // Create the task object
    const newTask = {
      name: taskName,
      category: taskCategory
    };

    // Save to Memory
    tasks.push(newTask);
    localStorage.setItem('myTasks', JSON.stringify(tasks));

    // Show on Screen (Using the Blueprint!)
    renderTask(newTask);
  }
});

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
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    // Remove from Screen
    taskCard.remove();
  });

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