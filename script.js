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
const yearContent = document.getElementById("yearContent");

const contentData = {
  "1920": "Aufgrund der Rolle Deutschlands im ersten Weltkrieg wurde Deutschland 1920/1924 von den Olympischen Speielen ausgeschlossen. Die Olympischen Spielen von 1920 symbolisierten Frieden. Die USA hat mit 95 Medaillen am Besten abgeschnitten. Es wurde generell zwischen die Winter- und Sommerspielen unterschieden.",
  "1924": "Deutschland durfte wieder nicht teilnehmen. Die USA hat mit 99 Medaillen wieder am Besten abgeschnitten.",
  "1928": "Hier durfte Deutschland zum ersten Mal nach 16 Jahren wieder an den Olympischen Spielen teilnehmen. Die Winterspiele fanden vom 11. bis zum 19. Februar in St. Moritz (Schweiz) statt. Deutschland errreichte in St. Moritz den 8. Platz. Die Sommerspiele fanden vom 28. Juli bis zum 12. August in Amsterdam (Niederlande) statt. Deutschland stand im Medaillenspiegel auf dem 2. Platz, mit insgesamt 31 Medaillen. Die Olympischen Spiele 1928 waren ein historischer Moment, da Frauen teilnehmen durften und auch viele Medaillen gewonnen haben."
};

const yearBoxes = document.querySelectorAll(".year-box");

if (yearContent && yearBoxes.length > 0) {
  yearBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const year = box.dataset.year;

      if (contentData[year]) {
        yearContent.textContent = contentData[year];
      }
    });
  });
}
