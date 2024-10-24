document.addEventListener('DOMContentLoaded', function() {
    let currentContact = null, contacts = [];

    // Event listener for add contact button
    document.getElementById('addContactBtn').addEventListener('click', e => {
        e.stopPropagation();
        editContactCard();
    });

    // Event listener for contact click
    const attachContactClickEvents = () => {
        document.querySelectorAll('.contact-data').forEach(el => {
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
    };

    // Show contact card
    const showContactCard = email => {
        const contact = contacts.find(c => c.email === email);
        if (contact) renderContactCard(contact);
        const card = document.querySelector('.float-Ctn');
        card.style.display = 'block';
        card.classList.add('visible');
    };

    // Hide contact card
    const hideContactCard = () => {
        const card = document.querySelector('.float-Ctn');
        card.classList.remove('visible');
        card.style.display = 'none';
    };

    // Render the contact card with the selected contact's information
    const renderContactCard = contact => {
        const card = document.querySelector('.float-Ctn');
        card.innerHTML = generateContactCardHtml(contact);

        document.getElementById('edit-button').addEventListener('click', e => {
            e.stopPropagation();
            editContactCard(contact.email, true);
        });

        document.getElementById('delete-button').addEventListener('click', () => {
            deleteContact(contact.email);
        });

        const updateFloatImgSize = () => {
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
        };

        window.addEventListener('resize', updateFloatImgSize);
        updateFloatImgSize();
    };

    // Load contacts from Firebase
    const loadContactsFromFirebase = async () => {
        contacts = await getData('contacts').then(data => Object.values(data).map(contact => ({
            ...contact,
            color: contact.color || getUniqueColor()
        })));
        renderContactList();
    };

    // Fetch data from Firebase
    const getData = async path => {
        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
        const res = await fetch(`${BASE_URL}${path}.json`);
        if (res.ok) {
            return await res.json();
        } else {
            console.error('Fetch error');
        }
    };

    // Render the contact list
    const renderContactList = () => {
        const contactList = document.getElementById('contact-list');
        contactList.innerHTML = generateContactListHtml(contacts);
        attachContactClickEvents();
    };

    // Group contacts by first letter
    const groupContactsByLetter = contacts => {
        return contacts.sort((a, b) => a.name.localeCompare(b.name))
            .reduce((acc, contact) => {
                const letter = contact.name[0].toUpperCase();
                (acc[letter] = acc[letter] || []).push(contact);
                return acc;
            }, {});
    };

    // Generate initials image for contact
    const generateInitialsImage = (name, size, color) => `
        <div class="initials-avatar" style="background-color: ${color}; width: ${size}px; height: ${size}px; font-size: ${size / 2.5}px;">
            ${name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>`;

    // Get a unique color for the contact
    const getUniqueColor = () => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A5', '#FF8F33', '#33FFD1'];
        return colors.find(color => !contacts.some(contact => contact.color === color)) || colors[Math.floor(Math.random() * colors.length)];
    };

    // Edit or add new contact card
    const editContactCard = (email = '', isEditMode = false) => {
        const contact = contacts.find(c => c.email === email) || { name: '', email: '', phone: '', color: getUniqueColor(), img: `<img src="./assets/icon/PersonAddContact.svg">` };
        const isNewContact = !contacts.some(c => c.email === email);
    
        document.body.insertAdjacentHTML('beforeend', generateAddContactHtml(contact, isNewContact, isEditMode));
    
        document.getElementById('closeBtn').addEventListener('click', () => document.getElementById('next').remove());
        document.getElementById('Cancel-Btn').addEventListener('click', () => document.getElementById('next').remove());
        
        // Füge den Listener hinzu, um zu überprüfen, ob außerhalb geklickt wird
        closeOnOutsideClick();
    };

    // Save edited or new contact
    const saveEditedContact = async (event, email) => {
        event.preventDefault();
        const name = document.getElementById('contact-name').value.trim(),
              emailValue = document.getElementById('contact-email').value.trim(),
              phone = document.getElementById('contact-phone').value.trim();

        if (!name || !emailValue || !phone) return alert('All fields must be filled!');

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
    };

    // Add new contact to Firebase
    const addContactToFirebase = async contact => {
        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
        const newContact = {
            ...contact,
            assignedToTask: false
        };
        await fetch(`${BASE_URL}contacts.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newContact)
        });
    };

    // Update contact in Firebase
    const updateContactInFirebase = async (email, contact) => {
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
    };

    // Delete contact from Firebase
    const deleteContact = async email => {
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
        if (editForm) {
            editForm.remove();
        }
    };

    const showCreationAlert = () => {
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
    };

    const updateAvatarSize = () => {
        if (window.innerWidth <= 1590) {
            document.querySelectorAll('.initials-avatar').forEach(function(avatar) {
                
            });
        }
    };

    window.addEventListener('resize', updateAvatarSize);
    updateAvatarSize();

    loadContactsFromFirebase();

    // All HTML generation functions are placed here as requested
    const generateContactCardHtml = contact => `
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
    `;

    const generateContactListHtml = contacts => {
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
    };

    const generateAddContactHtml = (contact, isNewContact, isEditMode) => `
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
                        <div class="profil-img">${isNewContact ? contact.img : generateInitialsImage(contact.name, 120, contact.color)}</div>
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
});


// Funktion, um das AddContactCard zu schließen, wenn außerhalb geklickt wird
const closeOnOutsideClick = () => {
    document.addEventListener('click', function(event) {
        const addContactCard = document.querySelector('.AddContactCard');
        const nextContainer = document.getElementById('next');

        // Überprüfe, ob das geklickte Element außerhalb des AddContactCard-Containers ist
        if (nextContainer && addContactCard && !addContactCard.contains(event.target) && !event.target.closest('.AddContactCard')) {
            nextContainer.remove();
        }
    });
};

const editContactCard = (email = '', isEditMode = false) => {
    const contact = contacts.find(c => c.email === email) || { name: '', email: '', phone: '', color: getUniqueColor(), img: `<img src="./assets/icon/PersonAddContact.svg">` };
    const isNewContact = !contacts.some(c => c.email === email);

    document.body.insertAdjacentHTML('beforeend', generateAddContactHtml(contact, isNewContact, isEditMode));

    // Schließen des Fensters bei Klick auf das X oder Cancel
    document.getElementById('closeBtn').addEventListener('click', () => document.getElementById('next').remove());
    document.getElementById('Cancel-Btn').addEventListener('click', () => document.getElementById('next').remove());

    // Füge den Listener für den Save-Button hinzu
    document.getElementById('save-contact').addEventListener('click', (e) => saveEditedContact(e, email));
    
    // Füge den Listener hinzu, um zu überprüfen, ob außerhalb geklickt wird
    closeOnOutsideClick();
};

