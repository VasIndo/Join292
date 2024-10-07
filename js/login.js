/**
 * Zeigt das Registrierungsfenster an und blendet das Anmeldefenster aus.
 */
function signUp() {
  let signUp = document.getElementById('RegisterWindow');
  hideSignUpForm();
  signUp.innerHTML = renderSignUp();
  addEventListeners(); // Stelle sicher, dass die Event-Listener hinzugefügt werden
}

/**
* Blendert das Anmeldefenster aus und zeigt das Registrierungsfenster an.
*/
function hideSignUpForm() {
  document.getElementById('formId').classList.add('d-none');
  document.getElementById('RegisterWindow').classList.remove('d-none');
  document.getElementById('signUpNone').classList.add('d-none');
}

/**
* Blendert das Registrierungsfenster aus und zeigt das Anmeldefenster wieder an.
*/
function backtoSignUp() {
  showSignUpForm();
}

/**
* Zeigt das Anmeldefenster an und blendert das Registrierungsfenster aus.
*/
function showSignUpForm() {
  document.getElementById('formId').classList.remove('d-none');
  document.getElementById('RegisterWindow').classList.add('d-none');
  document.getElementById('signUpNone').classList.remove('d-none');
}

/**
* Initialisiert die Animation beim Laden der Seite.
*/
window.onload = function() {
  const loadingLogo = document.querySelector('.loadingScreen img');
  const loadingScreen = document.querySelector('.loadingScreen');
  const finalLogo = document.querySelector('.logo-Ctn img');
  const topCtn = document.querySelector('.top-Ctn');
  
  const { targetX, targetY, scaleX, scaleY } = calculateAnimationParameters(topCtn);
  animateLoadingLogo(loadingLogo, loadingScreen, targetX, targetY, scaleX, scaleY);
};

/**
* Berechnet die Zielposition und Skalierung für die Animation des Lade-Logos.
* @param {HTMLElement} topCtn - Das Element, auf das sich die Animation bezieht.
* @returns {{targetX: number, targetY: number, scaleX: number, scaleY: number}} - Berechnete Werte für die Animation.
*/
function calculateAnimationParameters(topCtn) {
    const topCtnRect = topCtn.getBoundingClientRect();
    let targetX, targetY, scaleX, scaleY;
  
    if (window.innerWidth <= 400) {
        targetX = topCtnRect.left - 80;
        targetY = topCtnRect.top - 102;
        scaleX = 80 / 200;
        scaleY = 90 / 243.94;
    } else if (window.innerWidth <= 680) {
        targetX = topCtnRect.left - 59.4;
        targetY = topCtnRect.top - 42.35;
        scaleX = 100.03 / 200;
        scaleY = 121.97 / 243.94;
    } else if(window.innerHeight <= 667){
        targetX = topCtnRect.left - 10;
        targetY = topCtnRect.top - 10;
        scaleX = 60 / 200;  // Bildbreite auf 60px anpassen
        scaleY = 70 / 243.94; // Bildhöhe auf 70px anpassen
    } else {
        targetX = topCtnRect.left - 23.29;
        targetY = topCtnRect.top - 42.35;
        scaleX = 100.03 / 200;
        scaleY = 121.97 / 243.94;
    }
  
    return { targetX, targetY, scaleX, scaleY };
  }
  
/**
* Animiert das Lade-Logo und ändert den Hintergrund des Ladebildschirms.
* @param {HTMLElement} loadingLogo - Das Lade-Logo-Element.
* @param {HTMLElement} loadingScreen - Der Ladebildschirm-Element.
* @param {number} targetX - Ziel-X-Position.
* @param {number} targetY - Ziel-Y-Position.
* @param {number} scaleX - Skalierungsfaktor für die X-Achse.
* @param {number} scaleY - Skalierungsfaktor für die Y-Achse.
*/
function animateLoadingLogo(loadingLogo, loadingScreen, targetX, targetY, scaleX, scaleY) {
  const loadingLogoRect = loadingLogo.getBoundingClientRect();
  const translateX = targetX - loadingLogoRect.left;
  const translateY = targetY - loadingLogoRect.top;

  loadingLogo.style.transformOrigin = "top left";
  setTimeout(() => {
      loadingLogo.style.transition = 'transform 1s';
      loadingLogo.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      loadingScreen.style.transition = 'background-color 1s';
      loadingScreen.style.backgroundColor = 'transparent';
  }, 450);

  if (window.innerWidth <= 680) {
      setTimeout(() => {
          loadingLogo.src = '/assets/icon/Join%20logo%20vector.svg?' + new Date().getTime();
      }, 200);
  }

  setTimeout(() => {
      const finalLogo = document.querySelector('.logo-Ctn img');
      finalLogo.style.opacity = '1'; // Ändere opacity auf 1 statt 10
  }, 1400);

  setTimeout(() => {
      loadingScreen.style.display = 'none';
  }, 1400);
}

