document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL2 = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
    const icons = {
        visibilityOff: "./assets/icon/visibility_off.svg",
        visibility: "./assets/icon/visibility.svg",
        lock: "./assets/icon/lock.webp",
        rememberDefault: "./assets/icon/Property 1=Default.svg",
        rememberChecked: "./assets/icon/Property 1=checked.svg"
    };

    // Setzt den Zustand auf "Remember Default" beim Start
    localStorage.setItem("isRememberDefault", "true");

    /**
     * Aktualisiert das Icon des Passwort-Toggles basierend auf dem Eingabeinhalt.
     * @param {string} inputId - Die ID des Passwortfeldes.
     * @param {string} toggleId - Die ID des Icons für den Passwort-Toggle.
     */
    function updatePasswordToggleIcon(inputId, toggleId) {
        const input = document.getElementById(inputId);
        document.getElementById(toggleId).src = input.value.length > 0 ? icons.visibilityOff : icons.lock;
    }

    /**
     * Schaltet die Sichtbarkeit des Passworts um und ändert das Icon.
     * @param {string} inputId - Die ID des Passwortfeldes.
     * @param {string} toggleId - Die ID des Icons für den Passwort-Toggle.
     */
    function togglePasswordVisibilityIcon(inputId, toggleId) {
        const field = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        if (field.value.length === 0) return;
        if (toggle.src.includes('visibility_off.svg')) {
            field.type = "text";
            toggle.src = icons.visibility;
        } else {
            field.type = "password";
            toggle.src = icons.visibilityOff;
        }
    }

    /**
     * Fügt Event-Listener für die "Remember Me"-Funktion hinzu.
     */
    function addRememberEventListeners() {
        const container = document.getElementById("remember-image-container");
        const image = document.getElementById("remember-main-image");
        if (container && image) {
            let isDefault = localStorage.getItem("isRememberDefault") === "true";
            image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;

            container.addEventListener("mouseover", () => { if (isDefault) image.src = icons.rememberChecked; });
            container.addEventListener("mouseout", () => { if (isDefault) image.src = icons.rememberDefault; });
            container.addEventListener("click", () => {
                isDefault = !isDefault;
                image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;
                localStorage.setItem("isRememberDefault", isDefault);

                if (!isDefault) {
                    const email = document.getElementById('login-email').value;
                    const password = document.getElementById('login-password').value;
                    localStorage.setItem("rememberedEmail", email);
                    localStorage.setItem("rememberedPassword", password);
                } else {
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberedPassword");
                    // Leert die Felder, wenn Remember Me deaktiviert ist
                    document.getElementById('login-email').value = '';
                    document.getElementById('login-password').value = '';
                }
            });
        }
    }

    /**
     * Überwacht DOM-Änderungen, um Event-Listener hinzuzufügen.
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

    // Setzt die Felder auf leer, da Remember Me standardmäßig deaktiviert ist
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';

    /**
     * Ruft die Benutzerdaten von der Datenbank ab.
     * @returns {Promise<Object>} - Ein Promise, das die Benutzerinformationen zurückgibt.
     */
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL2}/users.json`);
            if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            showMessage("FailedtoSingUp");
        }
    };

    /**
     * Validiert die Benutzeranmeldedaten.
     * @param {Object} users - Die Benutzerinformationen.
     * @param {string} email - Die E-Mail-Adresse des Benutzers.
     * @param {string} password - Das Passwort des Benutzers.
     * @returns {boolean} - Gibt zurück, ob die Anmeldedaten gültig sind.
     */
    const validateUser = (users, email, password) => {
        return Object.values(users).some(user => user.email.toLowerCase() === email && user.password === password);
    };

    // Event-Listener für den Login-Button
    const logBtn = document.getElementById("logBtn");
    if (logBtn) {
        logBtn.onclick = async function(event) {
            event.preventDefault();
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
        };
    }

    // Event-Listener für den Gast-Login-Button
    const guestBtn = document.getElementById("guestBtn");
    if (guestBtn) {
        guestBtn.onclick = () => { window.location.href = "summary.html"; };
    }

    /**
     * Zeigt eine Benachrichtigung an.
     * @param {string} className - Die Klasse des Benachrichtigungs-Elements.
     */
    function showMessage(className) {
        const alertContainer = document.querySelector('.singUp-Alert');
        alertContainer.style.display = 'flex';
        [...alertContainer.children].forEach(message => message.style.display = 'none');
        document.querySelector(`.${className}`).style.display = 'flex';
        setTimeout(() => { alertContainer.style.display = 'none'; }, 2000);
    }
});
