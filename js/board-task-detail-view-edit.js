/**
 * Initiates the process of editing a task by calling functions.
 */
function editTask() {
  editHeadline();
  editTitle();
  editDescription();
  editDate();
  editPrio();
  let path = array[taskNum]["prio"][0];
  editTogglePrio(path);
  editAssignedPersons();
  editRenderPersonLogo();
  editSubtasks();
  changeOptions();
}

/**
 * Edits the headline of the task by replacing it with a close button.
 */
function editHeadline() {
  document.getElementById("card-detail-view-headline").innerHTML = "";
  document.getElementById("card-detail-view-headline").style.justifyContent = "flex-end";

  document.getElementById("card-detail-view-headline").innerHTML = `
      <img onclick="resetCard(), renderCardInfo()" src="assets/img/close.svg" alt="close">
    `;
}

/**
 * Edits the title section of the task, providing an input field to change the title.
 */
function editTitle() {
  document.getElementById("card-detail-view-title-container").innerHTML = `
      <span class="edit-title">Title</span>
      <input type="text" id="edit-title-input" name="task-title" required placeholder="Enter a Title" />
    `;
  document.getElementById("edit-title-input").value = array[taskNum]["title"];
}

/**
 * Edits the description section of the task, providing a textarea to change the description.
 */
function editDescription() {
  document.getElementById("card-detail-view-description-container").innerHTML = `
      <label id="edit-description" for="description">Description</label>
      <textarea id="edit-description-textarea" name="task-description" rows="6" placeholder="Enter a Description"></textarea>
    `;
  document.getElementById("edit-description-textarea").value = array[taskNum]["description"];
}

/**
 * Edits the date section of the task, providing a date picker to change the due date.
 */
function editDate() {
  document.getElementById("card-detail-view-date").innerHTML = `
      <span class="edit-date">Due Date:</span>
      <input type="date" id="edit-date-value" name="date" required="" style="border: 1px solid rgb(209, 209, 209);">  `;
  document.getElementById("edit-date-value").value = array[taskNum]["date"];
  document.getElementById("card-detail-view-date").style.display = "flex";
  document.getElementById("card-detail-view-date").style.flexDirection = "column";
}

/**
 * Edits the priority section of the task, allowing the user to change the priority (high, medium, low).
 */
function editPrio() {
  document.getElementById("card-detail-view-priority").innerHTML = `
      <span class="edit-prio">Priority:</span>
      <div class="edit-prio-btns">
        <button onclick="editTogglePrio('high')" class="high-btn" type="button" id="edit-high-btn"> Urgent 
          <img id="edit-high-btn-img" src="assets/img/prio-high.svg" alt="High">
        </button>
        <button onclick="editTogglePrio('medium')" class="medium-btn medium-btn-active" type="button" id="edit-medium-btn"> Medium 
          <img id="edit-medium-btn-img" src="assets/icon/prio_medium_selected.svg" alt="Medium">
        </button>
        <button onclick="editTogglePrio('low')" class="low-btn" type="button" id="edit-low-btn"> Low 
          <img id="edit-low-btn-img" src="assets/img/prio-low.svg" alt="Low">
        </button>
      </div>
    `;
  document.getElementById("card-detail-view-priority").style.display = "block";
}

/**
 * Toggles the priority between high, medium, and low by updating the task's priority and modifying the UI.
 * @param {string} path - The priority level to set (e.g., 'high', 'medium', 'low').
 */
function editTogglePrio(path) {
  array[taskNum]["prio"] = [];
  array[taskNum]["prio"].push(path);

  const prios = ["high", "medium", "low"];

  prios.forEach((prio) => {
    const img = document.getElementById(`edit-${prio}-btn-img`);
    const btn = document.getElementById(`edit-${prio}-btn`);
    btn.classList.remove(`${prio}-btn-active`);
    img.src = `assets/img/prio-${prio}.svg`;
  });
  const img = document.getElementById(`edit-${path}-btn-img`);
  const btn = document.getElementById(`edit-${path}-btn`);
  btn.classList.add(`${path}-btn-active`);
  img.src = `assets/icon/prio_${path}_selected.svg`;
}

/**
 * Edits the assigned persons section of the task by providing a dropdown to assign contacts.
 */
