let todo = [];

//add items to array

function add() {
  let inputField = document.getElementById("myInput");

  let taskInput = inputField.value.trim();
  
  if(taskInput == ""){
    alert("Add your task first");
  }
   else if(!todo.some(task => task.text.toLowerCase() === taskInput.toLowerCase())) {
    todo.push({
      text: taskInput,
      completed: false,
    });
  
    localStorage.setItem("myItems", JSON.stringify(todo));

    inputField.value = "";
  } else {
    alert("Task already exists!");
  }

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
    checkbox.addEventListener("click", () => {
      todo[i].completed = checkbox.checked;

      if (checkbox.checked) {
        newItem.style.textDecoration = "line-through";
        newItem.style.color = "green";
      } else {
        newItem.style.textDecoration = "none";
        newItem.style.color = "black";
      }
      localStorage.setItem("myItems", JSON.stringify(todo));

      renderTask();
    });
    // Edit button
    let edit = document.createElement("button");
    edit.style.marginLeft = "10px";
    edit.textContent = "Edit✏️";

    edit.addEventListener("click", () => {
      let dlgBox = prompt("Enter a new task", todo[i].text);

      if (dlgBox !== null && dlgBox.trim() !== "") {
        todo[i].text = dlgBox.trim();

        localStorage.setItem("myItems", JSON.stringify(todo));

        renderTask();
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

function deleteTask(index) {
  todo.splice(index, 1);

  localStorage.setItem("myItems", JSON.stringify(todo));

  renderTask();
}

function clearAll() {
  let confirmDelete = confirm("Delete all tasks?");
  if (confirmDelete) {
    todo = [];
    localStorage.removeItem("myItems");

    renderTask();
  }
}
//Load saved data

let saved = localStorage.getItem("myItems");
if (saved !== null) {
  todo = JSON.parse(saved);
}
renderTask();
