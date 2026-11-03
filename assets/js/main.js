document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typingEffect = document.querySelector('.typing-effect');
if (typingEffect && !reduceMotion) {
  const typingOutput = typingEffect.querySelector('.typing-output');
  const fullText = typingOutput.textContent;
  let typingTimer;
  const clearTyping = () => {
    window.clearTimeout(typingTimer);
    typingEffect.classList.remove('has-typing-caret');
    typingOutput.textContent = '';
  };
  const startTyping = () => {
    window.clearTimeout(typingTimer);
    typingOutput.textContent = '';
    typingEffect.classList.add('has-typing-caret');
    let typedCharacters = 0;
    const typeNextCharacter = () => {
      typedCharacters += 1;
      typingOutput.textContent = fullText.slice(0, typedCharacters);
      if (typedCharacters < fullText.length) {
        typingTimer = window.setTimeout(typeNextCharacter, 58);
      }
    };
    typingTimer = window.setTimeout(typeNextCharacter, 240);
  };
  if ('IntersectionObserver' in window) {
    const typingObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startTyping();
        else clearTyping();
      });
    }, { rootMargin: '-12% 0px -12% 0px', threshold: 0.25 });
    typingObserver.observe(typingEffect);
  } else {
    startTyping();
  }
}
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('#education .section-heading, #education .education-entry, #education .experience-timeline, #project .section-heading, #project .project-card, #about > div:first-child, #about .about-copy, #contact');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  const revealOrder = new Map();
  revealTargets.forEach(target => {
    const sectionId = target.closest('section')?.id || 'page';
    const delay = revealOrder.get(sectionId) || 0;
    target.style.setProperty('--reveal-delay', `${delay}ms`);
    revealOrder.set(sectionId, Math.min(delay + 60, 180));
    target.classList.add('scroll-reveal');
    if (target.getBoundingClientRect().top <= window.innerHeight * 0.85) {
      target.classList.add('is-visible');
    }
    revealObserver.observe(target);
  });
}
const scrollProgressFill = document.querySelector('.scroll-progress span');
if (scrollProgressFill) {
  let progressUpdateScheduled = false;
  const updateScrollProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    scrollProgressFill.style.transform = `scaleX(${progress})`;
    progressUpdateScheduled = false;
  };
  const scheduleProgressUpdate = () => {
    if (progressUpdateScheduled) return;
    progressUpdateScheduled = true;
    window.requestAnimationFrame(updateScrollProgress);
  };
  window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
  window.addEventListener('resize', scheduleProgressUpdate, { passive: true });
  updateScrollProgress();
}
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

const internshipGallery = document.getElementById('internship-gallery-dialog');
const internshipGalleryButton = document.querySelector('.internship-more-button');
if (internshipGallery && internshipGalleryButton && typeof internshipGallery.showModal === 'function') {
  internshipGalleryButton.addEventListener('click', () => internshipGallery.showModal());
  internshipGallery.querySelector('.internship-gallery-close').addEventListener('click', () => internshipGallery.close());
  internshipGallery.addEventListener('click', event => {
    const bounds = internshipGallery.getBoundingClientRect();
    if (event.target === internshipGallery && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) internshipGallery.close();
  });
  internshipGallery.addEventListener('close', () => internshipGalleryButton.focus());
}


function setupVideoDemo(openId, dialogId, closeSelector) {
  const openButton = document.getElementById(openId);
  const dialog = document.getElementById(dialogId);
  const video = dialog?.querySelector('video');
  const closeButton = dialog?.querySelector(closeSelector);
  if (!openButton || !dialog || !video || !closeButton || typeof dialog.showModal !== 'function') return;

  openButton.addEventListener('click', () => {
    dialog.showModal();
    const playback = video.play();
    playback?.catch(() => {});
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    openButton.focus();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
  });
}

setupVideoDemo('freelance-demo-open', 'freelance-demo-dialog', '.freelance-demo-close');
setupVideoDemo('thesis-demo-open', 'thesis-demo-dialog', '.project-demo-close');