function editAssignedPersons() {
  let assignedPersonsContainer = document.getElementById("card-detail-view-assigned-persons");
  assignedPersonsContainer.innerHTML = "";
  assignedPersonsContainer.innerHTML = `
        <div onclick="toggleDropdownEditAssignedPersons()" id="edit-assigned-dropdown">
          Select contacts to assign
          <img class="drop-down-arrow" src="assets/img/drop-down-arrow.svg" alt="Arrow">
        </div>
        <div id="edit-assigned-dropdown-container" class="d-none"></div>
      `;
}

/**
 * Toggles the dropdown menu for assigning persons.
 */
function toggleDropdownEditAssignedPersons() {
  document.getElementById("edit-assigned-dropdown-container").classList.toggle("d-none");
  renderEditDropDown();
}

/**
 * Renders the dropdown list for assigning or removing persons to/from the task.
 */
function renderEditDropDown() {
  document.getElementById("edit-assigned-dropdown-container").innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let letterForlogo = createInitials(i, contacts);
    if (editCheckAssigned(i)) {
      document.getElementById("edit-assigned-dropdown-container").innerHTML += `
          <div id="edit-assigned-person${i}" style="background-color: rgb(9, 25, 49);" onclick="editRemovePerson(${i})" class="person-container">
            <div class="person">
              <span class="person-to-assigned-logo" style="background-color:${contacts[i]["color"]}">${letterForlogo}</span>
              <span id="edit-person-to-assigned-name${i}" style="color: rgb(255, 255, 255);">${contacts[i]["name"]}</span>
            </div>
            <img id="edit-person${i}-checkbox" src="assets/img/check-button-checked-white.svg" class="checkbox" />
          </div>
          `;
      contacts[i]["assignedToTask"] = true;
    } else {
      document.getElementById("edit-assigned-dropdown-container").innerHTML += `
          <div id="edit-not-assigned-person${i}" onclick="editAddPerson(${i})" class="person-container">
            <div class="person">
              <span class="person-to-assigned-logo" style="background-color:${contacts[i]["color"]}">${letterForlogo}</span>
              <span id="edit-person-to-assigned-name${i}">${contacts[i]["name"]}</span>
            </div>
            <img id="edit-person${i}-checkbox" src="assets/img/check-button.svg" class="checkbox" />
          </div>
          `;
      contacts[i]["assignedToTask"] = false;
    }
  }
}

/**
 * Checks if a person is already assigned to the task.
 * @param {number} i - The index of the contact to check.
 * @returns {boolean} - Returns true if the person is assigned, otherwise false.
 */
function editCheckAssigned(i) {
  let allContacts = contacts[i]["name"];
  return array[taskNum]["assigned persons"].some((person) => person === allContacts);
}

/**
 * Adds a person to the assigned persons list.
 * @param {number} i - The index of the person to add.
 */
function editAddPerson(i) {
  document.getElementById(`edit-person${i}-checkbox`).src = "assets/img/check-button-checked-white.svg";
  document.getElementById(`edit-not-assigned-person${i}`).style.backgroundColor = "rgba(9, 25, 49, 1)";
  document.getElementById(`edit-person-to-assigned-name${i}`).style.color = "rgb(255, 255, 255)";
  contacts[i]["assignedToTask"] = true;
  editAddPersonsToTask();
  renderEditDropDown();
}

/**
 * Removes a person from the assigned persons list.
 * @param {number} i - The index of the person to remove.
 */
function editRemovePerson(i) {
  document.getElementById(`edit-person${i}-checkbox`).src = "assets/img/check-button.svg";
  document.getElementById(`edit-assigned-person${i}`).style.backgroundColor = "unset";
  document.getElementById(`edit-person-to-assigned-name${i}`).style.color = "rgba(0, 0, 0, 1)";
  contacts[i]["assignedToTask"] = false;
  editAddPersonsToTask();
  renderEditDropDown();
}

/**
 * Updates the assigned persons array in the task.
 */
function editAddPersonsToTask() {
  array[taskNum]["assigned persons"] = [];
  array[taskNum]["color"] = [];
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i]["assignedToTask"]) {
      array[taskNum]["assigned persons"].push(contacts[i]["name"]);
      array[taskNum]["color"].push(contacts[i]["color"]);
    }
  }
  editRenderPersonLogo();
}

/**
 * Renders the logos of the assigned persons on the task card.
 */
