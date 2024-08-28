const URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Loads contact data from the Firebase Realtime Database.
 * The data is assigned to the `contacts` variable.
 */
async function loadData() {
  let response = await fetch(URL + "contacts" + "/.json");
  let responseJSON = await response.json();
  contacts = Object.values(responseJSON);
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
