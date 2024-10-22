const taskSections = [
  { id: "to-do-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
  { id: "in-progress-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
  { id: "await-feedback-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
];

let contacts;
let allTasks;
let toDoTasks;
let inProgressTasks;
let awaitFeedbackTasks;
let doneTasks;
let currentDraggedElement;

const URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Calls functions to get all information and to shown them.
 */

async function loadData() {
    await loadContacts();
    await loadTasks();
    renderTasks();
}

/**
 * Loads contact information from firebase and stores it in the `contacts` variable.
 */
async function loadContacts() {
  let response = await fetch(URL + "contacts" + "/.json");
  let responseJSON = await response.json();
  contacts = Object.values(responseJSON);
}

/**
 * Loads task information from firebase and stores it in the `allTasks` variable and
 */
async function loadTasks() {
  try {
    response = await fetch(URL + "tasks/.json");
    responseJSON = await response.json();
    allTasks = Object.values(responseJSON);
    sortTasksInColumn(allTasks);  
  } catch(err) {
    console.log(err)
    loadData();
  }
}

/**
 * Sorts tasks into the right columns
 */
function sortTasksInColumn(allTasks) {
  toDoTasks = allTasks.filter((task) => task.taskColumn === "toDo");
  inProgressTasks = allTasks.filter((task) => task.taskColumn === "inProgress");
  awaitFeedbackTasks = allTasks.filter((task) => task.taskColumn === "awaitFeedback");
  doneTasks = allTasks.filter((task) => task.taskColumn === "done");
}

/**
 * Renders tasks for all columns by calling the `renderTask` function for each column.
 */
function renderTasks() {
  renderTask(toDoTasks, "to-do-tasks", "To do");
  renderTask(inProgressTasks, "in-progress-tasks", "In progress");
  renderTask(awaitFeedbackTasks, "await-feedback-tasks", "Await feedback");
  renderTask(doneTasks, "done-tasks", "done");
}

/**
 * Renders a list of tasks in a specific column on the page.
 * @param {Array} tasksArr - The array of tasks to be rendered.
 * @param {string} tasksColumn - The ID of the HTML column where tasks will be rendered.
 */
function renderTask(tasksArr, tasksColumn, columnName) {
  document.getElementById(tasksColumn).innerHTML = "";
  if (tasksArr.length == 0) {
    document.getElementById(
      tasksColumn
    ).innerHTML = `<div id="${tasksColumn}-empty" class="tasks-empty">No tasks ${columnName}</div>`;
  }
  for (let i = 0; i < tasksArr.length; i++) {
    document.getElementById(tasksColumn).innerHTML += generateHtml(tasksArr, tasksColumn, i);
    setCategoryColor(tasksArr, i, tasksColumn);
    checkSubtask(tasksArr, i, tasksColumn);
    renderAssignedPersons(tasksArr, i, tasksColumn);
    renderPrio(tasksArr, i, tasksColumn);
  }
}

/**
 * Generates the HTML for a task card.
 * @param {Array} tasksArr - The array of tasks.
 * @param {string} tasksColumn - The ID of the HTML column where tasks will be rendered.
 * @param {number} i - The index of the task in the array.
 * @returns {string} The generated HTML string for the task card.
 */
function generateHtml(tasksArr, tasksColumn, i) {
  let arrayAsString = arrayToString(tasksColumn);
  return `
<div onclick="(init('${tasksColumn}', ${i}, ${arrayAsString}), cardAnimation())" class="tasks-card" id="${tasksColumn}-card(${i})" draggable="true" ondragstart="rotate('${tasksColumn}-card(${i})')">
    <div id="${tasksColumn}-catagory(${i})" class="catagory">${tasksArr[i]["category"]}</div>
    <h1 class="title">${tasksArr[i]["title"]}</h1>
    <p class="description">${tasksArr[i]["description"]}</p>
    <div id="${tasksColumn}-subtasks(${i})" class="subtasks"></div>

    <div class="bottom-card">
        <div onclick="showSplitsToMove(event)" id="person-and-prio">
            <div id="${tasksColumn}assigned-to(${i})" class="assigned-to"></div>                
            <img id="${tasksColumn}prio${i}" class="prio" src="assets/img/prio-medium.svg" alt="medium" />
        </div>
        <img onclick="event.stopPropagation(), toggleSplitsToMove('${tasksColumn}', ${i}), rotate('${tasksColumn}-card(${i})')" class="mobile-menu" src="assets/img/mobile-menu.svg">
        <div id="splits-to-move-container-${tasksColumn}-${i}" class="splits-to-move-container d-none">
        <span onclick="event.stopPropagation(), moveTo('toDo')">To do</span><br>
        <span onclick="event.stopPropagation(), moveTo('inProgress')">In Progress</span><br>
        <span onclick="event.stopPropagation(), moveTo('awaitFeedback')">Await feedback</span><br>
        <span onclick="event.stopPropagation(), moveTo('done')">Done</span><br>
        </div>
    </div>
</div>
        `;
}

/**
 * Converts a column ID string to a  task array variable name.
 * @param {string} tasksColumn - The name of the task column.
 * @returns {string} The name of the task array.
 */
function arrayToString(tasksColumn) {
  if (tasksColumn == "to-do-tasks") {
    return "toDoTasks";
  } else if (tasksColumn == "in-progress-tasks") {
    return "inProgressTasks";
  } else if (tasksColumn == "await-feedback-tasks") {
    return "awaitFeedbackTasks";
  } else if (tasksColumn == "done-tasks") {
    return "doneTasks";
  }
}
/**
 * Sets the background color for the category banner.
 * @param {Array} tasksArr - The array of tasks.
 * @param {string} tasksColumn - The ID of the HTML column where tasks will be rendered.
 * @param {number} i - The index of the task in the array.
 */
function setCategoryColor(tasksArr, i, tasksColumn) {
  if (tasksArr[i]["category"] == "User Story") {
    document.getElementById(`${tasksColumn}-catagory(${i})`).style.backgroundColor = "rgba(0, 56, 255, 1)";
  } else {
    document.getElementById(`${tasksColumn}-catagory(${i})`).style.backgroundColor = "rgb(32, 215, 194)";
  }
}

/**
 * Checks and calculates the number of completed and incomplete subtasks
 *
 * @param {Array} tasksArr - The array of tasks.
 * @param {number} i - The index of the task in the array.
 * @param {string} tasksColumn - The ID of the HTML column where tasks will be rendered.
 */
function checkSubtask(tasksArr, i, tasksColumn) {
  let subtasksCheckedNum = tasksArr[i]["subtasksChecked"].length;
  let subtasksChecked = tasksArr[i]["subtasksChecked"];
  if (subtasksChecked == "" || subtasksChecked =="placeholder" || subtasksChecked == undefined) {
    subtasksCheckedNum = 0;
  }

  let subtasksNotCheckedNum = tasksArr[i]["subtasksNotChecked"].length;
  let subtasksNotChecked = tasksArr[i]["subtasksNotChecked"];
  if (subtasksNotChecked == "" || subtasksNotChecked == "placeholder" || subtasksNotChecked == undefined) {
    subtasksNotCheckedNum = 0;
  }

  renderSubtaskDiagram(subtasksCheckedNum, subtasksNotCheckedNum, i, tasksColumn);
}

/**
 * Renders the diagram.
 *
 * @param {number} subtasksCheckedNum - The number of completed subtasks.
 * @param {number} subtasksNotCheckedNum - The number of incomplete subtasks.
 * @param {number} i - The index of the task in the array.
 * @param {string} tasksColumn - The ID of the HTML column where tasks will be rendered.

 */
function renderSubtaskDiagram(subtasksCheckedNum, subtasksNotCheckedNum, i, tasksColumn) {
  let allTasksNum = subtasksCheckedNum + subtasksNotCheckedNum;
  if (allTasksNum > 0) {
    document.getElementById(`${tasksColumn}-subtasks(${i})`).innerHTML = `
    <div id="${tasksColumn}-subtasks-diagram(${i})" class="subtasks-diagram">
     <div id="${tasksColumn}-subtasks-diagram-filled(${i})" class="subtasks-diagram-filled"></div>
    </div>
    <div class="subtasks-number">
      <span>${subtasksCheckedNum}</span>
      <span>/</span>
      <span id="all-subtasks">${allTasksNum}</span>
    </div>
  `;

  let widthInPercent = subtasksCheckedNum / allTasksNum * 100;
  document.getElementById(`${tasksColumn}-subtasks-diagram-filled(${i})`).style.width = `${widthInPercent}%`;
  }
}

/**
 * Renders the assigned persons on a task card.
 * @param {Array} tasksArr - The array of tasks.
 * @param {number} i - The index of the task.
 * @param {string} idName - The base ID of the HTML element where the assigned persons will be displayed.
 */
function renderAssignedPersons(tasksColumn, i, idName) {
  let person = tasksColumn[i]["assigned persons"];
  if (person == undefined || person[0] == "placeholder" || person == "") {
  } else {
    for (let j = 0; j < person.length; j++) {
      let initials = person[j]
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("");
      let color = tasksColumn[i]["color"][j];
      document.getElementById(`${idName}assigned-to(${i})`).innerHTML += `
        <span style="background-color: ${color}; right:calc(5px * ${j})"  class="card-person-initials position">${initials}</span>
      `;
    }
  }
}

/**
 * Updates the priority icon on a task card based on the task's priority level.
 * @param {Array} tasksArr - The array of tasks.
 * @param {number} i - The index of the task.
 * @param {string} idName - The base ID of the HTML element where the priority icon will be updated.
 */
function renderPrio(tasksColumn, i, idName) {
  let prio = tasksColumn[i]["prio"];
  if (prio == "low") {
    document.getElementById(`${idName}prio${i}`).src = "assets/img/prio-low.svg";
  }
  if (prio == "medium") {
    document.getElementById(`${idName}prio${i}`).src = "assets/img/prio-medium.svg";
  }
  if (prio == "high") {
    document.getElementById(`${idName}prio${i}`).src = "assets/img/prio-high.svg";
  }
}

/**
 * Rotates the task card when it starts being dragged.
 * @param {string} card - The ID of the task card to rotate.
 */
function rotate(card) {
  document.getElementById(card).classList.add("rotate");
  currentDraggedElement = card;
}

/**
 * Allows a task to be dropped into a new column.
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves the dragged task to a new column and updates the database.
 * @param {string} newTaskColumn - The name of the new task column where the task will be moved.
 */
async function moveTo(newTaskColumn) {
  let number = currentDraggedElement.split("(")[1].split(")")[0];
  let string = currentDraggedElement.split("(")[0];
  defineNewColumn(string, number, newTaskColumn);
  allTasks = [];
  pushTasksInArray();
  await updateTasksInFirebase();
  loadData();
}

/**
 * Show the container to push the task to a new column.
 * @param {string} tasksColumn - The ID of the HTML column.
 * @param {number} i - The index of the task.
 */
function toggleSplitsToMove(tasksColumn, i) {
  document.getElementById(`splits-to-move-container-${tasksColumn}-${i}`).classList.toggle("d-none");
}


/**
 * Updates the task's column based on its current position and the new column.
 * @param {string} string - The ID of the current task column.
 * @param {number} number - The index of the task in the array.
 * @param {string} newTaskColumn - The name of the new column to move the task to.
 */
function defineNewColumn(string, number, newTaskColumn) {
  if (string == "to-do-tasks-card") {
    toDoTasks[number]["taskColumn"] = newTaskColumn;
  } else if (string == "in-progress-tasks-card") {
    inProgressTasks[number]["taskColumn"] = newTaskColumn;
  } else if (string == "await-feedback-tasks-card") {
    awaitFeedbackTasks[number]["taskColumn"] = newTaskColumn;
  } else if (string == "done-tasks-card") {
    doneTasks[number]["taskColumn"] = newTaskColumn;
  }
}

/**
 * Pushes all tasks from each column into the `allTasks` array.
 */
function pushTasksInArray() {
  toDoTasks.forEach((toDoTasks) => {
    allTasks.push(toDoTasks);
  });
  inProgressTasks.forEach((inProgressTasks) => {
    allTasks.push(inProgressTasks);
  });
  awaitFeedbackTasks.forEach((awaitFeedbackTasks) => {
    allTasks.push(awaitFeedbackTasks);
  });
  doneTasks.forEach((doneTasks) => {
    allTasks.push(doneTasks);
  });
}

/**
 * Updates the tasks in the Firebase database with the new task data.
 */
async function updateTasksInFirebase() {
  let response = await fetch(URL + "tasks/.json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(allTasks),
  });
}

/**
 * Initializes event listeners for the task section buttons when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  taskSections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) {
      /**
       * Changes the button's image to the hover state when the mouse enters the element.
       */
      element.addEventListener("mouseenter", () => {
        element.src = section.hoverSrc;
      });
      /**
       * Reverts the button's image to the default state when the mouse leaves the element.
       */
      element.addEventListener("mouseleave", () => {
        element.src = section.defaultSrc;
      });
    }
  });
});

