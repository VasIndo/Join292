let assignedPersons = [];
let colorPerson = [];
let subtasksArr = [];

let newTask = {
  title: [],
  description: [],
  "assigned persons": ["placeholder"],
  color: [],
  date: [],
  prio: ["medium"],
  category: [],
  subtasksChecked: [""],
  subtasksNotChecked: [""],
  taskColumn: "toDo",
};

/**
 * Toggles the visibility of the assigned person dropdown.
 */
function toggleAssignedDropDown() {
  document.getElementById("person-to-assigned").classList.toggle("d-none");
  renderDropDown();
}

/**
 * Clears all input fields, resets assigned persons, priority, and subtasks.
 */
function deleteAllFields() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  assignedPersons = [];
  for (let i = 0; i < contacts.length; i++) {
    contacts[i]["assignedToTask"] = false;
  }
  addPersonLogo();
  document.getElementById("date").value = "";
  document.getElementById("category-dropdown").innerHTML = "Select task category";
  newTask["prio"] = "";
  togglePrio("medium");
  subtasksArr = [];
  renderSubtasks();
  newTask = {
    title: [],
    description: [],
    "assigned persons": ["placeholder"],
    color: ["placeholder"],
    date: [],
    prio: ["medium"],
    category: [],
    subtasksChecked: [""],
    subtasksNotChecked: ["placeholder"],
    taskColumn: "toDo",
  };

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
    colorPerson = [];
    addPersonsToTask();
    addPersonLogo(i);
  } else {
    document.getElementById(`person${i}-checkbox`).src = "assets/img/check-button.svg";
    document.getElementById(`person${i}`).style.backgroundColor = "unset";
    document.getElementById(`person-to-assigned-name${i}`).style.color = "rgba(0, 0, 0, 1)";
    contacts[i]["assignedToTask"] = false;
    assignedPersons = [];
    colorPerson = [];
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
      colorPerson.push(contacts[i]["color"]);
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
 * Toggles the priority selection and updates the button visuals accordingly.
 * @param {string} path - The selected priority ("high", "medium", or "low").
 */
function togglePrio(path) {
  newTask['prio'] = [];
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

/**
 * Updates the category dropdown with the selected category.
 * @param {string} category - The selected category.
 */
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

/**
 * Renders the list of added subtasks.
 */
function renderSubtasks() {
  document.getElementById("added-subtasks-list").innerHTML = "";
  for (let i = 0; i < subtasksArr.length; i++) {
    document.getElementById("added-subtasks-list").innerHTML += `
        <li id="subtask${i}" class="subtask">
          <span>${subtasksArr[i]}</span>
          <div>
          <img class="subTaskBtn" onclick="editTask(${i})" src="assets/img/edit.svg" alt="Edit">
          <img class="subTaskBtn" onclick="deletSubtask(${i})" src="assets/img/bin.svg" alt="Delete">
          </div>
        </li>
      `;
  }
}

/**
 * Ermöglicht das Bearbeiten einer bestehenden Subtask.
 * @param {number} index - Der Index der zu bearbeitenden Subtask im Array `subtasksArr`.
 */
function editTask(index) {
  // Hole das aktuelle Subtask-Element
  let subtaskElement = document.getElementById(`subtask${index}`);
  
  // Extrahiere den Subtask-Text
  let currentSubtaskText = subtasksArr[index];

  // Erstelle ein Eingabefeld mit dem aktuellen Text
  subtaskElement.innerHTML = `
    <input id="edit-input-${index}" type="text" value="${currentSubtaskText}" />
    <div>
    <img class="subTaskBtn" onclick="saveTask(${index})" src="assets/img/check.svg" alt="Save">
    <img class="subTaskBtn" onclick="cancelEdit(${index}, '${currentSubtaskText}')" src="assets/img/cancel-x.svg" alt="Cancel">
    </div>
  `;
}

/**
 * Speichert die Änderungen an einer Subtask.
 * @param {number} index - Der Index der zu bearbeitenden Subtask im Array `subtasksArr`.
 */
function saveTask(index) {
  // Hole den neuen Text aus dem Eingabefeld
  let newSubtaskText = document.getElementById(`edit-input-${index}`).value;

  // Überprüfe, ob der neue Text leer ist
  if (newSubtaskText.trim() === "") {
    alert("Subtask cannot be empty!");
    return;
  }

  // Aktualisiere das Array
  subtasksArr[index] = newSubtaskText;

  // Rendere die Subtasks neu
  renderSubtasks();
}

/**
 * Bricht das Bearbeiten einer Subtask ab und stellt den alten Zustand wieder her.
 * @param {number} index - Der Index der zu bearbeitenden Subtask im Array `subtasksArr`.
 * @param {string} originalText - Der ursprüngliche Text der Subtask.
 */
function cancelEdit(index, originalText) {
  subtasksArr[index] = originalText;

  // Rendere die Subtasks neu
  renderSubtasks();
}


/**
 * Adds an event listener to the input field that triggers a function when the Enter key is pressed.
 */
document.getElementById("add-subtasks").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addSubtasks();
  }
});

