let assignedDropdownOpen = false;
let categoryDropdownOpen = false;


/**
 * Toggles the visibility of the category dropdown menu.
 */
function toggleCategoryDropDown() {
  const dropdown = document.getElementById("categories");
  dropdown.classList.toggle("d-none");
  categoryDropdownOpen = !dropdown.classList.contains("d-none");
}

/**
 * Closes dropdowns when clicking outside of them.
 * This is added as a global event listener on the document.
 */
document.addEventListener("click", function (event) {
  // Check for Assigned Dropdown
  const assignedDropdown = document.getElementById("person-to-assigned");
  const assignedTrigger = document.getElementById("assigned-dropdown");
  if (assignedDropdownOpen && !assignedDropdown.contains(event.target) && !assignedTrigger.contains(event.target)) {
    assignedDropdown.classList.add("d-none");
    assignedDropdownOpen = false;
  }

  // Check for Category Dropdown
  const categoryDropdown = document.getElementById("categories");
  const categoryTrigger = document.getElementById("category-dropdown");
  if (categoryDropdownOpen && !categoryDropdown.contains(event.target) && !categoryTrigger.contains(event.target)) {
    categoryDropdown.classList.add("d-none");
    categoryDropdownOpen = false;
  }
});