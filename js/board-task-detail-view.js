let checkedSubtasks;
let unCheckedSubtasks;
let task;
let taskNum;
let array;

/**
 * Toggles the visibility of the detailed task card view and the main board container.
 */
function cardAnimation() {
  document.getElementById("card-detail-view").classList.toggle("show-card");
  document.getElementById("board-container").classList.toggle("d-none");
}

function init(taskColumn, i, arr) {
  task = taskColumn;
  taskNum = i;
  array = arr;
  renderCardInfo();
}

function renderCardInfo() {
  renderClose();
  renderCard("card-detail-view-catagory", "category");
  setCardCategoryColor("card-detail-view-catagory", "category");
  renderCard("card-detail-view-title", "title");
  renderCard("card-detail-view-description", "description");
  renderCard("card-detail-view-date-due-date", "date");
  renderCardPrio("card-detail-view-priority-urgency-span", "prio");
  checkAssignedPersons("card-detail-view-assigned-persons", "assigned persons");
  renderCardSubtasks("card-detail-view-subtasks-container");
}

function renderClose() {
  document.getElementById("card-detail-view-headline").innerHTML = "";
  document.getElementById("card-detail-view-headline").innerHTML += `
    <div id="card-detail-view-catagory" class="card-detail-view-catagory">User Story</div>
    <img onclick="cardAnimation(), updateSubtasksInFirebase()" src="assets/img/close.svg" alt="close" />
  `;
}

function renderCard(id, path) {
  document.getElementById(id).innerHTML = array[taskNum][path];
}

function setCardCategoryColor(id, path) {
  let category = array[taskNum][path];
  if (category == "Technical Task") {
    document.getElementById(id).style.backgroundColor = "rgb(32, 215, 194)";
  } else {
    document.getElementById(id).style.backgroundColor = "rgb(0, 56, 255, 1)";
  }
}

function renderCardPrio(id, path) {
  let prioImage = document.getElementById("card-detail-view-priority-urgency-img");
  document.getElementById(id).innerHTML = array[taskNum][path];
  if (array[taskNum][path] == "low") {
    prioImage.src = "assets/img/prio-low.svg";
  } else if (array[taskNum][path] == "medium") {
    prioImage.src = "assets/img/prio-medium.svg";
  } else if (array[taskNum][path] == "high") {
    prioImage.src = "assets/img/prio-high.svg";
  }
}

function checkAssignedPersons(id, path) {
  document.getElementById(id).innerHTML = "";
  let persons = array[taskNum][path];
  if (persons == undefined) {
  } else {
    renderCardAssignedPersons(id, persons);
  }
}

function renderCardAssignedPersons(id, persons) {
  for (let index = 0; index < persons.length; index++) {
    let initials = persons[index]
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
    let initialsColor = array[taskNum]["color"][index];

    document.getElementById(id).innerHTML += `
    <div class="card-detail-view-assigned-person">
      <span id="person(${index})" class="card-detail-view-assigned-to-person-logo" style="background-color: ${initialsColor}">${initials}</span>
      <span>${persons[index]}</span>
    </div>
  `;
  }
}

function renderCardSubtasks(id) {
  document.getElementById(id).innerHTML = "";
  checkedSubtasks = array[taskNum]["subtasksChecked"];
  unCheckedSubtasks = array[taskNum]["subtasksNotChecked"];

  if (checkedSubtasks == "" || checkedSubtasks == "placeholder") {
    checkedSubtasks = [];
  }

  if (unCheckedSubtasks == "" || unCheckedSubtasks == "placeholder") {
    unCheckedSubtasks = [];
  }

  if (checkedSubtasks == undefined || unCheckedSubtasks == undefined) {
    document.getElementById("card-detail-view-subtasks").style.display = "none";
  } else {
    document.getElementById("card-detail-view-subtasks").style.display = "block";
  }
  unCheckedSubtasksHtml(id);
  checkedSubtasksHtml(id);
}

function checkedSubtasksHtml(id) {
  for (let index = 0; index < checkedSubtasks.length; index++) {
    document.getElementById(id).innerHTML += `
      <div id="card-detail-view-checked-subtasks(${index})" class="card-detail-view-subtasks-enumeration">
        <img onclick="uncheckSubtask(${index}, '${id}')" id="checkedCheckbox(${index})" src="assets/img/check-button-checked.svg" />
        <span>${checkedSubtasks[index]}</span>
        <img onclick="deleteCheckedSubtask(${index})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
      </div>
    `;
  }
}

