import './thought.css';
import { initThought } from './thought.js';
import './hero-formation.css';
import { initHeroFormation } from './hero-formation.js';

let thoughtExperience;
let heroFormation;
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('#motion-toggle');
let userPreference;
try { userPreference = localStorage.getItem('devart-motion'); } catch { /* Private storage can be unavailable. */ }
let motionEnabled = !reducedMotion.matches && userPreference !== 'off';

function setMotion(enabled) {
  motionEnabled = enabled && !reducedMotion.matches;
  if (!motionEnabled) document.getAnimations().forEach(animation => animation.cancel());
  root.dataset.motion = motionEnabled ? 'on' : 'off';
  toggle.setAttribute('aria-pressed', String(!motionEnabled));
  toggle.setAttribute('aria-label', motionEnabled ? 'Pause animation' : 'Enable animation');
  toggle.querySelector('span').textContent = motionEnabled ? 'ON' : 'OFF';
  toggle.disabled = reducedMotion.matches;
  toggle.title = reducedMotion.matches ? 'Reduced motion follows your device settings' : '';
  thoughtExperience?.refresh();
  heroFormation?.refresh();
}
setMotion(motionEnabled);
toggle.addEventListener('click', () => {
  setMotion(!motionEnabled);
  userPreference = motionEnabled ? 'on' : 'off';
  try { localStorage.setItem('devart-motion', userPreference); } catch { /* The setting still works for this visit. */ }
});
reducedMotion.addEventListener('change', () => setMotion(userPreference !== 'off'));
thoughtExperience = initThought(() => motionEnabled);
heroFormation = initHeroFormation(() => motionEnabled);

const snippets = {
  embedded: { file: 'embedded.cpp', code: '// Close to the hardware.\nvoid loop() {\n  auto signal = sensor.read();\n  controller.update(signal);\n}' },
  systems: { file: 'systems.ts', code: '// Make the pieces work together.\nconst system = connect({\n  input: yourIdea,\n  output: somethingUseful\n});' },
  web: { file: 'web.tsx', code: '// Built for the person using it.\nfunction Experience() {\n  return <Website\n    thoughtful responsive\n  />;\n}' },
};
document.querySelectorAll('[data-code]').forEach(button => {
  button.addEventListener('click', () => {
    const snippet = snippets[button.dataset.code];
    document.querySelectorAll('[data-code]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    document.querySelector('#code-file').textContent = snippet.file;
    const output = document.querySelector('#code-output');
    output.textContent = snippet.code;
    if (motionEnabled) output.animate([
      { opacity: .3, transform: 'translateY(5px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 350, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    revealObserver.unobserve(entry.target);
    if (!motionEnabled) return;
    const element = entry.target;
    const isHeading = element.matches('h1 > span, h2');
    element.animate(isHeading ? [
      { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(18px)' },
      { clipPath: 'inset(0 0 0% 0)', transform: 'translateY(0)' },
    ] : [
      { opacity: .35, transform: `translateY(${element.matches('.project') ? 35 : 15}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: element.matches('h1 > span') ? 1800 : isHeading ? 850 : 700, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
}, { threshold: .12 });
document.querySelectorAll('h1 > span, h2, .hero-intro, .hero-cta, .hero-meta, .project, .service, .about-copy, .about-signature, .contact-bottom, .site-footer').forEach(element => revealObserver.observe(element));

document.querySelectorAll('.service').forEach(service => {
  service.addEventListener('toggle', () => {
    if (!service.open || !motionEnabled) return;
    service.querySelector('.service-body').animate([
      { opacity: 0, transform: 'translateY(-10px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 400, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
});

const visibilityObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting));
});
document.querySelectorAll('.hero, .marquee-section').forEach(element => visibilityObserver.observe(element));
document.addEventListener('visibilitychange', () => { root.dataset.hidden = String(document.hidden); });

let scrollFrame;
function updateProgress() {
  const scrollRange = root.scrollHeight - innerHeight;
  document.querySelector('.scroll-progress').style.transform = `scaleX(${scrollRange > 0 ? scrollY / scrollRange : 0})`;
  thoughtExperience?.onScroll();
  scrollFrame = undefined;
}
addEventListener('scroll', () => { scrollFrame ??= requestAnimationFrame(updateProgress); }, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();

const copyButton = document.querySelector('#copy-email');
const status = document.querySelector('#copy-status');
let statusTimeout;
copyButton.addEventListener('click', async () => {
  clearTimeout(statusTimeout);
  try {
    await navigator.clipboard.writeText('akelmendi029@gmail.com');
    status.textContent = 'EMAIL COPIED';
  } catch {
    status.textContent = 'Select the email to copy it.';
  }
  statusTimeout = setTimeout(() => { status.textContent = ''; }, 3500);
});

const links = [...document.querySelectorAll('.nav-pill a')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    links.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
document.querySelector('#year').textContent = new Date().getFullYear();
