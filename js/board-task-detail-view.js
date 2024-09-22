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
  task = taskColumn
  taskNum = i;
  array = arr;
  renderCardInfo()
  console.log(taskNum);
  console.log(array);
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
  let persons = task[taskNum][path];
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
    let initialsColor = task[taskNum]["color"][index];

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