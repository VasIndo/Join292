document.addEventListener('DOMContentLoaded', function() {
    let currentContact = null, contacts = [];

    /**
     * Event listener for the "Add Contact" button.
     */
    document.getElementById('addContactBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        editContactCard();
    });

    document.addEventListener('DOMContentLoaded', function () {
        const innerContentDiv = document.querySelector('.innerContent'); // Selektiert den innerContent-Bereich
        const floatCtn = document.querySelector('.float-Ctn'); // Selektiert den Detailbereich
    
        document.querySelectorAll('.contact-data').forEach(function (el) {
            el.addEventListener('click', function () {
                // innerContent ausblenden
                if (innerContentDiv) {
                    innerContentDiv.style.display = 'none';
                    console.log('innerContent ausgeblendet:', innerContentDiv.style.display);
                } else {
                    console.error('innerContent nicht gefunden.');
                }
    
                // Detailbereich anzeigen
                if (floatCtn) {
                    floatCtn.style.display = 'block';
                    console.log('Float-Ctn sichtbar gemacht:', floatCtn.style.display);
                } else {
                    console.error('Float-Ctn nicht gefunden.');
                }
            });
        });
    });
    

    /**
     * Attaches click events to contact elements.
     * Toggles contact selection and displays/hides the contact card.
     */
    function attachContactClickEvents() {
        document.querySelectorAll('.contact-data').forEach(function(el) {
            el.addEventListener('click', function() {
                if (currentContact === this) {
                    this.classList.remove('clicked');
                    hideContactCard();
                    currentContact = null;
                } else {
                    document.querySelectorAll('.contact-data').forEach(el => el.classList.remove('clicked'));
                    this.classList.add('clicked');
                    currentContact = this;
                    showContactCard(this.querySelector('p').innerText);
                }
            });
        });
    }

    /**
     * Displays the contact card of the selected contact.
     * @param {string} email - The email of the selected contact.
     */
    function showContactCard(email) {
        const contact = contacts.find(c => c.email === email);
        if (contact) renderContactCard(contact);
        const card = document.querySelector('.float-Ctn');
        card.style.display = 'block';
        card.classList.add('visible');
    }

    /**
     * Hides the contact card.
     */
    function hideContactCard() {
        const card = document.querySelector('.float-Ctn');
        card.classList.remove('visible');
        card.style.display = 'none';
    }

    /**
     * Renders the contact card with the selected contact's information.
     * @param {Object} contact - The contact object containing contact details.
     */
    function renderContactCard(contact) {
        const card = document.querySelector('.float-Ctn');
        card.innerHTML = generateContactCardHtml(contact);

        document.getElementById('edit-button').addEventListener('click', function(e) {
            e.stopPropagation();
            editContactCard(contact.email, true);
        });

        document.getElementById('delete-button').addEventListener('click', function() {
            deleteContact(contact.email);
        });

        document.getElementById('editButton').addEventListener('click', function(e) {
            e.stopPropagation();
            editContactCard(contact.email, true);
        });

        document.getElementById('deleteButton').addEventListener('click', function() {
            deleteContact(contact.email);
        });
        
        
        
        function updateFloatImgSize() {
            const floatImg = card.querySelector('.float-img div');
            if (window.innerWidth <= 1590) {
                floatImg.style.width = '80px';
                floatImg.style.height = '80px';
                floatImg.style.fontSize = '30px';
            } else {
                floatImg.style.width = '120px';
                floatImg.style.height = '120px';
                floatImg.style.fontSize = '48px';
            }
        }

        window.addEventListener('resize', updateFloatImgSize);
        updateFloatImgSize();
    }

    /**
     * Loads contacts from Firebase.
     */
    async function loadContactsFromFirebase() {
        contacts = await getData('contacts').then(data => Object.values(data).map(contact => ({
            ...contact,
            color: contact.color || getUniqueColor()
        })));
        renderContactList();
    }

    /**
     * Fetches data from Firebase.
     * @param {string} path - Firebase database path.
     * @returns {Promise<Object>} - The fetched data.
     */
    async function getData(path) {
        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
        const res = await fetch(`${BASE_URL}${path}.json`);
        if (res.ok) {
            return await res.json();
        } else {
            console.error('Fetch error');
        }
    }

    /**
     * Renders the contact list to the DOM.
     */
    function renderContactList() {
        const contactList = document.getElementById('contact-list');
        contactList.innerHTML = generateContactListHtml(contacts);
        attachContactClickEvents();
    }

    /**
     * Groups contacts by their first letter.
     * @param {Array<Object>} contacts - The array of contact objects.
     * @returns {Object} - Contacts grouped by the first letter.
     */
    function groupContactsByLetter(contacts) {
        return contacts.sort((a, b) => a.name.localeCompare(b.name))
            .reduce((acc, contact) => {
                const letter = contact.name[0].toUpperCase();
                (acc[letter] = acc[letter] || []).push(contact);
                return acc;
            }, {});
    }

    /**
     * Generates HTML for a contact's initials as an avatar.
     * @param {string} name - The contact's name.
     * @param {number} size - The size of the avatar.
     * @param {string} color - The avatar background color.
     * @returns {string} - HTML string for the initials avatar.
     */
    function generateInitialsImage(name, size, color) {
        return `
            <div class="initials-avatar" style="background-color: ${color}; width: ${size}px; height: ${size}px; font-size: ${size / 2.5}px;">
                ${name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>`;
    }

    /**
     * Gets a unique color for the contact.
     * @returns {string} - A unique color in hexadecimal format.
     */
    function getUniqueColor() {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A5', '#FF8F33', '#33FFD1'];
        return colors.find(color => !contacts.some(contact => contact.color === color)) || colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Opens the edit contact card or creates a new contact.
     * @param {string} [email=''] - The email of the contact to edit (empty if creating a new contact).
     * @param {boolean} [isEditMode=false] - Whether in edit mode.
     */
    function editContactCard(email = '', isEditMode = false) {
        const contact = contacts.find(c => c.email === email) || { name: '', email: '', phone: '', color: getUniqueColor(), img: `<img src="./assets/icon/PersonAddContact.svg">` };
        const isNewContact = !contacts.some(c => c.email === email);

        document.body.insertAdjacentHTML('beforeend', generateAddContactHtml(contact, isNewContact, isEditMode));

        if (window.innerHeight >= 900 && window.innerWidth <= 430) {
            document.querySelector('.profil-img').style.display = 'none';
        } else {
            document.querySelector('.profil-img').style.display = 'block';
        }

        document.getElementById('closeBtn').addEventListener('click', function() {
            document.getElementById('next').remove();
        });
        document.getElementById('Cancel-Btn').addEventListener('click', function() {
            if (isEditMode) {
                deleteContact(email);
            } else {
                document.getElementById('next').remove();
            }
        });

        document.getElementById('save-contact').addEventListener('click', function(e) {
            saveEditedContact(e, email);
        });

        closeOnOutsideClick();
    }

    /**
     * Saves the edited or new contact.
     * @param {Event} event - The event object.
     * @param {string} email - The email of the contact being edited.
     */
    async function saveEditedContact(event, email) {
        event.preventDefault();
        const name = document.getElementById('contact-name').value.trim(),
              emailValue = document.getElementById('contact-email').value.trim(),
              phone = document.getElementById('contact-phone').value.trim();

        // Email validation: must end with .de or .com
        const emailPattern = /^[^\s@]+@[^\s@]+\.(de|com)$/;
        if (!name || !emailValue || !phone) {
            return alert('All fields must be filled!');
        }
        if (!emailPattern.test(emailValue)) {
            return alert('Please enter a valid email address that ends with .de or .com (e.g., test@example.com or test@example.de)');
        }

        const duplicateContact = contacts.find(contact => 
            (contact.name.toLowerCase() === name.toLowerCase() && contact.email !== email) || 
            (contact.email.toLowerCase() === emailValue.toLowerCase() && contact.email !== email)
        );
        if (duplicateContact) {
            return alert('Dieser Name oder diese E-Mail ist bereits vorhanden. Bitte geben Sie andere Werte ein.');
        }

        const contactIndex = contacts.findIndex(c => c.email === email);
        const isNewContact = contactIndex === -1;
        const updatedContact = { name, email: emailValue, phone, color: contacts[contactIndex]?.color || getUniqueColor() };

        if (isNewContact) {
            contacts.push(updatedContact);
            await addContactToFirebase(updatedContact);
            showCreationAlert();
        } else {
            contacts[contactIndex] = updatedContact;
            await updateContactInFirebase(email, updatedContact);
        }

        renderContactList();
        document.getElementById('next').remove();
    }

    /**
     * Adds a new contact to Firebase.
     * @param {Object} contact - The contact object to add.
     */
    async function addContactToFirebase(contact) {
        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
        await fetch(`${BASE_URL}contacts.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...contact, assignedToTask: false })
        });
    }

    /**
     * Updates a contact in Firebase.
     * @param {string} email - The email of the contact to update.
     * @param {Object} contact - The updated contact object.
     */
    async function updateContactInFirebase(email, contact) {
        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
        const res = await fetch(`${BASE_URL}contacts.json`);
        const data = await res.json();
        const contactKey = Object.keys(data).find(key => data[key].email === email);
        if (contactKey) {
            await fetch(`${BASE_URL}contacts/${contactKey}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contact)
            });
        }
    }

    /**
     * Deletes a contact from Firebase.
     * @param {string} email - The email of the contact to delete.
     */
    async function deleteContact(email) {
        const contactIndex = contacts.findIndex(c => c.email === email);
        if (contactIndex === -1) return;

        contacts.splice(contactIndex, 1);

        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
        const res = await fetch(`${BASE_URL}contacts.json`);
        const data = await res.json();
        const contactKey = Object.keys(data).find(key => data[key].email === email);
        if (contactKey) {
            await fetch(`${BASE_URL}contacts/${contactKey}.json`, { method: "DELETE" });
        }

        renderContactList();
        hideContactCard();
        const editForm = document.getElementById('next');
        if (editForm) editForm.remove();
    }

    /**
     * Displays a creation success alert.
     */
    function showCreationAlert() {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="AlertCreated">
                <div class="createdsuccesfully">Contact successfully created</div>
            </div>
        `);
        setTimeout(() => {
            const alertElement = document.querySelector('.AlertCreated');
            alertElement.style.transition = 'opacity 0.5s ease';
            alertElement.style.opacity = '0';
            setTimeout(() => alertElement.remove(), 500);
        }, 1000);
    }

    /**
     * Adjusts the avatar size based on window width.
     */
    const updateAvatarSize = () => {
        if (window.innerWidth <= 1590) {
            document.querySelectorAll('.initials-avatar').forEach(avatar => {
                // Anpassung der Avatargröße falls nötig
            });
        }
    };

    window.addEventListener('resize', updateAvatarSize);
    updateAvatarSize();
    loadContactsFromFirebase();

    /**
     * Generates HTML for the contact card.
     * @param {Object} contact - The contact object.
     * @returns {string} - HTML string for the contact card.
     */
    function generateContactCardHtml(contact) {
        return `
            <div class="ContactsNew">
                <div class="backcontainer"> 
                    <h2>Contacts</h2>
                    <img id="contactsNew" src="/assets/img/Vector.svg" alt="">
                 </div>
                 <p>Better with a team</p>
                 <div class="blue-line"></div>
            </div>
            <div class="float-top-Ctn">
                <div class="float-img">${generateInitialsImage(contact.name, 120, contact.color)}</div>
                <div class="float-Edit-Delet-Ctn">
                    <h3>${contact.name}</h3>
                    <div class="edit-delete-Ctn">
                        <div class="edit-delete2" id="edit-button"><img class="small-img" src="./assets/icon/edit.svg"><p>Edit</p></div>
                        <div class="edit-delete2" id="delete-button"><img class="small-img" src="./assets/icon/delete.svg"><p>Delete</p></div>
                    </div>
                </div>
            </div>
            <div class="contact-Information"><p>Contact Information</p></div>
            <div class="contact-Information-box">
                <p class="font-weight">Email</p><p class="email-blue">${contact.email}</p>
                <p class="font-weight">Phone</p><p>${contact.phone}</p>
            </div>
            
            <div id="menuDot" class="menuDot">
            <img src="/assets/img/threedot.svg" alt="" >
            </div>

            <div id="menuButton" class="menuButton" style="display: none;">
              <div class="edit-delete3" id="editButton"><img class="small-img" src="./assets/icon/edit.svg"><p>Edit</p></div>
              <div class="edit-delete3" id="deleteButton"><img class="small-img" src="./assets/icon/delete.svg"><p>Delete</p></div>
            </div>
        `;
        
        
    }

     function handleMenuClick(event) {
        // Prüfen, ob der Klick auf ein Element mit der Klasse "menuDot" war
        if (event.target.closest(".menuDot")) {
            const menuDot = event.target.closest(".menuDot");
            const menuButton = menuDot.nextElementSibling; // Nächstes Element in der Struktur
            if (!menuButton) {
                console.error("Fehler: Menü-Button nicht gefunden.");
                return;
            }
            // Umschalten der Sichtbarkeit
            if (menuButton.style.display === "none" || menuButton.style.display === "") {
                menuButton.style.display = "flex";
            } else {
                menuButton.style.display = "none";
            }
        } else if (!event.target.closest(".menuButton")) {
            // Wenn der Klick außerhalb von menuDot und menuButton ist, Menüs schließen
            document.querySelectorAll(".menuButton").forEach(menu => {
                menu.style.display = "none";
            });
        }
    }
    
    // Event Listener hinzufügen
    document.addEventListener("click", handleMenuClick);
    
    document.addEventListener('click', function (event) {
        if (event.target.id === 'contactsNew') {
            const floatCtn = document.querySelector('.float-Ctn');
            if (floatCtn) {
                floatCtn.style.display = 'none';
            } 
        }
    });
    
    /**
     * Generates HTML for the contact list.
     * @param {Array<Object>} contacts - Array of contacts.
     * @returns {string} - HTML string for the contact list.
     */
    function generateContactListHtml(contacts) {
        const grouped = groupContactsByLetter(contacts);
        let html = '';

        for (const letter in grouped) {
            html += `
                <div class="AtoZ-Ctn"><p>${letter}</p></div>
                <div class="line-Ctn"><div class="line"></div></div>
                ${grouped[letter].map(contact => `
                    <div class="contact-data" data-email="${contact.email}">
                        ${generateInitialsImage(contact.name, 60, contact.color)}
                        <div style="width:200px"><h1>${contact.name}</h1><p>${contact.email}</p></div>
                    </div>`).join('')}
            `;
        }

        return html;
    }

    /**
     * Generates HTML for the "Add Contact" form.
     * @param {Object} contact - The contact object.
     * @param {boolean} isNewContact - Whether it is a new contact.
     * @param {boolean} isEditMode - Whether in edit mode.
     * @returns {string} - HTML string for the form.
     */
    function generateAddContactHtml(contact, isNewContact, isEditMode) {
        return `
            <div id="next" class="Full-Container">
                <div class="AddContactCard">
                    <div class="leftSide">
                        <div class="close-icon2"><img id="closeBtn" src="./assets/icon/closewhite.svg"></div>
                        <img class="LogoLeftSide" src="./assets/icon/Join logo vector.svg">
                        <div class="innerAddContact">
                            <h1>${isNewContact ? 'Add Contact' : 'Edit Contact'}</h1>
                            <p>Tasks are better with a team!</p>
                            <div class="TaskLine"></div>
                        </div>
                    </div>
                    <div class="rightSide">
                        <div class="close-icon"><img id="closeBtn" src="./assets/icon/close.svg"></div>
                        <div class="rightSide-middle">
                            <div class="profil-img" >${isNewContact ? contact.img : generateInitialsImage(contact.name, 120, contact.color)}</div>
                            <form id="contact-form">
                                <div><input id="contact-name" type="text" placeholder="Name" value="${contact.name}"><img class="iconInput" src="./assets/icon/Person1.webp"></div>
                                <div><input id="contact-email" type="email" placeholder="Email" value="${contact.email}"><img class="iconInput" src="./assets/icon/mail.webp"></div>
                                <div><input id="contact-phone" type="text" placeholder="Phone" value="${contact.phone}"><img class="iconInput" src="./assets/icon/call.svg"></div>
                            </form>
                        </div>
                        <div class="ctn-button" style="${isEditMode ? 'margin-left: 0;' : ''}">
                            <button id="Cancel-Btn" class="cancel">
                                ${isEditMode ? 'Delete' : 'Cancel'}
                                <div class="icon-container">
                                    <img class="default-icon" src="./assets/icon/close.svg">
                                    <img class="hover-icon" src="./assets/icon/closeBlue.svg">
                                </div>
                            </button>
                            <button id="save-contact" class="create" style="${isEditMode ? 'width: 100px;' : ''}">
                                ${isEditMode ? 'Save' : 'Create contact'}
                                <img src="./assets/icon/check.webp">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});

/**
 * Closes the AddContactCard if a click occurs outside it.
 */
function closeOnOutsideClick() {
    document.addEventListener('click', function(event) {
        const addContactCard = document.querySelector('.AddContactCard');
        const nextContainer = document.getElementById('next');

        if (nextContainer && addContactCard && !addContactCard.contains(event.target) && !event.target.closest('.AddContactCard')) {
            nextContainer.remove();
        }
    });
};