function editRenderPersonLogo() {
  if (assignedPersons !== undefined || assignedPersons !== "placeholder" || assignedPersons !== "") {
    document.getElementById("card-detail-view-assigned-persons-logo").innerHTML = "";
    let assignedPersonsArr = array[taskNum]["assigned persons"];
    let assignedPersonsColor = array[taskNum]["color"];

    if (assignedPersonsArr.length > 4) {
      renderMoreAssignedPersons(assignedPersonsArr, assignedPersonsColor);
    } else {
      renderFewerAssignedPersons(assignedPersonsArr, assignedPersonsColor);
    }
  }
}

function renderMoreAssignedPersons(assignedPersonsArr, assignedPersonsColor) {
  const morePersons = assignedPersonsArr.length - 4;
  for (let i = 0; i < 4; i++) {
    let initials = editCreateInitials(i, assignedPersonsArr);
    document.getElementById("card-detail-view-assigned-persons-logo").innerHTML += `
        <div class="assigned-person-logo" style="background-color: ${assignedPersonsColor[i]}">${initials}</div>
      `;
  }
  document.getElementById("card-detail-view-assigned-persons-logo").innerHTML += `
  <span class="card-more-persons">+${morePersons}</span>
`;
}

function renderFewerAssignedPersons(assignedPersonsArr, assignedPersonsColor) {
  for (let i = 0; i < assignedPersonsArr.length; i++) {
    let initials = editCreateInitials(i, assignedPersonsArr);
    document.getElementById("card-detail-view-assigned-persons-logo").innerHTML += `
        <div class="assigned-person-logo" style="background-color: ${assignedPersonsColor[i]}">${initials}</div>
      `;
  }
}

/**
 * Creates the initials for assigned persons.
 */

function editCreateInitials(i, array) {
  let name = array[i];
  let initials = name.split(" ").map((word) => word[0]);
  let initialsString = initials.join("");
  return initialsString.toUpperCase();
}

/**
 * This function clears the current subtasks section and displays inputs for adding new subtasks.
 * It calls helper functions to render the input field, checked subtasks, and unchecked subtasks.
 */
function editSubtasks() {
  document.getElementById("card-detail-view-subtasks").innerHTML = "";
  document.getElementById("card-detail-view-subtasks").style.display = "flex";
  document.getElementById("card-detail-view-subtasks").classList.add("edit-subtasks-input");

  renderEditSubtaskContainer();
  renderEditCheckedSubtasks();
  renderEditUnCheckedSubtasks();
}

/**
 * Renders the container for subtasks, including an input field for adding new subtasks.
 */
function renderEditSubtaskContainer() {
  document.getElementById("card-detail-view-subtasks").innerHTML = `
    <span>Subtasks</span>
    <div id="edit-subtask-input-container">
      <input type="text" id="edit-add-subtask" name="subtask-input" required="" placeholder="Add new subtask">
      <img onclick="editAddSubtask()" id="add-subtasks-plus" src="assets/img/plus2.svg" alt="Plus">
    </div>
    <div id="card-detail-view-subtasks-container">
    </div>
  `;
}

/**
 * Renders the checked subtasks.
 * This function loops through the list of checked subtasks and displays them.
 */
function renderEditCheckedSubtasks() {
  checkedSubtasks = array[taskNum]["subtasksChecked"];
  if (
    checkedSubtasks.length !== 0 &&
    checkedSubtasks[0] !== "placeholder" &&
    checkedSubtasks !== undefined &&
    checkedSubtasks[0] !== ""
  ) {
    for (let i = 0; i < checkedSubtasks.length; i++) {
      document.getElementById("card-detail-view-subtasks-container").innerHTML += `
            <div id="edit-checked-subtasks(${i})" class="card-detail-view-subtasks-enumeration">
              <img onclick="EditUncheckSubtask(${i}, 'card-detail-view-subtasks-container')" id="checkedCheckbox(${i})" src="assets/img/check-button-checked.svg" />
              <span id="edit-checked-subtask-${i}">${checkedSubtasks[i]}</span>
              <div id="edit-checked-subtask-options-container(${i})" class="edit-options-container">
                <img onclick="editRewriteCheckedSubtask(${i})" id="edit-checked-subtask-pencil-(${i})" class="subtask-bin" src="assets/img/edit.svg" alt="Edit">
                <div class="edit-options-container-line"></div>
                <img onclick="editDeleteCheckedSubtask(${i})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
              </div>
            </div>
          `;
    }
  }
}

