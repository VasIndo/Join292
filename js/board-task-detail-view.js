/**
 * Toggles the visibility of the detailed task card view and the main board container.
 */
function cardAnimation() {
  document.getElementById("card-detail-view").classList.toggle("show-card");
  document.getElementById("board-container").classList.toggle("d-none");
}

function renderCardInfo(arr, i) {
  renderCard(arr, i, "card-detail-view-catagory", "category");
  setCardCategoryColor(arr, i, "card-detail-view-catagory", "category");
  renderCard(arr, i, "card-detail-view-title", "title");
  renderCard(arr, i, "card-detail-view-description", "description");
  renderCard(arr, i, "card-detail-view-date-due-date", "date");
  renderCardPrio(arr, i, "card-detail-view-priority-urgency-span", "prio");
  checkAssignedPersons(arr, i, "card-detail-view-assigned-persons", "assigned persons");
  renderCardSubtasks(arr, i, "card-detail-view-subtasks-container", "subtasks");
}

function renderCard(arr, i, id, path) {
  document.getElementById(id).innerHTML = arr[i][path];
}

function setCardCategoryColor(arr, i, id, path) {
  let category = arr[i][path];
  if (category == "Technical Task") {
    document.getElementById(id).style.backgroundColor = "rgb(32, 215, 194)";
  } else {
    document.getElementById(id).style.backgroundColor = "rgb(0, 56, 255, 1)";
  }
}

function renderCardPrio(arr, i, id, path) {
  let prioImage = document.getElementById("card-detail-view-priority-urgency-img");
  document.getElementById(id).innerHTML = arr[i][path];
  if (arr[i][path] == "low") {
    prioImage.src = "assets/img/prio-low.svg";
  } else if (arr[i][path] == "medium") {
    prioImage.src = "assets/img/prio-medium.svg";
  } else if (arr[i][path] == "high") {
    prioImage.src = "assets/img/prio-high.svg";
  }
}

function checkAssignedPersons(arr, i, id, path) {
  document.getElementById(id).innerHTML = "";
  let persons = arr[i][path];
  if (persons == undefined) {
  } else {
    renderCardAssignedPersons(arr, i, id, persons);
  }
}

function renderCardAssignedPersons(arr, i, id, persons) {
  for (let index = 0; index < persons.length; index++) {
    let initials = persons[index]
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
    let initialsColor = arr[i]["color"][index];

    document.getElementById(id).innerHTML += `
    <div class="card-detail-view-assigned-person">
      <span id="person(${index})" class="card-detail-view-assigned-to-person-logo" style="background-color: ${initialsColor}">${initials}</span>
      <span>${persons[index]}</span>
    </div>
  `;
  }
}

function renderCardSubtasks(arr, i, id) {
  document.getElementById(id).innerHTML = "";
  let checkedSubtasks = arr[i]["subtaskschecked"];
  let noCheckedSubtasks = arr[i]["subtasksnotChecked"];

  if (checkedSubtasks[0] == "") {
    checkedSubtasks = [];
  }

  let subtasksLenght = checkedSubtasks.length + noCheckedSubtasks.length;
  for (let index = 0; index < subtasksLenght; index++) {
    document.getElementById(id).innerHTML += `
      <div onclick="toggleSubtask(${index}, ${checkedSubtasks})" id="card-detail-view-subtasks(${index})" class="card-detail-view-subtasks-enumeration">
        <img id="checkbox(${index})" src="assets/img/check-button.svg" />
        <span>${noCheckedSubtasks[index]}</span>
      </div>
    `;
  }
}

function toggleSubtask(i) {
  let imgSoure = document.getElementById(`checkbox(${i})`).src;
  let checkedCheckboxSource = "http://127.0.0.1:5500/assets/img/check-button-checked.svg";
  if (imgSoure == checkedCheckboxSource) {
    document.getElementById(`checkbox(${i})`).src = "assets/img/check-button.svg";
  } else {
    document.getElementById(`checkbox(${i})`).src = "assets/img/check-button-checked.svg";
  }
  setSubtask();
}

function setSubtask() {
  // nach ändereung auf firebase url / tasks [i] subtasksChecked oder eben subtasksNotChecked
}