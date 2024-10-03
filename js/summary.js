/**
 * Changes the "To-Do" icon source when hovered.
 */
function changeToDoIconOnMouseEnter() {
  document.getElementById("summary-to-do-icon").src = "assets/img/summary-to-do-hover.svg";
}

/**
 * Reverts the "To-Do" icon source when not hovered.
 */
function changeToDoIconOnMouseLeave() {
  document.getElementById("summary-to-do-icon").src = "assets/img/summary-to-do.svg";
}

/**
 * Changes the "Done" icon source when hovered.
 */
function changeDoneIconOnMouseEnter() {
  document.getElementById("summary-done-icon").src = "assets/img/summary-done-hover.svg";
}

/**
 * Reverts the "Done" icon source when not hovered.
 */
function changeDoneIconOnMouseLeave() {
  document.getElementById("summary-done-icon").src = "assets/img/summary-done.svg";
}

/**
 * Calls functions to show numbers of tasks the page with task data.
 */
async function render() {
  await loadTasks();
  renderGreeting();
  renderTaskNum(toDoTasks, "to-do-number");
  renderTaskNum(doneTasks, "done-number");
  renderTaskNum(allTasks, "all-tasks-number");
  renderTaskNum(inProgressTasks, "in-progress-number");
  renderTaskNum(awaitFeedbackTasks, "await-feedback-number");
  renderUrgentNum();
  renderDeadline();
}

function renderGreeting() {
  let time = new Date();
  let hours = time.getHours();
  document.getElementById('greeting-message').innerHTML = timeOfDay(hours);
}

function timeOfDay(hours) {
  if (hours < 12) {
    return "Good morning"
  } else if (hours < 18) {
    return "Good afternoon"
  } else if (hours <= 21) {
    return "Good evening"
  } else {
    return "Good night"
  }
}

/**
 * Renders the number of tasks in the array and updates the HTML.
 * @param {Array} arr - The array of tasks.
 * @param {string} id - The ID of the HTML element to update.
 */
function renderTaskNum(arr, id) {
  let num = arr.length;
  document.getElementById(id).innerHTML = num;
}

/**
 * Filters all tasks for high priority and updates the urgent task count in the HTML.
 */
function renderUrgentNum() {
  urgentTasks = allTasks.filter((task) => task["prio"][0] === "high");
  document.getElementById("urgent-number").innerHTML = urgentTasks.length;
}

/**
 * Finds the earliest deadline from the task list and updates the HTML element.
 */
function renderDeadline() {
  const timestamps = allTasks.map((task) => {
    let timestampInNumber = new Date(task["date"]);
    return timestampInNumber.getTime();
  });

  let minTimestamp = Math.min(...timestamps);
  let minDate = new Date(minTimestamp);

  let formattedDate = minDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  document.getElementById('deadline-date').innerHTML = formattedDate;
}
