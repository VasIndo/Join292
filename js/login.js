function signUp() {
  let signUp = document.getElementById('RegisterWindow');
  document.getElementById('formId').classList.add('d-none')
  document.getElementById('RegisterWindow').classList.remove('d-none')
  document.getElementById('signUpNone').classList.add('d-none')
  signUp.innerHTML = "";
  signUp.innerHTML = renderSignUp();
  addEventListeners(); // Stelle sicher, dass die Event-Listener hinzugefügt werden
}

function backtoSignUp(){
  document.getElementById('formId').classList.remove('d-none')
  document.getElementById('RegisterWindow').classList.add('d-none')
  document.getElementById('signUpNone').classList.remove('d-none')
}

window.onload = function() {
  const loadingLogo = document.querySelector('.loadingScreen img');
  const loadingScreen = document.querySelector('.loadingScreen');
  const finalLogo = document.querySelector('.logo-Ctn img');
  const topCtn = document.querySelector('.top-Ctn');
  
  // Calculate the position and size differences
  const topCtnRect = topCtn.getBoundingClientRect();
  const loadingLogoRect = loadingLogo.getBoundingClientRect();

  // Calculate the target position inside the top container
  const targetX = topCtnRect.left + -23.29; // margin-left: 77px
  const targetY = topCtnRect.top + -42.35; // margin-top: 80px

  // Calculate translation values
  const translateX = targetX - loadingLogoRect.left;
  const translateY = targetY - loadingLogoRect.top;

  // Calculate scale values
  const scaleX = 100.03 / 200; // Final width / Initial width
  const scaleY = 121.97 / 243.94; // Final height / Initial height
  
  loadingLogo.style.transformOrigin = "top left";
  
  setTimeout(() => {
      loadingLogo.style.transition = 'transform 1s, opacity 1s';
      loadingLogo.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      loadingScreen.style.transition = 'background-color 1s';
      loadingScreen.style.backgroundColor = 'transparent';
  }, 250);

  setTimeout(() => {
      finalLogo.style.opacity = '10';
  }, 1250);

  setTimeout(() => {
      loadingScreen.style.display = 'none';
      }, 1500);
};

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

function renderSignUp(){
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
        <div class="input-Ctn">
            <input class="input" type="text" placeholder="Name" id="signup-name" required autocomplete="current-Name">
            <img src="./assets/icon/person.webp" alt="">
        </div>
        <div class="input-Ctn">
            <input class="input" type="email" placeholder="Email" id="signup-email" required autocomplete="current-email">
            <img src="./assets/icon/mail.webp" alt="">
        </div>
          <div class="input-Ctn">
            <input class="input" type="password" placeholder="Password" id="signup-password" autocomplete="current-password" required oninput="updateToggleIcon('signup-password', 'signup-password-toggle')">
            <img src="./assets/icon/lock.webp" alt="" id="signup-password-toggle" onclick="togglePasswordVisibility('signup-password', 'signup-password-toggle')">
          </div>
        <div class="input-Ctn">
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
  `
}
