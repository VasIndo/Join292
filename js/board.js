let contacts;
let ToDo;
const URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads contact data from the Firebase Realtime Database.
 * The data is assigned to the `contacts` variable.
 */
async function loadData() {
  loadContacts();
  await loadTasksToDo();
  renderToDoTasks();
}

async function loadContacts() {
  let response = await fetch(URL + "contacts" + "/.json");
  let responseJSON = await response.json();
  contacts = Object.values(responseJSON);
}

async function loadTasksToDo() {
  let response = await fetch(URL + "tasks/toDo" + "/.json");
  let responseJSON = await response.json();
  ToDo = Object.values(responseJSON);
}

function renderToDoTasks() {
  for (let i = 0; i < ToDo.length; i++) {
    document.getElementById("to-do-tasks").innerHTML += `
            <div onclick="toggleDetailTaskCard()" class="to-do-tasks-card" id="to-do-tasks-card${i}">
              <div class="catagory">${ToDo[i]["category"]}</div>
              <h1 class="title">${ToDo[i]["title"]}</h1>
              <p class="description">${ToDo[i]["description"]}</p>
              <div class="subtasks">
                <div class="subtasks-diagram">
                  <div class="subtasks-diagram-filled"></div>
                </div>
                <span class="subtasks-number">1/2</span>
              </div>
              <div class="bottom-card">
                <div id="assigned-to(${i})" class="assigned-to">

                </div>                
                <img class="prio" src="assets/img/prio-medium.svg" alt="medium" />
              </div>
            </div>
        `;
    renderAssignedPersons(i);
  }
}

function renderAssignedPersons(i) {
  let person = ToDo[i]["assigned persons"];
  for (let j = 0; j < person.length; j++) {
    let initials = person[j].split(" ").map((word) => word[0].toUpperCase()).join("");
    let color = ToDo[i]["color"][j];
    document.getElementById(`assigned-to(${i})`).innerHTML += `
      <span style="background-color: ${color}; right:calc(5px * ${j})"  class="card-person-initials position">${initials}</span>
    `;
    // margin-left: 6px;
    console.log(initials);
  }
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
 * Toggles the visibility of the add task pop-up and the main board container.
 */
function toggleAddTaskPopUp() {
  document.getElementById("add-task").classList.toggle("show-add-task");
  document.getElementById("board-container").classList.toggle("d-none");
  document.getElementById("title").style.border = "1px solid rgba(209, 209, 209, 1)";
  document.getElementById("date").style.border = "1px solid rgba(209, 209, 209, 1)";
  document.getElementById("category-dropdown").style.border = "1px solid rgba(209, 209, 209, 1)";
  document.getElementById("point-out").classList.add("d-none");
  deleteAllFields();
}
