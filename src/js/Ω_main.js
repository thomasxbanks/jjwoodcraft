'use strict';

window.onload = () => {
  document.documentElement.classList.replace('no-js', 'is-js'); // Tells us that JS isn't disabled in the browser.

  if (window.location.href.indexOf('local') === -1) {
    // In case we forget to remove
    // the .redline class
    // or the development css
    // prior to production, this will remove it for us.
    // Presumes we're using a xxx.local or localhost:PORT syntax development URI
    // If we aren't, amend the string in the includes() function
    document.documentElement.classList.remove('redline');
    document.getElementById('devCss').outerHTML = '';
  }
};

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

    const article = document.querySelector('.post .card');
    if (article) {
      var articleHeight = parseInt(window.getComputedStyle(article).getPropertyValue('height'));
      var bottom = articleHeight - browser.height;
      var pxPerc = browser.width / 100;
      var percentage;
      if (scrollTop > 0 && scrollTop < articleHeight - browser.height) {
        percentage = pxPerc * (Math.max(0, Math.min(1, scrollTop / bottom)) * 100);
      }
      if (scrollTop <= 0) {
        percentage = 0;
      }
      if (scrollTop >= bottom) {
        percentage = browser.width;
      }
      console.log(pxPerc, percentage, browser.width, `${percentage}px`);
      document.querySelector('#indicator').style.width = `${percentage}px`;
    }

    // Show/hide Masthead
    if (CurrentScroll > browser.height / 2) {
      masthead.setAttribute('data-state', 'is-active');
    } else {
      masthead.setAttribute('data-state', 'not-active');
    }

    CurrentScroll = scrollTop; // Updates current scroll position
  })
);