/**
 * Deletes a subtask from the list.
 * @param {number} i - The index of the subtask to delete.
 */
function deletSubtask(i) {
  subtasksArr.splice(i, 1);
  renderSubtasks();
}

/**
 * Pushes the current task data to the task object and sends it to Firebase.
 */
async function pushNewTaskInJson() {
  if (checkEmptyFields()) {
    document.getElementById("title").style.borderColor = "red";
    document.getElementById("date").style.borderColor = "red";
    document.getElementById("category-dropdown").style.borderColor = "red";
  } else {
    push("title");
    push("description");
    pushAssignedPersonsAndColor();
    push("date");
    pushCatagory("category");
    pushSubtasks("subtasksNotChecked");
    await addTaskInFirebase();
    loadData();
  }
}

/**
 * Checks if title, date or category are empty.
 * @returns {boolean} - Returns true if any field is empty, false otherwise.
 */
function checkEmptyFields() {
  let title = document.getElementById("title").value;
  let date = document.getElementById("date").value;
  let category = document.getElementById("category-dropdown").innerHTML;
  if (title == "" || category == "Select task category" || date == "") {
    return true;
  } else {
    return false;
  }
}

/**
 * Pushes the value from an HTML element into the newTask object.
 * @param {string} path - The path the value should be pushed, in newTask object.
 */
function push(path) {
  let data = document.getElementById(path).value;
  newTask[path].push(data);
}

/**
 * Adds names and colors of assigned persons to the newTask object.
 */
function pushAssignedPersonsAndColor() {
  if (assignedPersons == "placeholder" || assignedPersons == "") {

  } else {
    newTask["assigned persons"] = [];
    newTask["color"] = [];
    for (let i = 0; i < assignedPersons.length; i++) {
      newTask["assigned persons"].push(assignedPersons[i]["name"]);
      newTask["color"].push(colorPerson[i]);
    }
  }
}

/**
 * Updates the priority field in the newTask object.
 * @param {string} path - The priority value ("high", "medium", "low").
 */
function pushPrio(path) {
  newTask["prio"] = [];
  newTask["prio"].push(path);
}

/**
 * Updates the category field in the newTask object.
 * @param {string} path - The path where the category should be set, in newTask object.
 */
function pushCatagory(path) {
  let data = document.getElementById("category-dropdown").innerHTML;
  newTask[path] = [];
  newTask[path].push(data);
}

/**
 * Updates the subtasks field in the newTask object.
 * @param {string} path - The path  where the subtasks should be set, in newTask object.
 */
function pushSubtasks(path) {
  if (!subtasksArr.length == 0) {
    newTask[path] = [];
    for (let i = 0; i < subtasksArr.length; i++) {
      let data = subtasksArr[i];
      newTask[path].push(data);
    }
  }
}

/**
 * Sends the newTask object to Firebase and resets the input fields.
 */
async function addTaskInFirebase() {
  await fetch(URL + "/tasks" + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
  deleteAllFields();
  toggleAddTaskPopUp();
}

let assignedDropdownOpen = false;
let categoryDropdownOpen = false;

/**
 * Toggles the visibility of the assigned person dropdown.
 */
function toggleAssignedDropDown() {
  const dropdown = document.getElementById("person-to-assigned");
  dropdown.classList.toggle("d-none");
  assignedDropdownOpen = !dropdown.classList.contains("d-none");
  renderDropDown();
}

/**
 * Toggles the visibility of the category dropdown menu.
 */
function toggleCategoryDropDown() {
  const dropdown = document.getElementById("categories");
  dropdown.classList.toggle("d-none");
  categoryDropdownOpen = !dropdown.classList.contains("d-none");
}

/**
 * Closes dropdowns when clicking outside of them.
 * This is added as a global event listener on the document.
 */
document.addEventListener("click", function (event) {
  // Check for Assigned Dropdown
  const assignedDropdown = document.getElementById("person-to-assigned");
  const assignedTrigger = document.getElementById("assigned-dropdown");
  if (assignedDropdownOpen && !assignedDropdown.contains(event.target) && !assignedTrigger.contains(event.target)) {
    assignedDropdown.classList.add("d-none");
    assignedDropdownOpen = false;
  }

  // Check for Category Dropdown
  const categoryDropdown = document.getElementById("categories");
  const categoryTrigger = document.getElementById("category-dropdown");
  if (categoryDropdownOpen && !categoryDropdown.contains(event.target) && !categoryTrigger.contains(event.target)) {
    categoryDropdown.classList.add("d-none");
    categoryDropdownOpen = false;
  }
});