/**
 * Toggles the visibility of the add task pop-up and the main board container.
 */
function toggleAddTaskPopUp() {
  document.getElementById("add-task").classList.toggle("show-add-task");
  document.getElementById("board-container").classList.toggle("d-none");
  document.getElementById("title").style.border = "1px solid rgba(209, 209, 209, 1)";
  document.getElementById("date").style.border = "1px solid rgba(209, 209, 209, 1)";
  document.getElementById("category-dropdown").style.border = "1px solid rgba(209, 209, 209, 1)";
  deleteAllFields();
}

/**
 * Filters tasks based on the search term from the search field.
 */
async function filterTask() {
  let searchbarValue = document.getElementById("searchbar-field").value.toLowerCase();
  if (searchbarValue == "") {
    searchbarValue = document.getElementById("searchbar-field-mobile").value.toLowerCase();
  }
  let filtered = allTasks.filter((task) => {
    let titleString = task["title"][0].toLowerCase();
    return titleString.includes(searchbarValue);
  });

  if (searchbarValue.length == 0) {
    loadData();
  } else {
    allTasks = filtered;
    sortTasksInColumn(allTasks);
    renderTasks();
  }
}

/**
 * Adds a class to the split to highlight it.
 * @param {*} split - The ID from the split
 */
function addHighLight(split) {
  document.getElementById(split).classList.add("highlight");
}

/**
 * Removes a class from the split to remove the highlight.
 * @param {*} split - The ID from the split
 */
function removeHighLight(split) {
  document.getElementById(split).classList.remove("highlight");
}


