const URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let contacts;
let assignedPersons = [];
let subtasksArr = [];

/**
 * Loads contact data from the Firebase Realtime Database.
 * The data is assigned to the `contacts` variable.
 */
async function loadData() {
  let response = await fetch(URL + "/.json");
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
          <span id="person-to-assigned-name${i}" style="color: rgb(255, 255, 255);">${
            contacts[i]["name"]
      }</span>
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
  let initials = name.split(' ').map(word => word[0]);
  let initialsString = initials.join('');
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
/**
 * Adds a new subtask to the list.
 */

function addSubtasks() {
  let subtaskValue = document.getElementById("add-subtasks").value;

  if (subtaskValue == "") {

  } else {
    document.getElementById("added-subtasks-list").innerHTML = ""; 
    subtasksArr.push(subtaskValue);
    for (let i = 0; i < subtasksArr.length; i++) {
      document.getElementById("added-subtasks-list").innerHTML += `
        <li class = "subtask${i}">${subtasksArr[i]}</li>
      `;
    }  
  }
  document.getElementById("add-subtasks").value = ""; 
}

/**
 * Adds an event listener to the input field that triggers a function when the Enter key is pressed.
 */
document.getElementById('add-subtasks').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addSubtasks();
  }
});