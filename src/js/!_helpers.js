/*eslint-disable no-unused-vars*/

const throttle = (action, wait = 100) => {
  let time = Date.now();
  return function() {
    if (time + wait - Date.now() < 0) {
      action();
      time = Date.now();
    }
  };
};
