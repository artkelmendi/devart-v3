import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('.impeccable/review', { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://127.0.0.1:5173');
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(() => document.fonts.check('600 16px "Chakra Petch"')), 'Display font loaded');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `No horizontal overflow at ${width}px`);
    if (width === 1440 || width === 390) {
      await page.waitForTimeout(1000);
      await page.evaluate(() => { document.documentElement.dataset.motion = 'off'; document.getAnimations().forEach(animation => animation.finish()); });
      await page.screenshot({ path: `.impeccable/review/${width === 1440 ? 'desktop' : 'mobile'}.png`, fullPage: true });
      await page.screenshot({ path: `.impeccable/review/hero-${width}.png` });
    }
    console.log(`PASS responsive layout ${width}px`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173');
  for (const type of ['embedded', 'systems', 'web']) {
    await page.locator(`[data-code="${type}"]`).click();
    assert.equal(await page.locator(`[data-code="${type}"]`).getAttribute('aria-pressed'), 'true');
    assert.ok((await page.locator('#code-output').textContent()).length > 40);
  }
  assert.equal(await page.locator('.project').count(), 4);
  assert.equal(await page.locator('.project').nth(2).getAttribute('href'), 'https://artkelmendi.github.io/blueberries');
  assert.ok(await page.locator('.project-preview img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
  await page.locator('.nav-pill a[href="#expertise"]').click();
  await page.waitForFunction(() => location.hash === '#expertise');
  await page.locator('.service summary').first().click();
  assert.equal(await page.locator('.service').first().getAttribute('open'), '');
  await page.locator('.service summary').first().press('Enter');
  assert.equal(await page.locator('.service').first().getAttribute('open'), null);
  for (const link of await page.locator('a[href^="mailto:"]').all()) {
    assert.match(await link.getAttribute('href'), /^mailto:akelmendi029@gmail\.com/);
  }
  await page.locator('#motion-toggle').click();
  assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
  await page.locator('#copy-email').click();
  await page.waitForFunction(() => document.querySelector('#copy-status').textContent === 'EMAIL COPIED');
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'akelmendi029@gmail.com');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('#motion-toggle').disabled);
  assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
  assert.equal(await page.locator('#motion-toggle').isDisabled(), true);
  assert.deepEqual(errors, []);
  console.log('PASS navigation, mouse and keyboard disclosures, email targets, motion persistence, reduced motion, clipboard and browser console');
} finally {
  await browser.close();
}
