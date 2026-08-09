let todo = [];

//add items to array

async function add() {
  let inputField = document.getElementById("myInput");

  let taskInput = inputField.value.trim();
  
  if(taskInput == ""){
    alert("Add your task first");
    return;
  }
    if (todo.some(task =>
      task.text.toLowerCase() === taskInput.toLowerCase())) {
    alert("Task already exists!");
    return;
  }

await fetch("http://localhost:3000/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: taskInput
  })
});

inputField.value = "";

  await loadTasks();
}

async function loadTasks(){
  const response = await fetch("https://localhost:3000/tasks");
  
  todo = await response.json();

  renderTask();
}

//Enter button to add task

let inputField = document.getElementById("myInput");

inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    add();
  }
});

// show items on page

function renderTask() {
  //find the tasks list
  let myTasksList = document.getElementById("myTasksList");

  let completedCounter = document.getElementById("completedCounter");

  
  let completedTasks = todo.filter((task) => task.completed).length;

  completedCounter.textContent = completedTasks;

  //Keeping a counter
  let counter = document.getElementById("counter");

  counter.textContent = todo.length;

  //clear old items
  myTasksList.innerHTML = "";

  for (let i = 0; i < todo.length; i++) {
    let newItem = document.createElement("li");
    newItem.textContent = todo[i].text;

    //checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo[i].completed;
    if (todo[i].completed) {
      newItem.style.textDecoration = "line-through";
      newItem.style.color = "green";
    }
    checkbox.addEventListener("click", async () => {

  await fetch(
    `http://localhost:3000/tasks/${todo[i].id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: todo[i].text,
        completed: checkbox.checked
      })
    }
  );

  await loadTasks();
});

    // Edit button
    let edit = document.createElement("button");
edit.style.marginLeft = "10px";
edit.textContent = "Edit✏️";
    edit.addEventListener("click", async () => {

  let dlgBox = prompt(
    "Enter a new task",
    todo[i].text
  );

  if (
    dlgBox !== null &&
    dlgBox.trim() !== ""
  ) {

    await fetch(
      `http://localhost:3000/tasks/${todo[i].id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: dlgBox.trim(),
          completed: todo[i].completed
        })
      }
    );

    await loadTasks();
  }

});

    // Delete button
    let dlt = document.createElement("button");
    dlt.style.marginLeft = "10px";
    dlt.textContent = "Delete🗑️";

    dlt.addEventListener("click", () => {
      deleteTask(i);
    });

    newItem.appendChild(checkbox);
    newItem.appendChild(edit);
    newItem.appendChild(dlt);

    myTasksList.appendChild(newItem);
  }
}

// Delete items

async function deleteTask(index) {

  await fetch(
     `http://localhost:3000/tasks/${todo[index].id}`,
     {
      method: "DELETE"
     }
  );


  await loadTasks();
}
async function clearAll() {

  await fetch("http://localhost:3000/tasks", {
    method: "DELETE"
  });

  await loadTasks();
}

//Load saved data
async function loadTasks() {

  const response =
    await fetch("http://localhost:3000/tasks");

  todo = await response.json();

  renderTask();
}

loadTasks();

//dark mode

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
 
function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
 
function toggleTheme() {
  const isDark = !document.documentElement.classList.contains("dark");
  applyTheme(isDark);
}
 
themeToggle.addEventListener("click", toggleTheme);
 
// Use saved theme if present, otherwise fall back to the OS preference
let savedTheme = localStorage.getItem("theme");
if (savedTheme !== null) {
  applyTheme(savedTheme === "dark");
} else {
  applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
}
 