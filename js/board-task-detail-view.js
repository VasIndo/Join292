let checkedSubtasks;
let unCheckedSubtasks;
/**
 * Toggles the visibility of the detailed task card view and the main board container.
 */
function cardAnimation() {
  document.getElementById("card-detail-view").classList.toggle("show-card");
  document.getElementById("board-container").classList.toggle("d-none");
}

function renderCardInfo(taskColumn, i, arr) {
  renderClose(taskColumn, i);
  renderCard(arr, i, "card-detail-view-catagory", "category");
  setCardCategoryColor(arr, i, "card-detail-view-catagory", "category");
  renderCard(arr, i, "card-detail-view-title", "title");
  renderCard(arr, i, "card-detail-view-description", "description");
  renderCard(arr, i, "card-detail-view-date-due-date", "date");
  renderCardPrio(arr, i, "card-detail-view-priority-urgency-span", "prio");
  checkAssignedPersons(arr, i, "card-detail-view-assigned-persons", "assigned persons");
  renderCardSubtasks(taskColumn, i, "card-detail-view-subtasks-container", arr);
}

function renderCard(taskColumn, i, id, path) {
  document.getElementById(id).innerHTML = taskColumn[i][path];
}

function setCardCategoryColor(taskColumn, i, id, path) {
  let category = taskColumn[i][path];
  if (category == "Technical Task") {
    document.getElementById(id).style.backgroundColor = "rgb(32, 215, 194)";
  } else {
    document.getElementById(id).style.backgroundColor = "rgb(0, 56, 255, 1)";
  }
}

function renderCardPrio(taskColumn, i, id, path) {
  let prioImage = document.getElementById("card-detail-view-priority-urgency-img");
  document.getElementById(id).innerHTML = taskColumn[i][path];
  if (taskColumn[i][path] == "low") {
    prioImage.src = "assets/img/prio-low.svg";
  } else if (taskColumn[i][path] == "medium") {
    prioImage.src = "assets/img/prio-medium.svg";
  } else if (taskColumn[i][path] == "high") {
    prioImage.src = "assets/img/prio-high.svg";
  }
}

function checkAssignedPersons(taskColumn, i, id, path) {
  document.getElementById(id).innerHTML = "";
  let persons = taskColumn[i][path];
  if (persons == undefined) {
  } else {
    renderCardAssignedPersons(taskColumn, i, id, persons);
  }
}

function renderCardAssignedPersons(taskColumn, i, id, persons) {
  for (let index = 0; index < persons.length; index++) {
    let initials = persons[index]
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
    let initialsColor = taskColumn[i]["color"][index];

    document.getElementById(id).innerHTML += `
    <div class="card-detail-view-assigned-person">
      <span id="person(${index})" class="card-detail-view-assigned-to-person-logo" style="background-color: ${initialsColor}">${initials}</span>
      <span>${persons[index]}</span>
    </div>
  `;
  }
}

function renderCardSubtasks(taskColumn, i, id, arr) {
  document.getElementById(id).innerHTML = "";
  checkedSubtasks = arr[i]["subtasksChecked"];
  unCheckedSubtasks = arr[i]["subtasksNotChecked"];

  if (checkedSubtasks == "" || checkedSubtasks == "placeholder") {
    checkedSubtasks = [];
  }

  if (unCheckedSubtasks == "" || unCheckedSubtasks == "placeholder") {
    unCheckedSubtasks = [];
  }

  if (checkedSubtasks == undefined && unCheckedSubtasks == undefined) {
    document.getElementById("card-detail-view-subtasks").style.display = "none";
  } else {
    document.getElementById("card-detail-view-subtasks").style.display = "block";
  }
  // i = nummer der aufgabe im array erste aufgabe array[0] zweite array[1] ...
  unCheckedSubtasksHtml(taskColumn, i, id);
  checkedSubtasksHtml(taskColumn, i, id);
}

function checkedSubtasksHtml(taskColumn, i, id) {
  for (let index = 0; index < checkedSubtasks.length; index++) {
    document.getElementById(id).innerHTML += `
      <div onclick="uncheckSubtask('${taskColumn}', ${index}, '${id}')" id="card-detail-view-checked-subtasks(${index})" class="card-detail-view-subtasks-enumeration">
        <img id="checkedCheckbox(${index})" src="assets/img/check-button-checked.svg" />
        <span>${checkedSubtasks[index]}</span>
      </div>
    `;
  }
}

function unCheckedSubtasksHtml(taskColumn, i, id) {
  for (let index = 0; index < unCheckedSubtasks.length; index++) {
    document.getElementById(id).innerHTML += `
      <div onclick="checkSubtask('${taskColumn}', ${index}, '${id}')" id="card-detail-view-unchecked-subtasks(${index})" class="card-detail-view-subtasks-enumeration">
        <img id="unCheckedCheckbox(${index})" src="assets/img/check-button.svg" />
        <span>${unCheckedSubtasks[index]}</span>
      </div>
    `;
  }
}
function checkSubtask(taskColumn, i, id) {
  checkedSubtasks.push(unCheckedSubtasks[i]);
  unCheckedSubtasks.splice(i, 1);
  document.getElementById(id).innerHTML = "";
  unCheckedSubtasksHtml(taskColumn, i, id);
  checkedSubtasksHtml(taskColumn, i, id);
}

function uncheckSubtask(taskColumn, i, id) {
  unCheckedSubtasks.push(checkedSubtasks[i]);
  checkedSubtasks.splice(i, 1);
  document.getElementById(id).innerHTML = "";
  unCheckedSubtasksHtml(taskColumn, i, id);
  checkedSubtasksHtml(taskColumn, i, id);
}

function convertStringToArray(taskColumn) {
  if (taskColumn == "to-do-tasks") {
    return toDoTasks;
  } else if (taskColumn == "in-progress-tasks") {
    return inProgressTasks;
  } else if (taskColumn == "await-feedback-tasks") {
    return awaitFeedbackTasks;
  } else if (taskColumn == "done-tasks") {
    return doneTasks;
  }
}
function renderClose(taskColumn, i) {
  document.getElementById("card-detail-view-headline").innerHTML = "";
  document.getElementById("card-detail-view-headline").innerHTML += `
    <div id="card-detail-view-catagory" class="card-detail-view-catagory">User Story</div>
    <img onclick="cardAnimation(), updateSubtasksInFirebase('${taskColumn}', ${i})" src="assets/img/close.svg" alt="close" />
  `;
}

async function updateSubtasksInFirebase(taskColumn, i) {
  let arr = convertStringToArray(taskColumn);
  if (checkedSubtasks.length == 0) {
    arr[i]["subtasksChecked"] = ["placeholder"];
  } else {
    arr[i]["subtasksChecked"] = checkedSubtasks;
  }
  if (unCheckedSubtasks.length == 0) {
    arr[i]["subtasksNotChecked"] = ["placeholder"];
  } else {
    arr[i]["subtasksNotChecked"] = unCheckedSubtasks;
  }
  allTasks = [];
  pushTasksInArray();
  await updateTasksInFirebase();
  // loadData();
}
