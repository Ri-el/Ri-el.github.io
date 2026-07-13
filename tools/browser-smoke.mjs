#!/usr/bin/env node

import assert from 'node:assert/strict';

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: node tools/browser-smoke.mjs <file:///.../index.html|http://localhost:8080/> [...]');
  process.exitCode = 2;
} else {
  const { chromium } = await import('playwright').catch(error => {
    throw new Error(`Browser smoke test requires an existing Playwright installation: ${error.message}`);
  });

  const browser = await chromium.launch({ headless: true });
  const cases = [
    ['Jewels', 'Ruby'],
    ['Amulets', 'Crimson Amulet'],
    ['Rings', 'Golden Hoop'],
    ['Gloves', 'Stocky Mitts'],
    ['Body Armours', 'Rusted Cuirass'],
    ['Bows', 'Crude Bow'],
    ['Life Flasks', 'Lesser Life Flask'],
    ['Charms', 'Thawing Charm'],
  ];

  try {
    for (const target of targets) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const runtimeErrors = [];
      page.on('pageerror', error => runtimeErrors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
      });

      await page.goto(target, { waitUntil: 'load' });
      if (/^https?:/i.test(target)) {
        await page.evaluate(async () => {
          for (const registration of await navigator.serviceWorker.getRegistrations()) await registration.unregister();
          for (const name of await caches.keys()) await caches.delete(name);
        });
        await page.reload({ waitUntil: 'load' });
      }

      const startup = await page.evaluate(() => ({
        modBaseCount: window.MOD_BASES ? Object.keys(window.MOD_BASES).length : 0,
        normalizedPresent: !!window.COE_NORMALIZED_DATA,
        currencyIndexPresent: !!window.CRAFTING_CURRENCY_INDEX,
        craftRegistryLength: window.CRAFTING_CURRENCY_INDEX?.craftRegistry?.length ?? null,
        craftTabsLength: window.CRAFTING_CURRENCY_INDEX?.craftTabs?.length ?? null,
        craftForgePresent: !!window.CraftForge,
        normalizedCounts: window.CraftForge?.getNormalizedIndexCounts?.() ?? null,
        toast: document.getElementById('error-toast')?.textContent || '',
      }));
      assert(startup.modBaseCount > 0, `${target}: MOD_BASES did not initialize`);
      assert(startup.normalizedPresent, `${target}: normalized data did not initialize`);
      assert(startup.currencyIndexPresent, `${target}: currency index did not initialize`);
      assert.equal(startup.craftRegistryLength, 45, `${target}: visible runtime registry length`);
      assert.equal(startup.craftTabsLength, 10, `${target}: tab length`);
      assert(startup.craftForgePresent && startup.normalizedCounts, `${target}: CraftForge bridge/indexes unavailable`);
      assert.equal(startup.toast, '', `${target}: startup toast`);

      const results = [];
      for (const [classLabel, expectedBase] of cases) {
        const card = page.locator('.cat-card', { hasText: classLabel });
        assert.equal(await card.count(), 1, `${target}: ${classLabel} card count`);
        await card.click();
        const entered = await page.evaluate(() => {
          const context = window.CraftForge?.getConcreteBaseContext?.();
          const tooltip = document.getElementById('jewel-tooltip');
          return {
            selectHidden: document.getElementById('select-view')?.hidden === true,
            craftVisible: document.getElementById('craft-view')?.hidden === false,
            engineContext: !!context,
            selectedBaseItemId: context?.selectedBaseItemId ?? null,
            tooltipRendered: !!tooltip && getComputedStyle(tooltip).display !== 'none',
            tooltipName: document.getElementById('item-name')?.textContent?.trim() || '',
            toast: document.getElementById('error-toast')?.textContent || '',
          };
        });
        assert(entered.selectHidden && entered.craftVisible, `${target}: ${classLabel} did not enter craft view`);
        assert(entered.engineContext && entered.selectedBaseItemId != null, `${target}: ${classLabel} has no concrete engine context`);
        assert(entered.tooltipRendered, `${target}: ${classLabel} tooltip did not render`);
        assert.equal(entered.tooltipName, expectedBase, `${target}: ${classLabel} default base`);
        assert.equal(entered.toast, '', `${target}: ${classLabel} error toast`);

        const back = page.locator('#back-to-select');
        assert.equal(await back.count(), 1, `${target}: back button count`);
        await back.click();
        assert(await page.locator('#select-view').isVisible(), `${target}: back button did not restore categories`);
        assert(!(await page.locator('#craft-view').isVisible()), `${target}: back button did not hide workbench`);
        results.push({ classLabel, defaultBase: entered.tooltipName });
      }

      assert.deepEqual(runtimeErrors, [], `${target}: browser errors`);
      console.log(JSON.stringify({ target, startup, results }, null, 2));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
