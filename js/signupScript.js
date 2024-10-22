const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Sends data to the specified URL and returns the server response.
 * @param {string} path - The path to the resource.
 * @param {Object} data - The data to be sent.
 * @returns {Promise<Object>} - The server response.
 */
async function postData(path = "", data = {}) {
    try {
        const fullUrl = `${BASE_URL}${path}.json`;
        let response = await sendPostRequest(fullUrl, data);
        let responseToJson = await response.json();
        console.log("Server response: ", responseToJson);
        return responseToJson;
    } catch (error) {
        handlePostError(error);
    }
}

async function sendPostRequest(url, data) {
    console.log(`Sending data to: ${url}`);
    let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    return response;
}

function handlePostError(error) {
    console.error("Error sending data:", error);
    throw error;
}

/**
 * Fetches data from the specified URL and returns it.
 * @param {string} path - The path to the resource.
 * @returns {Promise<Object>} - The fetched data.
 */
async function getData(path = "") {
    try {
        const fullUrl = `${BASE_URL}${path}.json`;
        let response = await fetch(fullUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        handleGetError(error);
    }
}

function handleGetError(error) {
    console.error("Error fetching data:", error);
    throw error;
}

/**
 * Adds a new user after validating the input.
 * @param {Event} event - The form submission event.
 */
async function addUser(event) {
    event.preventDefault();
    if (!isImageClicked) return showMessage("PrivacyPolicy");

    let name = document.getElementById('signup-name').value,
        email = document.getElementById('signup-email').value,
        password = document.getElementById('signup-password').value,
        confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) return showMessage("FailedtoSingUp");
    await processNewUser({ name, email, password });
}

async function processNewUser(userData) {
    console.log("Sending user data: ", userData);
    let users = await getData("users");

    for (let userId in users) {
        if (users[userId].email === userData.email) return showMessage("Emailexists");
        if (users[userId].name === userData.name) return showMessage("Nameexists");
    }
    let response = await postData("users", userData);
    handleUserResponse(response);
}

function handleUserResponse(response) {
    if (response) {
        console.log("Server response:", response);
        showMessage("AlertSignUp", true);
    } else {
        showMessage("FailedtoSingUp");
    }
}

/**
 * Displays a message and optionally redirects to the login page.
 * @param {string} className - The class of the notification element.
 * @param {boolean} [redirectToLogin=false] - Whether to redirect to the login page.
 */
function showMessage(className, redirectToLogin = false) {
    let alertContainer = document.querySelector('.singUp-Alert');
    alertContainer.style.display = 'flex';
    hideOtherMessages(alertContainer);
    document.querySelector(`.${className}`).style.display = 'flex';
    setTimeout(() => {
        alertContainer.style.display = 'none';
        if (redirectToLogin) window.location.href = 'login.html';
    }, 1000);
}

function hideOtherMessages(alertContainer) {
    let messages = alertContainer.children;
    for (let i = 0; i < messages.length; i++) {
        messages[i].style.display = 'none';
    }
}

const visibilityOffIcon = "./assets/icon/visibility_off.svg",
    visibilityIcon = "./assets/icon/visibility.svg",
    lockIcon = "./assets/icon/lock.webp";

/**
 * Updates the password toggle icon based on input length.
 * @param {string} inputId - The ID of the password field.
 * @param {string} toggleId - The ID of the toggle icon.
 */
function updateToggleIcon(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const passwordToggle = document.getElementById(toggleId);
    passwordToggle.src = passwordInput.value.length > 0 ? visibilityOffIcon : lockIcon;
}

/**
 * Toggles the password visibility and updates the icon accordingly.
 * @param {string} inputId - The ID of the password field.
 * @param {string} toggleId - The ID of the toggle icon.
 */
function togglePasswordVisibility(inputId, toggleId) {
    const passwordField = document.getElementById(inputId);
    const passwordToggle = document.getElementById(toggleId);
    if (passwordField.value.length === 0) return;
    if (passwordToggle.src.includes('visibility_off.svg')) {
        passwordField.type = "text";
        passwordToggle.src = visibilityIcon;
    } else {
        passwordField.type = "password";
        passwordToggle.src = visibilityOffIcon;
    }
}

let isImageClicked = false;

/**
 * Adds event listeners to the image container for hover and click behavior.
 */
function addEventListeners() {
    const imageContainer = document.getElementById("image-container");
    const mainImage = document.getElementById("main-image");

    if (imageContainer && mainImage) {
        setupImageBehavior(imageContainer, mainImage);
    } else {
        console.error("Elements not found. Check the IDs.");
    }
}

function setupImageBehavior(container, image) {
    let isDefault = true;
    const defaultSrc = "./assets/icon/Property 1=Default.svg";
    const hoverSrc = "./assets/icon/Property 1=checked.svg";
    image.src = defaultSrc;
    isImageClicked = false;

    container.addEventListener("mouseover", () => { if (isDefault) image.src = hoverSrc; });
    container.addEventListener("mouseout", () => { if (isDefault) image.src = defaultSrc; });
    container.addEventListener("click", () => {
        isDefault = !isDefault;
        image.src = isDefault ? defaultSrc : hoverSrc;
        isImageClicked = !isDefault;
    });
}

/**
 * Ensures that the DOM is loaded before adding event listeners.
 */
document.addEventListener("DOMContentLoaded", function() {
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && document.getElementById("image-container") && document.getElementById("main-image")) {
                addEventListeners();
                observer.disconnect();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (document.getElementById("image-container") && document.getElementById("main-image")) addEventListeners();
});
