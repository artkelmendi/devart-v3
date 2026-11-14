import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:5173');
  await page.evaluate(() => document.fonts.ready);
  const bounds = await page.locator('#thought').evaluate(element => ({ top: element.offsetTop, height: element.offsetHeight }));
  const moveTo = async progress => {
    await page.evaluate(({ top, height, progress }) => window.scrollTo({ top: top - 120 + (height - innerHeight) * progress, behavior: 'instant' }), { ...bounds, progress });
    await page.waitForTimeout(1250);
  };
  await moveTo(.05);
  assert.equal(await page.locator('#thought-tab-0').getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('#thought-tab-1').isVisible(), false);
  await moveTo(.4);
  assert.equal(await page.locator('#thought-tab-1').getAttribute('aria-selected'), 'true');
  await page.locator('#signal-slider').fill('85');
  assert.equal(await page.locator('#signal-value').textContent(), '85%');
  await page.locator('#signal-slider').fill('35');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '.impeccable/review/thought-desktop.png' });
  await page.locator('#signal-slider').evaluate(element => element.blur());
  await moveTo(.8);
  assert.equal(await page.locator('#thought-tab-2').getAttribute('aria-selected'), 'true');
  assert.equal(await page.locator('#signal-slider').inputValue(), '100');
  await page.locator('#thought-tab-2').press('Home');
  assert.equal(await page.locator('#thought-tab-0').getAttribute('aria-selected'), 'true');
  await page.locator('#thought-tab-0').press('ArrowRight');
  assert.equal(await page.locator('#thought-panel-1').isVisible(), true);
  await page.locator('#signal-slider').focus();
  await page.locator('#signal-slider').press('ArrowLeft');
  assert.equal(await page.locator('#signal-slider').inputValue(), '99');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#thought .thought-sticky').evaluate(el => getComputedStyle(el).position), 'relative');
  assert.equal(await page.locator('.signal-graph').evaluate(el => el.animationsPaused()), true);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 1200 });
    await page.locator('#thought-tab-1').click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.locator('#thought [role="tab"]:visible').count(), 3);
    await page.evaluate(() => window.scrollTo({ top: document.querySelector('.thought-browser').getBoundingClientRect().top + scrollY - 155, behavior: 'instant' }));
    await page.screenshot({ path: `.impeccable/review/thought-${width}.png` });
  }
  assert.deepEqual(errors, []);
  console.log('PASS scroll-generated tabs, slider, keyboard navigation, reduced motion, mobile layout and browser errors');
} finally { await browser.close(); }
