const URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts;
let assignedPersons = [];
let subtasksArr = [];

let newTask = {
  title: [],
  description: [],
  "assigned persons": [],
  date: [],
  prio: [],
  category: [],
  subtasks: [],
};

/**
 * Loads contact data from the Firebase Realtime Database.
 * The data is assigned to the `contacts` variable.
 */
async function loadData() {
  let response = await fetch(URL + "contacts" + "/.json");
  let responseJSON = await response.json();
  contacts = Object.values(responseJSON);
}

/**
 * Initializes event listeners for the task section buttons when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const taskSections = [
    { id: "to-do-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
    { id: "in-progress-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
    {id: "await-feedback-plus", hoverSrc: "assets/img/plus-button-blue.svg", defaultSrc: "assets/img/plus-button.svg" },
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
 * Toggles the visibility of the detailed task card view and the main board container.
 */
function toggleDetailTaskCard() {
  document.getElementById("card-detail-view").classList.toggle("show-card");
  document.getElementById("board-container").classList.toggle("d-none");
}

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

function deleteAllFields() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  assignedPersons = [];
  for (let i = 0; i < contacts.length; i++) {
    contacts[i]["assignedToTask"] = false
  }
  addPersonLogo();
  document.getElementById("date").value = "";
  document.getElementById("category-dropdown").innerHTML = "Select task category";
  newTask["prio"] = "";
  togglePrio("medium")
  subtasksArr = [];
  renderSubtasks();

}

/**
 * Toggles the visibility of the assigned person dropdown.
 */
function toggleAssignedDropDown() {
  document.getElementById("person-to-assigned").classList.toggle("d-none");
  renderDropDown();
}

/**
 * Renders the assigned person dropdown menu with the list of contacts.
 */
function renderDropDown() {
  document.getElementById("person-to-assigned").innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let letterForlogo = createInitials(i, contacts);
    if (contacts[i]["assignedToTask"]) {
      document.getElementById("person-to-assigned").innerHTML += `
      <div id="person${i}" style="background-color: rgb(9, 25, 49);" onclick="togglePersonToAssigned(${i})" class="person-container">
        <div class="person">
          <span class="person-to-assigned-logo" style="background-color:${contacts[i]["color"]}">${letterForlogo}</span>
          <span id="person-to-assigned-name${i}" style="color: rgb(255, 255, 255);">${contacts[i]["name"]}</span>
        </div>
        <img id="person${i}-checkbox" src="assets/img/check-button-checked-white.svg" class="checkbox" />
      </div>
      `;
    } else {
      document.getElementById("person-to-assigned").innerHTML += `
      <div id="person${i}" onclick="togglePersonToAssigned(${i})" class="person-container">
        <div class="person">
          <span class="person-to-assigned-logo" style="background-color:${contacts[i]["color"]}">${letterForlogo}</span>
          <span id="person-to-assigned-name${i}">${contacts[i]["name"]}</span>
        </div>
        <img id="person${i}-checkbox" src="assets/img/check-button.svg" class="checkbox" />
      </div>
      `;
    }
  }
}

/**
 * Creates the initials of a name from an array of objects.
 *
 * @param {number} i - The index of the object in the array whose name will be used.
 * @param {Array<Object>} array - An array of objects, each containing a `name` property as a string.
 * @returns {string} - The initials of the name in uppercase.
 */
function createInitials(i, array) {
  let name = array[i]["name"];
  let initials = name.split(" ").map((word) => word[0]);
  let initialsString = initials.join("");
  return initialsString.toUpperCase();
}

/**
 * Toggles the visibility of the category dropdown menu.
 */
function toggleCategoryDropDown() {
  document.getElementById("categories").classList.toggle("d-none");
}

/**
 * Changes the cancel button's image to the hover state. *
 */
function mouseEnterChangeX() {
  document.getElementById("cancel-btn-img").src = "assets/img/cancel-x-hover.svg";
}

/**
 * Reverts the cancel button's image to the default state.
 */
function mouseLeaveChangeX() {
  document.getElementById("cancel-btn-img").src = "assets/img/cancel-x.svg";
}

/**
 * Toggles the assignment state of a person to a task.
 * @param {number} i - The index of the contact in the `contacts` object.
 */
