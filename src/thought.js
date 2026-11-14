export function initThought(isMotionEnabled) {
  const section = document.querySelector('.thought-section');
  const browser = section.querySelector('.thought-browser');
  const tabs = [...section.querySelectorAll('[role="tab"]')];
  const panels = [...section.querySelectorAll('[role="tabpanel"]')];
  const next = section.querySelector('.thought-next');
  const slider = section.querySelector('#signal-slider');
  const experiment = section.querySelector('.thought-experiment');
  const graph = section.querySelector('.signal-graph');
  const mobile = matchMedia('(max-width: 760px), (max-height: 800px)');
  let active = 0;
  let opened = 0;
  let manualScrollPosition = null;
  let inView = false;
  let entered = false;
  const svgNS = 'http://www.w3.org/2000/svg';
  // Deterministic diagram geometry: an illustration, not measured project data.
  const points = Array.from({ length: 26 }, (_, i) => ({
    x: 35 + ((Math.sin(i * 127.1 + 17) * 43758.5453 % 1 + 1) % 1) * 370,
    y: 30 + ((Math.sin(i * 311.7 + 41) * 19341.3711 % 1 + 1) % 1) * 240,
  }));
  points.forEach((point, i) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', i % 3 === 0 ? 4 : 2.5);
    graph.querySelector('.noise-points').append(circle);
    for (const offset of [7, 13]) {
      const target = points[(i + offset) % points.length];
      const line = document.createElementNS(svgNS, 'line');
      for (const [key, value] of Object.entries({ x1: point.x, y1: point.y, x2: target.x, y2: target.y })) line.setAttribute(key, value);
      graph.querySelector('.noise-connections').append(line);
    }
  });

  function setClarity(value) {
    const clarity = value / 100;
    slider.value = String(value);
    section.querySelector('#signal-value').value = `${value}%`;
    slider.setAttribute('aria-valuetext', `${value} percent clarity`);
    experiment.style.setProperty('--noise-opacity', String((1 - clarity) * .85));
    experiment.style.setProperty('--noise-scale', String(1 - clarity * .1));
    experiment.style.setProperty('--route-opacity', String(.25 + clarity * .75));
  }
  slider.addEventListener('input', () => setClarity(Number(slider.value)));
  setClarity(25);

  function showStage(stage, manual = false) {
    const oldOpened = opened;
    opened = Math.max(opened, stage);
    if (mobile.matches || !isMotionEnabled()) opened = 2;
    tabs.forEach((tab, i) => {
      tab.hidden = i > opened;
      tab.setAttribute('aria-selected', String(i === stage));
      tab.tabIndex = i === stage ? 0 : -1;
      panels[i].hidden = i !== stage;
      if (i > oldOpened && i <= opened && isMotionEnabled()) {
        tab.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    });
    next.disabled = stage === 2;
    section.querySelector('.thought-page-count').textContent = `0${stage + 1} — 03`;
    section.querySelector('.thought-scroll-hint').textContent = stage === 2 ? 'A LITTLE LESS. A LITTLE BETTER.' : 'SCROLL TO OPEN THE NEXT TAB';
    if (stage !== active) {
      if (stage === 2) setClarity(100);
      if (isMotionEnabled()) panels[stage].animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    active = stage;
    if (manual) manualScrollPosition = scrollY;
  }
  function advance() { showStage(Math.min(active + 1, 2), true); }
  next.addEventListener('click', advance);
  section.querySelectorAll('[data-thought-next]').forEach(button => button.addEventListener('click', () => {
    advance();
    tabs[active].focus({ preventScroll: true });
  }));
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showStage(i, true));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (i + 1) % 3;
      if (event.key === 'ArrowLeft') target = (i + 2) % 3;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = 2;
      if (target === undefined) return;
      event.preventDefault();
      showStage(target, true);
      tabs[target].focus({ preventScroll: true });
    });
  });

  function syncSignal() {
    if (isMotionEnabled() && inView && !document.hidden) graph.unpauseAnimations();
    else graph.pauseAnimations();
  }
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    syncSignal();
    if (!inView || entered) return;
    entered = true;
    if (isMotionEnabled()) browser.animate([
      { transform: 'translateY(60px) rotateX(7deg) scale(.94)', opacity: .5 },
      { transform: 'translateY(0) rotateX(0) scale(1)', opacity: 1 },
    ], { duration: 1100, easing: 'cubic-bezier(.16,1,.3,1)' });
  }, { threshold: .15 });
  observer.observe(browser);
  document.addEventListener('visibilitychange', syncSignal);

  function onScroll() {
    if (mobile.matches || !isMotionEnabled()) return;
    if (manualScrollPosition !== null) {
      if (Math.abs(scrollY - manualScrollPosition) < 160) return;
      manualScrollPosition = null;
    }
    // Never replace a panel while someone is using its keyboard or range input.
    if (section.contains(document.activeElement)) return;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, (120 - rect.top) / distance));
    const stage = Math.min(2, Math.floor(progress * 3));
    if (stage !== active) showStage(stage);
  }
  function refresh() {
    showStage(active);
    syncSignal();
  }
  mobile.addEventListener('change', refresh);
  refresh();
  return { onScroll, refresh };
}