function editRewriteCheckedSubtask(i) {
  const subtask = document.getElementById(`edit-checked-subtask-${i}`);
  const value = subtask.value || subtask.textContent || "";
  subtask.innerHTML = `
    <input type="text" id="edit-checked-subtask-${i}" name="subtask-input" required="" placeholder="Rewrite your subtask" value="${value}">
  `;
  document.getElementById(`edit-checked-subtask-options-container(${i})`).innerHTML = "";
  document.getElementById(`edit-checked-subtask-options-container(${i})`).innerHTML = `
    <img onclick="editSaveRewriteCheckedSubtask(${i})" class="subtask-bin" src="assets/img/check.svg" alt="Save">
    <div class="edit-options-container-line"></div>
    <img onclick="cancelEditSubtask()" class="subtask-bin" src="assets/img/cancel-x.svg" alt="Cancel">
  `;
}

/**
 * Renders the unchecked subtasks.
 * This function loops through the list of unchecked subtasks and displays them.
 */
function renderEditUnCheckedSubtasks() {
  unCheckedSubtasks = array[taskNum]["subtasksNotChecked"];
  if (
    unCheckedSubtasks.length !== 0 &&
    unCheckedSubtasks[0] !== "placeholder" &&
    unCheckedSubtasks !== undefined &&
    unCheckedSubtasks[0] !== ""
  ) {
    for (let i = 0; i < unCheckedSubtasks.length; i++) {
      document.getElementById("card-detail-view-subtasks-container").innerHTML += `
          <div id="edit-unchecked-subtasks(${i})" class="card-detail-view-subtasks-enumeration">
            <img onclick="editCheckSubtask(${i}, 'card-detail-view-subtasks-container')" id="unCheckedCheckbox(${i})" src="assets/img/check-button.svg" />
            <span id="edit-unchecked-subtask-${i}">${unCheckedSubtasks[i]}</span>
              <div id="edit-unchecked-subtask-options-container(${i})" class="edit-options-container">
                <img onclick="editRewriteUnCheckedSubtask(${i})" id="edit-checked-subtask-pencil-(${i})" class="subtask-bin" src="assets/img/edit.svg" alt="Edit">
                <div class="edit-options-container-line"></div>
                <img onclick="editDeletunCheckedSubtask(${i})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
              </div>
          </div>
        `;
    }
  }
}

function editRewriteUnCheckedSubtask(i) {
  const subtask = document.getElementById(`edit-unchecked-subtask-${i}`);
  const value = subtask.value || subtask.textContent || "";
  subtask.innerHTML = `
    <input type="text" id="edit-unchecked-subtask-${i}" name="subtask-input" required="" placeholder="Rewrite your subtask" value="${value}">
  `;
  document.getElementById(`edit-unchecked-subtask-options-container(${i})`).innerHTML = "";
  document.getElementById(`edit-unchecked-subtask-options-container(${i})`).innerHTML = `
    <img onclick="editSaveRewriteUncheckedSubtask(${i})" class="subtask-bin" src="assets/img/check.svg" alt="Save">
    <div class="edit-options-container-line"></div>
    <img onclick="cancelEditSubtask()" class="subtask-bin" src="assets/img/cancel-x.svg" alt="Cancel">
  `;
}

function cancelEditSubtask() {
  editSubtasks();
}

function EditUncheckSubtask(i) {
  unCheckedSubtasks.push(checkedSubtasks[i]);
  checkedSubtasks.splice(i, 1);
  document.getElementById("card-detail-view-subtasks-container").innerHTML = "";
  renderEditUnCheckedSubtasks();
  renderEditCheckedSubtasks();
}

function editCheckSubtask(i) {
  checkedSubtasks.push(unCheckedSubtasks[i]);
  unCheckedSubtasks.splice(i, 1);
  document.getElementById("card-detail-view-subtasks-container").innerHTML = "";
  renderEditUnCheckedSubtasks();
  renderEditCheckedSubtasks();
}

/**
 * Adds a new subtask to the list of unchecked subtasks.
 */
function editAddSubtask() {
  let editInput = document.getElementById("edit-add-subtask");
  let editInputValue = editInput.value;

  if (editInputValue !== "") {
    if (array[taskNum]["subtasksNotChecked"] == "placeholder") {
      array[taskNum]["subtasksNotChecked"] = [];
    }
    array[taskNum]["subtasksNotChecked"].push(editInputValue);
    document.getElementById("card-detail-view-subtasks-container").innerHTML = "";
    renderEditCheckedSubtasks();
    renderEditUnCheckedSubtasks();
    editInput.value = "";
  }
}

