const openSidebar = () => {
  document.querySelector('.sidebar').setAttribute('data-state', 'is-active');
  document.documentElement.style.overflow = `hidden`;
};

const closeSidebar = () => {
  document.querySelector('.sidebar').setAttribute('data-state', 'not-active');
  document.documentElement.style.overflow = ``;
};
