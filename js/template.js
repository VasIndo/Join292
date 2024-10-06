/**
 * Öffnet das Pop-up-Fenster, indem die Klasse 'd-none' vom Element mit der ID 'popUp' entfernt wird.
 */
function openPopUp() {
    document.getElementById('popUp').classList.remove('d-none');
}

/**
 * Schließt das Pop-up-Fenster, indem die Klasse 'd-none' zum Element mit der ID 'popUp' hinzugefügt wird.
 */
function closePopUp() {
    document.getElementById('popUp').classList.add('d-none');
}

/**
 * Zeigt den Hilfetext für eine spezifische Seite an.
 * 
 * @param {string} site - Der Name der Seite, für die der Hilfetext angezeigt wird.
 * @returns {string} HTML-String, der den Hilfetext enthält.
 */
function showHelp(site) {
    return `
        <div class="helpCon">
        <div class="headerHelp">
            <h1>Help</h1>
            <a href="${site}.html"><img src="assets/icon/back.svg" /></a>
        </div>

        <div class="helpText">
            <p>Welcome to the help page for <span>Join</span>, your guide to using our kanban project management tool.
                Here, we'll
                provide an overview of what <span>Join</span> is, how it can benefit you, and how to use it.</p>

            <h2>What is Join?</h2>
            <p>
                <span>Join</span> is a kanban-based project management tool designed and built by a group of dedicated students as
                part of their web development bootcamp at the Developer Akademie.
                <br><br>
                Kanban, a Japanese term meaning "billboard", is a highly effective method to visualize work, limit
                work-in-progress, and maximize efficiency (or flow). Join leverages the principles of kanban to help
                users manage their tasks and projects in an intuitive, visual interface.
                <br><br>
                It is important to note that <span>Join</span> is designed as an educational exercise and is not intended for
                extensive business usage. While we strive to ensure the best possible user experience, we cannot
                guarantee consistent availability, reliability, accuracy, or other aspects of quality regarding <span>Join</span>.
            </p>
            <br>
            <h2>How to use it</h2>
            <br>
            <p>Here is a step-by-step guide on how to use <span>Join</span>:</p>
            <ol>
                <li>
                    <h3>Exploring the Board</h3>
                    <p>
                        When you log in to <span>Join</span>, you'll find a default board. This board represents your project and
                        contains
                        four
                        default lists: "To Do", "In Progress", “Await feedback” and "Done".
                    </p>
                </li>
                <li>
                    <h3>Creating Contacts</h3>
                    <p>
                        In <span>Join</span>, you can add contacts to collaborate on your projects. Go to the "Contacts" section,
                        click
                        on
                        "New
                        contact", and fill in the required information. Once added, these contacts can be assigned tasks
                        and
                        they
                        can interact with the tasks on the board.
                    </p>
                </li>
                <li>
                    <h3>Adding Cards</h3>
                    <p>
                        Now that you've added your contacts, you can start adding cards. Cards represent individual
                        tasks.
                        Click
                        the
                        "+" button under the appropriate list to create a new card. Fill in the task details in the
                        card,
                        like
                        task
                        name, description, due date, assignees, etc.
                    </p>
                </li>
                <li>
                    <h3>Moving Cards</h3>
                    <p>
                        As the task moves from one stage to another, you can reflect that on the board by dragging and
                        dropping
                        the
                        card from one list to another.
                    </p>
                </li>
                <li>
                    <h3>Deleting Cards</h3>
                    <p>
                        Once a task is completed, you can either move it to the "Done" list or delete it. Deleting a
                        card
                        will
                        permanently remove it from the board. Please exercise caution when deleting cards, as this
                        action is
                        irreversible.
                        <br><br>
                        Remember that using <span>Join</span> effectively requires consistent updates from you and your team to ensure the board
                        reflects the current state of your project.
                        <br><br>
                        Have more questions about <span>Join</span>? Feel free to contact us at [Your Contact Email]. We're here to help you!
                        <br>    <br>
                        Enjoy using <span>Join</span>!
                    </p>
                </li>
            </ol>
        </div>
    </div>
    `;
}

/**
 * Öffnet die Hilfeseite basierend auf der aktuellen Seite, auf der sich der Benutzer befindet.
 * Der Hilfetext wird entsprechend der spezifischen Seite dynamisch eingefügt.
 */
function openHelp(){    
    // Beispiel für eine ID oder Klasse, die den spezifischen Inhalt bestimmt
    if (document.body.classList.contains('page-addTask')) {
        document.getElementById('help').innerHTML = showHelp('addTask');
    } else if (document.body.classList.contains('page-board')) {
        document.getElementById('board').innerHTML = showHelp('board');
    } else if (document.body.classList.contains('page-summary')) {
        document.getElementById('summary').innerHTML = showHelp('summary');
    } else if (document.body.classList.contains('page-contacts')) {
        document.getElementById('contacts').innerHTML = showHelp('contacts');
    } 
}
