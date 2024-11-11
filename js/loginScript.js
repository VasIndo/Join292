/**
 * Event listener for the DOMContentLoaded event to ensure the DOM is fully loaded before executing scripts.
 */
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL2 = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
    
    /**
     * Icons paths used for toggling password visibility and remembering user preferences.
     * @constant
     * @type {Object}
     */
    const icons = {
        visibilityOff: "./assets/icon/visibility_off.svg",
        visibility: "./assets/icon/visibility.svg",
        lock: "./assets/icon/lock.webp",
        rememberDefault: "./assets/icon/Property 1=Default.svg",
        rememberChecked: "./assets/icon/Property 1=checked.svg"
    };

    // Sets the "Remember Default" state to true initially
    localStorage.setItem("isRememberDefault", "true");

    /**
     * Updates the password toggle icon based on the input field value.
     * @param {string} inputId - ID of the password input field.
     * @param {string} toggleId - ID of the toggle icon element.
     */
    function updatePasswordToggleIcon(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggleIcon = document.getElementById(toggleId);
        setToggleIcon(input, toggleIcon);
    }

    /**
     * Sets the correct icon for password visibility based on input value length.
     * @param {HTMLElement} input - The password input element.
     * @param {HTMLElement} toggleIcon - The icon element for the toggle.
     */
    function setToggleIcon(input, toggleIcon) {
        toggleIcon.src = input.value.length > 0 ? icons.visibilityOff : icons.lock;
    }

    /**
     * Toggles password visibility and updates the icon.
     * @param {string} inputId - ID of the password input field.
     * @param {string} toggleId - ID of the toggle icon element.
     */
    function togglePasswordVisibilityIcon(inputId, toggleId) {
        const field = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        if (field.value.length === 0) return;
        toggleVisibility(field, toggle);
    }

    /**
     * Switches the input type between password and text and changes the icon.
     * @param {HTMLElement} field - The password input field.
     * @param {HTMLElement} toggle - The toggle icon element.
     */
    function toggleVisibility(field, toggle) {
        if (toggle.src.includes('visibility_off.svg')) {
            field.type = "text";
            toggle.src = icons.visibility;
        } else {
            field.type = "password";
            toggle.src = icons.visibilityOff;
        }
    }

    /**
     * Adds event listeners for the "Remember Me" feature.
     */
    function addRememberEventListeners() {
        const container = document.getElementById("remember-image-container");
        const image = document.getElementById("remember-main-image");
        if (container && image) {
            handleRememberToggle(container, image);
        }
    }

    /**
     * Handles "Remember Me" toggle logic, including icon changes and remembering credentials.
     * @param {HTMLElement} container - The container for the "Remember Me" option.
     * @param {HTMLElement} image - The image element for the "Remember Me" icon.
     */
    function handleRememberToggle(container, image) {
        let isDefault = localStorage.getItem("isRememberDefault") === "true";
        image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;
        container.addEventListener("mouseover", () => setHoverIcon(isDefault, image));
        container.addEventListener("mouseout", () => setDefaultIcon(isDefault, image));
        container.addEventListener("click", () => toggleRememberState(image));
    }

    /**
     * Sets the "hover" icon for the "Remember Me" state.
     * @param {boolean} isDefault - Indicates if "Remember Me" is in default state.
     * @param {HTMLElement} image - The image element for the icon.
     */
    function setHoverIcon(isDefault, image) {
        if (isDefault) image.src = icons.rememberChecked;
    }

    /**
     * Sets the default icon for the "Remember Me" state.
     * @param {boolean} isDefault - Indicates if "Remember Me" is in default state.
     * @param {HTMLElement} image - The image element for the icon.
     */
    function setDefaultIcon(isDefault, image) {
        if (isDefault) image.src = icons.rememberDefault;
    }

    /**
     * Toggles the "Remember Me" state and updates local storage and the UI accordingly.
     * @param {HTMLElement} image - The image element for the icon.
     */
    function toggleRememberState(image) {
        let isDefault = localStorage.getItem("isRememberDefault") === "true";
        isDefault = !isDefault;
        image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;
        localStorage.setItem("isRememberDefault", isDefault);
        manageRememberFields(isDefault);
    }

    /**
     * Manages the state of the remembered fields (email and password) based on the "Remember Me" setting.
     * @param {boolean} isDefault - Indicates if "Remember Me" is in default state.
     */
    function manageRememberFields(isDefault) {
        if (!isDefault) {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberedPassword", password);
        } else {
            clearRememberedFields();
        }
    }

    /**
     * Clears the remembered fields (email and password) from local storage and resets the input fields.
     */
    function clearRememberedFields() {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    }

    /**
     * Observes the DOM for changes and adds event listeners when elements for "Remember Me" are present.
     */
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && document.getElementById("remember-image-container") && document.getElementById("remember-main-image")) {
                addRememberEventListeners();
                observer.disconnect();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Clears email and password fields on page load
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';

    /**
     * Fetches user data from the Firebase database.
     * @returns {Promise<Object>} - A promise that resolves with the user data.
     */
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL2}/users.json`);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error.message);
            showMessage("FailedtoSingUp");
        }
    };

    /**
     * Validates the user's email and password against the retrieved user data.
     * @param {Object} users - User data from the database.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {boolean} - True if the user exists and the password matches.
     */
    function validateUser(users, email, password) {
        return Object.values(users).some(user => user.email.toLowerCase() === email && user.password === password);
    }

    /**
     * Handles the login process when the login button is clicked.
     */
    const logBtn = document.getElementById("logBtn");
    if (logBtn) {
        logBtn.onclick = async function(event) {
            event.preventDefault();
            handleLogin();
        };
    }

    /**
     * Handles the login validation process, including fetching user data and checking credentials.
     */
    async function handleLogin() {
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value.trim();
        if (!email || !password) {
            showMessage("EmailandPassword");
            return;
        }

        const users = await fetchUsers();
        if (users && validateUser(users, email, password)) {
            window.location.href = "summary.html";
        } else {
            showMessage("UserDontExist");
        }
    }

    /**
     * Redirects to the summary page when the guest login button is clicked.
     */
    const guestBtn = document.getElementById("guestBtn");
    if (guestBtn) {
        guestBtn.onclick = () => { window.location.href = "summary.html"; };
    }

    /**
     * Displays a message or alert based on the provided class name.
     * @param {string} className - The class name of the message element to display.
     */
    function showMessage(className) {
        const alertContainer = document.querySelector('.singUp-Alert');
        alertContainer.style.display = 'flex';
        showAlertMessage(alertContainer, className);
    }

    /**
     * Displays the specific alert message within the alert container.
     * @param {HTMLElement} alertContainer - The container element for alert messages.
     * @param {string} className - The class name of the message to display.
     */
    function showAlertMessage(alertContainer, className) {
        [...alertContainer.children].forEach(message => message.style.display = 'none');
        document.querySelector(`.${className}`).style.display = 'flex';
        setTimeout(() => { alertContainer.style.display = 'none'; }, 2000);
    }
});

/**
 * Fügt eine Validierung für die E-Mail-Adresse beim Absenden des Formulars hinzu.
 * @param {Event} event - Das Absende-Event des Formulars.
 */
function addUser(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    const emailInput = document.getElementById('signup-email');
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!emailInput.value.match(emailPattern)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return; // Verhindert das Absenden des Formulars, wenn die E-Mail ungültig ist
    }

    // Weitere Logik zum Hinzufügen des Benutzers...
    console.log("User registration successful");
    // Hier kannst du die Funktion zur Registrierung des Benutzers hinzufügen
}