function togglePersonToAssigned(i) {
  if (!contacts[i]["assignedToTask"]) {
    document.getElementById(`person${i}-checkbox`).src = "assets/img/check-button-checked-white.svg";
    document.getElementById(`person${i}`).style.backgroundColor = "rgba(9, 25, 49, 1)";
    document.getElementById(`person-to-assigned-name${i}`).style.color = "rgb(255, 255, 255)";
    contacts[i]["assignedToTask"] = true;
    assignedPersons = [];
    addPersonsToTask();
    addPersonLogo(i);
  } else {
    document.getElementById(`person${i}-checkbox`).src = "assets/img/check-button.svg";
    document.getElementById(`person${i}`).style.backgroundColor = "unset";
    document.getElementById(`person-to-assigned-name${i}`).style.color = "rgba(0, 0, 0, 1)";
    contacts[i]["assignedToTask"] = false;
    assignedPersons = [];
    addPersonsToTask();
    addPersonLogo(i);
  }
}

/**
 * Updates the `assignedPersons` array by adding all contacts that are assigned to a task.
 */
function addPersonsToTask() {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i]["assignedToTask"]) {
      assignedPersons.push(contacts[i]);
    }
  }
}

/**
 * Updates the UI to display the initials of all assigned persons.
 */
function addPersonLogo() {
  document.getElementById("assigned-person").innerHTML = "";
  for (let i = 0; i < assignedPersons.length; i++) {
    let letterForlogo = createInitials(i, assignedPersons);
    document.getElementById("assigned-person").innerHTML += `
      <div class="assigned-person-logo" style="background-color: ${assignedPersons[i]["color"]}">
        ${letterForlogo}
      </div>
    `;
  }
}

function togglePrio(path) {
  const prios = ["high", "medium", "low"];

  prios.forEach((prio) => {
    const img = document.getElementById(`${prio}-btn-img`);
    const btn = document.getElementById(`${prio}-btn`);
    btn.classList.remove(`${prio}-btn-active`);
    img.src = `assets/img/prio-${prio}.svg`;
  });
  const img = document.getElementById(`${path}-btn-img`);
  const btn = document.getElementById(`${path}-btn`);
  btn.classList.add(`${path}-btn-active`);
  img.src = `assets/icon/prio_${path}_selected.svg`;
  pushPrio(path);
}

function addCategory(catagory) {
  document.getElementById("category-dropdown").innerHTML = catagory;
}

/**
 * Adds a new subtask to the list.
 */
function addSubtasks() {
  let subtaskValue = document.getElementById("add-subtasks").value;
  if (subtaskValue == "") {
  } else {
    subtasksArr.push(subtaskValue);
    renderSubtasks();
  }
  document.getElementById("add-subtasks").value = "";
}

function renderSubtasks() {
  document.getElementById("added-subtasks-list").innerHTML = "";
  for (let i = 0; i < subtasksArr.length; i++) {
    document.getElementById("added-subtasks-list").innerHTML += `
      <li id="subtask${i}" class="subtask">
        <span>${subtasksArr[i]}</span>
          <img onclick="deletSubtask(${i})" src="assets/img/bin.svg" alt="Delet">
      </li>
    `;
  }
}

/**
 * Adds an event listener to the input field that triggers a function when the Enter key is pressed.
 */
document.getElementById("add-subtasks").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addSubtasks();
  }
});

function deletSubtask(i) {
  subtasksArr.splice(i, 1)
  renderSubtasks();
}

function pushNewTaskInJson() {
  if (checkEmptyFields()) {
    document.getElementById("title").style.borderColor = "red";
    document.getElementById("date").style.borderColor = "red";
    document.getElementById("category-dropdown").style.borderColor = "red";
    document.getElementById("point-out").classList.remove("d-none");;
  } else {
    push("title");
    push("description");
    pushAssignedPersons("assigned persons");
    push("date");
    pushPrio("medium");
    pushCatagory("category");
    pushSubtasks("subtasks");
    addTaskInFirebase();  
  }
}

function checkEmptyFields() {
  let title = document.getElementById("title").value;
  let date = document.getElementById("date").value;
  let category = document.getElementById("category-dropdown").innerHTML;
  if (title == "" || category == "Select task category" || date == "") {
    return true
  } else {
    return false
  }
}

function push(path) {
  let data = document.getElementById(path).value;
  newTask[path].push(data);
}

function pushAssignedPersons(path) {
  for (let i = 0; i < assignedPersons.length; i++) {
    assignedPersons[i]["name"];
    newTask[path].push(assignedPersons[i]["name"]);
  }
}

function pushPrio(path) {
  newTask["prio"] = []
  newTask["prio"].push(path);
}

function pushCatagory(path) {
  let data = document.getElementById("category-dropdown").innerHTML;
  newTask[path] = [];
  newTask[path].push(data);
}

function pushSubtasks(path) {
  newTask[path] = [];
  for (let i = 0; i < subtasksArr.length; i++) {
    let data = subtasksArr[i];
    newTask[path].push(data);
  }
}

async function addTaskInFirebase() {
  await fetch(URL + "/tasks/toDo" + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
}
