/*eslint-disable no-unused-vars*/
/* disabling the EsLint for unused functions as these are called inline */

// Make a button enabled
let enableButton = (target) => {
  document.querySelector(target).prop('disabled', false);
};

// Make a button disabled
let disableButton = (target) => {
  document.querySelector(target).prop('disabled', true);
};

// Destroy element
let destroyElement = (element) => {
  document.querySelector(element).outerHTML = '';
};

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */ &&
    rect.right <=
      (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}

const makeElementIsActive = (element) => {
  element.setAttribute('data-state', 'is-active');
};

const makeElementNotActive = (element) => {
  element.setAttribute('data-state', 'not-active');
};

const makeElementIsVisible = (element) => {
  element.setAttribute('data-state', 'is-visible');
};

const makeElementNotVisible = (element) => {
  element.setAttribute('data-state', 'not-visible');
};

const removeParagraphFromImages = () => {
  let imgs = document.querySelectorAll('img');
  imgs.forEach((img) => {
    var parent = img.parentElement;
    if (parent.tagName === 'P') {
      var container = img.parentElement.parentElement;
      var image = parent.firstChild;
      container.insertBefore(image, parent);
      parent.outerHTML = '';
    }
  });
};
