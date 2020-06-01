'use strict';

const masthead = document.querySelector('#masthead');

const handleColumnAdjust = () => {
  const macyInstance = Macy({
    container: '.tease_container',
    margin: 16,
    useContainerForBreakpoints: true,
    breakAt: {
      600: {
        columns: 1,
      },
      768: {
        columns: 2,
      },
      1200: {
        columns: 3,
      },
    },
  });
  macyInstance.recalculate();
};

const setPadding = () => {
  const homepageHero = document.querySelector('.homepage-hero');
  const mastheadHeight = window.getComputedStyle(masthead, null).getPropertyValue('height');
  document.body.style.paddingTop = mastheadHeight;
  if (homepageHero && mastheadHeight) {
    homepageHero.style.padding = `${parseInt(mastheadHeight.slice(0, -2), 10) / 2}px`;
  }
};

const toggleDropDown = (event) => {
  const { target } = event;
  const { parentElement } = target;
  const { active } = parentElement.dataset;
  const state = active === 'true';
  parentElement.dataset.active = !state;
};

const initDropDown = () => {
  const dropDown = masthead.querySelector('[data-action="toggle-nav"]');
  dropDown.addEventListener('click', toggleDropDown);
};

window.onload = () => {
  document.documentElement.classList.replace('no-js', 'is-js'); // Tells us that JS isn't disabled in the browser.
  setPadding();
  handleColumnAdjust();
  initDropDown();
};

window.addEventListener('resize', handleColumnAdjust);
window.addEventListener('resize', setPadding);

let CurrentScroll = 0;
window.addEventListener(
  'scroll',
  throttle(() => {
    const scrollTop = window.scrollY;

    if (scrollTop > CurrentScroll) {
      // Scroll down the page
      masthead.setAttribute('data-visibility', 'false');
    } else {
      // Scroll up the page
      masthead.setAttribute('data-visibility', 'true');
    }

    CurrentScroll = scrollTop; // Updates current scroll position
  })
);