function unCheckedSubtasksHtml(id) {
  for (let index = 0; index < unCheckedSubtasks.length; index++) {
    document.getElementById(id).innerHTML += `
      <div id="card-detail-view-unchecked-subtasks(${index})" class="card-detail-view-subtasks-enumeration">
        <img onclick="checkSubtask(${index}, '${id}')" id="unCheckedCheckbox(${index})" src="assets/img/check-button.svg" />
        <span>${unCheckedSubtasks[index]}</span>
        <img onclick="deletunCheckedSubtask(${index})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
      </div>
    `;
  }
}
function checkSubtask(i, id) {
  checkedSubtasks.push(unCheckedSubtasks[i]);
  unCheckedSubtasks.splice(i, 1);
  document.getElementById(id).innerHTML = "";
  unCheckedSubtasksHtml(id);
  checkedSubtasksHtml(id);
}

function uncheckSubtask(i, id) {
  unCheckedSubtasks.push(checkedSubtasks[i]);
  checkedSubtasks.splice(i, 1);
  document.getElementById(id).innerHTML = "";
  unCheckedSubtasksHtml(id);
  checkedSubtasksHtml(id);
}

async function updateSubtasksInFirebase() {
  if (checkedSubtasks.length == 0) {
    array[taskNum]["subtasksChecked"] = ["placeholder"];
  } else {
    array[taskNum]["subtasksChecked"] = checkedSubtasks;
  }
  if (unCheckedSubtasks.length == 0) {
    array[taskNum]["subtasksNotChecked"] = ["placeholder"];
  } else {
    array[taskNum]["subtasksNotChecked"] = unCheckedSubtasks;
  }
  allTasks = [];
  pushTasksInArray();
  await updateTasksInFirebase();
  loadData();
}

function deletunCheckedSubtask(i) {
  unCheckedSubtasks.splice(i, 1);
  renderCardSubtasks("card-detail-view-subtasks-container");
}

function deleteCheckedSubtask(i) {
  checkedSubtasks.splice(i, 1);
  renderCardSubtasks("card-detail-view-subtasks-container");
}

async function deleteTask() {
  array.splice(taskNum, 1);
  allTasks = [];
  pushTasksInArray();
  await updateTasksInFirebase();
  loadData();
  cardAnimation();
}

// #### Edit Funktionen ####

function editTask() {
  hideCategory();
  editTitle();
  editDescription();
  editDate();
  editPrio();
  editAssignedPersons();
  editRenderPersonLogo();
  editSubtasks();
  hideOptions();
}

function hideCategory() {
  document.getElementById("card-detail-view-catagory").classList.toggle("d-none");
  document.getElementById("card-detail-view-headline").style.justifyContent = "flex-end";
}

function editTitle() {
  document.getElementById("card-detail-view-title-container").innerHTML = `
    <span class="edit-title">Title</span>
    <input type="text" id="edit-title-input" name="task-title" required placeholder="Enter a Title" />
  `;
  document.getElementById("edit-title-input").value = array[taskNum]["title"];
}

function editDescription() {
  document.getElementById("card-detail-view-description-container").innerHTML = `
    <label id="edit-description" for="description">Description</label>
    <textarea id="edit-description-textarea" name="task-description" rows="6" placeholder="Enter a Description"></textarea>
  `;
  document.getElementById("edit-description-textarea").value = array[taskNum]["description"];
}

function editDate() {
  document.getElementById("card-detail-view-date").innerHTML = `
    <span class="edit-date">Due Date:</span>
    <input type="date" id="edit-date-value" name="date" required="" style="border: 1px solid rgb(209, 209, 209);">  `;
  document.getElementById("edit-date-value").value = array[taskNum]["date"];
  document.getElementById("card-detail-view-date").style.display = "flex";
  document.getElementById("card-detail-view-date").style.flexDirection = "column";
}

function editPrio() {
  document.getElementById("card-detail-view-priority").innerHTML = `
    <span class="edit-prio">Priority:</span>
    <div class="edit-prio-btns">
      <button onclick="togglePrio('high')" class="high-btn" type="button" id="high-btn"> Urgent 
        <img id="high-btn-img" src="assets/img/prio-high.svg" alt="High">
      </button>
      <button onclick="togglePrio('medium')" class="medium-btn medium-btn-active" type="button" id="medium-btn"> Medium 
        <img id="medium-btn-img" src="assets/icon/prio_medium_selected.svg" alt="Medium">
      </button>
      <button onclick="togglePrio('low')" class="low-btn" type="button" id="low-btn"> Low 
        <img id="low-btn-img" src="assets/img/prio-low.svg" alt="Low">
      </button>
    </div>
  `;
  document.getElementById("card-detail-view-priority").style.display = "block";
}

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

