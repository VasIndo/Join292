document.addEventListener("DOMContentLoaded", () => {
    const icons = [
      { parentId: 'to-do', iconId: 'summary-to-do-icon', hoverSrc: 'assets/img/summary-to-do-hover.svg', defaultSrc: 'assets/img/summary-to-do.svg' },
      { parentId: 'done', iconId: 'summary-done-icon', hoverSrc: 'assets/img/summary-done-hover.svg', defaultSrc: 'assets/img/summary-done.svg' }
    ];
  
    icons.forEach(({ parentId, iconId, hoverSrc, defaultSrc }) => {
      const parentElement = document.getElementById(parentId);
      const iconElement = document.getElementById(iconId);
  
      if (parentElement && iconElement) {
        parentElement.addEventListener('mouseenter', () => {
          iconElement.src = hoverSrc;
        });
  
        parentElement.addEventListener('mouseleave', () => {
          iconElement.src = defaultSrc;
        });
      }
    });
  });
  