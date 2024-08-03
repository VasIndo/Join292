document.addEventListener("DOMContentLoaded", () => {
    const taskSections = [
      { id: 'to-do-plus', hoverSrc: 'assets/img/plus-button-blue.svg', defaultSrc: 'assets/img/plus-button.svg' },
      { id: 'in-progress-plus', hoverSrc: 'assets/img/plus-button-blue.svg', defaultSrc: 'assets/img/plus-button.svg' },
      { id: 'await-feedback-plus', hoverSrc: 'assets/img/plus-button-blue.svg', defaultSrc: 'assets/img/plus-button.svg' }
    ];
  
    taskSections.forEach(section => {
      const element = document.getElementById(section.id);
  
      if (element) {
        element.addEventListener('mouseenter', () => {
          element.src = section.hoverSrc;
        });
  
        element.addEventListener('mouseleave', () => {
          element.src = section.defaultSrc;
        });
      }
    });
  });

  function activeDetailCard() {
    document.getElementById('card-detail-view').classList.remove("active-card");
  }

  function hideDetailCard() {
    document.getElementById('card-detail-view').classList.add("active-card");
  }