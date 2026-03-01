document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  // Create task counter element
  const taskCount = document.createElement("p");
  taskCount.style.marginBottom = "10px";
  document.querySelector(".container").insertBefore(taskCount, todoList);

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render existing tasks
  renderAllTasks();
  updateCount();

  // Add Task Button Click
  addTaskButton.addEventListener("click", addTask);

  // Press Enter to Add Task
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    updateCount();
    todoInput.value = "";
  }

  function renderAllTasks() {
    todoList.innerHTML = "";

    if (tasks.length === 0) {
      todoList.innerHTML = "<p style='opacity:0.6;'>No tasks yet</p>";
      return;
    }

    tasks.forEach((task) => renderTask(task));
  }

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text}</span>
      <button>Delete</button>
    `;

    // Toggle Complete
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;

      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });

    // Delete Task
    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();

      tasks = tasks.filter((t) => t.id !== task.id); // FIXED
      saveTasks();
      renderAllTasks();
      updateCount();
    });

    todoList.appendChild(li);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateCount() {
    taskCount.textContent = `Total Tasks: ${tasks.length}`;
  }
});