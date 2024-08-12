
//Floating Existing Customer//
document.addEventListener('DOMContentLoaded', function() {
  var contactDataButton = document.getElementById('contact-data');
  var contactCard = document.querySelector('.float-Ctn');
  var isVisible = false;

  contactDataButton.addEventListener('click', function() {
    contactDataButton.classList.toggle('clicked');
    
    if (isVisible) {
      contactCard.classList.remove('visible');
      contactCard.style.display = 'none';
    } else {
      contactCard.style.display = 'block';
      contactCard.classList.add('visible');
    }
    isVisible = !isVisible;
  });
});

//To close the Add New Contact//
function closeFullSize(){
  let close = document.querySelector('#next')
  close.addEventListener('click' ,(e) => {
  if(e.target == close){
     document.querySelector('#FullSize').classList.add('d-none')
   }
   });
}
//To close the Add New Contact(X-Btn)//
function closeFullSize2(){
  const closeButton = document.querySelector('#closeBtn, #Cancel-Btn');
  if (closeButton) {
      closeButton.addEventListener('click', (e) => {
          if (e.target == closeButton)
          document.querySelector('#FullSize').classList.add('d-none');
      });
  }
}
//To close the Add New Contact(Cancel-Btn)//
function closeFullSize3(){
  const closeButton = document.querySelector('#Cancel-Btn');
  if (closeButton) {
      closeButton.addEventListener('click', (e) => {
          if (e.target == closeButton)
          document.querySelector('#FullSize').classList.add('d-none');
      });
  }
}
 //Remove the Display:None//
function remove(){
   document.querySelector('#FullSize').classList.remove('d-none')
}
//render Function//
function floatCard(){
  let container = document.getElementById('FullSize');
  container.innerHTML = renderFloatCard();

  closeFullSize();
  closeFullSize2();
  closeFullSize3();
  remove();
}


//render Card: in a extra Function//
function renderFloatCard() {
  return `
  <div id="next" class="Full-Container">
    <div class="AddContactCard">

    <div class="leftSide">
      <img src="icon/Join logo vector.svg" alt="">
      <div class="innerAddContact">
        <h1>Add contact</h1>
        <p>Task are better with a team!</p>
        <div class="TaskLine"></div>
      </div>
    </div>
    
    <div class="rightSide">
       
      <div  class="close-icon"><img id="closeBtn" src="./icon/close.svg" alt=""></div>
       
    <div class="rightSide-middle">
          <img class="profil-img" src="./icon/person.svg" alt="">
          <form action="">
            <div>
            <input type="text" placeholder="Name">
            <img class="iconInput" src="./icon/Person1.webp" alt="">
            </div>
            <div>
            <input type="email" placeholder="Email">
            <img class="iconInput" src="./icon/mail.webp" alt="">
            </div>
            <div>
            <input type="text" placeholder="Phone">
            <img class="iconInput" src="./icon/call.svg" alt="">
            </div>
          </form>
      </div>
       
      <div class="ctn-button">
        <button id="Cancel-Btn" class="cancel">Cancel
          <img src="./icon/close.svg" alt="">
        </button>
        <button class="create">Create contact
          <img src="./icon/check.webp" alt="">
        </button>
      </div>
    </div>
  </div>
</div>
  `
}




 

