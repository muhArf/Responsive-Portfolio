document.documentElement.classList.add('js');
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-menu');
function closeMenu() {
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
const links = [...menu.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
document.getElementById('year').textContent = new Date().getFullYear();

const viewer = document.getElementById('image-viewer');
const viewerImage = document.getElementById('viewer-image');
let imageTrigger;
if (viewer && typeof viewer.showModal === 'function') {
  document.querySelectorAll('.gallery-link').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      imageTrigger = link;
      viewerImage.src = link.href;
      viewerImage.alt = link.querySelector('img').alt;
      document.getElementById('viewer-caption').textContent = link.closest('figure').querySelector('figcaption strong').textContent;
      viewer.showModal();
    });
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    const bounds = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close();
  });
  viewer.addEventListener('close', () => {
    viewerImage.removeAttribute('src');
    imageTrigger?.focus();
  });
}


const demoButton = document.querySelector('.demo-play');
const demoVideo = document.getElementById('thesis-video');
if (demoButton && demoVideo) {
  const demoStatus = document.querySelector('.demo-status');
  demoButton.addEventListener('click', () => {
    if (!demoVideo.getAttribute('src')) demoVideo.src = demoVideo.dataset.src;
    demoVideo.hidden = false;
    demoButton.hidden = true;
    demoVideo.focus();
    demoVideo.play().catch(() => {
      demoStatus.textContent = 'Press play on the video controls to start the demonstration.';
    });
  });
  demoVideo.addEventListener('playing', () => { demoStatus.textContent = ''; });
  demoVideo.addEventListener('error', () => {
    demoStatus.textContent = 'The video could not load. Please check your connection and try again.';
    demoButton.hidden = false;
    demoVideo.removeAttribute('src');
  });
  demoVideo.closest('details').addEventListener('toggle', event => {
    if (!event.target.open) demoVideo.pause();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) demoVideo.pause();
  });
}
