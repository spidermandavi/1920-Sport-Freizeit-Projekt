const menuButton = document.getElementById('menuButton');
const siteMenu = document.getElementById('siteMenu');
const menuLinks = siteMenu ? siteMenu.querySelectorAll('a') : [];

function setMenuState(isOpen) {
  if (!siteMenu || !menuButton) return;
  siteMenu.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
}

if (menuButton && siteMenu) {
  menuButton.addEventListener('click', () => {
    setMenuState(!siteMenu.classList.contains('is-open'));
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', (event) => {
    if (!siteMenu.classList.contains('is-open')) return;
    const clickedInsideMenu = siteMenu.contains(event.target);
    const clickedButton = menuButton.contains(event.target);
    if (!clickedInsideMenu && !clickedButton) setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}
/* EXPANDABLE PANELS */

const expandablePanels = document.querySelectorAll('.expandable-panel');

expandablePanels.forEach((panel) => {

  const openButton =
    panel.querySelector('.expand-button') ||
    panel.querySelector('.arrow-expand-button');

  const closeButton =
    panel.querySelector('.collapse-button') ||
    panel.querySelector('.arrow-collapse-button');

  if (!openButton || !closeButton) return;

  openButton.addEventListener('click', () => {

    expandablePanels.forEach((otherPanel) => {
      if (otherPanel !== panel) {
        otherPanel.classList.remove('expanded');
      }
    });

    panel.classList.add('expanded');

    setTimeout(() => {
      panel.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 120);
  });

  closeButton.addEventListener('click', () => {
    panel.classList.remove('expanded');
  });

});

