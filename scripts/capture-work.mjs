import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('public/work', { recursive: true });
const browser = await chromium.launch();
await Promise.all(['curriarch.com', 'aureberries.com', 'gphotelsupplies.com', 'ecc-ks.com'].map(async domain => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  try {
    const url = domain === 'aureberries.com' ? 'https://artkelmendi.github.io/blueberries' : `https://${domain}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(12000);
    console.log(JSON.stringify({ domain, title: await page.title(), text: (await page.locator('body').innerText()).slice(0, 1500) }));
    await page.screenshot({ path: `public/work/${domain}.png` });
    await writeFile(`public/work/${domain}.png.json`, JSON.stringify({ origin: `Screenshot of ${url}, supplied by the user as their own work. Captured 2026-11-14.`, source: url }, null, 2));
  } catch (error) { console.log(`${domain}: ${error.message}`); }
  finally { await page.close(); }
}));
await browser.close();
