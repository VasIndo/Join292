let contacts;
let toDo;
let inProgress;
let awaitFeedback;
let done;

let currentDraggedElement;

let response
let responseJSON
let allTasks;
let toDoTasks;
let inProgressTasks;
let awaitFeedbackTasks;
let doneTasks;

const URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData() {
  await loadContacts();
  await loadTasks();
  renderTasks();
}

function renderTasks() {
  renderTask(toDoTasks, "to-do-tasks");
  renderTask(inProgressTasks, "in-progress-tasks");
  renderTask(awaitFeedbackTasks, "await-feedback-tasks");
  renderTask(doneTasks, "done-tasks");
}

async function loadTasks() {
  response = await fetch(URL + "tasks/.json");
  responseJSON = await response.json();
  allTasks = Object.values(responseJSON);

  toDoTasks = allTasks.filter((task) => task.taskColumn === "toDo");
  inProgressTasks = allTasks.filter((task) => task.taskColumn === "inProgress");
  awaitFeedbackTasks = allTasks.filter((task) => task.taskColumn === "awaitFeedback");
  doneTasks = allTasks.filter((task) => task.taskColumn === "done");
}

async function loadContacts() {
  let response = await fetch(URL + "contacts" + "/.json");
  responseJSON = await response.json();
  contacts = Object.values(responseJSON);
}

function renderTask(tasksArr, tasksColumn) {
  document.getElementById(tasksColumn).innerHTML = "";
  for (let i = 0; i < tasksArr.length; i++) {
    document.getElementById(tasksColumn).innerHTML += `
            <div ondragstart="rotate('${tasksColumn}-card(${i})')" draggable="true" onclick="toggleDetailTaskCard()" class="tasks-card" id="${tasksColumn}-card(${i})">
              <div class="catagory">${tasksArr[i]["category"]}</div>
              <h1 class="title">${tasksArr[i]["title"]}</h1>
              <p class="description">${tasksArr[i]["description"]}</p>
              <div class="subtasks">
                <div class="subtasks-diagram">
                  <div class="subtasks-diagram-filled"></div>
                </div>
                <span class="subtasks-number">1/2</span>
              </div>
              <div class="bottom-card">
                <div id="${tasksColumn}assigned-to(${i})" class="assigned-to">
              </div>                
                <img id="${tasksColumn}prio${i}" class="prio" src="assets/img/prio-medium.svg" alt="medium" />
              </div>
            </div>
        `;

    renderAssignedPersons(tasksArr, i, tasksColumn);
    renderPrio(tasksArr, i, tasksColumn);
  }
}

function rotate(card) {
  document.getElementById(card).classList.add("rotate");
  currentDraggedElement = card;
}

function rotateBack(path) {
  document.getElementById(path).classList.remove("rotate");
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(newTaskColumn) {
  let number = currentDraggedElement.split("(")[1].split(")")[0];
  let string = currentDraggedElement.split('(')[0];
  if (string == "to-do-tasks-card") {
    toDoTasks[number]["taskColumn"] = newTaskColumn;
  } else if (string == "in-progress-tasks-card") {
    inProgressTasks[number]["taskColumn"] = newTaskColumn;
  } else if (string == "await-feedback-tasks-card") {
    awaitFeedbackTasks[number]["taskColumn"] = newTaskColumn;
  } else if (string == "done-tasks-card") {
    doneTasks[number]["taskColumn"] = newTaskColumn;
  }
  allTasks = [];
  toDoTasks.forEach(toDoTasks => {
    allTasks.push(toDoTasks);
  });
  inProgressTasks.forEach(inProgressTasks => {
    allTasks.push(inProgressTasks);
  });
  awaitFeedbackTasks.forEach(awaitFeedbackTasks => {
    allTasks.push(awaitFeedbackTasks);
  });
  doneTasks.forEach(doneTasks => {
    allTasks.push(doneTasks);
  });
  await uploadTasks();
  loadData();
}

async function uploadTasks() {
  let response = await fetch(URL + "tasks/.json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(allTasks),
  });
}

function renderAssignedPersons(tasksColumn, i, idName) {
  let person = tasksColumn[i]["assigned persons"];
  if (person == undefined) {
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
 * Initializes event listeners for the task section buttons when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const taskSections = [
    { id: "to-do-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
    { id: "in-progress-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
    {
      id: "await-feedback-plus",
      hoverSrc: "assets/img/plus-button-blue.svg",
      defaultSrc: "assets/img/plus-button.svg",
    },
  ];

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
  document.getElementById("point-out").classList.add("d-none");
  deleteAllFields();
}
