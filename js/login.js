function signUp() {
  let signUp = document.getElementById('RegisterWindow');
  document.getElementById('formId').classList.add('d-none')
  document.getElementById('RegisterWindow').classList.remove('d-none')
  document.getElementById('signUpNone').classList.add('d-none')
  signUp.innerHTML = "";
  signUp.innerHTML = renderSignUp();
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
  setTimeout(() => {
    loadingLogo.classList.add('logo-move');
    loadingScreen.style.backgroundColor = 'transparent';
  }, 250);
  setTimeout(() => {
    finalLogo.style.opacity = '1';
    finalLogo.style.display = '';
  }, 1250);
  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, 1500);
};

function renderSignUp(){
return ` 
        <div class="registration-Ctn">
          <div class="regiCtn">
            <img onclick="backtoSignUp()" src="./icon/arrow-left-line.webp" alt="">
            <div class="h2Ctn">
            <h2>Sign up</h2>
            </div>
          </div>
          <div class="underline-Ctn2"></div>

          <div class="CtnInput2">
              <form class="formRegi" action="">
                <div class="input-Ctn">
                  <input class="input" type="text" placeholder="Name">
                  <img src="./icon/person.webp" alt="">
                </div>
                <div class="input-Ctn">
                  <input class="input" type="text" placeholder="Email">
                  <img src="./icon/mail.webp" alt="">
                </div>
                <div class="input-Ctn">
                  <input class="input" type="password" placeholder="Password">
                  <img src="./icon/lock.webp" alt="">
                </div>
                <div class="input-Ctn">
                  <input class="input" type="password" placeholder="Confirm Password">
                  <img src="./icon/lock.webp" alt="">
                </div>
              </form>
          </div>

          <div class="remember-Ctn2">
            <img src="./icon/check.webp" alt="">
            <p>I accept the Privacy Policy</p>
          </div>
          
          <div class="SignUpButton-Ctn">
          <button class="SignUpButton">Sign up</button>
          </div> 

        </div>
      </div>
          
  `
}