/**
* Fügt Event-Listener für Links hinzu, um sie in neuen Tabs zu öffnen.
*/
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('privacyLink').addEventListener('click', function(event) {
      event.preventDefault();
      window.open(this.href, '_blank');
  });

  document.getElementById('legalNoticeLink').addEventListener('click', function(event) {
      event.preventDefault();
      window.open(this.href, '_blank');
  });
});

/**
* Schaltet die Sichtbarkeit des Passworts um und ändert das Symbol.
* @param {string} passwordFieldId - Die ID des Passwortfeldes.
* @param {string} toggleIconId - Die ID des Icons, das das Passwort sichtbar macht.
*/
function togglePasswordVisibility(passwordFieldId, toggleIconId) {
  const passwordField = document.getElementById(passwordFieldId);
  const toggleIcon = document.getElementById(toggleIconId);
  
  if (passwordField.type === 'password') {
      passwordField.type = 'text';
      toggleIcon.src = './assets/icon/eye-open.webp'; // Bild für Passwort sichtbar
  } else {
      passwordField.type = 'password';
      toggleIcon.src = './assets/icon/eye-closed.webp'; // Bild für Passwort versteckt
  }
}

/**
* Rendert das HTML für das Registrierungsformular.
* @returns {string} - Das gerenderte HTML für das Registrierungsformular.
*/
function renderSignUp() {
  return ` 
      <div class="registration-Ctn">
          <div class="regiCtn">
              <img onclick="backtoSignUp()" src="./assets/icon/arrow-left-line.webp" alt="">
              <div class="h2Ctn">
                  <h2>Sign up</h2>
              </div>
          </div>
          <div class="underline-Ctn2"></div>
          <div class="CtnInput2">
              <form class="formRegi" onsubmit="addUser(event);">
                  <div class="input-Ctn2">
                      <input class="input" type="text" placeholder="Name" id="signup-name" required autocomplete="current-Name">
                      <img src="./assets/icon/person.webp" alt="">
                  </div>
                  <div class="input-Ctn2">
                      <input class="input" type="email" placeholder="Email" id="signup-email" required autocomplete="current-email">
                      <img src="./assets/icon/mail.webp" alt="">
                  </div>
                  <div class="input-Ctn2">
                      <input class="input" type="password" placeholder="Password" id="signup-password" autocomplete="current-password" required oninput="updateToggleIcon('signup-password', 'signup-password-toggle')">
                      <img src="./assets/icon/lock.webp" alt="" id="signup-password-toggle" onclick="togglePasswordVisibility('signup-password', 'signup-password-toggle')">
                  </div>
                  <div class="input-Ctn2">
                      <input class="input" type="password" placeholder="Confirm Password" autocomplete="current-password" id="confirm-password" required oninput="updateToggleIcon('confirm-password', 'confirm-password-toggle')">
                      <img src="./assets/icon/lock.webp" alt="" id="confirm-password-toggle" onclick="togglePasswordVisibility('confirm-password', 'confirm-password-toggle')">
                  </div>
                  <div class="remember-Ctn2" id="image-container">
                      <img src="./assets/icon/Property 1=Default.svg" alt="" id="main-image">
                      <p>I accept the</p> <em>Privacy Policy</em>
                  </div>
                  <div class="SignUpButton-Ctn">
                      <button class="SignUpButton" id="signUpButton" type="submit">Sign up</button>
                  </div>
              </form>
          </div>
      </div>
  `;
}
