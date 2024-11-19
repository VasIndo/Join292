/**
 * Initializes the event listeners and UI state when the document is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    restoreUserImageState();
    const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
    const icons = {
        visibilityOff: "./assets/icon/visibility_off.svg",
        visibility: "./assets/icon/visibility.svg",
        lock: "./assets/icon/lock.webp",
        rememberDefault: "./assets/icon/Property 1=Default.svg",
        rememberChecked: "./assets/icon/Property 1=checked.svg"
    };

    init();

    /**
     * Initializes the application, sets initial localStorage values, and adds event listeners.
     */
    function init() {
        localStorage.setItem("isRememberDefault", "true");
        clearInputFields();
        addEventListeners();
        observeDOMChanges();
        observeTemplateLoad();
        updateGreetingUser();
    }

    /**
     * Clears the input fields for email and password.
     */
    function clearInputFields() {
        const emailField = document.getElementById('login-email');
        const passwordField = document.getElementById('login-password');
        if (emailField) emailField.value = '';
        if (passwordField) passwordField.value = '';
    }

    /**
     * Adds event listeners for login, guest login, and session clearing.
     */
    function addEventListeners() {
        const logBtn = document.getElementById("logBtn");
        const guestBtn = document.getElementById("guestBtn");

        if (logBtn) logBtn.onclick = (event) => { event.preventDefault(); handleLogin(event); };
        if (guestBtn) guestBtn.onclick = (event) => handleGuestLogin(event);

        const clearSessionBtn = document.getElementById("clearSessionBtn");
        if (clearSessionBtn) clearSessionBtn.onclick = clearSessionData;
    }

    /**
     * Handles guest login.
     * @param {Event} event - The event object.
     */
    function handleGuestLogin(event) {
        event.preventDefault();
        localStorage.setItem('userImageInitial', 'guest');
        localStorage.setItem('loggedInUserName', 'Guest');
        window.location.href = "summary.html";
    }

    /**
     * Observes DOM changes to detect and add event listeners for the remember-me functionality.
     */
    function observeDOMChanges() {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && document.getElementById("remember-image-container") && document.getElementById("remember-main-image")) {
                    addRememberEventListeners();
                    observer.disconnect();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Observes the template load to restore the user image state and update the greeting user.
     */
    function observeTemplateLoad() {
        const observer = new MutationObserver(() => {
            const userImage = document.getElementById('userImage');
            if (userImage) {
                observer.disconnect();
                restoreUserImageState();
                updateGreetingUser();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Adds event listeners to the remember-me image container.
     */
    function addRememberEventListeners() {
        const container = document.getElementById("remember-image-container");
        const image = document.getElementById("remember-main-image");
        if (container && image) handleRememberToggle(container, image);
    }

    /**
     * Handles the toggle of the remember-me image.
     * @param {HTMLElement} container - The container element for the remember-me image.
     * @param {HTMLElement} image - The image element to be toggled.
     */
    function handleRememberToggle(container, image) {
        let isDefault = localStorage.getItem("isRememberDefault") === "true";
        image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;

        container.addEventListener("click", () => toggleRememberState(image));
        container.addEventListener("mouseover", () => image.src = icons.rememberChecked);
        container.addEventListener("mouseout", () => {
            let isDefault = localStorage.getItem("isRememberDefault") === "true";
            image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;
        });
    }

    /**
     * Toggles the remember-me state and updates localStorage.
     * @param {HTMLElement} image - The image element to be toggled.
     */
    function toggleRememberState(image) {
        let isDefault = localStorage.getItem("isRememberDefault") === "true";
        isDefault = !isDefault;
        image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;
        localStorage.setItem("isRememberDefault", isDefault);
        manageRememberFields(isDefault);
    }

    /**
     * Manages the remembered email and password fields based on the remember-me state.
     * @param {boolean} isDefault - Whether the remember-me is in its default state.
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
     * Clears remembered email and password fields from localStorage.
     */
    function clearRememberedFields() {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        clearInputFields();
    }

    /**
     * Handles the login process.
     * @param {Event} event - The event object.
     */
    async function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
            showMessage("EmailandPassword");
            return;
        }

        const users = await fetchUsers();
        if (users && validateUser(users, email, password)) {
            localStorage.setItem('loggedInUserEmail', email);
            handleUserLogin(users, email);
            window.location.href = "summary.html";
        } else {
            showMessage("UserDontExist");
        }
    }

    /**
     * Fetches user data from the remote database.
     * @returns {Promise<Object>} The user data.
     */
    async function fetchUsers() {
        try {
            const response = await fetch(`${BASE_URL}/users.json`);
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error.message);
            showMessage("FailedtoSingUp");
        }
    }

    /**
     * Validates the user's credentials.
     * @param {Object} users - The user data.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {boolean} Whether the user's credentials are valid.
     */
    function validateUser(users, email, password) {
        return Object.values(users).some(user => user.email.toLowerCase() === email && user.password === password);
    }

    /**
     * Handles setting user login information in localStorage.
     * @param {Object} users - The user data.
     * @param {string} email - The email of the logged-in user.
     */
    function handleUserLogin(users, email) {
        const currentUser = Object.values(users).find(user => user.email.toLowerCase() === email);
        if (currentUser && currentUser.name) {
            const initial = currentUser.name.charAt(0).toUpperCase();
            localStorage.setItem('userImageInitial', initial);
            localStorage.setItem('loggedInUserName', currentUser.name);
        }
    }

    /**
     * Displays a message based on the provided class name.
     * @param {string} className - The class name of the message to be displayed.
     */
    function showMessage(className) {
        const alertContainer = document.querySelector('.singUp-Alert');
        alertContainer.style.display = 'flex';
        [...alertContainer.children].forEach(message => message.style.display = 'none');
        document.querySelector(`.${className}`).style.display = 'flex';
        setTimeout(() => { alertContainer.style.display = 'none'; }, 2000);
    }

    updateUserImage();
    restoreUserImageState();

    /**
     * Updates the user image based on the logged-in user's information.
     */
    async function updateUserImage() {
        const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
        const userImage = document.getElementById('userImage');

        if (!userImage) return;

        if (loggedInUserEmail) {
            try {
                const response = await fetch(`${BASE_URL}/users.json`);
                if (!response.ok) throw new Error(`Fehler beim Abrufen der Benutzerdaten: ${response.statusText}`);
                const users = await response.json();

                const currentUser = Object.values(users).find(user => user.email.toLowerCase() === loggedInUserEmail.toLowerCase());

                if (currentUser && currentUser.name) {
                    const initial = currentUser.name.charAt(0).toUpperCase();
                    setUserImageWithInitial(initial);
                } else {
                    hideGuestLogo();
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error.message);
                hideGuestLogo();
            }
        } else {
            hideGuestLogo();
        }
    }

    /**
     * Sets the user image with the initial of the user's name.
     * @param {string} initial - The initial of the user's name.
     */
    function setUserImageWithInitial(initial) {
        const userImage = document.getElementById('userImage');
        if (!userImage) return;
        userImage.outerHTML = `
            <svg id="userImage" class="userBtn" width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="24" transform="matrix(1 0 0 -1 4 52.9658)" fill="white"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24" fill="#29ABE2" font-family="Arial, sans-serif">${initial}</text>
                <circle cx="28" cy="28.9658" r="26.5" stroke="#2A3647" stroke-width="3"/>
            </svg>
        `;
        localStorage.setItem('userImageInitial', initial);
    }

    /**
     * Hides the user image and displays the guest logo.
     */
    function hideGuestLogo() {
        const userImage = document.getElementById('userImage');
        if (userImage) {
            userImage.src = "assets/img/guest.svg";
            userImage.style.display = 'block';
        } 
    
        localStorage.setItem('userImageInitial', 'guest');
    }

    /**
     * Restores the user image state based on localStorage.
     */
    function restoreUserImageState() {
        const userImageInitial = localStorage.getItem('userImageInitial');
        const userImage = document.getElementById('userImage');

        if (!userImage || !userImageInitial) {
            return;
        }

        if (userImageInitial === 'guest') {
            userImage.src = "assets/img/guest.svg";
            userImage.style.display = 'block';
        } else {
            setUserImageWithInitial(userImageInitial);
        }
    }

    /**
     * Updates the greeting user text based on the logged-in user.
     */
    function updateGreetingUser() {
        const loggedInUserName = localStorage.getItem('loggedInUserName');
        const greetingUserElement = document.getElementById('greeting-user');
        if (greetingUserElement) {
            greetingUserElement.textContent = loggedInUserName ? loggedInUserName : 'Guest';
        }
    }
});

/**
 * Clears session data from localStorage.
 */
function clearSessionData() {
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('userImageInitial');
    localStorage.removeItem('loggedInUserName');
    localStorage.setItem('isRememberDefault', 'true');
    clearRememberedFields();
}

/**
 * Clears remembered email and password fields from localStorage and the input fields.
 */
function clearRememberedFields() {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    const emailField = document.getElementById('login-email');
    const passwordField = document.getElementById('login-password');
    if (emailField) emailField.value = '';
    if (passwordField) passwordField.value = '';
}

/**
 * Initializes the page by including the HTML and restoring user image state.
 */
function initializePage() {
    includeHTML(() => {
        restoreUserImageState();
        init();  // Initializing event listeners, etc.
    });
}
