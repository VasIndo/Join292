  /**
 * Adds an event listener to the input field that triggers a function when the Enter key is pressed.
 */
  document.getElementById("searchbar-field").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      filterTask();
    }
  });  

/**
 * Toggles the visibility of the detailed task card view and the main board container.
 */
function toggleDetailTaskCard() {
    document.getElementById("card-detail-view").classList.toggle("show-card");
    document.getElementById("board-container").classList.toggle("d-none");
  }
  