/**
 * Deletes a subtask from the list of checked subtasks.
 * @param {number} i - The index of the subtask to delete.
 */
function editDeleteCheckedSubtask(i) {
  checkedSubtasks.splice(i, 1);
  editSubtasks();
}

/**
 * Deletes a subtask from the list of unchecked subtasks.
 * @param {number} i - The index of the subtask to delete.
 */
function editDeletunCheckedSubtask(i) {
  unCheckedSubtasks.splice(i, 1);
  editSubtasks();
}

/**
 * Updates the task array with the latest data from the edit fields.
 */
function updateArray() {
  let title = document.getElementById("edit-title-input").value;
  array[taskNum]["title"] = title;
  let description = document.getElementById("edit-description-textarea").value;
  array[taskNum]["description"] = description;
  let date = document.getElementById("edit-date-value").value;
  array[taskNum]["date"] = date;

  updateTasksInFirebase();
  resetCard();
  renderCardInfo();
}

/**
 * Changes the options for editing a task, providing a "Save" button for saving changes.
 */
function changeOptions() {
  document.getElementById("options-container").innerHTML = "";
  document.getElementById("options-container").innerHTML = `
      <div class="edit-options">
        <a onclick="updateArray()" class="edit-save-btn" href="#">Save</a>
      </div>
    `;
}

/**
 * This function calls other helper functions to reset the card.
 */
function resetCard() {
  resetHeadlineAndTitle();
  resetDescriptionAndDate();
  resetPrioAndAssignedPersons();
  resetSubtasksAndOptions();
}

/**
 * Resets the card's headline and title section to its original state.
 */
function resetHeadlineAndTitle() {
  document.getElementById("card-detail-view-headline").style.justifyContent = "space-between";
  document.getElementById("card-detail-view-headline").innerHTML = ``;

  document.getElementById("card-detail-view-title-container").innerHTML = `
        <h1 id="card-detail-view-title" class="card-detail-view-title"></h1>
      `;
}

/**
 * Resets the card's description and due date section to its original state.
 */
function resetDescriptionAndDate() {
  document.getElementById("card-detail-view-description-container").innerHTML = `
    <span id="card-detail-view-description" class="card-detail-view-description"></span>
  `;

  document.getElementById("card-detail-view-date").style.display = "block";
  document.getElementById("card-detail-view-date").innerHTML = `
    <span class="card-detail-view-date-text">Due Date:</span>
    <span id="card-detail-view-date-due-date" class="card-detail-view-date-due-date"></span>
  `;
}

/**
 * Resets the priority and assigned persons section of the card.
 */
function resetPrioAndAssignedPersons() {
  document.getElementById("card-detail-view-priority").style.display = "flex";
  document.getElementById("card-detail-view-priority").innerHTML = `
        <span class="card-detail-view-priority-text">Priority:</span>
        <div class="card-detail-view-priority-urgency">
          <span id="card-detail-view-priority-urgency-span">low</span>
          <img id="card-detail-view-priority-urgency-img" src="assets/img/prio-low.svg" alt="">
        </div>
      `;

  document.getElementById("card-detail-view-assigned-persons-container").innerHTML = `
        <span>Assigned-To:</span>
        <div id="card-detail-view-assigned-persons"></div>
        <div id="card-detail-view-assigned-persons-logo"></div>
      `;
}

/**
 * Resets the subtasks and options section of the card.
 */
function resetSubtasksAndOptions() {
  document.getElementById("card-detail-view-subtasks").innerHTML = `
    <span>Subtasks</span>
    <div id="card-detail-view-subtasks-container" class="card-detail-view-subtasks-container"></div>
  `;

  document.getElementById("options-container").innerHTML = `
    <div id="options" class="options">
      <div onclick="deleteTask()" class="delete">
        <img src="assets/img/delete.svg" alt="Bin">
        <span>Delete</span>
      </div>
      <div class="options-line"></div>
        <div onclick="editTask()" class="edit">
          <img src="assets/img/edit.svg" alt="Pencil">
          <span>Edit</span>
      </div>
    </div>  
  `;
}
