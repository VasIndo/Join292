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

/**
 * Initializes the detailed task view with task data.
 * @param {Object} taskColumn - The task column object.
 * @param {number} i - The index of the current task.
 * @param {Array<Object>} arr - The array containing all tasks.
 */
function init(taskColumn, i, arr) {
  task = taskColumn;
  taskNum = i;
  array = arr;
  renderCardInfo();
}

/**
 * Renders the detailed information of the current task in the card view.
 */
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

/**
 * Renders the close button and the task category in the detailed card view.
 */
function renderClose() {
  document.getElementById("card-detail-view-headline").innerHTML = "";
  document.getElementById("card-detail-view-headline").innerHTML += `
    <div id="card-detail-view-catagory" class="card-detail-view-catagory">User Story</div>
    <img onclick="cardAnimation(), updateSubtasksInFirebase()" src="assets/img/close.svg" alt="close" />
  `;
}

/**
 * Renders a specific task field (category, title, etc.) in the card view.
 * @param {string} id - The ID of the element where the field will be rendered.
 * @param {string} path - The property name of the task to be rendered.
 */
function renderCard(id, path) {
  document.getElementById(id).innerHTML = array[taskNum][path];
}

/**
 * Sets the background color of the task category based on its type.
 * @param {string} id - The ID of the element to set the background color.
 * @param {string} path - The property name of the task category.
 */
function setCardCategoryColor(id, path) {
  let category = array[taskNum][path];
  if (category == "Technical Task") {
    document.getElementById(id).style.backgroundColor = "rgb(32, 215, 194)";
  } else {
    document.getElementById(id).style.backgroundColor = "rgb(0, 56, 255, 1)";
  }
}

/**
 * Renders the priority of the task and updates the icon.
 * @param {string} id - The ID of the element to display the priority.
 * @param {string} path - The property name of the task priority.
 */
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

/**
 * Checks if persons are assigned to the task and renders them.
 * @param {string} id - The ID of the element where the assigned persons will be rendered.
 * @param {string} path - The property name of the assigned persons in the task object.
 */
function checkAssignedPersons(id, path) {
  document.getElementById(id).innerHTML = "";
  let persons = array[taskNum][path];
  if (persons !== undefined) {
    renderCardAssignedPersons(id, persons);
  }
}

/**
 * Renders the assigned persons' initials and names in the task card view.
 * @param {string} id - The ID of the element where the assigned persons will be rendered.
 * @param {Array<string>} persons - The array of assigned persons.
 */
function renderCardAssignedPersons(id, persons) {
  if (persons[0] !== "placeholder" || persons !== undefined || persons !== "") {
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

/**
 * Renders the subtasks (checked and unchecked) for the task in the card view.
 * @param {string} id - The ID of the element where the subtasks will be rendered.
 */
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

/**
 * Renders the checked subtasks in the card view.
 * @param {string} id - The ID of the element where the checked subtasks will be rendered.
 */
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
/**
 * Renders the unchecked subtasks in the card view.
 * @param {string} id - The ID of the element where the unchecked subtasks will be rendered.
 */
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
/**
 * Moves an unchecked subtask to the checked subtasks list.
 * @param {number} i - The index of the subtask to check.
 * @param {string} id - The ID of the subtasks container element.
 */
function checkSubtask(i, id) {
  checkedSubtasks.push(unCheckedSubtasks[i]);
  unCheckedSubtasks.splice(i, 1);
  document.getElementById(id).innerHTML = "";
  unCheckedSubtasksHtml(id);
  checkedSubtasksHtml(id);
}
/**
 * Moves a checked subtask to the unchecked subtasks list.
 * @param {number} i - The index of the subtask to uncheck.
 * @param {string} id - The ID of the subtasks container element.
 */
function uncheckSubtask(i, id) {
  unCheckedSubtasks.push(checkedSubtasks[i]);
  checkedSubtasks.splice(i, 1);
  document.getElementById(id).innerHTML = "";
  unCheckedSubtasksHtml(id);
  checkedSubtasksHtml(id);
}

/**
 * Updates the subtasks in Firebase.
 * Converts empty lists to placeholders before saving.
 */
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

/**
 * Deletes an unchecked subtask.
 * @param {number} i - The index of the subtask to delete.
 */
function deletunCheckedSubtask(i) {
  unCheckedSubtasks.splice(i, 1);
  renderCardSubtasks("card-detail-view-subtasks-container");
}

/**
 * Deletes a checked subtask.
 * @param {number} i - The index of the subtask to delete.
 */
function deleteCheckedSubtask(i) {
  checkedSubtasks.splice(i, 1);
  renderCardSubtasks("card-detail-view-subtasks-container");
}

/**
 * Deletes the current task from the task array and updates Firebase.
 */
async function deleteTask() {
  array.splice(taskNum, 1);
  allTasks = [];
  pushTasksInArray();
  await updateTasksInFirebase();
  loadData();
  cardAnimation();
}
