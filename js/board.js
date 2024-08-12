let addTaskPersonAssigned;

document.addEventListener("DOMContentLoaded", () => {
    const taskSections = [
      { id: 'to-do-plus', hoverSrc: 'assets/img/plus-button-blue.svg', defaultSrc: 'assets/img/plus-button.svg' },
      { id: 'in-progress-plus', hoverSrc: 'assets/img/plus-button-blue.svg', defaultSrc: 'assets/img/plus-button.svg' },
      { id: 'await-feedback-plus', hoverSrc: 'assets/img/plus-button-blue.svg', defaultSrc: 'assets/img/plus-button.svg' },
    ];
  
    taskSections.forEach(section => {
      const element = document.getElementById(section.id);
  
      if (element) {
        element.addEventListener('mouseenter', () => {
          element.src = section.hoverSrc;
        });
  
        element.addEventListener('mouseleave', () => {
          element.src = section.defaultSrc;
        });
      }
    });
  });

  function toggleDetailTaskCard() {
    document.getElementById('card-detail-view').classList.toggle("show-card");
    document.getElementById('board-container').classList.toggle("d-none");
  }

  function toggleAddTaskPopUp() {
    document.getElementById('add-task').classList.toggle("show-add-task")
    document.getElementById('board-container').classList.toggle("d-none");
  }

  function toggleAssignedDropDown() {
    document.getElementById('person-to-assigned').classList.toggle("d-none")
  }

  function toggleCategoryDropDown() {
    document.getElementById('categories').classList.toggle("d-none")
  }

  function mouseEnterChangeX() {
    document.getElementById('cancel-btn-img').src = "assets/img/cancel-x-hover.svg";
  }

  function mouseLeaveChangeX() {
    document.getElementById('cancel-btn-img').src = "assets/img/cancel-x.svg";
  }

  function togglePersonToAssigned(i) {
    if (!addTaskPersonAssigned) {
      document.getElementById(`person${i}-checkbox`).src = "assets/img/check-button-checked-white.svg";
      document.getElementById(`person${i}`).style.backgroundColor = "rgba(9, 25, 49, 1)";
      document.getElementById(`person-to-assigned-name${i}`).style.color = "rgb(255, 255, 255)";
      addTaskPersonAssigned = true;
    } else {
      document.getElementById(`person${i}-checkbox`).src = "assets/img/check-button.svg";
      document.getElementById(`person${i}`).style.backgroundColor = "unset";
      document.getElementById(`person-to-assigned-name${i}`).style.color = "rgba(0, 0, 0, 1)";
      addTaskPersonAssigned = false;
    }
  }