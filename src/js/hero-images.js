// Load hero images _after_ everything else has loaded (including thumbnails)
// This greatly improves page loading speeds
const heroImages = document.querySelectorAll('.hero-full');
heroImages.forEach((heroImage) => {
  const src = heroImage.getAttribute('data-src');
  const thumb = heroImage.previousElementSibling;
  heroImage.setAttribute('src', src);
  heroImage.onload = () => {
    heroImage.classList.remove('hide');
    thumb.classList.add('hide');
  };
});
