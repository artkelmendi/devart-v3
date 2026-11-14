const WIDTH = 520;
const HEIGHT = 320;
const DURATION = 19000;
const paths = [
  'M505 408 L601 248 C612 229 641 229 653 248 L749 408 L627 670 Z',
  'M482 450 L537 584 L430 774 C420 791 402 802 381 802 L304 802 C285 802 275 788 285 771 Z',
  'M773 450 L973 771 C983 788 975 802 955 802 L874 802 C853 802 835 791 825 774 L717 584 Z',
];
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const random = seed => { const value = Math.sin(seed * 127.1 + 31.7) * 43758.5453; return value - Math.floor(value); };

export function initHeroFormation(isMotionEnabled) {
  const figure = document.querySelector('.hero-formation');
  const canvas = figure.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const caption = figure.querySelector('#formation-caption');
  const replay = figure.querySelector('#formation-replay');
  if (!ctx) return { refresh() {} };
  const mark = new Image();
  let ready = false;
  let elapsed = 0;
  let previousTime;
  let frame;
  let visible = false;
  let completed = false;
  let phase = -1;
  const particles = [];
  const labels = ['Every idea starts somewhere.', 'A connection. Then another.', 'The pieces find their place.', 'From a little curiosity. Something real.'];

  function resize() {
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(WIDTH * scale);
    canvas.height = Math.round(HEIGHT * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    if (ready) draw(elapsed);
  }

  function draw(time) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const seconds = time / 1000;
    const assembly = smooth((time - 3000) / 9500);
    const solid = smooth((time - 12000) / 3000);
    const newPhase = time < 3500 ? 0 : time < 10500 ? 1 : time < 15000 ? 2 : 3;
    if (phase !== newPhase) {
      phase = newPhase;
      figure.dataset.phase = String(phase);
      caption.textContent = labels[phase];
    }

    // Two fine signal arcs slowly resolve around the emerging brand geometry.
    const guideOpacity = Math.sin(assembly * Math.PI) * .22;
    ctx.strokeStyle = `rgba(94,98,102,${guideOpacity})`;
    ctx.lineWidth = .6;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.ellipse(260, 148, 180 - i * 25, 66 + i * 25, -.35 + i * .7, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Deliberately staggered particles follow curved trajectories into the exact supplied SVG.
    for (const p of particles) {
      const local = smooth((time - 2600 - p.delay) / 9400);
      const drift = (1 - local) * 7;
      const curl = Math.sin(local * Math.PI) * p.bend;
      const x = p.startX + (p.x - p.startX) * local + Math.sin(seconds * .35 + p.seed) * drift + curl;
      const y = p.startY + (p.y - p.startY) * local + Math.cos(seconds * .3 + p.seed) * drift - curl * .35;
      ctx.globalAlpha = (1 - solid) * (.65 + local * .3);
      ctx.fillStyle = p.blue ? '#78bed6' : '#111111';
      const size = 1.7 + local * .3;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
    ctx.globalAlpha = solid;
    ctx.drawImage(mark, 168, 70, 180, 148.5);
    ctx.globalAlpha = 1;

    // The finished mark sends a single pulse down a newly drawn connection.
    const route = smooth((time - 14300) / 3200);
    if (route > 0) {
      ctx.strokeStyle = '#d9dcdf';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(260, 237);
      ctx.lineTo(260, 237 + 65 * route);
      ctx.stroke();
      const pulse = smooth((time - 16500) / 2300);
      ctx.fillStyle = '#9cdef4';
      ctx.fillRect(257, 234 + 65 * pulse, 6, 6);
    }

    // Code fragments are faint context during the opening, never a wall of text.
    const fragmentAlpha = (1 - smooth((time - 4500) / 6500)) * .55;
    if (fragmentAlpha > 0) {
      ctx.globalAlpha = fragmentAlpha;
      ctx.fillStyle = '#5e6266';
      ctx.font = '11px "Space Mono", monospace';
      ctx.fillText('idea', 40, 72);
      ctx.fillText('{ curiosity }', 345, 45);
      ctx.fillText('connect()', 350, 266);
      ctx.fillText('0 → 1', 63, 257);
      ctx.globalAlpha = 1;
    }
  }

  function tick(time) {
    frame = undefined;
    if (!ready || !visible || document.hidden || !isMotionEnabled() || completed) return;
    if (previousTime !== undefined) elapsed = Math.min(DURATION, elapsed + Math.min(time - previousTime, 80));
    previousTime = time;
    draw(elapsed);
    completed = elapsed >= DURATION;
    if (!completed) frame = requestAnimationFrame(tick);
  }

  function refresh() {
    replay.disabled = !isMotionEnabled();
    if (!ready) return;
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    previousTime = undefined;
    if (!isMotionEnabled()) {
      elapsed = DURATION;
      completed = true;
      draw(elapsed);
      return;
    }
    if (visible && !document.hidden && !completed) frame = requestAnimationFrame(tick);
  }
  replay.addEventListener('click', () => {
    if (!isMotionEnabled()) return;
    elapsed = 0;
    completed = false;
    draw(0);
    refresh();
  });

  mark.onload = () => {
    const mask = document.createElement('canvas');
    mask.width = WIDTH;
    mask.height = HEIGHT;
    const maskContext = mask.getContext('2d');
    maskContext.translate(168 - 269 * .25, 70 - 221 * .25);
    maskContext.scale(.25, .25);
    paths.forEach(path => maskContext.fill(new Path2D(path)));
    const pixels = maskContext.getImageData(0, 0, WIDTH, HEIGHT).data;
    for (let y = 70; y < 220; y += 4) {
      for (let x = 168; x < 350; x += 4) {
        if (pixels[(y * WIDTH + x) * 4 + 3] < 128) continue;
        const index = particles.length;
        const angle = random(index + 3) * Math.PI * 2;
        const radius = 95 + random(index + 11) * 150;
        particles.push({ x, y, startX: 260 + Math.cos(angle) * radius, startY: 150 + Math.sin(angle) * radius * .55, delay: random(index + 17) * 1200, bend: (random(index + 23) - .5) * 110, seed: index, blue: index % 17 === 0 });
      }
    }
    ready = true;
    resize();
    figure.classList.add('is-ready');
    refresh();
  };
  mark.src = import.meta.env.BASE_URL + 'assets/devart-symbol.svg';
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    refresh();
  }, { threshold: .15 }).observe(figure);
  document.addEventListener('visibilitychange', refresh);
  addEventListener('resize', resize);
  return { refresh };
}
