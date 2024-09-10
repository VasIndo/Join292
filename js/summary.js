function changeToDoIconOnMouseEnter() {
  document.getElementById("summary-to-do-icon").src = "assets/img/summary-to-do-hover.svg";
}

function changeToDoIconOnMouseLeave() {
  document.getElementById("summary-to-do-icon").src = "assets/img/summary-to-do.svg";
}

function changeDoneIconOnMouseEnter() {
  document.getElementById("summary-done-icon").src = "assets/img/summary-done-hover.svg";
}

function changeDoneIconOnMouseLeave() {
  document.getElementById("summary-done-icon").src = "assets/img/summary-done.svg";
}

async function render() {
  await loadTasks();
  renderTaskNum(toDoTasks, "to-do-number");
  renderTaskNum(doneTasks, "done-number");
  renderTaskNum(allTasks, "all-tasks-number");
  renderTaskNum(inProgressTasks, "in-progress-number");
  renderTaskNum(awaitFeedbackTasks, "await-feedback-number");
  renderUrgentNum();
  renderDeadline();
}

function renderTaskNum(arr, id) {
  let num = arr.length;
  document.getElementById(id).innerHTML = num;
}

function renderUrgentNum() {
  urgentTasks = allTasks.filter((task) => task["prio"][0] === "high");
  document.getElementById("urgent-number").innerHTML = urgentTasks.length;
  console.log(urgentTasks);
}

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
