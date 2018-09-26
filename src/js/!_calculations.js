// What are the browser dimensions?
let browser = {
  width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
};

function isElement(element) {
  return element instanceof Element;
}
