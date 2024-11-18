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

    function init() {
        localStorage.setItem("isRememberDefault", "true");
        clearInputFields();
        addEventListeners();
        observeDOMChanges();
        observeTemplateLoad();
    }

    function clearInputFields() {
        const emailField = document.getElementById('login-email');
        const passwordField = document.getElementById('login-password');
        if (emailField) emailField.value = '';
        if (passwordField) passwordField.value = '';
    }

    function addEventListeners() {
        const logBtn = document.getElementById("logBtn");
        const guestBtn = document.getElementById("guestBtn");

        if (logBtn) logBtn.onclick = (event) => { event.preventDefault(); handleLogin(event); };
        if (guestBtn) guestBtn.onclick = (event) => { 
            event.preventDefault(); 
            localStorage.setItem('userImageInitial', 'guest');
            console.log('userImageInitial im localStorage gesetzt: guest');
            window.location.href = "summary.html"; 
        };

        const clearSessionBtn = document.getElementById("clearSessionBtn");
        if (clearSessionBtn) clearSessionBtn.onclick = clearSessionData;
    }

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

    function observeTemplateLoad() {
        const observer = new MutationObserver(() => {
            const userImage = document.getElementById('userImage');
            if (userImage) {
                observer.disconnect();
                restoreUserImageState();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function addRememberEventListeners() {
        const container = document.getElementById("remember-image-container");
        const image = document.getElementById("remember-main-image");
        if (container && image) handleRememberToggle(container, image);
    }

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

    function toggleRememberState(image) {
        let isDefault = localStorage.getItem("isRememberDefault") === "true";
        isDefault = !isDefault;
        image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;
        localStorage.setItem("isRememberDefault", isDefault);
        manageRememberFields(isDefault);
    }

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

    function clearRememberedFields() {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        const emailField = document.getElementById('login-email');
        const passwordField = document.getElementById('login-password');
        if (emailField) emailField.value = '';
        if (passwordField) passwordField.value = '';
    }

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
            const currentUser = Object.values(users).find(user => user.email.toLowerCase() === email);
            if (currentUser && currentUser.name) {
                const initial = currentUser.name.charAt(0).toUpperCase();
                localStorage.setItem('userImageInitial', initial);
                console.log('userImageInitial im localStorage gesetzt:', initial);
            }
            window.location.href = "summary.html";
        } else {
            showMessage("UserDontExist");
        }
    }

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

    function validateUser(users, email, password) {
        return Object.values(users).some(user => user.email.toLowerCase() === email && user.password === password);
    }

    function showMessage(className) {
        const alertContainer = document.querySelector('.singUp-Alert');
        alertContainer.style.display = 'flex';
        [...alertContainer.children].forEach(message => message.style.display = 'none');
        document.querySelector(`.${className}`).style.display = 'flex';
        setTimeout(() => { alertContainer.style.display = 'none'; }, 2000);
    }

    updateUserImage();
    restoreUserImageState();

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

    function hideGuestLogo() {
        const userImage = document.getElementById('userImage');
        if (userImage) {
            userImage.src = "assets/img/guest.svg";
            userImage.style.display = 'block';
        } 
    
        localStorage.setItem('userImageInitial', 'guest');
    }

    function restoreUserImageState() {
        console.log("restoreUserImageState() aufgerufen");
        const userImageInitial = localStorage.getItem('userImageInitial');
        console.log("userImageInitial:", userImageInitial);
        const userImage = document.getElementById('userImage');
        console.log("userImage Element gefunden:", userImage !== null);

        if (!userImage || !userImageInitial) {
            console.warn('Benutzerbild oder Initialen nicht gefunden.');
            return;
        }

        if (userImageInitial === 'guest') {
            console.log('Gast-Benutzer erkannt, Gastlogo anzeigen.');
            userImage.src = "assets/img/guest.svg";
            userImage.style.display = 'block';
        } else {
            console.log('Eingeloggter Benutzer erkannt, Initialbuchstaben anzeigen.');
            setUserImageWithInitial(userImageInitial);
        }
    }
});

function clearSessionData() {
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('userImageInitial');
    localStorage.setItem('isRememberDefault', 'true');
    clearRememberedFields();
}

function clearRememberedFields() {
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");
    const emailField = document.getElementById('login-email');
    const passwordField = document.getElementById('login-password');
        if (emailField) emailField.value = '';
    if (passwordField) passwordField.value = '';
}

function initializePage() {
    includeHTML(() => {
        restoreUserImageState();
        init();  // Initialisierung der Event Listener etc.
    });
}
