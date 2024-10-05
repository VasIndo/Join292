let checkedSubtasks;
let unCheckedSubtasks;
let task;
let taskNum;
let array;
let binNum;
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
  document.getElementById(path).innerHTML = "";
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
  if (persons[0] == "placeholder" || persons == undefined || persons == "") {
    
  } else {
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
        <div class="card-detail-view-checked-subtasks-left">
          <img onclick="uncheckSubtask(${index}, '${id}')" id="checkedCheckbox(${index})" src="assets/img/check-button-checked.svg" />
          <span>${checkedSubtasks[index]}</span>
        </div>
      </div>
    `;
  }
}

function unCheckedSubtasksHtml(id) {
  for (let index = 0; index < unCheckedSubtasks.length; index++) {
    binNum = index;
    document.getElementById(id).innerHTML += `
      <div id="card-detail-view-unchecked-subtasks(${index})" class="card-detail-view-subtasks-enumeration">
        <div class="card-detail-view-unchecked-subtasks-left">
          <img onclick="checkSubtask(${index}, '${id}')" id="unCheckedCheckbox(${index})" src="assets/img/check-button.svg" />
          <span>${unCheckedSubtasks[index]}</span>
        </div>
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
  editHeadline();
  editTitle();
  editDescription();
  editDate();
  editPrio();
  let path = array[taskNum]["prio"][0]
  editTogglePrio(path);
  editAssignedPersons();
  editRenderPersonLogo();
  editSubtasks();
  changeOptions();
}

function editHeadline() {
  document.getElementById("card-detail-view-headline").innerHTML = "";
  document.getElementById("card-detail-view-headline").style.justifyContent = "flex-end";

  document.getElementById("card-detail-view-headline").innerHTML = `
    <img onclick="resetCard(), renderCardInfo()" src="assets/img/close.svg" alt="close">
  `;
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

function editTogglePrio(path) {
  array[taskNum]["prio"] = []
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
  if (assignedPersons == undefined || assignedPersons == "placeholder" || assignedPersons =="") {
  } else {
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
    <div id="edit-subtask-input-container">
      <input type="text" id="edit-add-subtask" name="subtask-input" required="" placeholder="Add new subtask">
      <img onclick="editAddSubtask()" id="add-subtasks-plus" src="assets/img/plus2.svg" alt="Plus">
    </div>
    <div id="card-detail-view-subtasks-container">
    </div>
  `;
  checkedSubtasks = array[taskNum]["subtasksChecked"];
  if (checkedSubtasks.length !== 0 && checkedSubtasks[0] !== "placeholder" && checkedSubtasks !== undefined) {
    for (let i = 0; i < checkedSubtasks.length; i++) {
      document.getElementById("card-detail-view-subtasks-container").innerHTML += `
        <div id="edit-checked-subtasks(${i})" class="card-detail-view-subtasks-enumeration">
          <img onclick="uncheckSubtask(${i}, 'card-detail-view-subtasks-container')" id="checkedCheckbox(${i})" src="assets/img/check-button-checked.svg" />
          <span>${checkedSubtasks[i]}</span>
          <img onclick="editDeleteCheckedSubtask(${i})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
        </div>
      `;
    }  
  }

  unCheckedSubtasks = array[taskNum]["subtasksNotChecked"];
  if (unCheckedSubtasks.length !== 0 && !unCheckedSubtasks[0] !== "placeholder" && unCheckedSubtasks !== undefined) {
    for (let i = 0; i < unCheckedSubtasks.length; i++) {
      document.getElementById("card-detail-view-subtasks-container").innerHTML += `
      <div id="edit-unchecked-subtasks(${i})" class="card-detail-view-subtasks-enumeration">
        <img onclick="checkSubtask(${i}, 'card-detail-view-subtasks-container')" id="unCheckedCheckbox(${i})" src="assets/img/check-button.svg" />
        <span>${unCheckedSubtasks[i]}</span>
        <img onclick="editDeletunCheckedSubtask(${i})" class="subtask-bin" src="assets/img/bin.svg" alt="Delete">
      </div>
    `;
    }      
  }
}

function editAddSubtask() {
  let editInputValue = document.getElementById("edit-add-subtask").value;

  if (editInputValue == "") {
    
  } else {
    array[taskNum]["subtasksNotChecked"].push(editInputValue);
    editSubtasks();  
  }
}

function editDeleteCheckedSubtask(i) {
  checkedSubtasks.splice(i, 1);
  editSubtasks();
}

function editDeletunCheckedSubtask(i) {
  unCheckedSubtasks.splice(i, 1);
  editSubtasks();
}


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


function changeOptions() {
  document.getElementById("options-container").innerHTML = "";
  document.getElementById("options-container").innerHTML = `
    <div class="edit-options">
      <a onclick="updateArray()" class="edit-save-btn" href="#">Save</a>
    </div>
  `;
}

function resetCard() {
  document.getElementById("card-detail-view-headline").style.justifyContent = "space-between";
  document.getElementById("card-detail-view-headline").innerHTML = `
  
  `;

  document.getElementById("card-detail-view-title-container").innerHTML = `
    <h1 id="card-detail-view-title" class="card-detail-view-title"></h1>
  `;

  document.getElementById("card-detail-view-description-container").innerHTML = `
    <span id="card-detail-view-description" class="card-detail-view-description"></span>
  `;


  document.getElementById("card-detail-view-date").style.display = "block";
  document.getElementById("card-detail-view-date").innerHTML = `
    <span class="card-detail-view-date-text">Due Date:</span>
    <span id="card-detail-view-date-due-date" class="card-detail-view-date-due-date"></span>
  `;

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