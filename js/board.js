const URL = "https://join-contacts-b0fa3-default-rtdb.europe-west1.firebasedatabase.app";
let contacts;
let assignedPersons = [];

/**
 * Loads contact data from the Firebase Realtime Database.
 * The data is assigned to the `contacts` variable.
 */
async function loadData() {
  let response = await fetch(URL + "/.json");
  let responseJSON = await response.json();
  contacts = responseJSON["contacts"];
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
  for (let i = 0; i < Object.keys(contacts).length; i++) {
    if (contacts[`contact${i}`]["assignedToTask"]) {
      let letterForlogo = renderPersonLogoInDropDown(i);
      document.getElementById("person-to-assigned").innerHTML += `
      <div id="person${i}" style="background-color: rgb(9, 25, 49);" onclick="togglePersonToAssigned(${i})" class="person-container">
        <div class="person">
          <span class="person-to-assigned-logo assigned-person-logo-color${contacts[`contact${i}`]["id"]}">${letterForlogo}</span>
          <span id="person-to-assigned-name${i}" style="color: rgb(255, 255, 255);">${
            contacts[`contact${i}`]["firstName"] + " " + contacts[`contact${i}`]["lastName"]
      }</span>
        </div>
        <img id="person${i}-checkbox" src="assets/img/check-button-checked-white.svg" class="checkbox" />
      </div>
      `;
    } else {
      let letterForlogo = renderPersonLogoInDropDown(i);
      document.getElementById("person-to-assigned").innerHTML += `
      <div id="person${i}" onclick="togglePersonToAssigned(${i})" class="person-container">
        <div class="person">
          <span class="person-to-assigned-logo assigned-person-logo-color${contacts[`contact${i}`]["id"]}">${letterForlogo}</span>
          <span id="person-to-assigned-name${i}">${contacts[`contact${i}`]["firstName"] + " " + contacts[`contact${i}`]["lastName"]}</span>
        </div>
        <img id="person${i}-checkbox" src="assets/img/check-button.svg" class="checkbox" />
      </div>
      `;
    }
  }
}

/**
 * Generates the initials (first letter of first name and last name) for a contact.
 * 
 * @function renderPersonLogoInDropDown
 * @param {number} i - The index of the contact in the `contacts` object.
 * @returns {string} The initials of the contact.
 */
function renderPersonLogoInDropDown(i) {
  let firstLetter = contacts[`contact${i}`]["firstName"].charAt(0);
  let secondLetter = contacts[`contact${i}`]["lastName"].charAt(0);
  return firstLetter + secondLetter;
}

/**
 * Generates the initials (first letter of first name and last name) for an assigned person.
 * 
 * @function renderPersonLogoForAssignedPerson
 * @param {number} i - The index of the person in the `assignedPersons` array.
 * @returns {string} The initials of the assigned person.
 */
function renderPersonLogoForAssignedPerson(i) {
  let firstLetter = assignedPersons[i]["assignedPerson"]["firstName"].charAt(0);
  let secondLetter = assignedPersons[i]["assignedPerson"]["lastName"].charAt(0);
  return firstLetter + secondLetter;
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
  if (!contacts[`contact${i}`]["assignedToTask"]) {
    document.getElementById(`person${i}-checkbox`).src = "assets/img/check-button-checked-white.svg";
    document.getElementById(`person${i}`).style.backgroundColor = "rgba(9, 25, 49, 1)";
    document.getElementById(`person-to-assigned-name${i}`).style.color = "rgb(255, 255, 255)";
    contacts[`contact${i}`]["assignedToTask"] = true;
    assignedPersons = [];
    addPersonsToTask();
    addPersonLogo(i);
  } else {
    document.getElementById(`person${i}-checkbox`).src = "assets/img/check-button.svg";
    document.getElementById(`person${i}`).style.backgroundColor = "unset";
    document.getElementById(`person-to-assigned-name${i}`).style.color = "rgba(0, 0, 0, 1)";
    contacts[`contact${i}`]["assignedToTask"] = false;
    assignedPersons = [];
    addPersonsToTask();
    addPersonLogo(i);
  }
}

/**
 * Updates the `assignedPersons` array by adding all contacts that are assigned to a task.
 */
function addPersonsToTask() {
  for (let i = 0; i < Object.keys(contacts).length; i++) {
    if (contacts[`contact${i}`]["assignedToTask"]) {
      assignedPersons.push({ assignedPerson: contacts[`contact${i}`] });
    }
  }
}

/**
 * Updates the UI to display the initials of all assigned persons.
 */
function addPersonLogo() {
  document.getElementById("assigned-person").innerHTML = "";
  for (let index = 0; index < assignedPersons.length; index++) {
    let letterForlogo = renderPersonLogoForAssignedPerson(index);
    document.getElementById("assigned-person").innerHTML += `
    <div class="assigned-person-logo assigned-person-logo-color${assignedPersons[index]["assignedPerson"]["id"]}">${letterForlogo}</div>
  `;
  }
}