function toggleDropdownEditAssignedPersons() {
  document.getElementById("edit-assigned-dropdown-container").classList.toggle("d-none");
  renderEditDropDown();
}

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

function editCheckAssigned(i) {
  let allContacts = contacts[i]["name"];
  return array[taskNum]["assigned persons"].some((person) => person === allContacts);
}

function editAddPerson(i) {
  document.getElementById(`edit-person${i}-checkbox`).src = "assets/img/check-button-checked-white.svg";
  document.getElementById(`edit-not-assigned-person${i}`).style.backgroundColor = "rgba(9, 25, 49, 1)";
  document.getElementById(`edit-person-to-assigned-name${i}`).style.color = "rgb(255, 255, 255)";
  contacts[i]["assignedToTask"] = true;
  editAddPersonsToTask()
  renderEditDropDown();
}

function editRemovePerson(i) {
  document.getElementById(`edit-person${i}-checkbox`).src = "assets/img/check-button.svg";
  document.getElementById(`edit-assigned-person${i}`).style.backgroundColor = "unset";
  document.getElementById(`edit-person-to-assigned-name${i}`).style.color = "rgba(0, 0, 0, 1)";
  contacts[i]["assignedToTask"] = false;
  editAddPersonsToTask();
  renderEditDropDown();
}

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

function editRenderPersonLogo() {
  document.getElementById("card-detail-view-assigned-persons-logo").innerHTML = "";
  let assignedPersonsArr = array[taskNum]["assigned persons"];
  let assignedPersonsColor = array[taskNum]["color"];

  for (let i = 0; i < assignedPersonsArr.length; i++) {
    let initials = editCreateInitials(i, assignedPersonsArr)
    document.getElementById("card-detail-view-assigned-persons-logo").innerHTML += `
      <div class="assigned-person-logo" style="background-color: ${assignedPersonsColor[i]}">${initials}</div>
    `;
  }
}

function editCreateInitials(i, array) {
  let name = array[i];
  let initials = name.split(" ").map((word) => word[0]);
  let initialsString = initials.join("");
  return initialsString.toUpperCase();
}

function editSubtasks() {
  document.getElementById("card-detail-view-subtasks").innerHTML = "";
  document.getElementById("card-detail-view-subtasks").style.display = "flex";
  document.getElementById("card-detail-view-subtasks").classList.add("edit-subtasks-input");

  document.getElementById("card-detail-view-subtasks").innerHTML = `
    <span>Subtasks</span>
    <input type="text" id="edit-add-subtask" name="subtask-input" required="" placeholder="Add new subtask">
    <img onclick="addSubtasks()" id="edit-subtasks-plus" src="assets/img/plus2.svg" alt="Plus">
  `;
  let subtasksChecked = array[taskNum]["subtasksChecked"]
  if (subtasksChecked.length !== 0 && subtasksChecked[0] !== "placeholder" && subtasksChecked !== undefined) {
    for (let i = 0; i < subtasksChecked.length; i++) {
      document.getElementById("card-detail-view-subtasks").innerHTML += `
        <div id="edit-checked-subtasks(${i})" class="card-detail-view-subtasks-enumeration">
          <img onclick="uncheckSubtask(${i})" id="checkedCheckbox(${i})" src="assets/img/check-button-checked.svg" />
          <span>${checkedSubtasks[i]}</span>
          <img onclick="deleteCheckedSubtask(${i})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
        </div>
      `;
    }  
  }

  let subtasksNotChecked = array[taskNum]["subtasksNotChecked"]
  if (subtasksNotChecked.length !== 0 && !subtasksNotChecked[0] !== "placeholder" && subtasksNotChecked !== undefined) {
    for (let i = 0; i < subtasksNotChecked.length; i++) {
      document.getElementById("card-detail-view-subtasks").innerHTML += `
      <div id="edit-unchecked-subtasks(${i})" class="card-detail-view-subtasks-enumeration">
        <img onclick="checkSubtask(${i})" id="unCheckedCheckbox(${i})" src="assets/img/check-button.svg" />
        <span>${unCheckedSubtasks[i]}</span>
        <img onclick="deletunCheckedSubtask(${i})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
      </div>
    `;
    }      
  }
}


function hideOptions() {
  document.getElementById("options").innerHTML = "";
}

